import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';

// Verify the worklet survives the repository's lossless public-asset transport.
test('voice worklet is included in a verified, single-file asset supplement',()=>{
 const manifest=JSON.parse(readFileSync('.asset-bundle/manifest.json','utf8'));
 const supplement=manifest.supplements.find(item=>item.parts.includes('voice-capture-000.part.b64'));
 assert.ok(supplement);
 const archive=Buffer.concat(supplement.parts.map(part=>Buffer.from(readFileSync('.asset-bundle/'+part,'utf8'),'base64')));
 const hash=data=>createHash('sha256').update(data).digest('hex');
 assert.equal(hash(archive),supplement.sha256);
 const tar=gunzipSync(archive),entries=[];
 for(let offset=0;offset+512<=tar.length;){
  const header=tar.subarray(offset,offset+512);if(header.every(byte=>byte===0))break;
  const path=header.subarray(0,100).toString().replace(/\0.*$/s,''),size=parseInt(header.subarray(124,136).toString().replace(/\0.*$/s,'').trim(),8);
  assert.ok(Number.isInteger(size)&&size>=0);assert.ok(header[156]===48||header[156]===0);
  const body=tar.subarray(offset+512,offset+512+size);entries.push(path);
  assert.equal(path,'public/tutor/voice-capture-worklet.js');assert.equal(hash(body),manifest.files[path]);
  assert.match(body.toString(),/registerProcessor\(['"]tutor-voice-capture['"]/);
  assert.doesNotMatch(body.toString(),/https?:\/\/|fetch\(|WebSocket|sk-proj-/);
  offset+=512+Math.ceil(size/512)*512;
 }
 assert.deepEqual(entries,['public/tutor/voice-capture-worklet.js']);
 assert.ok(readFileSync('lib/tutor-conversation-audio.ts','utf8').includes('voice-capture-worklet.js?v='+manifest.files[entries[0]].slice(0,12)));
});
