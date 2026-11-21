#!/bin/bash
# Set W/H to 1080/1920 for full resolution (copy PNGs are 1080x1920 and are scaled to W:H)
W=${W:-540}; H=${H:-960}; CRF=${CRF:-30}
S=${WORK:?set WORK to the job working folder}
O=$S/out2/R-reels
G="colortemperature=temperature=6800:mix=0.5,curves=master='0/0.03 0.2/0.29 0.5/0.6 0.8/0.89 1/1':green='0/0 0.5/0.49 1/1',eq=contrast=1.10:saturation=1.22:gamma=1.08,unsharp=5:5:0.7"
SC="scale=$W:$H:flags=lanczos,setsar=1,fps=30"
# F timeline: bauble 0-1.6 (cut after the zoom-out) | Laura 1.6-8.0 | TL 8.0-26.0 | garland 26-30 | porch 30-35
# 1) Laura's audio: loudnorm whole clip5 once (whole clip -14 LUFS, speech about -16), room tone stays in proportion
ffmpeg -v error -y -i $S/src/clip5.mp4 -vn -af loudnorm=I=-14:TP=-1.5:LRA=7 -ar 44100 -ac 1 $O/laura_norm.wav
ffmpeg -v error -y -i $O/laura_norm.wav -ss 6.3 -t 1.5 $O/bed_src.wav
ffmpeg -v error -y -i $S/src/timelapse_stable.mp4 -t 54.2 \
 -ss 0.2 -t 1.6 -i $S/src/clip4.mp4 -ss 0 -t 6.4 -i $S/src/clip5.mp4 -ss 1.0 -t 4 -i $S/src/clip2.mp4 -ss 0.3 -t 5 -i $S/src/clip1.mp4 \
 -loop 1 -t 6 -i $S/safe/hl.png -loop 1 -t 6 -i $S/safe/fin_h.png -framerate 30 -i $S/anim/classic/f_%04d.png -loop 1 -t 1 -i $S/wildF/wc2.png \
 -i $O/laura_norm.wav -filter_complex "
$(echo)[0:v]deflicker=size=9:mode=am,hqdn3d=1.5:1.5:3:3,colortemperature=temperature=7000:mix=0.6,curves=master='0/0.06 0.12/0.30 0.35/0.62 0.65/0.87 1/1',colorbalance=rs=-0.03:bs=0.04:rm=-0.04:bm=0.03,eq=contrast=1.04:saturation=1.12:gamma=1.18,split[g1][g2];[g2]huesaturation=colors=r+y:saturation=-0.6[d];[g1]crop=iw:1000:0:0[top];[d][top]overlay=0:0,unsharp=5:5:0.8[tlg];
[tlg]setpts=(PTS-STARTPTS)/3,fps=30,trim=duration=18,setpts=PTS-STARTPTS,crop=946:1683:0:0,$SC[v0];
[1:v]setpts=PTS-STARTPTS,$G,$SC[v1];
[2:v]setpts=PTS-STARTPTS,$G,$SC[v2];
[3:v]setpts=PTS-STARTPTS,$G,$SC[v3];
[4:v]setpts=PTS-STARTPTS,$G,$SC[v4];
[v1][v2][v0][v3][v4]concat=n=5:v=1:a=0[base];
[5:v]format=rgba,scale=$W:$H,fade=t=in:st=0:d=0.4:alpha=1,fade=t=out:st=3.9:d=0.4:alpha=1,setpts=PTS+8.6/TB[hd];
[6:v]format=rgba,scale=$W:$H,fade=t=in:st=0:d=0.6:alpha=1,setpts=PTS+30.6/TB[fn];
[7:v]format=rgba,scale=$W:$H,setpts=PTS+1.6/TB[c1];
[base][hd]overlay=eof_action=pass[b1];[b1][c1]overlay=eof_action=pass[b3];[b3][fn]overlay=eof_action=pass,format=yuv420p[v];
[9:a]atrim=0.40:6.30,asetpts=PTS-STARTPTS,agate=threshold=0.03:ratio=10:attack=4:release=150:range=0.01,afade=t=in:d=0.05,afade=t=out:st=5.85:d=0.05,adelay=2000:all=1,apad=whole_dur=35.0[sp];
[sp]afade=t=out:st=34.0:d=1,aresample=44100[a]" \
 -map "[v]" -map "[a]" -t 35.0 -c:v libx264 -preset veryfast -crf $CRF -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart $O/FC.mp4
