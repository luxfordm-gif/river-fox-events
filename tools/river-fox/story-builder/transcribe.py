#!/usr/bin/env python3
"""Transcribe the clips where Laura talks, with word times. Usage: python3 transcribe.py <clips_dir> <work_dir> clip1.mp4 clip2.mp4 ...
Sends each clip's AUDIO to OpenAI (whisper-1) using the key in tools/photo-grade/.env. ASK MATT FIRST, every time.
Writes <work_dir>/<clip>.wav (loudness-normalised; story.py mixes it in) and prints the words with start times in seconds."""
import sys,os,subprocess,json,re,urllib.request,uuid
clips,work,*files=sys.argv[1:]; os.makedirs(work,exist_ok=True)
env=open(os.path.expanduser('~/Projects/river-fox-events/tools/photo-grade/.env')).read()
key=re.search(r'^OPENAI_API_KEY=(.*)$',env,re.M).group(1).strip().strip('"\'')
for f in files:
    wav=os.path.join(work,f.rsplit('.',1)[0]+'.wav')
    subprocess.run(['ffmpeg','-v','error','-y','-i',os.path.join(clips,f),'-vn','-af','loudnorm=I=-16','-ar','16000','-ac','1',wav],check=True)
    out=subprocess.run(['curl','-s','https://api.openai.com/v1/audio/transcriptions','-H','Authorization: Bearer '+key,'-F','model=whisper-1','-F','file=@'+wav,'-F','response_format=verbose_json','-F','timestamp_granularities[]=word','-F','language=en'],capture_output=True,text=True).stdout
    d=json.loads(out); json.dump([{'word':w['word'].strip(),'start':w['start'],'end':w['end']} for w in d.get('words',[])],open(wav[:-4]+'.words.json','w')); print('==',f); print(' '.join('%s@%.1f'%(w['word'],w['start']) for w in d.get('words',[])))
