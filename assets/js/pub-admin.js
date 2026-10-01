// 관리자용 논문·특허 추가: 입력값으로 _papers/ 또는 _patents/ 파일을 만들어
// GitHub "새 파일" 화면(내용 자동 입력)으로 보냅니다.
(function () {
  "use strict";

  // 관리자 모드: ?admin=1 로 한 번 열면 이 브라우저에 [추가] 버튼 표시 (?admin=0 해제)
  try {
    var m = /[?&]admin=([01])/.exec(location.search);
    if (m) {
      if (m[1] === "1") localStorage.setItem("pj-admin", "1");
      else localStorage.removeItem("pj-admin");
    }
    if (localStorage.getItem("pj-admin") === "1") document.body.classList.add("is-admin");
  } catch (e) {}

  var dlg = document.getElementById("pubAdmin");
  if (!dlg) return;
  var form = document.getElementById("pubAdminForm");
  var repo = dlg.dataset.repo;
  var branch = dlg.dataset.branch || "main";
  var ko = dlg.dataset.lang === "ko";

  var q = function (s) { return JSON.stringify(String(s == null ? "" : s).trim()); };
  var val = function (n) { var el = form.elements[n]; return el ? String(el.value || "").trim() : ""; };
  var kind = function () { return form.querySelector('input[name="kind"]:checked').value; };
  var slug = function (s) {
    return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim()
      .split(/\s+/).filter(function (w) { return w.length > 2; }).slice(0, 4).join("-") || "item";
  };
  var today = new Date().toISOString().slice(0, 10);

  function build() {
    if (kind() === "paper") {
      var date = val("date") || today;
      var authors = val("authors").split(",").map(function (a) { return a.trim(); }).filter(Boolean);
      var lines = ["---",
        "title: " + q(val("title")),
        "authors:"].concat(authors.map(function (a) { return "  - " + q(a); })).concat([
        "journal: " + q(val("journal")),
        "abbr: " + q(val("abbr")),
        "volume: " + q(val("volume")),
        "issue: " + q(val("issue")),
        "pages: " + q(val("pages")),
        "year: " + date.slice(0, 4),
        "date: " + date,
        "doi: " + q(val("doi").replace(/^https?:\/\/(dx\.)?doi\.org\//, "")),
        "link: " + q(val("link")),
        'pdf: ""',
        "selected: " + (form.elements.selected.checked ? "true" : "false"),
        "---", ""]);
      return { dir: "_papers", name: date + "-" + slug(val("title")) + ".md", body: lines.join("\n") };
    }
    var pdate = val("pdate") || today;
    var plines = ["---",
      "title: " + q(val("ptitle")),
      "inventors: " + q(val("inventors")),
      "country: " + val("country"),
      "kind: " + val("pkind"),
      "number: " + q(val("number")),
      "date: " + pdate,
      "year: " + pdate.slice(0, 4),
      "---", ""];
    return { dir: "_patents", name: pdate + "-" + slug(val("ptitle")) + ".md", body: plines.join("\n") };
  }

  // 배포 시 HTML 압축기가 빈 태그를 지울 수 있으므로, 미리보기 칸이 없으면 만들어서 사용
  function slot(sel, tag, cls) {
    var box = dlg.querySelector(".pa-preview");
    var el = box && box.querySelector(sel);
    if (!el && box) {
      el = document.createElement(tag);
      if (cls) el.className = cls;
      box.appendChild(el);
    }
    return el;
  }

  function preview() {
    var f = build();
    var path = slot(".pa-path", "p", "pa-path");
    var pre = slot("pre", "pre");
    if (path) path.textContent = f.dir + "/" + f.name;
    if (pre) pre.textContent = f.body;
  }

  function syncKind() {
    var k = kind();
    dlg.querySelectorAll(".pa-fields").forEach(function (fs) {
      var on = fs.dataset.for === k;
      fs.hidden = !on;
      fs.disabled = !on; // 숨긴 쪽의 필수 입력은 검사하지 않음
    });
    preview();
  }

  document.querySelectorAll("[data-open-pub-admin]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      if (!form.elements.date.value) form.elements.date.value = today;
      if (!form.elements.pdate.value) form.elements.pdate.value = today;
      syncKind();
      dlg.showModal();
    });
  });
  dlg.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
  form.querySelectorAll('input[name="kind"]').forEach(function (r) { r.addEventListener("change", syncKind); });
  form.addEventListener("input", preview);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var f = build();
    var url = "https://github.com/" + repo + "/new/" + branch + "/" + f.dir +
      "?filename=" + encodeURIComponent(f.name) + "&value=" + encodeURIComponent(f.body);
    window.open(url, "_blank", "noopener");
  });

  dlg.querySelector("[data-download]").addEventListener("click", function () {
    if (!form.reportValidity()) return;
    var f = build();
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([f.body], { type: "text/markdown" }));
    a.download = f.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    alert(ko ? "다운로드한 파일을 저장소의 " + f.dir + "/ 폴더에 넣으면 목록에 추가됩니다."
             : "Put the downloaded file into the repository's " + f.dir + "/ folder.");
  });
})();
