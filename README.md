# Prof. Hyung-Sup Jung — Homepage (EN / 한국어)

[al-folio](https://github.com/alshedivat/al-folio) 템플릿 기반의 개인 홈페이지입니다.
영문(`/`)과 국문(`/ko/`) 두 버전이 있고, 상단 메뉴의 **EN | 한국어** 버튼으로 같은 페이지의 다른 언어로 이동합니다.

## 최초 1회 설정 (GitHub)

플러그인을 쓰기 때문에 GitHub Actions로 빌드합니다.

1. 저장소 **Settings → Actions → General → Workflow permissions** 에서 **Read and write permissions** 선택 후 저장
2. 코드를 `main`에 푸시하면 Actions가 `gh-pages` 브랜치를 만듭니다 (3~5분)
3. **Settings → Pages → Build and deployment** 에서 Source를 **Deploy from a branch**, Branch를 **gh-pages / (root)** 로 지정

## 논문·특허 추가 — 사이트에서 바로

1. 연구실적 페이지를 주소 뒤에 `?admin=1`을 붙여 한 번 엽니다 (예: `https://testprofjung.github.io/publications/?admin=1`).
   이후 그 브라우저에서는 **[논문·특허 추가]** 버튼이 계속 보입니다 (`?admin=0`으로 숨김).
2. 버튼 → 논문/특허 선택 → 내용 입력 → **[GitHub에 저장]**
3. GitHub 새 파일 화면이 내용이 채워진 채로 열립니다 → **Commit changes** 클릭 → 3~5분 뒤 사이트에 반영
   (GitHub에 로그인되어 있고 이 저장소에 쓰기 권한이 있어야 합니다.)

## 그 밖의 내용 수정 — 웹 편집기 (Pages CMS)

https://app.pagescms.org 에 GitHub 계정으로 로그인 → 이 저장소 선택 (최초 1회 Pages CMS GitHub 앱 설치 필요).
논문·특허 수정·삭제도 여기서 할 수 있습니다.

| 메뉴 | 하는 일 | 파일 |
|---|---|---|
| **논문** | **새 항목** → 제목·저자·저널·연도·DOI 입력 → 저장 | `_papers/` (1편 = 파일 1개) |
| **특허** | **새 항목** → 특허명·발명자·국가·번호·날짜 입력 → 저장 | `_patents/` (1건 = 파일 1개) |
| 사진 갤러리 | 사진 업로드 + 영문/국문 설명 | `_data/gallery.yml` |
| 소개·연락처·연구분야 | 영문/국문 소개글, 연구 분야 카드 | `_data/profile.yml` |
| 이력 (CV) | 학력·경력·수상·학회·편집·강의 (영문/국문) | `_data/cv.yml` |

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
