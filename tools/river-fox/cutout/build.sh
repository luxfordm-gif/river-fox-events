#!/bin/bash
# build.sh name  -> W-<name>.mp4 (540x960 draft) and W-<name>-1080.mp4 when FULL=1
cd "$(dirname "$0")"; N=$1
CL=../../cl/n18_start.mp4; SS=1.8; D=11.2
GR="hqdn3d=1.5:1.5:3:3,colortemperature=temperature=6100:mix=0.45,curves=master='0/0.03 0.25/0.33 0.5/0.6 0.8/0.87 1/1',eq=contrast=1.05:saturation=1.15:gamma=1.06,scale=1080:1920:flags=lanczos,unsharp=5:5:0.8,setsar=1"
# caption windows (seconds in output): from,to
W=("0.1 2.9" "2.95 4.2" "4.15 6.05" "6.5 9.1" "9.5 11.2")
IN=(-ss $SS -t $D -i $CL -framerate 30 -i mt/f_%04d.png -i title_$N.png)
for i in 0 1 2 3 4; do IN+=(-loop 1 -t $D -i cap_${N}_$i.png); done
FC="[0:v]$GR,split[v1][v2];[1:v]scale=1080:1920,format=gray,gblur=sigma=1.2[m];[v2][m]alphamerge[p];[v1][2:v]overlay[a];[a][p]overlay[b]"
prev=b
for i in 0 1 2 3 4; do set -- ${W[$i]}; FC+=";[$prev][$((3+i)):v]overlay=enable='between(t,$1,$2)'[c$i]"; prev=c$i; done
FC+=";[$prev]trim=duration=$D,setpts=PTS-STARTPTS,format=yuv420p[vout]"
ffmpeg -v error -y "${IN[@]}" -ss $SS -t $D -i $CL -filter_complex "$FC;[8:a]highpass=f=70,afftdn=nr=8:nf=-45,afade=t=out:st=10.95:d=0.25,loudnorm=I=-15:TP=-1.5:LRA=11[aout]" -map "[vout]" -map "[aout]" -r 30 -c:v libx264 -preset veryfast -crf 17 -c:a aac -b:a 160k -ar 48000 master_$N.mp4
ffmpeg -v error -y -i master_$N.mp4 -vf scale=540:960:flags=lanczos -c:v libx264 -preset slow -crf 28 -c:a aac -b:a 96k -movflags +faststart W-$N.mp4
