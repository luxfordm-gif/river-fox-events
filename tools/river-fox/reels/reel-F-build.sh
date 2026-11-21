#!/bin/bash
# Reel F: close-up, Laura talking with captions, time-lapse, detail shot, the whole piece with the finale text.
#   WORK=~/river-fox-work/<job> STYLE=box ./reel-F-build.sh          draft, 540x960
#   WORK=~/river-fox-work/<job> STYLE=box W=1080 H=1920 CRF=18 ./reel-F-build.sh
# STYLE is the caption style: box (pink boxes, the default), wild or classic. It reads $WORK/anim/<STYLE>/f_%04d.png.
# The text images are 1080x1920 and are scaled to W:H.
#
# What it does besides the video (added 21 Nov 2026, after two faults in the Worplesdon reels):
#  - every shot is cut to an exact number of frames, so a cut cannot land a frame late and captions cannot run onto the next shot
#  - it saves the picture with no text or captions on it in $WORK/plates/, so a later re-cut never has to be made from a finished video
#  - it refuses a WORK folder in a temporary place: the folder has to still be there next week
#  - it runs check.py on the result and stops with an error if that fails. Read the sheet it writes before filing.
set -euo pipefail
STYLE=${STYLE:-box}
W=${W:-540}; H=${H:-960}; CRF=${CRF:-30}
S=${WORK:?set WORK to the job working folder, e.g. ~/river-fox-work/worplesdon}
HERE="$(cd "$(dirname "$0")" && pwd)"
case "$(cd "$S" && pwd -P)" in
  /tmp/*|/private/tmp/*|/var/folders/*|/private/var/folders/*) echo "WORK is in a temporary folder and will be cleared. Use a folder that is kept, e.g. ~/river-fox-work/<job>."; exit 1;;
esac
case $STYLE in box) NAME=FF;; wild) NAME=FW;; classic) NAME=FC;; *) echo "STYLE must be box, wild or classic"; exit 1;; esac
O=$S/out2/R-reels; mkdir -p "$O" "$S/plates"

# Shot lengths in frames at 30 a second. Change these (and the starts on the input lines) for a new job.
N_BAUBLE=48      # 1.6 s  opening close-up, cut as soon as the pull-back finishes
N_LAURA=192      # 6.4 s  Laura talking
N_TL=540         # 18 s   time-lapse at 3 times speed
N_GARLAND=120    # 4 s    detail shot
N_PORCH=150      # 5 s    the whole piece, finale text
T_LAURA=$(echo "$N_BAUBLE/30" | bc -l)
T_TL=$(echo "($N_BAUBLE+$N_LAURA)/30" | bc -l)
T_PORCH=$(echo "($N_BAUBLE+$N_LAURA+$N_TL+$N_GARLAND)/30" | bc -l)
T_END=$(echo "($N_BAUBLE+$N_LAURA+$N_TL+$N_GARLAND+$N_PORCH)/30" | bc -l)

G="colortemperature=temperature=6800:mix=0.5,curves=master='0/0.03 0.2/0.29 0.5/0.6 0.8/0.89 1/1':green='0/0 0.5/0.49 1/1',eq=contrast=1.10:saturation=1.22:gamma=1.08,unsharp=5:5:0.7"
SC="scale=$W:$H:flags=lanczos,setsar=1,fps=30"
cutto() { echo "trim=end_frame=$1,setpts=PTS-STARTPTS"; }   # exactly this many frames

# Laura's audio: loudnorm the whole clip once (whole clip -14 LUFS, speech about -16), room tone stays in proportion
ffmpeg -v error -y -i "$S/src/clip5.mp4" -vn -af loudnorm=I=-14:TP=-1.5:LRA=7 -ar 44100 -ac 1 "$O/laura_norm.wav"

# Each clip is read a little longer than its shot, then cut to the exact frame count.
ffmpeg -v error -y -i "$S/src/timelapse_stable.mp4" \
 -ss 0.2 -t 2.0 -i "$S/src/clip4.mp4" -ss 0 -t 6.8 -i "$S/src/clip5.mp4" -ss 1.0 -t 4.4 -i "$S/src/clip2.mp4" -ss 0.3 -t 5.4 -i "$S/src/clip1.mp4" \
 -loop 1 -framerate 30 -t 6 -i "$S/safe/hl.png" -loop 1 -framerate 30 -t 6 -i "$S/safe/fin_h.png" -framerate 30 -i "$S/anim/$STYLE/f_%04d.png" \
 -i "$O/laura_norm.wav" -filter_complex "
[0:v]deflicker=size=9:mode=am,hqdn3d=1.5:1.5:3:3,colortemperature=temperature=7000:mix=0.6,curves=master='0/0.06 0.12/0.30 0.35/0.62 0.65/0.87 1/1',colorbalance=rs=-0.03:bs=0.04:rm=-0.04:bm=0.03,eq=contrast=1.04:saturation=1.12:gamma=1.18,split[g1][g2];[g2]huesaturation=colors=r+y:saturation=-0.6[d];[g1]crop=iw:1000:0:0[top];[d][top]overlay=0:0,unsharp=5:5:0.8[tlg];
[tlg]setpts=(PTS-STARTPTS)/3,crop=946:1683:0:0,$SC,$(cutto $N_TL)[v0];
[1:v]setpts=PTS-STARTPTS,$G,$SC,$(cutto $N_BAUBLE)[v1];
[2:v]setpts=PTS-STARTPTS,$G,$SC,$(cutto $N_LAURA)[v2];
[3:v]setpts=PTS-STARTPTS,$G,$SC,$(cutto $N_GARLAND)[v3];
[4:v]setpts=PTS-STARTPTS,$G,$SC,$(cutto $N_PORCH)[v4];
[v1][v2][v0][v3][v4]concat=n=5:v=1:a=0,split[base][plate];
[5:v]format=rgba,scale=$W:$H,fade=t=in:st=0:d=0.4:alpha=1,fade=t=out:st=3.9:d=0.4:alpha=1,setpts=PTS+($T_TL+0.6)/TB[hd];
[6:v]format=rgba,scale=$W:$H,fade=t=in:st=0:d=0.6:alpha=1,setpts=PTS+($T_PORCH+0.6)/TB[fn];
[7:v]format=rgba,scale=$W:$H,$(cutto $N_LAURA),setpts=PTS+$T_LAURA/TB[c1];
[base][hd]overlay=eof_action=pass[b1];[b1][c1]overlay=eof_action=pass[b3];[b3][fn]overlay=eof_action=pass,format=yuv420p[v];
[plate]format=yuv420p[pl];
[8:a]atrim=0.40:6.30,asetpts=PTS-STARTPTS,agate=threshold=0.03:ratio=10:attack=4:release=150:range=0.01,afade=t=in:d=0.05,afade=t=out:st=5.85:d=0.05,adelay=$(echo "($T_LAURA+0.4)*1000/1" | bc):all=1,apad=whole_dur=$T_END[sp];
[sp]afade=t=out:st=$(echo "$T_END-1" | bc -l):d=1,aresample=44100[a]" \
 -map "[v]" -map "[a]" -t "$T_END" -c:v libx264 -preset veryfast -crf "$CRF" -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "$O/$NAME.mp4" \
 -map "[pl]" -t "$T_END" -c:v libx264 -preset veryfast -crf 12 -pix_fmt yuv420p -movflags +faststart "$S/plates/reel-F-no-text-${W}x${H}.mp4"

echo "wrote $O/$NAME.mp4 and the no-text copy $S/plates/reel-F-no-text-${W}x${H}.mp4"
python3 "$HERE/check.py" "$O/$NAME.mp4" --text "$S/safe/hl.png" "$S/safe/fin_h.png" --at "$(echo "$T_TL+3" | bc -l),$(echo "$T_PORCH+3" | bc -l)"
