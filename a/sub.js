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
