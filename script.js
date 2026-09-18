/* ============================================================
   SAISER - скрипт страницы.
   Плиты и схема здания (герой) · гребёнка-раскрытие фото-плит · вкладки услуг ·
   перевод RU/KZ (словарь kk грузится по кнопке) · меню · бегущая строка ·
   лента объектов с кнопками · WhatsApp с готовым текстом · форма в WhatsApp.
   Библиотек нет.
   ============================================================ */
(function(){
"use strict";
/* ---- КОНТАКТЫ: единственное место замены. Заглушка до получения номера от клиента. ---- */
var PHONE = "+77074567575";          /* для tel: */
var PHONE_FMT = "+7 707 456-75-75";  /* для текста */
var WA = "77074567575";              /* для wa.me */

var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";
var root = document.documentElement;

/* ---------------- КОНВЕРСИИ GOOGLE ADS ----------------
   Ярлыки задаёт index.html (window.SA_CONV): phone, contact, lead. Пусто - не шлём. */
function conv(key){
  var id = (window.SA_CONV || {})[key];
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {send_to: id, value: 1.0, currency: "USD", transport_type: "beacon"});
}
document.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  if (h.indexOf("tel:") === 0) conv("phone");
  else if (h.indexOf("wa.me") > -1) conv("contact");
}, true);

/* телефон из констант - во все ссылки и подписи */
function applyPhone(){
  document.querySelectorAll('a[href^="tel:"]').forEach(function(a){ a.href = "tel:" + PHONE; });
  document.querySelectorAll("[data-phone]").forEach(function(el){ el.textContent = PHONE_FMT; });
}

/* ---------------- КАЗАХСКИЙ СЛОВАРЬ ----------------
   Лежит в assets/lang/kk.js и грузится только по выбору KZ (или ?lang=kk / сохранённый выбор).
   В разметке и здесь казахского текста нет - проверка Google Ads видит русский сайт. */
var ASSET_V = ((document.currentScript && document.currentScript.src.match(/[?&]v=([^&]+)/)) || [])[1] || "";
var KK = null, KZ = {};
function loadKK(done){
  if (KK) return done();
  var s = document.createElement("script");
  s.src = "assets/lang/kk.js" + (ASSET_V ? "?v=" + ASSET_V : "");
  s.onload = function(){ if (window.SITE_KK){ KK = window.SITE_KK; KZ = KK.dict || {}; } done(); };
  s.onerror = function(){ done(); };
  document.head.appendChild(s);
}

/* ---------------- ДАННЫЕ УСЛУГ (RU) ---------------- */
var SVC_RU = {
  sks:  {t:"СКС - структурированные кабельные системы", b:["Кабельные трассы, патч-панели и розетки по проекту","Медь категории 5e / 6 / 6A и оптические магистрали","Тест каждой линии, маркировка, паспорт СКС"]},
  lvs:  {t:"ЛВС - локальные вычислительные сети", b:["Коммутаторы, маршрутизаторы, Wi-Fi покрытие","Серверные и телекоммуникационные шкафы","Настройка VLAN, резервирование каналов"]},
  vols: {t:"ВОЛС - волоконно-оптические линии связи", b:["Магистрали между зданиями, этажами и площадками","Сварка волокна, измерения рефлектометром","Оптические кроссы, муфты, патч-корды"]},
  skud: {t:"СКУД - система контроля и управления доступом", b:["Считыватели карт и лиц, турникеты, шлагбаумы","Электромагнитные и электромеханические замки","Учёт рабочего времени, связь с видеонаблюдением"]},
  videonablyudenie: {t:"СВН - система видеонаблюдения", b:["IP-камеры 2-8 Мп, ИК-подсветка, видеоаналитика","Регистраторы и серверы под нужный срок архива","Удалённый доступ с телефона и поста охраны"]},
  "sistemy-bezopasnosti": {t:"Системы безопасности и охранная сигнализация", b:["Охранная сигнализация, датчики движения и открытия","Домофония и видеодомофоны для ЖК и офисов","Вывод тревог на пульт охраны"]},
  aps:  {t:"АПС - автоматическая пожарная сигнализация", b:["Адресные и неадресные извещатели дыма и тепла","Приёмно-контрольные приборы, ручные извещатели","Проект по нормам РК и согласование"]},
  soue: {t:"СОУЭ - система оповещения и управления эвакуацией", b:["Речевое и звуковое оповещение 1-5 типа","Световые табло «Выход» и указатели направления","Связь с АПС и диспетчеризацией здания"]},
  apt:  {t:"АПТ - автоматическое пожаротушение", b:["Водяное, газовое и порошковое тушение","Спринклерные и дренчерные системы","Насосные станции, модули и станции управления"]},
  elektromontazh: {t:"Электромонтажные работы", b:["Вводно-распределительные устройства и щиты","Кабельные трассы, лотки, освещение, розеточные сети","Заземление, молниезащита, замеры"]},
  dispetcherizaciya: {t:"Диспетчеризация инженерных систем", b:["Единый пульт для АПС, вентиляции, лифтов, ИТП","Мониторинг состояний, уведомления дежурному","SCADA и BMS под задачи объекта"]},
  puskonaladka: {t:"Пусконаладка и интеграция", b:["Запуск и настройка каждой системы на объекте","Интеграция СКУД, видео, АПС и СОУЭ между собой","Исполнительная документация и обучение персонала"]}
};
function svcData(){ return (curLang() === "kk" && KK && KK.svc) ? KK.svc : SVC_RU; }

var WA_RU = {
  hero:"Здравствуйте! Хочу рассчитать смету на инженерные системы.\nОбъект и площадь: ",
  svc:"Здравствуйте! Интересует: {t}.\nОбъект и площадь: ",
  kontakty:"Здравствуйте! Пишу с сайта SAISER. Объект: "
};
function waTxt(){ return (curLang() === "kk" && KK && KK.wa) ? KK.wa : WA_RU; }

var TICK_RU = ["СКС","ЛВС","ВОЛС","СКУД","Видеонаблюдение","Пожарная сигнализация","СОУЭ","Пожаротушение","Электромонтаж","Диспетчеризация","Системы безопасности","Пусконаладка"];

/* ---------------- ПЕРЕВОД ---------------- */
var RU = {};
function snapshot(){
  document.querySelectorAll("[data-i]").forEach(function(el){ if (RU[el.dataset.i] === undefined) RU[el.dataset.i] = el.innerHTML; });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){ RU[el.dataset.iAlt] = el.alt; });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ RU[el.dataset.iAria] = el.getAttribute("aria-label"); });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ RU[el.dataset.iC] = el.getAttribute("content"); });
  var t = document.querySelector("title[data-i-t]"); if (t) RU[t.dataset.iT] = t.textContent;
}
function pick(k, kk){ return (kk && KZ[k] !== undefined) ? KZ[k] : RU[k]; }
function curLang(){ return root.lang === "kk" ? "kk" : "ru"; }

/* ссылки WhatsApp собираются заранее (при смене языка/вкладки), а не в момент клика -
   так трекер LeadBot спокойно дописывает код обращения в href */
function setWaLinks(){
  var W = waTxt();
  document.querySelectorAll("[data-wa]").forEach(function(a){
    var key = a.dataset.wa, t = W[key] || W.hero;
    if (t.indexOf("{t}") > -1) {
      var box = a.closest(".svc"), h = box ? box.querySelector(".svc-t") : null;
      t = t.replace("{t}", h ? h.textContent.trim() : "");
    }
    a.href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
    a.target = "_blank"; a.rel = "noopener";
  });
}

function applyLang(lang){
  var kk = lang === "kk" && !!KK;
  root.setAttribute("lang", kk ? "kk" : "ru");
  document.querySelectorAll("[data-i]").forEach(function(el){
    var v = pick(el.dataset.i, kk); if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){
    var v = pick(el.dataset.iAlt, kk); if (v !== undefined) el.alt = v;
  });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){
    var v = pick(el.dataset.iAria, kk); if (v !== undefined) el.setAttribute("aria-label", v);
  });
  document.querySelectorAll("[data-i-c]").forEach(function(el){
    var v = pick(el.dataset.iC, kk); if (v !== undefined) el.setAttribute("content", v);
  });
  var t = document.querySelector("title[data-i-t]");
  if (t) { var tv = pick(t.dataset.iT, kk); if (tv !== undefined) t.textContent = tv; }
  var og = document.querySelector('meta[property="og:locale"]');
  if (og) og.setAttribute("content", kk ? "kk_KZ" : "ru_RU");
  document.querySelectorAll(".lang button").forEach(function(b){
    var on = b.getAttribute("data-lang") === (kk ? "kk" : "ru");
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  try { localStorage.setItem("sa-lang", kk ? "kk" : "ru"); } catch(e){}
  plates.forEach(function(p){ renderSvc(p, p.cur, false); });
  setWaLinks();
  fillTicker();
  requestAnimationFrame(fitText);
}
/* ?lang= в URL сильнее localStorage: русское объявление не должно открыть казахскую версию.
   Язык по navigator.language не угадываем - казахский только явным выбором. */
function initLang(){
  var url = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("sa-lang"); } catch(e){}
  var lang = (url === "kk" || url === "ru") ? url : (saved === "kk" ? "kk" : "ru");
  setLang(lang);
}
function setLang(lang){
  if (lang === "kk") loadKK(function(){ applyLang("kk"); });
  else applyLang("ru");
}
document.querySelectorAll(".lang button").forEach(function(b){
  b.addEventListener("click", function(){ setLang(b.getAttribute("data-lang")); });
});

/* дисплейные строки: казахский длиннее - ужимаем, пока не влезет */
function fitText(){
  document.querySelectorAll(".h1 span, .kphone").forEach(function(el){
    el.style.fontSize = "";
    var box = el.parentElement.clientWidth;
    if (!box) return;
    var size = parseFloat(getComputedStyle(el).fontSize), base = size;
    while (el.scrollWidth > box + 1 && size > base * 0.5) {
      size *= 0.95;
      el.style.fontSize = size + "px";
    }
  });
}

/* ---------------- БЕГУЩАЯ СТРОКА ---------------- */
function fillTicker(){
  var el = document.getElementById("ticker"); if (!el) return;
  var list = (curLang() === "kk" && KK && KK.tick) ? KK.tick : TICK_RU;
  var one = list.map(function(t){ return "<b>" + t + "</b>"; }).join("");
  el.innerHTML = one;
  var w = el.scrollWidth || 1000;
  var need = Math.max(2, Math.ceil((innerWidth * 2) / w) + 1);
  var html = "";
  for (var i = 0; i < need; i++) html += one;
  el.innerHTML = html;
  el.style.setProperty("--tkw", w + "px");
  el.style.setProperty("--tkd", Math.max(14, w / 46) + "s");
}
var rsTimer;
addEventListener("resize", function(){ clearTimeout(rsTimer); rsTimer = setTimeout(function(){ fillTicker(); fitText(); lanes.forEach(function(l){ l.state(); }); }, 200); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ fillTicker(); fitText(); });

/* ---------------- МЕНЮ ---------------- */
var burger = document.getElementById("burger");
var mnav = document.getElementById("mnav");
function closeMenu(){
  document.body.classList.remove("menu-open");
  if (burger) burger.setAttribute("aria-expanded", "false");
}
if (burger) burger.addEventListener("click", function(){
  var open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});
if (mnav) mnav.addEventListener("click", function(e){ if (e.target.closest("a")) closeMenu(); });
addEventListener("keydown", function(e){ if (e.key === "Escape") closeMenu(); });

/* ---------------- ВКЛАДКИ УСЛУГ В ПЛИТАХ ---------------- */
var plates = [];
document.querySelectorAll(".pp").forEach(function(sec){
  var p = {sec: sec, pw: sec.closest(".pw"), tabs: [].slice.call(sec.querySelectorAll(".tab")), box: sec.querySelector(".svc"), imgs: [].slice.call(sec.querySelectorAll(".ph-img img")), cur: null};
  p.cur = p.tabs[0] ? p.tabs[0].dataset.svc : null;
  p.tabs.forEach(function(t){
    t.addEventListener("click", function(){
      renderSvc(p, t.dataset.svc, true);
      try { history.replaceState(null, "", "#" + t.id); } catch(e){}
    });
  });
  plates.push(p);
  renderSvc(p, p.cur, false);
});
function renderSvc(p, id, anim){
  if (!id) return;
  var d = svcData()[id] || SVC_RU[id]; if (!d) return;
  p.cur = id;
  p.tabs.forEach(function(t){ var on = t.dataset.svc === id; t.classList.toggle("is-on", on); t.setAttribute("aria-selected", on ? "true" : "false"); });
  p.imgs.forEach(function(im){ im.classList.toggle("is-on", im.dataset.svc === id); });
  var h = p.box.querySelector(".svc-t"), ul = p.box.querySelector(".svc-b");
  h.textContent = d.t;
  ul.innerHTML = d.b.map(function(x){ return "<li>" + x + "</li>"; }).join("");
  if (anim && !RED) { p.box.classList.remove("sw"); void p.box.offsetWidth; p.box.classList.add("sw"); }
  setWaLinks();
}
function findPlateByTab(id){
  for (var i = 0; i < plates.length; i++) for (var j = 0; j < plates[i].tabs.length; j++) if (plates[i].tabs[j].id === id) return plates[i];
  return null;
}

/* ---------------- ЯКОРЯ ----------------
   Якорь услуги (#sks, #skud …) ведёт на плиту раздела и сразу открывает вкладку. */
var HH = function(){ return parseFloat(getComputedStyle(root).getPropertyValue("--hh")) || 64; };
function goTo(id, smooth){
  var t = document.getElementById(id); if (!t) return false;
  var p = findPlateByTab(id);
  if (p) { renderSvc(p, t.dataset.svc, false); t = p.pw; }
  var top = t.getBoundingClientRect().top + scrollY - (t.classList.contains("pw") ? 0 : HH() + 8);
  scrollTo({ top: Math.max(0, top), behavior: (smooth && !RED) ? "smooth" : "auto" });
  return true;
}
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a) return;
  var id = a.getAttribute("href").slice(1); if (!id) return;
  if (!document.getElementById(id)) return;
  e.preventDefault();
  closeMenu();
  goTo(id, true);
  try { history.pushState(null, "", "#" + id); } catch(err){}
});

/* ---------------- ШАПКА ---------------- */
var hdr = document.getElementById("hdr");
function hdrState(){ if (hdr) hdr.classList.toggle("solid", scrollY > 40); }

/* ---------------- ГРЕБЁНКА: раскрытие фото по этажам от стояка ----------------
   p 0..1: стояк слева растёт снизу вверх (0..0.3), затем полосы-этажи уходят вправо снизу вверх. */
function comb(p){
  if (p >= 0.999) return "none";
  var rw = 8, N = 5, bh = 100 / N;
  var hr = 100 * easeOut(clamp(p / 0.3));
  var top = 100 - hr;
  var pts = ["0% 100%", "0% " + top.toFixed(2) + "%", rw + "% " + top.toFixed(2) + "%"];
  for (var i = N - 1; i >= 0; i--) {
    var yt = 100 - (i + 1) * bh, yb = 100 - i * bh;
    if (yt < top - 0.01) continue;
    var q = easeOut(clamp((p - (0.2 + i * 0.11)) / 0.42));
    var x = rw + (100 - rw) * q;
    pts.push(rw + "% " + yt + "%", x.toFixed(2) + "% " + yt + "%", x.toFixed(2) + "% " + yb + "%", rw + "% " + yb + "%");
  }
  pts.push(rw + "% 100%");
  return "polygon(" + pts.join(",") + ")";
}

/* ---------------- ПЛИТЫ ----------------
   Один слушатель scroll через rAF. На каждую .pw пишем --enter/--exit/--stay
   и --open (прогресс гребёнки для фото-плит). */
var heroPw = document.getElementById("top");
var hero = document.getElementById("hero");
var pws = [].slice.call(document.querySelectorAll(".pw"));
var bar = document.getElementById("bar");
var kont = document.getElementById("kontakty");
var introK = 1, introDone = true;
function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
function easeOut(t){ return 1 - Math.pow(1 - t, 2.4); }
function update(){
  var H = innerHeight || root.clientHeight;
  pws.forEach(function(pw){
    var r = pw.getBoundingClientRect();
    var enter = clamp(1 - r.top / H);
    var exit  = clamp(1 - r.bottom / H);
    var stay  = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : enter;
    var open  = pw === heroPw ? 1 : clamp((enter - 0.22) / 0.72);
    pw.style.setProperty("--enter", enter.toFixed(3));
    pw.style.setProperty("--exit",  exit.toFixed(3));
    pw.style.setProperty("--stay",  stay.toFixed(3));
    pw.style.setProperty("--open",  open.toFixed(3));
    pw.classList.toggle("gone", exit >= 1);
    pw.classList.toggle("on", enter > 0.6);
    if (pw === heroPw) pw.style.setProperty("--f", introK.toFixed(3));
    else {
      var pi = pw.querySelector(".ph-img");
      if (pi) { var c = comb(open); if (pi._c !== c) { pi._c = c; pi.style.clipPath = c; } }
    }
  });
  hdrState();
  if (bar) {
    var onKont = kont && kont.getBoundingClientRect().top < H * 0.6;
    bar.classList.toggle("show", scrollY > H * 0.55 && !onKont);
  }
}
if (RED) {
  root.classList.add("no-plate");
  root.classList.add("no-intro");
  if (hero) hero.classList.add("on");
  pws.forEach(function(pw){ pw.classList.add("on"); });
  addEventListener("scroll", function(){ hdrState(); if (bar) bar.classList.toggle("show", scrollY > innerHeight * 0.55); }, {passive:true});
  hdrState();
} else {
  var tick = false;
  addEventListener("scroll", function(){
    if (tick) return; tick = true;
    requestAnimationFrame(function(){ tick = false; update(); });
  }, {passive:true});
  addEventListener("resize", update);
  addEventListener("load", update);
  /* интро 1250 мс: каркас здания прочерчивается, кросс включается, текст поднимается.
     Пропускаем при хэше / прокрутке - человек из рекламы сразу видит собранный экран. */
  var skip = location.hash || scrollY > 80;
  if (skip) {
    root.classList.add("no-intro");
    if (hero) hero.classList.add("on");
    update();
  } else {
    introK = 0; introDone = false; update();
    var t0 = null;
    var step = function(ts){
      if (introDone) return;
      if (t0 === null) t0 = ts;
      var p = clamp((ts - t0) / 1250);
      introK = easeOut(p);
      update();
      if (p < 1) requestAnimationFrame(step);
      else introDone = true;
    };
    requestAnimationFrame(function(){ if (hero) hero.classList.add("on"); requestAnimationFrame(step); });
    setTimeout(function(){ if (hero) hero.classList.add("on"); }, 400);
    setTimeout(function(){ if (!introDone) { introDone = true; introK = 1; update(); } }, 1800);
  }
}
window.plateSync = function(){ introDone = true; introK = 1; if (hero) hero.classList.add("on"); update(); };
addEventListener("hashchange", function(){ root.classList.add("no-intro"); var id = location.hash.slice(1); if (id && document.getElementById(id)) goTo(id, false); });

/* ---------------- ПОЯВЛЕНИЕ В КАТАЛОЖНЫХ СЕКЦИЯХ ---------------- */
if (HAS_IO) {
  if (!RED) root.classList.add("js");
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.08, rootMargin:"0px 0px -5% 0px"});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
  setTimeout(function(){ document.querySelectorAll(".rv:not(.in)").forEach(function(el){
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
  }); }, 1500);
} else {
  document.querySelectorAll(".rv").forEach(function(el){ el.classList.add("in"); });
}

/* ---------------- ЛЕНТА С КНОПКАМИ ---------------- */
var lanes = [];
document.querySelectorAll(".lane-w").forEach(function(w){
  var lane = w.querySelector(".lane"), sec = w.closest(".sec");
  var prev = sec && sec.querySelector(".lbtn.prev"), next = sec && sec.querySelector(".lbtn.next");
  if (!lane || !prev || !next) return;
  function stepW(){
    var c = lane.firstElementChild; if (!c) return 300;
    var cs = getComputedStyle(lane);
    var gap = parseFloat(cs.columnGap || cs.gap) || 16;
    return c.getBoundingClientRect().width + gap;
  }
  function state(){
    var max = lane.scrollWidth - lane.clientWidth;
    var none = max <= 1;
    prev.hidden = none; next.hidden = none;
    prev.disabled = lane.scrollLeft <= 5;
    next.disabled = lane.scrollLeft >= max - 1;
  }
  prev.addEventListener("click", function(){ lane.scrollBy({left: -stepW(), behavior: RED ? "auto" : "smooth"}); });
  next.addEventListener("click", function(){ lane.scrollBy({left: stepW(), behavior: RED ? "auto" : "smooth"}); });
  lane.addEventListener("scroll", state, {passive:true});
  lane.addEventListener("keydown", function(e){
    if (e.key === "ArrowRight") { e.preventDefault(); next.click(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev.click(); }
  });
  state();
  requestAnimationFrame(state);
  addEventListener("load", state);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(state);
  lanes.push({state: state});
});

/* ---------------- ФОРМА → WhatsApp ---------------- */
var FORM_RU = {hello:"Здравствуйте! Заявка на расчёт сметы с сайта SAISER.", type:"Тип объекта", area:"Площадь", sys:"Системы", phone:"Телефон", none:"не выбрано"};
var form = document.getElementById("form");
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = document.getElementById("fmok"), err = document.getElementById("fmerr");
  if (form.company && form.company.value) return;          /* honeypot */
  var phone = form.phone.value.trim();
  if (phone.replace(/\D/g, "").length < 10) { err.hidden = false; ok.hidden = true; form.phone.focus(); return; }
  err.hidden = true;
  var F = (curLang() === "kk" && KK && KK.form) ? KK.form : FORM_RU;
  var sel = form.objtype, type = sel.value ? sel.options[sel.selectedIndex].textContent.trim() : F.none;
  var area = form.area.value.trim();
  var sys = [].slice.call(form.querySelectorAll('input[name="sys"]:checked')).map(function(i){ var s = i.parentElement.querySelector("span"); return s ? s.textContent.trim() : i.value; });
  var t = F.hello + "\n" + F.type + ": " + type + (area ? "\n" + F.area + ": " + area + " м²" : "") + "\n" + F.sys + ": " + (sys.length ? sys.join(", ") : F.none) + "\n" + F.phone + ": " + phone;
  ok.hidden = false;
  conv("lead");
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

/* ---------------- СТАРТ ---------------- */
applyPhone();
snapshot();
initLang();
fillTicker();
fitText();
hdrState();
/* прямой переход по якорю услуги: открыть вкладку и встать на плиту */
if (location.hash) {
  var hid = location.hash.slice(1);
  if (document.getElementById(hid)) setTimeout(function(){ goTo(hid, false); }, 60);
}
})();
