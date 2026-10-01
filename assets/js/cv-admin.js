// 관리자용 CV 항목 추가: 입력값으로 _cv/ 파일을 만들어 GitHub "새 파일" 화면(내용 자동 입력)으로 보냅니다.
(function () {
  "use strict";

  // 관리자 모드 처리는 admin-mode.js (사이트 공통)

  var dlg = document.getElementById("cvAdmin");
  if (!dlg) return;
  var form = document.getElementById("cvAdminForm");
  var repo = dlg.dataset.repo;
  var branch = dlg.dataset.branch || "main";
  var ko = dlg.dataset.lang === "ko";

  var q = function (s) { return JSON.stringify(String(s == null ? "" : s).trim()); };
  var val = function (n) { var el = form.elements[n]; return el ? String(el.value || "").trim() : ""; };
  var slug = function (s) {
    return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "").trim()
      .split(/\s+/).filter(Boolean).slice(0, 5).join("-") || "item";
  };
  var thisMonth = new Date().toISOString().slice(0, 7);

  function build() {
    var sec = val("section");
    var sort = (val("sort") || thisMonth) + "-50";
    var lines = ["---",
      "section: " + sec,
      "period: " + q(sec === "teaching" ? "" : val("period")),
      "order_key: " + q(sort),
      "title_en: " + q(val("title_en")),
      "title_ko: " + q(val("title_ko") || val("title_en")),
      "org_en: " + q(sec === "teaching" ? "" : val("org_en")),
      "org_ko: " + q(sec === "teaching" ? "" : (val("org_ko") || val("org_en"))),
      "---", ""];
    return { dir: "_cv_items", name: sort.slice(0, 7) + "-" + sec + "-" + slug(val("title_en")) + ".md", body: lines.join("\n") };
  }

  function slot(sel, tag, cls) {
    var box = dlg.querySelector(".pa-preview");
    var el = box && box.querySelector(sel);
    if (!el && box) { el = document.createElement(tag); if (cls) el.className = cls; box.appendChild(el); }
    return el;
  }
  function preview() {
    var f = build();
    var path = slot(".pa-path", "p", "pa-path"), pre = slot("pre", "pre");
    if (path) path.textContent = f.dir + "/" + f.name;
    if (pre) pre.textContent = f.body;
  }
  function syncSection() {
    var teaching = val("section") === "teaching";
    form.querySelectorAll("[data-hide-for=teaching]").forEach(function (el) {
      el.hidden = teaching;
      el.querySelectorAll("input").forEach(function (i) { i.disabled = teaching; });
    });
    preview();
  }

  // 기간 입력에서 정렬 기준(연-월) 자동 추정
  var MON = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
  form.elements.period.addEventListener("input", function () {
    var s = val("period"), y = /(19|20)\d{2}/.exec(s);
    if (!y) return;
    var mon = "01";
    var word = /([A-Za-z]{3})[a-z]*\.?\s+(?:19|20)\d{2}/.exec(s); // "Mar. 2026"
    var num = /(?:19|20)\d{2}[.\-\/년\s]+(\d{1,2})(?!\d)/.exec(s);  // "2026.03", "2026년 3월"
    if (word && MON[word[1].toLowerCase()]) mon = MON[word[1].toLowerCase()];
    else if (num && +num[1] >= 1 && +num[1] <= 12) mon = String(num[1]).padStart(2, "0");
    form.elements.sort.value = y[0] + "-" + mon;
    preview();
  });

  document.querySelectorAll("[data-open-cv-admin]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      if (!form.elements.sort.value) form.elements.sort.value = thisMonth;
      syncSection();
      dlg.showModal();
    });
  });
  dlg.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
  form.elements.section.addEventListener("change", syncSection);
  form.addEventListener("input", preview);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var f = build();
    window.open("https://github.com/" + repo + "/new/" + branch + "/" + f.dir +
      "?filename=" + encodeURIComponent(f.name) + "&value=" + encodeURIComponent(f.body), "_blank", "noopener");
  });

  dlg.querySelector("[data-download]").addEventListener("click", function () {
    if (!form.reportValidity()) return;
    var f = build();
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([f.body], { type: "text/markdown" }));
    a.download = f.name;
    document.body.appendChild(a); a.click(); a.remove();
    alert(ko ? "다운로드한 파일을 저장소의 _cv_items/ 폴더에 넣으면 이력에 추가됩니다."
             : "Put the downloaded file into the repository's _cv_items/ folder.");
  });
})();
