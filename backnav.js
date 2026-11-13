/* ← 버튼: 직전 페이지가 목적지와 같으면 history.back(), 아니면 링크로 이동 (히스토리가 꼬이지 않게) */
document.addEventListener("click", function (e) {
  var a = e.target.closest && e.target.closest("a.back, a.trpg-back, .end a");
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  var href = a.getAttribute("href");
  if (!href || /^(https?:|mailto:|tel:)/.test(href)) return;
  var norm = function (p) { return p.replace(/index\.html$/, ""); };
  try {
    var t = new URL(href, location.href), r = document.referrer && new URL(document.referrer);
    if (r && r.origin === location.origin && norm(r.pathname) === norm(t.pathname)) {
      e.preventDefault(); history.back();
    }
  } catch (err) {}
});
