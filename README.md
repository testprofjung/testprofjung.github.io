# Prof. Hyung-Sup Jung — Homepage (EN / 한국어)

[al-folio](https://github.com/alshedivat/al-folio) 템플릿 기반의 개인 홈페이지입니다.
영문(`/`)과 국문(`/ko/`) 두 버전이 있고, 상단 메뉴의 **EN | 한국어** 버튼으로 같은 페이지의 다른 언어로 이동합니다.

## 최초 1회 설정 (GitHub)

플러그인을 쓰기 때문에 GitHub Actions로 빌드합니다.

1. 저장소 **Settings → Actions → General → Workflow permissions** 에서 **Read and write permissions** 선택 후 저장
2. 코드를 `main`에 푸시하면 Actions가 `gh-pages` 브랜치를 만듭니다 (3~5분)
3. **Settings → Pages → Build and deployment** 에서 Source를 **Deploy from a branch**, Branch를 **gh-pages / (root)** 로 지정

## 관리자 모드 — 사이트에서 바로 추가·수정

1. 아무 페이지나 주소 뒤에 `?admin=1`을 붙여 엽니다 (예: `https://testprofjung.github.io/?admin=1`).
   화면 왼쪽 아래에 **「관리자 모드 · 종료」** 표시가 나타나고, 각 페이지에 추가/수정 버튼이 보입니다.
   관리자 모드는 **그 탭에서만** 유지되며, 탭을 닫거나 [종료]를 누르면 꺼집니다.
2. 버튼 → 내용 입력 → **[GitHub에 저장]** → GitHub 화면에서 **Commit changes**
3. 1~2분 뒤 배포가 끝나고(저장소 **Actions** 탭에서 확인), GitHub Pages 캐시 때문에 **최대 10분** 뒤 화면에 보입니다. 바로 확인하려면 **Ctrl+F5**(강력 새로고침).

※ 버튼은 관리자 모드에서만 보이지만, 실제 저장은 **이 저장소에 쓰기 권한이 있는 GitHub 계정**만 할 수 있습니다.

| 페이지 | 버튼 | 저장 방식 | 파일 |
|---|---|---|---|
| 연구실적 | 논문·특허 추가 | 새 파일 (내용 자동 입력) | `_papers/`, `_patents/` (1건 = 파일 1개) |
| 이력 (CV) | 이력 항목 추가 | 새 파일 (내용 자동 입력) | `_cv_items/` (1항목 = 파일 1개) |
| 갤러리 | 사진 추가 | ① 사진 업로드 ② 설명 파일 (2단계) | `assets/img/gallery/`, `_gallery_items/` |
| 소개 (About) | 소개 수정 | 내용 자동 복사 → GitHub 편집 화면에서 **Ctrl+A → Ctrl+V** → Commit | `_data/profile.yml` |

**수정·삭제**: GitHub에서 해당 파일을 열어 연필(편집) 또는 휴지통(삭제) 아이콘을 누르거나,
웹 편집기 https://app.pagescms.org (최초 1회 Pages CMS GitHub 앱 설치 필요)에서 할 수 있습니다.

### CV 정렬
각 CV 항목의 `order_key`(예: `2026-03-50`)가 큰 순서로 위에 표시됩니다. [이력 항목 추가]에서 기간을 입력하면 자동으로 채워집니다.

### 논문 입력 팁
- **저자**: 한 칸에 한 명씩. 교수님 이름은 `Hyung-Sup Jung`으로 쓰면 자동으로 굵게 표시됩니다.
- **저널 약어**: 왼쪽 배지 (예: `RSE`, `TGRS`, `JSTARS`, `RS`, `ISPRS`).
- **출판일**: 같은 연도 안에서 최신 날짜가 위로 갑니다.
- **소개 페이지 대표 논문**: 체크하면 About 페이지의 Selected Publications에 표시됩니다.

## 화면 문구 (메뉴 이름 등)

`_data/i18n.yml`에서 영문/국문 문구를 바꿀 수 있습니다.

## 로컬 미리보기

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

## 색상·글꼴

`_sass/_custom.scss` 맨 위 변수 (네이비·블루·시안, Pretendard). 레이아웃 스타일은 `_sass/_profile.scss`.
