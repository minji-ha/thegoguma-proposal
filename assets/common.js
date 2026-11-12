// 세 시안 공통: 스크롤하면 헤더 배경 켜기, 화면에 들어오면 살짝 떠오르기
(() => {
  const hd = document.querySelector("[data-hd]");
  if (hd) {
    const on = () => hd.classList.toggle("scrolled", scrollY > 40);
    addEventListener("scroll", on, { passive: true }); on();
  }
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((e) => e.classList.add("in")); return;
  }
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach((e) => io.observe(e));
})();
