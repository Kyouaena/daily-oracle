import { MBTIS, CITY_ZONES, normalizeCity, dateInZone, generateOracle, oracleText, validateProfile } from './oracle.js';
import { LANGUAGES, CITY_SUGGESTIONS, t, translateText, localizeOracle } from './i18n.js';

const $ = id => document.getElementById(id);
const STORAGE_KEY = 'rihe-profile-v1';
const LANGUAGE_KEY = 'rihe-language-v1';
let language = 'zh-CN';
let activeOracle = null;
let activeProfile = null;
let zoneHint = '可调整';
let formStatus = '';
let copyStatus = '';
const defaultZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Shanghai';
try {
  const saved = localStorage.getItem(LANGUAGE_KEY);
  if (LANGUAGES.includes(saved)) language = saved;
} catch { /* Language switching also works without storage. */ }
const tr = text => t(text, language);

// Retain original static text nodes so changing languages is reversible without
// replacing controls, losing input, or relying on translated strings as keys.
const staticText = [];
const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
while (walker.nextNode()) {
  const node = walker.currentNode;
  if (node.textContent.trim() && !node.parentElement.closest('#language, script')) {
    staticText.push([node, node.textContent]);
  }
}
const attributes = [...document.querySelectorAll('[aria-label], [placeholder]')]
  .filter(node => node.id !== 'language')
  .flatMap(node => ['aria-label', 'placeholder'].filter(name => node.hasAttribute(name)).map(name => [node, name, node.getAttribute(name)]));
for (const type of MBTIS) $('mbti').add(new Option(type, type));
const zones = [...new Set([defaultZone, ...Object.values(CITY_ZONES), ...(Intl.supportedValuesOf ? Intl.supportedValuesOf('timeZone') : [])])].sort();
for (const zone of zones) $('timezone').add(new Option(zone.replaceAll('_', ' '), zone));
$('timezone').value = defaultZone;

function setFormStatus(key) { formStatus = key; $('form-status').textContent = tr(key); }
function setCopyStatus(key) { copyStatus = key; $('copy-status').textContent = tr(key); }
function updateDate() {
  const zone = $('timezone').value;
  const today = dateInZone(zone);
  $('birthday').max = today;
  $('header-date').textContent = new Intl.DateTimeFormat(language, { timeZone: zone, year: 'numeric', month: 'short', day: 'numeric' }).format(new Date());
  $('header-weekday').textContent = new Intl.DateTimeFormat(language, { timeZone: zone, weekday: 'long' }).format(new Date()) + ' · ' + tr('今日安好');
  $('year').textContent = today.slice(0, 4);
}
function applyLanguage() {
  document.documentElement.lang = language;
  document.title = tr('日和 · 每日卦帖');
  document.querySelector('meta[name="description"]').content = tr('借一张卦帖，给平常的日子一点灵感。');
  $('language').value = language;
  for (const [node, original] of staticText) if (node.isConnected) node.textContent = translateText(original, language);
  for (const [node, name, original] of attributes) node.setAttribute(name, tr(original));
  $('cities').replaceChildren(...CITY_SUGGESTIONS[language].map(city => new Option(city, city)));
  // Localized time-zone names keep the IANA identifier visible for disambiguation.
  for (const option of $('timezone').options) {
    try {
      const name = new Intl.DateTimeFormat(language, { timeZone: option.value, timeZoneName: 'long' }).formatToParts(new Date()).find(part => part.type === 'timeZoneName').value;
      option.textContent = name + ' · ' + option.value.replaceAll('_', ' ');
    } catch { option.textContent = option.value; }
  }
  $('zone-hint').textContent = tr(zoneHint);
  updateDate();
  if (activeOracle) render(activeOracle);
  setFormStatus(formStatus);
  setCopyStatus(copyStatus);
}
$('language').addEventListener('change', () => {
  language = LANGUAGES.includes($('language').value) ? $('language').value : 'zh-CN';
  try { localStorage.setItem(LANGUAGE_KEY, language); } catch { /* Best effort. */ }
  applyLanguage();
});
$('city').addEventListener('change', () => {
  const zone = CITY_ZONES[normalizeCity($('city').value)];
  if (zone) { $('timezone').value = zone; zoneHint = '已匹配城市'; }
  else zoneHint = '请确认当地时区';
  $('zone-hint').textContent = tr(zoneHint);
  updateDate();
});
$('timezone').addEventListener('change', updateDate);
function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function render(oracle) {
  const o = localizeOracle(oracle, language);
  $('demo-tag').hidden = true;
  $('result-label').textContent = o.date + ' · ' + tr('今日卦帖');
  $('result-city').textContent = o.city + ' / ' + o.mbti;
  $('fortune-kicker').textContent = tr('今日签意') + ' · ' + o.word;
  $('fortune-title').replaceChildren(document.createTextNode(o.title[0] + (language === 'en' ? ',' : '、')), el('br'), document.createTextNode(o.title[1] + (language === 'en' ? '.' : '。')));
  $('fortune-summary').textContent = o.summary;
  $('fortune-level').textContent = o.level;
  $('fortune-element').textContent = tr('今日关键词：') + o.word;
  $('symbol-name').textContent = o.symbol;
  $('trigram').replaceChildren(...o.lines.map(v => el('i', undefined, v ? '' : 'broken')));
  $('luck-strip').replaceChildren(...o.luck.map((l, i) => {
    const d = el('div'); d.append(el('span', tr(['专注', '人际', '生活'][i])), el('strong', l[0]), el('em', l[1])); return d;
  }));
  $('actions').replaceChildren(...o.actions.map((a, i) => {
    const d = el('div'), body = el('div'); body.append(el('h4', a[0]), el('p', a[1]));
    d.append(el('span', tr(['一', '二'][i]), 'action-number'), body, el('span', a[2], 'cost')); return d;
  }));
  $('avoid').textContent = o.avoid;
  $('meals').replaceChildren(...o.meals.map((m, i) => {
    const d = el('div'); d.append(el('span', tr(['早 · 唤醒', '午 · 满足', '晚 · 松弛'][i])), el('h4', m[0]), el('p', m[1])); return d;
  }));
  const color = el('b'), dot = el('i'); dot.style.background = o.color[1]; color.append(dot, document.createTextNode(o.color[0]));
  $('lucky-color').replaceChildren(document.createTextNode(tr('幸运色')), color);
  $('lucky-number').replaceChildren(document.createTextNode(tr('幸运数字')), el('b', o.number));
  $('closing-line').textContent = o.date + ' · ' + tr('今天，也请善待自己。');
  $('oracle-card').classList.remove('refreshed');
  requestAnimationFrame(() => $('oracle-card').classList.add('refreshed'));
}
function profile() { return { birthday: $('birthday').value, city: $('city').value.trim(), mbti: $('mbti').value, timezone: $('timezone').value, diet: $('diet').value }; }
function save(p) {
  try {
    if ($('remember').checked) localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    else localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch { setFormStatus('本机存储不可用，本次仍可正常生成卦帖。'); return false; }
}
$('oracle-form').addEventListener('submit', e => {
  e.preventDefault();
  try {
    const p = profile(), o = generateOracle(p);
    activeOracle = o; activeProfile = p; render(o); setCopyStatus('');
    if (save(p)) setFormStatus($('remember').checked ? '今日卦帖已生成，资料仅保存在本机。' : '今日卦帖已生成，资料未保存。');
    if (matchMedia('(max-width:720px)').matches) $('result-label').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  } catch (err) { setFormStatus(err.message); }
});
$('remember').addEventListener('change', () => {
  if (!$('remember').checked) {
    try { localStorage.removeItem(STORAGE_KEY); setFormStatus('已关闭记忆并清除本机保存的资料。'); }
    catch { setFormStatus('无法访问本机存储。'); }
  }
});
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const p = JSON.parse(raw); validateProfile(p);
    for (const key of ['birthday', 'city', 'mbti', 'timezone', 'diet']) $(key).value = p[key];
    $('remember').checked = true; activeProfile = p; activeOracle = generateOracle(p);
  }
} catch {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage can be disabled. */ }
  setFormStatus('没有读取到有效资料，请重新填写。');
}
$('clear-button').addEventListener('click', () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* Best effort. */ }
  $('oracle-form').reset(); $('timezone').value = defaultZone;
  activeProfile = null; activeOracle = null; location.reload();
});
$('copy-button').addEventListener('click', async () => {
  if (!activeOracle) { setCopyStatus('请先填写资料，开启属于你的今日卦帖。'); return; }
  try { await navigator.clipboard.writeText(oracleText(activeOracle, language)); setCopyStatus('已复制卦帖，不含生日。'); }
  catch { setCopyStatus('浏览器未允许复制，可使用“保存 / 打印”留存。'); }
});
$('print-button').addEventListener('click', () => {
  if (!activeOracle) { setCopyStatus('请先填写资料，开启属于你的今日卦帖。'); return; }
  window.print();
});
$('about-button').addEventListener('click', () => $('about-dialog').showModal());
$('close-about').addEventListener('click', () => $('about-dialog').close());
function refreshDay() {
  updateDate();
  if (activeProfile && activeOracle && dateInZone(activeProfile.timezone) !== activeOracle.date) {
    activeOracle = generateOracle(activeProfile); render(activeOracle); setCopyStatus(''); setFormStatus('新的一天，卦帖已更新。');
  }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshDay(); });
setInterval(refreshDay, 60000);
applyLanguage();
