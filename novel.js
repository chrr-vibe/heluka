/* 소설형 단편: 상단 [전체 복사] 버튼 + 대화형/소설형 전환
   - 대화형 페이지와 소설판에는 <div id="views" data-chat="..." data-novel="..." data-cur="chat|novel"></div> 를 둔다
   - <article> 가 있는 페이지에는 복사 버튼이 붙는다 */
(function () {
  var KEY = "heluka-view";
  function getPref() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setPref(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var css = document.createElement("style");
  css.textContent =
    ".ntools{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;margin:18px auto 0;max-width:620px}" +
    ".ntools .seg{display:inline-flex;border:1px solid rgba(196,166,118,.55);border-radius:999px;overflow:hidden;background:rgba(23,17,12,.82)}" +
    ".ntools .seg a,.ntools .seg span{display:block;padding:6px 16px;font:600 13px/1.4 'Nanum Myeongjo','AppleMyungjo',serif;color:#cdbf9f;text-decoration:none;letter-spacing:.04em}" +
    ".ntools .seg .on{background:rgba(196,166,118,.28);color:#f1e6cc}" +
    ".ntools .seg a:hover,.ntools .seg a:focus-visible{background:rgba(196,166,118,.16);outline:none}" +
    ".ntools button{padding:6px 16px;border-radius:999px;border:1px solid rgba(196,166,118,.55);background:rgba(23,17,12,.82);color:#e6d6b2;cursor:pointer;font:600 13px/1.4 'Nanum Myeongjo','AppleMyungjo',serif;letter-spacing:.04em}" +
    ".ntools button:hover,.ntools button:focus-visible{border-color:#e6d6b2;outline:none}" +
    ".ntools button.done{background:rgba(196,166,118,.28)}";
  document.head.appendChild(css);

  var bar = document.createElement("div");
  bar.className = "ntools";

  /* 대화형 / 소설형 */
  var v = document.getElementById("views");
  if (v) {
    var cur = v.getAttribute("data-cur"), chat = v.getAttribute("data-chat"), nov = v.getAttribute("data-novel");
    if (cur === "chat" && getPref() === "novel" && !/[?&]chat\b/.test(location.search)) { location.replace(nov); return; }
    var seg = document.createElement("div");
    seg.className = "seg"; seg.setAttribute("role", "group"); seg.setAttribute("aria-label", "보기 방식");
    [["chat", "대화형", chat], ["novel", "소설형", nov]].forEach(function (o) {
      var el;
      if (o[0] === cur) { el = document.createElement("span"); el.className = "on"; el.setAttribute("aria-current", "page"); }
      else {
        el = document.createElement("a"); el.href = o[2];
        el.addEventListener("click", function (e) { e.preventDefault(); setPref(o[0]); location.replace(o[2]); });
      }
      el.textContent = o[1]; seg.appendChild(el);
    });
    bar.appendChild(seg);
  }

  /* 전체 복사 */
  var art = document.querySelector("article");
  if (art) {
    var btn = document.createElement("button");
    btn.type = "button"; btn.textContent = "전체 복사";
    btn.addEventListener("click", function () {
      var text = collect(art);
      done(copy(text));
    });
    bar.appendChild(btn);
    function done(p) {
      p.then(function () { btn.textContent = "복사했어요 ✓"; btn.classList.add("done"); },
             function () { btn.textContent = "복사 실패 · 다시"; })
       .then(function () { setTimeout(function () { btn.textContent = "전체 복사"; btn.classList.remove("done"); }, 2200); });
    }
  }

  if (!bar.children.length) return;
  if (v) v.parentNode.insertBefore(bar, v.nextSibling);
  else if (document.querySelector("header")) { var h = document.querySelector("header"); h.parentNode.insertBefore(bar, h.nextSibling); }
  else if (art) art.parentNode.insertBefore(bar, art);

  function clean(s) { return (s || "").replace(/\s+\n/g, "\n").replace(/[ \t]+/g, " ").trim(); }
  function collect(root) {
    var lines = [];
    var h1 = document.querySelector("header h1") || document.querySelector("h1");
    var when = document.querySelector("header .when");
    if (h1) lines.push(clean(h1.textContent));
    if (when) lines.push(clean(when.textContent));
    if (lines.length) lines.push("");
    walk(root, lines);
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }
  function walk(el, lines) {
    Array.prototype.forEach.call(el.children, function (c) {
      var cl = c.classList, tag = c.tagName;
      if (tag === "FIGURE" || tag === "SCRIPT" || tag === "STYLE" || tag === "SVG" || tag === "svg") return;
      if (cl.contains("scene")) {
        var parts = Array.prototype.map.call(c.childNodes, function (n) { return clean(n.textContent); }).filter(Boolean);
        lines.push("", "# " + parts.join(" · "), ""); return;
      }
      if (cl.contains("part")) { lines.push("", "## " + clean(c.innerText || c.textContent).replace(/\n+/g, " · "), ""); return; }
      if (tag === "H2" || tag === "H3") { lines.push("", "# " + clean(c.textContent), ""); return; }
      if (cl.contains("chat")) {
        var who = "";
        Array.prototype.forEach.call(c.children, function (m) {
          if (m.classList.contains("who")) who = clean(m.textContent);
          else if (m.classList.contains("msg")) { lines.push((who ? who + ": " : "") + clean(m.textContent)); }
          else if (m.classList.contains("room")) lines.push("[" + clean(m.textContent) + "]");
        });
        lines.push(""); return;
      }
      if (cl.contains("letter") || cl.contains("talk") || cl.contains("list") || cl.contains("note-card")) {
        var ps = c.querySelectorAll("p,li");
        if (ps.length) Array.prototype.forEach.call(ps, function (p) { lines.push((cl.contains("letter") ? "> " : "") + clean(p.textContent)); });
        else lines.push(clean(c.innerText || c.textContent));
        lines.push(""); return;
      }
      if (tag === "P" || tag === "BLOCKQUOTE" || tag === "LI") { lines.push(clean(c.innerText || c.textContent), ""); return; }
      if (c.children.length) { walk(c, lines); return; }
      var t = clean(c.textContent); if (t) lines.push(t, "");
    });
  }
  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return fallback(text); });
    }
    return fallback(text);
  }
  function fallback(text) {
    return new Promise(function (res, rej) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.top = "-1000px";
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta); ok ? res() : rej();
    });
  }
})();
