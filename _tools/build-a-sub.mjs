// 시안 A 서브페이지 생성기 (GitHub Pages 검토용)
// 실제 사이트(web/)와 같은 레이아웃 코드(web/src/a-theme.mjs)로 만들고, 주소만 시안 폴더 구조(상대경로)로 바꾼다.
// 디자인은 web/src 쪽만 고치면 되고, 이 스크립트를 다시 돌리면 시안에도 반영된다.
// 실행: node proposal/_tools/build-a-sub.mjs  → proposal/a/<id>.html, a/sub.css, a/site.js
import { readFileSync, writeFileSync, cpSync, mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "a");
const WEB = join(here, "..", "..", "web");
const imp = (f) => import(pathToFileURL(join(WEB, f)).href);
const { PAGES } = await imp("src/site.mjs");
const { subPage } = await imp("src/a-theme.mjs");
const read = (f) => readFileSync(join(WEB, f), "utf8");

// 실제 사이트 주소 → 시안 파일
const FILE = { "/": "./", "/about/": "about.html", "/about/location/": "location.html", "/sweet-potato/": "sweet-potato.html",
  "/sweet-potato/culture/": "culture.html", "/business/education/": "education.html", "/business/profit/": "profit.html",
  "/products/seedling/": "seedling.html", "/products/fresh/": "fresh.html", "/products/liquor/": "liquor.html", "/notice/": "notice.html" };
const rel = (html) => {
  let s = html
    .replaceAll("/images/a/", "../assets/img/a/")
    .replaceAll("/images/notice/", "../assets/img/notice/")
    .replace(/(["(])\/images\/(culture|hero|variety)\//g, "$1../assets/img/sub/$2/");
  for (const [path, file] of Object.entries(FILE).sort((a, b) => b[0].length - a[0].length))
    s = s.replaceAll(`href="${path}"`, `href="${file}"`);
  return s;
};

// 이미지·스타일·스크립트
mkdirSync(join(here, "..", "assets", "img", "a"), { recursive: true });
cpSync(join(WEB, "public", "images", "a"), join(here, "..", "assets", "img", "a"), { recursive: true });
cpSync(join(WEB, "public", "images", "notice"), join(here, "..", "assets", "img", "notice"), { recursive: true });
writeFileSync(join(OUT, "sub.css"), ["src/a-common.css", "src/a-sub.css", "src/a-extra.css", "src/a-mag.css"].map(read).join("\n"));
writeFileSync(join(OUT, "site.js"), read("src/client.js")); // 공지·제품 API가 없으면 기본 내용을 그대로 둔다

const V = Date.now().toString(36);
for (const p of PAGES.filter((p) => p.id !== "home")) {
  const file = FILE[p.path];
  const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>${p.h1} · 시안 A · 더고구마</title>
<meta name="description" content="${p.desc}">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;600;700;800&family=Noto+Serif+KR:wght@600;700&display=swap">
<link rel="stylesheet" href="sub.css?v=${V}">
</head>
<body>
${rel(subPage(p))}
<a class="back" href="../">← 시안 목록</a>
<script src="site.js?v=${V}" defer></script>
</body>
</html>
`;
  writeFileSync(join(OUT, file), html);
  console.log("wrote", file);
}
