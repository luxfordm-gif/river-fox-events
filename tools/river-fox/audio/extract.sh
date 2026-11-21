#!/bin/bash
# extract a small mono audio file (not the video) from one clip
f="$1"; S="$2"; b=$(basename "$f" .mp4); b=${b%.TS}; d=$(basename "$(dirname "$f")" | cut -c1-2)
ffmpeg -v error -y -i "$f" -vn -ac 1 -ar 16000 -c:a aac -b:a 48k "$S/audio/${d}_${b}.m4a" && echo "ok ${d}_${b}"
