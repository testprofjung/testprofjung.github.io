// 관리자용 소개(About) 수정: 현재 _data/profile.yml 값을 입력 창에 채우고,
// 수정 결과로 새 profile.yml 전체를 만들어 클립보드에 복사한 뒤 GitHub 편집 화면을 엽니다.
(function () {
  "use strict";
  var dlg = document.getElementById("profileAdmin");
  if (!dlg) return;
  var form = document.getElementById("profileAdminForm");
  var data = {};
  try { data = JSON.parse(document.getElementById("profileData").textContent) || {}; } catch (e) {}
  var repo = dlg.dataset.repo, branch = dlg.dataset.branch || "main";
  var ko = dlg.dataset.lang === "ko";
  var PATH = "_data/profile.yml";
  var SIMPLE = ["name_en", "name_ko", "photo", "title_en", "title_ko", "department_en", "department_ko",
    "university_en", "university_ko", "address_en", "address_ko", "phone", "fax", "email", "scholar", "researchgate"];
  var list = document.getElementById("paResearch");
  var tpl = document.getElementById("paResearchTpl");

  function addResearch(r) {
    var node = tpl.content.firstElementChild.cloneNode(true);
    node.querySelectorAll("[data-k]").forEach(function (el) { el.value = (r && r[el.dataset.k]) || ""; });
    list.appendChild(node);
  }
  function fill() {
    SIMPLE.forEach(function (k) { if (form.elements[k]) form.elements[k].value = data[k] == null ? "" : data[k]; });
    form.elements.bio_en.value = String(data.bio_en || "").replace(/\s+$/, "");
    form.elements.bio_ko.value = String(data.bio_ko || "").replace(/\s+$/, "");
    form.elements.faculty_since.value = data.faculty_since || "";
    list.innerHTML = "";
    (data.research || []).forEach(addResearch);
  }

  // ---- YAML 작성 ----
  var q = function (s) { return JSON.stringify(String(s == null ? "" : s)); };
  var block = function (s) {
    var t = String(s || "").replace(/\r/g, "").replace(/\s+$/, "");
    return t ? "|\n" + t.split("\n").map(function (l) { return l ? "  " + l : ""; }).join("\n") : '""';
  };
  function v(k) { return String(form.elements[k].value || "").trim(); }
  function build() {
    var out = ["# 기본 정보 · 소개 · 연구분야 (영문 / 국문)",
      "# 사이트 About 페이지의 [소개 수정] 또는 이 파일을 직접 수정하면 반영됩니다.", ""];
    SIMPLE.forEach(function (k) { out.push(k + ": " + q(v(k))); });
    out.push("", "# 논문 목록에서 굵게 표시할 교수님 이름 표기");
    out.push("author_names: [" + (data.author_names || []).map(q).join(", ") + "]", "");
    out.push("bio_en: " + block(form.elements.bio_en.value), "");
    out.push("bio_ko: " + block(form.elements.bio_ko.value), "");
    out.push("research:");
    list.querySelectorAll(".pa-research-item").forEach(function (fs) {
      if (fs.querySelector("[data-remove]").checked) return;
      var g = function (k) { var el = fs.querySelector('[data-k="' + k + '"]'); return el ? el.value.trim() : ""; };
      if (!g("title_en") && !g("title_ko")) return;
      out.push("  - title_en: " + q(g("title_en")));
      ["title_ko", "desc_en", "desc_ko", "icon"].forEach(function (k) { out.push("    " + k + ": " + q(g(k))); });
    });
    out.push("", "# 서울시립대 임용 연도 (About 페이지 \"재직 연수\" 계산용)");
    out.push("faculty_since: " + (parseInt(v("faculty_since"), 10) || ""), "");
    return out.join("\n");
  }
  function preview() {
    var box = dlg.querySelector(".pa-preview");
    var pre = box.querySelector("pre");
    if (!pre) { pre = document.createElement("pre"); box.appendChild(pre); }
    pre.textContent = build();
  }

  document.querySelectorAll("[data-open-profile-admin]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); fill(); preview(); dlg.showModal(); });
  });
  dlg.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
  dlg.querySelector("[data-add-research]").addEventListener("click", function () { addResearch({ icon: "fa-solid fa-satellite" }); preview(); });
  form.addEventListener("input", preview);
  form.addEventListener("change", preview);

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    ta.remove();
    return Promise.resolve();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = build();
    var win = window.open("https://github.com/" + repo + "/edit/" + branch + "/" + PATH, "_blank", "noopener");
    copy(text).then(function () {
      alert(ko ? "새 내용이 복사되었습니다.\nGitHub 편집 화면에서 Ctrl+A → Ctrl+V → Commit changes 를 눌러 주세요."
               : "Copied. In GitHub's editor press Ctrl+A → Ctrl+V → Commit changes.");
    }, function () {
      alert(ko ? "자동 복사에 실패했습니다. [파일 다운로드]로 받은 내용을 붙여넣어 주세요." : "Copy failed. Use [Download file].");
    });
    return win;
  });

  dlg.querySelector("[data-download]").addEventListener("click", function () {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([build()], { type: "text/yaml" }));
    a.download = "profile.yml";
    document.body.appendChild(a); a.click(); a.remove();
  });
})();
