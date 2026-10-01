// 관리자 모드 (사이트 전체 공통)
// - 주소 뒤에 ?admin=1 을 붙여 열면 켜집니다. 같은 탭 안에서만 유지되고, 탭/창을 닫으면 꺼집니다.
// - 켜져 있으면 화면 아래에 [관리자 모드 · 종료] 표시가 나타납니다.
// - 이것은 버튼을 보이게 할 뿐이며, 실제 저장은 GitHub 저장소 쓰기 권한이 있는 계정만 가능합니다.
(function () {
  "use strict";
  var KEY = "pj-admin";
  var on = false;
  try {
    localStorage.removeItem(KEY); // 예전 방식(브라우저에 계속 남는 표시) 정리
    var m = /[?&]admin=([01])/.exec(location.search);
    if (m) {
      if (m[1] === "1") sessionStorage.setItem(KEY, "1");
      else sessionStorage.removeItem(KEY);
    }
    on = sessionStorage.getItem(KEY) === "1";
  } catch (e) {}
  if (!on) return;

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  ready(function () {
    document.body.classList.add("is-admin");
    var ko = (document.documentElement.lang || "").indexOf("ko") === 0;
    var bar = document.createElement("div");
    bar.className = "admin-bar";
    bar.innerHTML = '<i class="fa-solid fa-user-shield"></i> ' + (ko ? "관리자 모드" : "Admin mode") +
      ' <button type="button">' + (ko ? "종료" : "Exit") + "</button>";
    bar.querySelector("button").addEventListener("click", function () {
      try { sessionStorage.removeItem(KEY); } catch (e) {}
      var url = location.href.replace(/([?&])admin=1(&|$)/, "$1").replace(/[?&]$/, "");
      location.replace(url);
    });
    document.body.appendChild(bar);
  });
})();
