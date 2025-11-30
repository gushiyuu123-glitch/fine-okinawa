// src/eventsObserver.js

// fade-up 出現
document.addEventListener("DOMContentLoaded", () => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("show");
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));
});
