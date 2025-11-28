document.addEventListener("DOMContentLoaded", () => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  }, { threshold: 0.18 });
  document.querySelectorAll(".fade-up").forEach(el => io.observe(el));

  window.handleSubmit = (e) => {
    e.preventDefault();
    const s = document.getElementById("formStatus");
    s.style.display = "block";
    e.target.reset();
    setTimeout(() => { s.style.display = "none"; }, 4000);
    return false;
  };
});
