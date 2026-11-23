// 시안 A 서브페이지 생성기
// 원고는 web/src/site.mjs(실제 사이트 원고)를 그대로 가져오고, 시안 A의 헤더·서브비주얼·탭·푸터로 감싼다.
// 실행: node proposal/_tools/build-a-sub.mjs  → proposal/a/<id>.html
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, "..", "a");
const { PAGES, MENU, PRODUCTS, STATIC_NOTICES } = await import(pathToFileURL(join(here, "..", "..", "web", "src", "site.mjs")).href);

const FILE = { home: "./", about: "about.html", "sweet-potato": "sweet-potato.html", culture: "culture.html",
  education: "education.html", profit: "profit.html", seedling: "seedling.html", fresh: "fresh.html", liquor: "liquor.html", notice: "notice.html" };
const ctx = { img: (p) => `../assets/img/sub/${p}`, href: (id) => FILE[id] || "#", art: () => null };
const P = (f) => `../assets/img/photo/${f}`;
const S = (f) => `../assets/img/sub/${f}`;

// 페이지별 상단 배너 사진과 위치
const BANNER = {
  about: [P("field.jpg"), "center 70%"], "sweet-potato": [P("halves.jpg"), "center 55%"], culture: ["../assets/img/bg/lab.jpg", "center"],
  education: [S("bn-edu.jpg"), "center"], profit: [S("bn-profit.jpg"), "center"],
  seedling: [S("bn-prod.jpg"), "center"], fresh: [S("bn-prod.jpg"), "center"], liquor: [S("bn-profit.jpg"), "center"],
  notice: [S("bn-notice.jpg"), "center 40%"],
};
const MENU_EN = ["ABOUT US", "SWEET POTATO", "BUSINESS", "PRODUCTS", "NOTICE"];
const ABOUT_KIDS = [["about", "설립 목적"], ["about#map", "오시는 길"]];
const kids = (m) => m.kids || (m.id === "about" ? null : [[m.id, m.ko]]);
const href = (id) => id.includes("#") ? FILE[id.split("#")[0]] + "#" + id.split("#")[1] : ctx.href(id);

const PROD_IMG = {
  seedling: { src: P("seedling2.jpg"), pos: "50% 52%", alt: "배양 용기 속 고구마 조직배양묘" },
  fresh: { src: P("fresh.jpg"), pos: "50% 50%", alt: "고구마 생과" },
  liquor: { src: P("liquor-soon2.svg"), pos: "50% 50%", alt: "기념주 준비 중 일러스트", soon: true },
};
// 판매 방식 (26.11.23 요청): 조직배양묘는 학교기업 직접 판매, 생과·기념주는 협력업체 판매사이트로 연결.
// 개발 시: 제품별 판매 링크와 버튼 표시 여부(on/off)를 관리자 화면에서 설정.
const SALE = {
  seedling: { by: "학교기업 더고구마가 직접 생산·판매합니다.", btn: "구매하러 가기", on: true },
  fresh: { by: "협력업체를 통해 판매됩니다. 버튼을 누르면 협력업체 판매사이트로 이동합니다.", btn: "판매사이트로 이동", on: true },
  liquor: { by: "현재 시제품 개발 중입니다. 출시 후 협력업체 판매사이트에서 구매하실 수 있습니다.", btn: "판매 준비 중", on: false },
};
const LEAD = {
  seedling: "생장점 배양으로 바이러스를 제거한 무병주를 학교기업 연구실에서 직접 생산합니다.",
  fresh: "분자마커로 선발한 단일 품종 고구마를 협력업체를 통해 소개합니다.",
  liquor: "고구마를 활용해 빚는 학교기업 기념주입니다. 지금 시제품을 개발하고 있습니다.",
};
const arrow = `<svg viewBox="0 0 12 12" fill="none"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;
const icard = (k, sub) => {
  const d = PRODUCTS[k], im = PROD_IMG[k];
  return `<a class="ic reveal" href="${ctx.href(k)}"><div class="im"><img src="${im.src}" alt="${im.alt}" loading="lazy" style="object-position:${im.pos}">${im.soon ? "<em>준비 중</em>" : ""}</div>
    <div class="tx"><span>${d.en.toUpperCase()}</span><h3>${d.t}</h3>${sub ? `<p>${LEAD[k]}</p>` : ""}<div class="go">자세히 보기 <b>→</b></div></div></a>`;
};

// ---------- 원고를 그대로 쓰지 않고 시안 A에 맞게 다시 짠 본문 ----------
const BODY = {
  about: () => `
<section class="sec gut"><div class="w"><div class="ct">
  <div class="intro">
    <div class="reveal">
      <h2 style="margin-bottom:30px">설립 목적</h2>
      <div class="prose">
        <p class="lead-p">고구마 고유 품종으로 고부가가치 상품을 만들어 소비자에게 소개하고자 2017년 설립한 학교기업입니다.</p>
        <p>서울시립대학교 학교기업 더 고구마는 서울시립대학교 환경원예학과에서 개발한 고구마 고유 품종을 가지고 고구마 유래 고부가가치 상품을 개발하여 소비자들에게 소개하고자 설립되었습니다.</p>
        <p>고구마 무병주 생산, 고구마 병 진단 키트, 고구마 유용성분을 이용한 화장품, 고구마 식가공품 등을 개발해 왔으며, 고구마 신품종 육성 등을 통한 지역사회와의 연계 활동도 병행하고 있습니다.</p>
        <p>고구마는 더 이상 구황작물이 아닌 고부가가치 작물이며 21세기를 대표하는 작물로 자리 잡고 있습니다. 학교기업 더 고구마는 산학 연계 활동을 통해 고구마의 선진화에 노력하겠습니다.</p>
      </div>
    </div>
    <div class="pic reveal"><img src="${P("biz-rnd.jpg")}" alt="현미경과 배양 중인 고구마 모종" loading="lazy"></div>
  </div>
  <div class="stats reveal">
    <div><b>2017</b><span>학교기업 설립</span></div>
    <div><b>12</b><span>서울시립대 자체 육성 품종</span></div>
    <div><b>6</b><span>바이러스 다중 진단 키트</span></div>
    <div><b>3</b><span>판매 중인 제품</span></div>
  </div>
</div></div></section>

<section class="sec soft gut" id="map"><div class="w"><div class="ct">
  <div class="sh"><h2>오시는 길</h2><p>서울시립대학교 자연과학대학 환경원예학과</p></div>
  <!-- 개발 시: 지도 영역에 카카오/네이버 지도 삽입 -->
  <div class="map reveal">
    <div class="mbox" style="background-image:linear-gradient(rgba(30,25,20,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(30,25,20,.06) 1px,transparent 1px),linear-gradient(135deg,#ece8e3,#f8f7f5);background-size:40px 40px,40px 40px,auto">
      <span class="pin">서울시립대학교 자연과학관</span>
    </div>
    <dl>
      <div><dt>ADDRESS</dt><dd>서울특별시 동대문구 서울시립대로 163<br>서울시립대학교 자연과학대학 환경원예학과</dd></div>
      <div><dt>LABORATORIES</dt><dd>서울시립대학교 자연과학대학 환경원예학과</dd></div>
      <div><dt>MAP</dt><dd><a class="btn" style="font-size:.92rem;padding:12px 20px;margin-top:6px" href="https://map.naver.com/p/search/%EC%84%9C%EC%9A%B8%EC%8B%9C%EB%A6%BD%EB%8C%80%ED%95%99%EA%B5%90" target="_blank" rel="noopener">지도에서 보기 <b>→</b></a></dd></div>
    </dl>
  </div>
</div></div></section>`,

  education: () => `
<section class="sec gut"><div class="w"><div class="ct">
  <div class="prose reveal">
    <p class="lead-p">더고구마는 서울시립대학교 환경원예학과의 연구성과와 학교기업의 실제 사업을 교육의 장으로 활용합니다.</p>
    <p>학생에게는 전공지식을 현장에서 체험할 기회를, 지역사회에는 식물과 농업을 가까이 경험할 기회를 제공합니다. 이를 위해 현장실습, 창업교육 및 창업실습 프로그램 등을 매년 운영하고 있습니다.</p>
  </div>
</div></div></section>
<section class="sec soft gut"><div class="w"><div class="ct">
  <div class="sh"><h2>운영 프로그램</h2><p>매년 학생과 지역 주민을 대상으로 운영합니다.</p></div>
  <div class="icards">
    <div class="ic reveal"><div class="im"><img src="${S("culture/04.jpg")}" alt="마디 배양 중인 고구마 조직" loading="lazy"></div><div class="tx"><span>PRACTICE</span><h3>조직배양 실습</h3><p>조직배양묘 생산과 학교기업 업무를 직접 실습합니다.</p></div></div>
    <div class="ic reveal" style="transition-delay:.1s"><div class="im"><img src="${P("biz-edu.jpg")}" alt="강의실" loading="lazy"></div><div class="tx"><span>START-UP</span><h3>창업교육 및 창업실습</h3><p>창업 전반에 대한 이해와 문제해결 능력을 기릅니다.</p></div></div>
    <div class="ic reveal" style="transition-delay:.2s"><div class="im"><img src="${P("notice.jpg")}" alt="테라리움을 꾸미는 손" loading="lazy"></div><div class="tx"><span>COMMUNITY</span><h3>지역연계 프로그램</h3><p>지역과 연계하여 융합형 교육 경험 기회를 제공합니다.</p></div></div>
  </div>
</div></div></section>`,

  notice: () => `
<section class="sec gut"><div class="w"><div class="ct">
  <!-- 개발 시: 관리자 화면에서 등록한 공지가 이 목록에 표시됨 (/api/notices) -->
  <div class="board-top">
    <div class="cnt">전체 <b>${STATIC_NOTICES.length}</b>건</div>
    <form class="srch" onsubmit="return false"><input type="search" placeholder="검색어를 입력하세요" aria-label="공지 검색"><button aria-label="검색"><svg viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.8"/><path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></form>
  </div>
  <div class="nlist">
    ${STATIC_NOTICES.map((n, i) => `<details${i === 0 ? " open" : ""}><summary><span class="no">${STATIC_NOTICES.length - i}</span><span class="tag">${n.category}</span><span class="t">${n.title}</span><span class="d">${n.created_at.replaceAll("-", ".")}</span></summary>
      <div class="body">${n.body || "지역연계 프로그램 「식물과 함께하는 라이프 스타일 시리즈」를 안내드립니다.<br>식물과 함께하는 생활을 주제로 테라리움 만들기 등 시리즈 프로그램을 운영합니다. 자세한 일정과 참여 방법은 추후 이 공지에 안내드리겠습니다."}</div></details>`).join("")}
  </div>
  <div class="pager"><a class="on" href="#">1</a></div>
</div></div></section>`,
};

// 수익사업: 원고 본문을 쓰되 '현재 판매 제품' 카드만 사진 카드로 교체
const profitBody = () => {
  const base = PAGES.find((p) => p.id === "profit").body(ctx);
  return base
    .replace("지금은 고구마 무병조직배양묘, 고구마 생과, 고구마를 활용한 기념주를 제작하여 판매에 힘쓰고 있습니다.", "지금은 고구마 무병조직배양묘를 직접 생산·판매하고, 고구마 생과와 고구마를 활용한 기념주는 협력업체와 함께 선보이고 있습니다.")
    .replace(">현재 판매 제품</h2>", ">제품 소개</h2>")
    .replace(/<div class="cols"><a class="colink"[\s\S]*?<\/a><\/div>/,
    `<div class="icards">${["seedling", "fresh", "liquor"].map((k) => icard(k, true)).join("")}</div>`);
};

// 제품 상세
const productBody = (k) => {
  const d = PRODUCTS[k], im = PROD_IMG[k];
  const others = ["seedling", "fresh", "liquor"].filter((x) => x !== k);
  return `
<section class="sec gut"><div class="w"><div class="ct">
  <div class="pd">
    <div class="shot reveal"><img src="${im.src}" alt="${im.alt}" style="object-position:${im.pos}"><span class="lb">${im.soon ? "COMING SOON" : "THE GOGUMA"}</span>${im.soon ? '<em class="soon">시제품 개발 중 · 제품 이미지 준비 중</em>' : ""}</div>
    <div class="reveal">
      <div class="en">${d.en}</div>
      <h2>${d.t}</h2>
      <p class="lp">${LEAD[k]} 많은 관심 부탁드립니다.</p>
      <dl class="spec">${d.spec.map(([a, b]) => `<div><dt>${a}</dt><dd>${a === "구매" ? "협력업체 판매사이트" : b}</dd></div>`).join("")}</dl>
      <div class="buy">
        <!-- 개발 시: 판매 링크와 버튼 표시(on/off)를 관리자가 제품별로 설정. off면 '판매 준비 중'으로 표시 -->
        ${SALE[k].on
          ? `<a class="btn" href="${d.url || "#"}"${d.url ? ' target="_blank" rel="noopener"' : ""}>${SALE[k].btn} <b>→</b></a>`
          : `<span class="btn off">${SALE[k].btn}</span>`}
        <p>${SALE[k].by}</p>
      </div>
    </div>
  </div>
</div></div></section>
<section class="sec pnext gut"><div class="w"><div class="ct">
  <div class="sh"><h2>다른 제품도 둘러보세요</h2></div>
  <div class="icards">${others.map((x) => icard(x, true)).join("")}</div>
</div></div></section>`;
};

// 원고 본문(고구마 이야기·조직배양기술)은 .w 안에 .ct 폭 제한만 추가
const wrapCt = (html) => html.replaceAll('<div class="w">', '<div class="w"><div class="ct">').replaceAll("</div></section>", "</div></div></section>");

// ---------- 공통 틀 ----------
const header = (group, id) => `
<header class="hd" data-hd><div class="w">
  <a class="logo" href="./"><img class="lg-w" src="../assets/img/logo-w.png" alt="서울시립대 더 고구마"><img class="lg-c" src="../assets/img/logo.png" alt=""></a>
  <nav class="gnb" aria-label="주 메뉴">${MENU.map((m, i) => {
    const ks = m.id === "about" ? ABOUT_KIDS : kids(m);
    return `<div${i === group ? ' class="on"' : ""}><a href="${ctx.href(m.id)}">${m.ko}<small>${MENU_EN[i]}</small></a>${ks && ks.length > 1 ? `<div class="dd">${ks.map(([k, t]) => `<a href="${href(k)}"${k === id ? ' class="on"' : ""}>${t}</a>`).join("")}</div>` : ""}</div>`;
  }).join("")}</nav>
  <div class="util"><button class="burger" aria-label="메뉴 열기" aria-expanded="false"><i></i></button></div>
  <nav class="mnav" aria-label="모바일 메뉴">${MENU.map((m, i) => {
    const ks = m.id === "about" ? ABOUT_KIDS : kids(m);
    return `<div><b>${m.ko}<small>${MENU_EN[i]}</small></b>${ks.map(([k, t]) => `<a href="${href(k)}"${k === id ? ' class="on"' : ""}>${t}</a>`).join("")}</div>`;
  }).join("")}</nav>
</div></header>`;

const footer = `
<footer class="ft"><div class="w">
  <div class="sitemap">
    <div class="brand"><img class="flogo" src="../assets/img/logo-w.png" alt="서울시립대 더 고구마"><small>서울시립대학교 학교기업<br>환경원예학과</small></div>
    <div><b>학교기업 소개</b><a href="about.html">설립 목적</a><a href="about.html#map">오시는 길</a></div>
    <div><b>고구마 이야기</b><a href="sweet-potato.html">고구마 이야기</a><a href="culture.html">조직배양기술 이야기</a></div>
    <div><b>사업안내</b><a href="education.html">교육사업</a><a href="profit.html">수익사업</a></div>
    <div><b>제품 소개</b><a href="seedling.html">조직배양묘</a><a href="fresh.html">고구마 생과</a><a href="liquor.html">기념주</a></div>
    <div><b>공지사항</b><a href="notice.html">공지사항</a></div>
  </div>
  <div class="fb">
    <div><div class="links"><a href="#">개인정보처리방침</a><a href="#">이용약관</a></div><div style="margin-top:10px">서울특별시 동대문구 서울시립대로 163 서울시립대학교 자연과학대학 환경원예학과</div></div>
    <div style="align-self:flex-end">Copyright © 서울시립대학교 학교기업 더고구마. All Rights Reserved.</div>
  </div>
</div></footer>`;

const home = `<svg viewBox="0 0 16 16" fill="none"><path d="M2.5 7.5L8 3l5.5 4.5V13a.5.5 0 01-.5.5H3a.5.5 0 01-.5-.5V7.5z" stroke="currentColor" stroke-width="1.5"/></svg>`;

for (const p of PAGES.filter((p) => p.id !== "home")) {
  const m = MENU[p.group];
  const ks = p.id === "about" ? null : kids(m);
  const [bg, pos] = BANNER[p.id];
  const body = BODY[p.id] ? BODY[p.id]() : p.id === "profit" ? profitBody() : PRODUCTS[p.id] ? productBody(p.id) : wrapCt(p.body(ctx));
  const crumb = [m.ko, p.h1 !== m.ko ? p.h1 : null].filter(Boolean);
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700;800&display=swap">
<link rel="stylesheet" href="../assets/common.css?v=3">
<link rel="stylesheet" href="sub.css?v=8">
</head>
<body>
${header(p.group, p.id)}

<section class="sv">
  <div class="bg" style="background-image:url(${bg});background-position:${pos}" role="img" aria-label="${p.h1}"></div>
  <div class="w">
    <div>
      <div class="en">${p.eyebrow}</div>
      <h1>${p.h1}</h1>
      ${p.lead ? `<p class="lead">${LEAD[p.id] || p.lead}</p>` : ""}
    </div>
    <div class="crumb"><a href="./" aria-label="홈">${home}</a>${crumb.map((c) => `<i>›</i><span>${c}</span>`).join("")}</div>
  </div>
</section>
${ks && ks.length > 1 ? `<nav class="stab" aria-label="${m.ko} 하위 메뉴"><div class="w">${ks.map(([k, t]) => `<a href="${ctx.href(k)}"${k === p.id ? ' class="on" aria-current="page"' : ""}>${t}</a>`).join("")}</div></nav>` : ""}

<main>
${body}
</main>
${footer}

<a class="top-btn" href="#" aria-label="맨 위로"><svg viewBox="0 0 16 16" fill="none"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
<a class="back" href="../">← 시안 목록</a>
<script src="../assets/common.js"></script>
<script src="sub.js?v=1"></script>
</body>
</html>
`;
  writeFileSync(join(OUT, FILE[p.id]), html);
  console.log("wrote", FILE[p.id]);
}
