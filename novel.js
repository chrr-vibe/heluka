/* 소설형 단편: 대화형/소설형 전환
   - 대화형 페이지와 소설판에는 <div id="views" data-chat="..." data-novel="..." data-cur="chat|novel"></div> 를 둔다
    */
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

  if (!bar.children.length) return;
  if (v) v.parentNode.insertBefore(bar, v.nextSibling);
  else if (document.querySelector("header")) { var h = document.querySelector("header"); h.parentNode.insertBefore(bar, h.nextSibling); }

})();
