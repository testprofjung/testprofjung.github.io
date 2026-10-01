// 관리자용 사진 추가 (2단계): ① GitHub 업로드 화면에서 사진 커밋 → ② _gallery_items/ 설명 파일 커밋
(function () {
  "use strict";

  // 관리자 모드 처리는 admin-mode.js (사이트 공통)

  var dlg = document.getElementById("galleryAdmin");
  if (!dlg) return;
  var form = document.getElementById("galleryAdminForm");
  var repo = dlg.dataset.repo;
  var branch = dlg.dataset.branch || "main";
  var IMG_DIR = "assets/img/gallery";

  var q = function (s) { return JSON.stringify(String(s == null ? "" : s).trim()); };
  var val = function (n) { var el = form.elements[n]; return el ? String(el.value || "").trim() : ""; };
  var today = new Date().toISOString().slice(0, 10);

  function fileName() {
    var f = form.elements.file.files && form.elements.file.files[0];
    return f ? f.name : "";
  }
  function slug(s) {
    return s.toLowerCase().replace(/\.[a-z0-9]+$/, "").normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "photo";
  }
  function build() {
    var date = val("date") || today;
    var name = fileName() || "photo.jpg";
    var body = ["---",
      "image: " + q("/" + IMG_DIR + "/" + name),
      "caption: " + q(val("caption")),
      "caption_ko: " + q(val("caption_ko")),
      "date: " + date,
      "category: " + q(val("category")),
      "---", ""].join("\n");
    return { dir: "_gallery_items", name: date + "-" + slug(name) + ".md", body: body };
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
    if (path) path.textContent = f.dir + "/" + f.name + "   +   " + IMG_DIR + "/" + (fileName() || "…");
    if (pre) pre.textContent = f.body;
  }

  form.elements.file.addEventListener("change", function () {
    var f = form.elements.file.files[0];
    var box = dlg.querySelector(".pa-thumb");
    if (f && box) {
      box.querySelector("img").src = URL.createObjectURL(f);
      box.hidden = false;
      if (/[^A-Za-z0-9._-]/.test(f.name)) {
        alert(dlg.dataset.lang === "ko"
          ? "파일 이름에 한글·공백·특수문자가 있으면 사진이 안 보일 수 있습니다. 영문·숫자 이름(예: igarss2026.jpg)으로 바꾼 뒤 다시 선택해 주세요."
          : "File names with spaces or non-English characters may break. Please rename (e.g. igarss2026.jpg) and select again.");
      }
    }
    preview();
  });

  document.querySelectorAll("[data-open-gallery-admin]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      if (!form.elements.date.value) form.elements.date.value = today;
      preview();
      dlg.showModal();
    });
  });
  dlg.querySelectorAll("[data-close]").forEach(function (b) { b.addEventListener("click", function () { dlg.close(); }); });
  form.addEventListener("input", preview);

  // 1단계: GitHub 업로드 화면 (assets/img/gallery 폴더)
  dlg.querySelector("[data-step=upload]").addEventListener("click", function () {
    if (!form.elements.file.reportValidity()) return;
    window.open("https://github.com/" + repo + "/upload/" + branch + "/" + IMG_DIR, "_blank", "noopener");
  });

  // 2단계: 설명 파일
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var f = build();
    window.open("https://github.com/" + repo + "/new/" + branch + "/" + f.dir +
      "?filename=" + encodeURIComponent(f.name) + "&value=" + encodeURIComponent(f.body), "_blank", "noopener");
  });
})();
