// 관리자 모드 (사이트 전체 공통)
// - 주소에 ?admin=1 이 붙어 있을 때만 켜집니다. 브라우저에 아무것도 저장하지 않습니다.
// - 관리자 모드에서 사이트 안 링크를 누르면 다음 주소에도 ?admin=1 이 자동으로 붙습니다.
// - 주소에서 ?admin=1 을 빼거나 [종료]를 누르면 꺼집니다.
// - 이것은 버튼을 보이게 할 뿐이며, 실제 저장·삭제는 GitHub 저장소 쓰기 권한이 있는 계정만 가능합니다.
(function () {
  "use strict";
  // 예전 방식에서 브라우저에 남아 있던 값 정리
  try { localStorage.removeItem("pj-admin"); } catch (e) {}
  try { sessionStorage.removeItem("pj-admin"); } catch (e) {}

  var on = /[?&]admin=1(&|$)/.test(location.search);
  if (!on) return;

  function withAdmin(href) {
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin) return null;
      u.searchParams.set("admin", "1");
      return u.toString();
    } catch (e) { return null; }
  }
  function withoutAdmin(href) {
    var u = new URL(href, location.href);
    u.searchParams.delete("admin");
    return u.toString();
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    document.body.classList.add("is-admin");

    // 사이트 안 링크에 ?admin=1 유지 (#, mailto:, 외부 링크, 파일 다운로드 제외)
    document.querySelectorAll("a[href]").forEach(function (a) {
      var h = a.getAttribute("href");
      if (!h || h.charAt(0) === "#" || /^(mailto:|tel:|javascript:)/i.test(h) || a.hasAttribute("download")) return;
      if (/\.(pdf|jpe?g|png|gif|webp|svg|zip)(\?|#|$)/i.test(h)) return;
      var n = withAdmin(h);
      if (n) a.setAttribute("href", n);
    });

    var ko = (document.documentElement.lang || "").indexOf("ko") === 0;
    var bar = document.createElement("div");
    bar.className = "admin-bar";
    bar.innerHTML = '<i class="fa-solid fa-user-shield"></i> ' + (ko ? "관리자 모드" : "Admin mode") +
      ' <button type="button">' + (ko ? "종료" : "Exit") + "</button>";
    bar.querySelector("button").addEventListener("click", function () {
      location.replace(withoutAdmin(location.href));
    });
    document.body.appendChild(bar);

    // 삭제 확인
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("[data-confirm-delete]");
      if (!a) return;
      var name = a.getAttribute("data-confirm-delete");
      var img = a.getAttribute("data-image-delete");
      var msg = ko
        ? "‘" + name + "’ 항목을 삭제할까요?\n\nGitHub 삭제 화면이 열리면 [Commit changes]를 눌러야 실제로 삭제됩니다." +
          (img ? "\n(사진 파일 삭제 화면도 함께 열립니다)" : "") + "\n반영까지 몇 분 걸리며, Ctrl+F5로 새로고침해 확인하세요."
        : "Delete ‘" + name + "’?\n\nClick [Commit changes] on the GitHub page that opens." +
          (img ? "\n(The photo file's delete page opens too)" : "");
      if (!window.confirm(msg)) { e.preventDefault(); return; }
      if (img) window.open(img, "_blank", "noopener");
    });
  });
})();
