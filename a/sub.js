// 시안 A 공통: 모바일 메뉴 열기/닫기, 맨 위로 버튼
(() => {
  const hd = document.querySelector("[data-hd]");
  const btn = hd && hd.querySelector(".burger");
  if (btn) btn.addEventListener("click", () => {
    const open = hd.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
    document.documentElement.style.overflow = open ? "hidden" : "";
  });
  const top = document.querySelector(".top-btn");
  if (top) {
    const on = () => top.classList.toggle("on", scrollY > 600);
    addEventListener("scroll", on, { passive: true }); on();
    top.addEventListener("click", (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: "smooth" }); });
  }
})();
// 같은 페이지 안 탭(#설립 목적 / #오시는 길): 스크롤 위치에 따라 선택 표시
(() => {
  const tabs = [...document.querySelectorAll('.stab a[href^="#"]')];
  if (!tabs.length) return;
  const secs = tabs.map((a) => document.querySelector(a.getAttribute("href")));
  const set = () => {
    let i = 0;
    secs.forEach((s, k) => { if (s && s.getBoundingClientRect().top < 220) i = k; });
    const H = document.documentElement.scrollHeight;
    if (H > innerHeight + 40 && scrollY > 0 && innerHeight + scrollY >= H - 4) i = secs.length - 1;
    tabs.forEach((a, k) => { a.classList.toggle("on", k === i); a.toggleAttribute("aria-current", k === i); });
  };
  addEventListener("scroll", set, { passive: true }); set();
})();
