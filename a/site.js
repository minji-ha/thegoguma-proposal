// 더고구마 사이트 공통 스크립트 (빌드 때 dist/site.js 로 복사)
// 헤더·메뉴·등장 효과, 공지사항(/api/notices), 제품 정보(/api/products) 갱신
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mk = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const ymd = (d) => String(d || "").slice(0, 10).replaceAll("-", ".");

  // ---------- 헤더: 스크롤하면 흰 배경, 모바일 메뉴 ----------
  const hd = $("[data-hd]");
  if (hd) {
    const on = () => hd.classList.toggle("scrolled", scrollY > 40);
    addEventListener("scroll", on, { passive: true }); on();
    const btn = $(".burger", hd);
    if (btn) btn.addEventListener("click", () => {
      const open = hd.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
      document.documentElement.style.overflow = open ? "hidden" : "";
    });
  }

  // ---------- 맨 위로 ----------
  const top = $(".top-btn");
  if (top) {
    const on = () => top.classList.toggle("on", scrollY > 600);
    addEventListener("scroll", on, { passive: true }); on();
    top.addEventListener("click", (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); });
  }

  // ---------- 화면에 들어오면 살짝 떠오르기 ----------
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((e) => e.classList.add("in"));
  } else {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((e) => io.observe(e));
  }

  // ---------- 공지사항 ----------
  let noticesP;
  const getNotices = () => (noticesP ||= fetch("/api/notices", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null)).then((j) => (Array.isArray(j) ? j : null)).catch(() => null));

  // 메인 공지 블록: 왼쪽 이미지·배지는 고정, 오른쪽 글만 최신 공지로. ↑/↓ 로 이전·다음 공지
  const hn = $("[data-home-notice]");
  if (hn) getNotices().then((list) => {
    if (!list || !list.length) return;
    let i = 0;
    const show = () => {
      const n = list[i];
      $("[data-n-tag]", hn).textContent = n.category || "공지";
      $("[data-n-title]", hn).textContent = n.title;
      $("[data-n-date]", hn).textContent = ymd(n.created_at);
      const sum = String(n.body || "").replace(/\s+/g, " ").trim();
      $("[data-n-sum]", hn).textContent = sum ? (sum.length > 110 ? sum.slice(0, 110) + "…" : sum) : "자세한 내용은 공지사항에서 확인하실 수 있습니다.";
      $("[data-prev]", hn).disabled = i === 0;
      $("[data-next]", hn).disabled = i === list.length - 1;
    };
    $("[data-prev]", hn).addEventListener("click", () => { if (i > 0) { i--; show(); } });
    $("[data-next]", hn).addEventListener("click", () => { if (i < list.length - 1) { i++; show(); } });
    show();
  });

  // 공지사항 게시판: 검색 + 10개씩 페이지
  const board = $("[data-board]");
  if (board) getNotices().then((list) => {
    if (!list) return; // 실패하면 빌드 때 넣은 기본 공지를 그대로 둔다
    const PER = 10;
    let q = "", page = 1;
    const box = $(".nlist", board), cnt = $("[data-count]", board), pager = $(".pager", board);
    const render = () => {
      const f = q ? list.filter((n) => (n.title + " " + (n.body || "") + " " + (n.category || "")).toLowerCase().includes(q)) : list;
      cnt.textContent = f.length;
      const pages = Math.max(1, Math.ceil(f.length / PER));
      page = Math.min(page, pages);
      box.replaceChildren();
      if (!f.length) box.append(mk("div", "empty", q ? "검색 결과가 없습니다." : "등록된 공지사항이 없습니다."));
      f.slice((page - 1) * PER, page * PER).forEach((n, k) => {
        const d = mk("details"), s = mk("summary");
        s.append(mk("span", "no" + (n.pinned ? " pin" : ""), n.pinned ? "필독" : String(f.length - ((page - 1) * PER + k))));
        s.append(mk("span", "tag", n.category || "공지"), mk("span", "t", n.title), mk("span", "d", ymd(n.created_at)));
        d.append(s);
        const b = mk("div", "body", n.body || "");
        if (n.image_url && /^\/(media|images)\/notices?\//.test(String(n.image_url))) { const im = mk("img"); im.src = n.image_url; im.alt = n.title + " 이미지"; im.loading = "lazy"; b.prepend(im); }
        d.append(b); box.append(d);
      });
      pager.replaceChildren();
      for (let p = 1; p <= pages; p++) {
        const a = mk("button", p === page ? "on" : "", String(p)); a.type = "button";
        if (p === page) a.setAttribute("aria-current", "page");
        a.addEventListener("click", () => { page = p; render(); board.scrollIntoView({ behavior: "smooth" }); });
        pager.append(a);
      }
    };
    $(".srch", board).addEventListener("submit", (e) => { e.preventDefault(); q = $("input", e.target).value.trim().toLowerCase(); page = 1; render(); });
    render();
  });

  // ---------- 제품: 관리자 화면에서 고친 값으로 문구·사진·정보 표·구매 버튼 갱신 ----------
  const pb = $("[data-product]");
  if (pb) fetch("/api/products", { headers: { accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : null)).catch(() => null).then((list) => {
      const p = Array.isArray(list) && list.find((x) => x.key === pb.dataset.product);
      if (!p) return;
      if (p.name) { $$("[data-p-name]").forEach((e) => { e.textContent = p.name; }); }
      if (p.lead) { $$("[data-p-lead]").forEach((e) => { e.textContent = p.lead; }); }
      const sp = $("[data-p-spec]", pb);
      if (sp && Array.isArray(p.spec) && p.spec.length)
        sp.replaceChildren(...p.spec.map(([a, b]) => { const d = mk("div"); d.append(mk("dt", null, a), mk("dd", null, b)); return d; }));
      const im = $("[data-p-img]", pb);
      if (im && String(p.image_url || "").startsWith("/media/products/")) {
        const i = mk("img"); i.src = p.image_url; i.alt = p.name || "";
        im.replaceChildren(i, mk("span", "lb", "THE GOGUMA"));
      }
      const by = $("[data-p-buy]", pb);
      if (by) {
        const offTxt = ($(".btn.off", by) || {}).textContent || "준비 중";
        let b;
        if (p.sale_on && /^https?:/.test(p.sale_url || "")) {
          b = mk("a", "btn", (p.sale_label || "구매하러 가기") + " "); b.append(mk("b", null, "→"));
          b.href = p.sale_url; b.target = "_blank"; b.rel = "noopener";
        } else b = mk("span", "btn off", offTxt);
        by.replaceChildren(b, mk("p", null, p.sale_note || ""));
      }
    });
})();
