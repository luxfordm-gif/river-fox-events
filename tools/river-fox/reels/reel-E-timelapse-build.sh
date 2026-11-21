#!/bin/bash
# Reel E: the time-lapse on its own, headline at the start, finale text held on the last frame.
#   WORK=~/river-fox-work/<job> FINISHED=yes ./reel-E-timelapse-build.sh      (W=1080 H=1920 CRF=18 for full resolution)
# The finale text goes over the LAST frame of the time-lapse, so that frame has to show the finished job. On Worplesdon the
# camera stopped early (ladder still up) and "Ta-da" went out over an unfinished door (21 Nov 2026). So this script first
# writes the last frame to $WORK/out2/R-reels/E-last-frame.jpg and stops. Look at it. If the job is finished in that frame,
# run again with FINISHED=yes. If not, don't use this script: cut to Laura's own reveal and put the finale there (reel-F-build.sh).
set -euo pipefail
W=${W:-540}; H=${H:-960}; CRF=${CRF:-30}
S=${WORK:?set WORK to the job working folder, e.g. ~/river-fox-work/worplesdon}
HERE="$(cd "$(dirname "$0")" && pwd)"
case "$(cd "$S" && pwd -P)" in
  /tmp/*|/private/tmp/*|/var/folders/*|/private/var/folders/*) echo "WORK is in a temporary folder and will be cleared. Use a folder that is kept, e.g. ~/river-fox-work/<job>."; exit 1;;
esac
OUT=$S/out2/R-reels; mkdir -p "$OUT"
ffmpeg -v error -y -sseof -0.2 -i "$S/src/timelapse_stable.mp4" -update 1 -frames:v 1 -q:v 3 "$OUT/E-last-frame.jpg"
if [ "${FINISHED:-}" != "yes" ]; then
  echo "Wrote $OUT/E-last-frame.jpg. Look at it: is the job finished in that frame (no ladder, nothing half done)?"
  echo "If yes, run again with FINISHED=yes. If not, the finale text must not go on the time-lapse: use reel-F-build.sh."
  exit 1
fi
TL_GRADE="[0:v]deflicker=size=9:mode=am,hqdn3d=1.5:1.5:3:3,colortemperature=temperature=7000:mix=0.6,curves=master='0/0.06 0.12/0.30 0.35/0.62 0.65/0.87 1/1',colorbalance=rs=-0.03:bs=0.04:rm=-0.04:bm=0.03,eq=contrast=1.04:saturation=1.12:gamma=1.18,split[g1][g2];[g2]huesaturation=colors=r+y:saturation=-0.6[d];[g1]crop=iw:1000:0:0[top];[d][top]overlay=0:0,unsharp=5:5:0.8[tlg]"
D=30.1   # 27.1 s at 2x + 3 s hold
ffmpeg -v error -y -i "$S/src/timelapse_stable.mp4" -loop 1 -framerate 30 -t $D -i "$S/safe/hl.png" -loop 1 -framerate 30 -t $D -i "$S/safe/fin_h.png" -f lavfi -t $D -i anullsrc=r=44100:cl=stereo -filter_complex "
$TL_GRADE;
[tlg]setpts=PTS/2,fps=30,tpad=stop_mode=clone:stop_duration=3,crop=946:1683:0:0,scale=$W:$H:flags=lanczos[v];
[1:v]scale=$W:$H,format=rgba,fade=t=in:st=0.6:d=0.4:alpha=1,fade=t=out:st=4.6:d=0.4:alpha=1[h];
[2:v]scale=$W:$H,format=rgba,fade=t=in:st=26.4:d=0.4:alpha=1[f];
[v][h]overlay=eof_action=pass[a];[a][f]overlay=eof_action=pass,format=yuv420p[o]" \
 -map "[o]" -map 3:a -t $D -r 30 -c:v libx264 -preset veryfast -crf "$CRF" -pix_fmt yuv420p -c:a aac -b:a 64k -movflags +faststart "$OUT/E2.mp4"
python3 "$HERE/check.py" "$OUT/E2.mp4" --text "$S/safe/hl.png" "$S/safe/fin_h.png" --at 3,29
