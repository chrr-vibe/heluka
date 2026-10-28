/* 배경음악: 페이지마다 window.BGM = {ids:[...], title:"..."} 을 먼저 정해 두면 됨 */
(function () {
  var cfg = window.BGM || null;
  if (!cfg || !cfg.ids || !cfg.ids.length) return;

  var KEY = "heluka-bgm-on";
  function wantOn() { try { return localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function setWant(v) { try { localStorage.setItem(KEY, v ? "1" : "0"); } catch (e) {} }

  var css = document.createElement("style");
  css.textContent =
    "#bgm{position:fixed;top:max(12px,env(safe-area-inset-top,0px));right:max(12px,env(safe-area-inset-right,0px));z-index:50;" +
    "display:flex;align-items:center;gap:8px;max-width:min(72vw,320px);padding:6px 14px 6px 10px;border-radius:999px;" +
    "border:1px solid rgba(196,166,118,.55);background:rgba(23,17,12,.82);color:#e6d6b2;cursor:pointer;" +
    "font:500 12px/1.3 'Nanum Myeongjo','AppleMyungjo',serif;letter-spacing:.02em;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);" +
    "box-shadow:0 4px 14px rgba(0,0,0,.25)}" +
    "#bgm:hover,#bgm:focus-visible{border-color:#e6d6b2;outline:none}" +
    "#bgm .ic{flex:none;width:18px;height:18px;display:grid;place-items:center;font-size:14px}" +
    "#bgm .t{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}" +
    "#bgm.on .ic{animation:bgmPulse 1.6s ease-in-out infinite}" +
    "#bgm.mini{padding:6px;gap:0}#bgm.mini .t{max-width:0}#bgm .t{transition:max-width .3s;max-width:260px}" +
    "@keyframes bgmPulse{50%{opacity:.35}}" +
    "@media (prefers-reduced-motion:reduce){#bgm.on .ic{animation:none}}" +
    "#bgm-frame{position:fixed;left:-400px;bottom:0;width:240px;height:200px;opacity:0;pointer-events:none}";
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.id = "bgm";
  btn.type = "button";
  btn.innerHTML = '<span class="ic">♪</span><span class="t"></span>';
  var label = btn.querySelector(".t"), icon = btn.querySelector(".ic");
  var holder = document.createElement("div");
  holder.id = "bgm-frame";
  holder.innerHTML = '<div id="bgm-yt"></div>';
  document.body.appendChild(holder);
  document.body.appendChild(btn);

  var cur = { ids: cfg.ids.slice(), title: cfg.title, i: 0 };
  if (window.__carolNow) cur = { ids: window.__carolNow[0].slice(), title: window.__carolNow[1], i: 0 };
  var player = null, ready = false, playing = false, pending = false;

  function show() {
    btn.classList.toggle("on", playing);
    icon.textContent = playing ? "♪" : "♪";
    label.textContent = (playing ? "" : "▶ ") + cur.title;
    btn.setAttribute("aria-label", (playing ? "음악 끄기: " : "음악 켜기: ") + cur.title);
  }
  show();

  function load(play) {
    if (!ready) { pending = play; return; }
    var id = cur.ids[cur.i];
    if (play) player.loadVideoById(id); else player.cueVideoById(id);
  }

  window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player("bgm-yt", {
      width: 240, height: 200, videoId: cur.ids[0],
      playerVars: { playsinline: 1, controls: 0, rel: 0 },
      events: {
        onReady: function () {
          ready = true; player.setVolume(45);
          var go = pending || wantOn(); pending = false; load(go);
        },
        onStateChange: function (e) {
          if (e.data === 1) { playing = true; show(); }
          else if (e.data === 2) { playing = false; show(); }
          else if (e.data === 0) { player.seekTo(0); player.playVideo(); }
        },
        onError: function () {
          cur.i++;
          if (cur.i < cur.ids.length) { load(true); }
          else { playing = false; label.textContent = "재생이 막힌 곡이에요 · " + cur.title; }
        }
      }
    });
  };
  var s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(s);

  btn.addEventListener("click", function () {
    if (playing) { setWant(false); if (ready) player.pauseVideo(); playing = false; show(); }
    else { setWant(true); if (ready) player.playVideo(); else pending = true; }
  });

  /* 스크롤하면 동그란 ♪ 만 남기기 */
  function mini() { btn.classList.toggle("mini", window.scrollY > 40); }
  window.addEventListener("scroll", mini, { passive: true }); mini();

  /* 켜 둔 상태로 넘어왔는데 브라우저가 자동재생을 막으면, 화면을 처음 누를 때 시작 */
  function firstTouch(ev) {
    if (ev.target.closest && ev.target.closest("#bgm")) return;
    if (wantOn() && !playing && ready) player.playVideo();
    document.removeEventListener("pointerdown", firstTouch, true);
  }
  document.addEventListener("pointerdown", firstTouch, true);

  /* 6·7편: 장마다 곡 바꾸기 */
  window.bgmPlay = function (ids, title) {
    cur = { ids: ids.slice(), title: title, i: 0 };
    setWant(true); show(); load(true);
  };
  var autoT = null;
  window.bgmAuto = function (ids, title) {
    clearTimeout(autoT);
    autoT = setTimeout(function () {
      if (cur.title === title) return;
      var was = playing;
      cur = { ids: ids.slice(), title: title, i: 0 };
      show(); load(was || (!ready && wantOn()));
    }, 30);
  };
})();
