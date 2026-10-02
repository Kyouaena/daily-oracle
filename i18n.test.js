import test from 'node:test';
import assert from 'node:assert/strict';
import { generateOracle, oracleText, MBTIS, CITY_ZONES } from './oracle.js';
import { localizeOracle, t, CITY_SUGGESTIONS } from './i18n.js';
const profile={birthday:'1998-04-16',city:'Tokyo',mbti:'INFP',timezone:'Asia/Tokyo',diet:'all'};
const now=new Date('2026-10-02T12:00:00Z');
test('all generated English content is translated and locale does not change the oracle',()=>{
  for(const mbti of MBTIS) for(let day=1;day<=31;day++){
    const o=generateOracle({...profile,mbti},new Date(`2026-10-${String(day).padStart(2,'0')}T12:00:00Z`));
    const original=JSON.stringify(o);
    const en=localizeOracle(o,'en'),ja=localizeOracle(o,'ja');
    assert.doesNotMatch(JSON.stringify(en),/[\u3400-\u9fff]/);
    for(const localized of [en,ja]){
      assert.deepEqual(localized.lines,o.lines);
      assert.equal(localized.number,o.number);
      assert.equal(localized.color[1],o.color[1]);
      assert.equal(localized.city,o.city);
      assert.equal(localized.date,o.date);
    }
    assert.equal(JSON.stringify(o),original);
  }
});
test('copy follows language and excludes birthday',()=>{
  const o=generateOracle(profile,now);
  assert.match(oracleText(o,'en'),/Daily Oracle/);
  assert.match(oracleText(o,'ja'),/今日のおみくじ/);
  assert.match(oracleText(o,'zh-CN'),/每日卦帖/);
  for(const lang of ['zh-CN','en','ja'])assert.ok(!oracleText(o,lang).includes(profile.birthday));
});
test('all localized city suggestions have a time-zone match',()=>{
  for(const cities of Object.values(CITY_SUGGESTIONS))for(const city of cities)assert.ok(CITY_ZONES[city.toLowerCase()],city);
});
test('validation errors have English and Japanese translations',()=>{
  for(const patch of [{city:''},{mbti:'bad'},{diet:'bad'},{timezone:'bad'},{birthday:'2028-01-01'},{birthday:'2025-02-29'}]){
    try{generateOracle({...profile,...patch},now);assert.fail('expected error');}catch(err){
      for(const lang of ['en','ja'])assert.notEqual(t(err.message,lang),err.message);
    }
  }
});
