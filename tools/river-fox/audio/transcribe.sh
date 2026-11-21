#!/bin/bash
# sends ONE audio file to OpenAI whisper-1 (word timestamps); the key is read from the tool's .env and never printed
f="$1"; b=$(basename "$f" .m4a)
KEY=$(grep '^OPENAI_API_KEY=' /Users/MLuxford/Projects/river-fox-events/tools/photo-grade/.env | cut -d= -f2-)
curl -s --max-time 180 https://api.openai.com/v1/audio/transcriptions -H "Authorization: Bearer $KEY" \
  -F file=@"$f" -F model=whisper-1 -F response_format=verbose_json -F "timestamp_granularities[]=word" -F language=en > "tx/$b.json"
echo "done $b $(wc -c < tx/$b.json)"
