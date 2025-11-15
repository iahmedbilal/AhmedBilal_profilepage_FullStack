// script.js - polished interactions for recruiter-friendly portfolio
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Smooth scroll + active nav highlighting ---------- */
  const navLinks = Array.from(document.querySelectorAll(".quicknav a"));
  const sections = navLinks.map((a) =>
    document.querySelector(a.getAttribute("href"))
  );

  // smooth scrolling
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });
  // Wrap every letter in a span
  var textWrapper = document.querySelector(".ml10 .letters");
  textWrapper.innerHTML = textWrapper.textContent.replace(
    /\S/g,
    "<span class='letter'>$&</span>"
  );

  anime
    .timeline({ loop: true })
    .add({
      targets: ".ml10 .letter",
      rotateY: [-90, 0],
      duration: 1300,
      delay: (el, i) => 45 * i,
    })
    .add({
      targets: ".ml10",
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000,
    });
  // observe sections to highlight nav
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = `#${entry.target.id}`;
        const link = document.querySelector(`.quicknav a[href="${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { root: null, threshold: 0.45 }
  );

  sections.forEach((s) => {
    if (s) io.observe(s);
  });

  /* ---------- Typewriter effect for subtitle ---------- */
  const subtitleEl = document.querySelector(".subtitle");
  if (subtitleEl) {
    const fullText = subtitleEl.textContent.trim();
    subtitleEl.textContent = "";
    let i = 0;
    const delay = 32;
    (function type() {
      if (i <= fullText.length) {
        subtitleEl.textContent = fullText.slice(0, i++);
        setTimeout(type, delay);
      } else {
        // small blinking cursor effect after completion
        subtitleEl.classList.add("typed-complete");
      }
    })();
  }

  /* ---------- Reveal on scroll for cards ---------- */
  const cards = document.querySelectorAll(".card");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("reveal");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  cards.forEach((c) => revealObserver.observe(c));

  /* ---------- Copy email to clipboard (clickable) ---------- */
  const contactList = document.querySelector(".contact");
  if (contactList) {
    const emailLink = contactList.querySelector('a[href^="mailto:"]');
  }

  /* ---------- Floating contact button + modal ---------- */
  // create floating button
  const floatBtn = document.createElement("button");
  floatBtn.className = "float-contact";
  floatBtn.ariaLabel = "Contact me";
  floatBtn.innerHTML = "Contact";
  document.body.appendChild(floatBtn);

  /* ---------- create modal ---------- */
  const modal = document.createElement("div");
  modal.className = "contact-modal";
  modal.innerHTML = `
    <div class="modal-inner" role="dialog" aria-modal="true" aria-label="Contact me">
      <button class="modal-close" aria-label="Close">✕</button>
      <h3>Get in touch</h3>
      <p>You can reach me at <button class="modal-copy-email" type="button">${
        document.querySelector('.contact a[href^="mailto:"]')?.textContent ||
        "email"
      }</button></p>
      <p>Or call: <a href="tel:${
        document
          .querySelector('.contact a[href^="tel:"]')
          ?.getAttribute("href")
          ?.replace("tel:", "") || ""
      }">${
    document.querySelector('.contact a[href^="tel:"]')?.textContent || ""
  }</a></p>
      <p><a class="download-resume" href="resume.pdf" target="_blank" rel="noopener">Download Resume (PDF)</a></p>
    </div>
  `;
  document.body.appendChild(modal);

  // open/close handlers
  const openModal = () => modal.classList.add("open");
  const closeModal = () => modal.classList.remove("open");
  floatBtn.addEventListener("click", openModal);
  modal.querySelector(".modal-close").addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // copy email from modal
  const modalCopy = modal.querySelector(".modal-copy-email");
  if (modalCopy) {
    modalCopy.addEventListener("click", async () => {
      const text = modalCopy.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        modalCopy.textContent = "Copied ✓";
        setTimeout(() => (modalCopy.textContent = text), 2000);
      } catch {
        modalCopy.textContent = "Copy failed";
        setTimeout(() => (modalCopy.textContent = text), 2000);
      }
    });
  }

  /* ---------- Simple animated skill progress bars (convert tags into bars) ---------- */
  // define a small skill -> confidence map (edit values as you like)
  const skillConfidence = {
    HTML: 96,
    CSS: 95,
    JavaScript: 94,
    "C++": 78,
    "Git & GitHub": 99,
    React: 90,
    Tailwind: 94,
    Firebase: 92,
    "SQL (Basics)": 88,
  };

  const tagsEl = document.querySelector(".tags");
  if (tagsEl) {
    // create a mini progress area under skills
    const progressWrap = document.createElement("div");
    progressWrap.className = "skill-bars";
    Object.keys(skillConfidence).forEach((skill) => {
      const val = skillConfidence[skill];
      const bar = document.createElement("div");
      bar.className = "skill-row";
      bar.innerHTML = `
        <div class="skill-head"><strong>${skill}</strong><span class="pct">${val}%</span></div>
        <div class="bar"><div class="fill" style="width:0%" data-target="${val}"></div></div>
      `;
      progressWrap.appendChild(bar);
    });
    // append after tags
    tagsEl.parentElement.appendChild(progressWrap);

    // animate when in view
    const barObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) {
            const fills = ent.target.querySelectorAll(".fill");
            fills.forEach((f) => {
              const t = f.dataset.target;
              f.style.transition = "width 900ms ease-out";
              f.style.width = t + "%";
            });
            obs.unobserve(ent.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    barObserver.observe(progressWrap);
  }

  /* ---------- Small accessibility improvement: prefers-reduced-motion respect ---------- */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReduced.matches) {
    document.documentElement.classList.add("reduced-motion");
  }

  /* === NEW THEME TOGGLE LOGIC === */
  try {
    const themeToggle = document.getElementById("theme-toggle");
    const htmlEl = document.documentElement;
    const themeKey = "theme-preference";

    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem(themeKey);

    // Get OS preference
    const osTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    // Determine initial theme
    let currentTheme = savedTheme ? savedTheme : osTheme;

    // Apply initial theme
    if (currentTheme === "dark") {
      htmlEl.classList.add("dark-mode");
      themeToggle.setAttribute("aria-pressed", "true");
    } else {
      htmlEl.classList.remove("dark-mode");
      themeToggle.setAttribute("aria-pressed", "false");
    }

    // Add click listener
    themeToggle.addEventListener("click", () => {
      // Toggle the class on <html>
      htmlEl.classList.toggle("dark-mode");

      // Update currentTheme variable
      const isDark = htmlEl.classList.contains("dark-mode");
      currentTheme = isDark ? "dark" : "light";

      // Save preference to localStorage
      localStorage.setItem(themeKey, currentTheme);

      // Update ARIA attribute
      themeToggle.setAttribute("aria-pressed", isDark.toString());
    });
  } catch (e) {
    console.error("Theme toggle script failed:", e);
  }
  /* === END NEW THEME LOGIC === */
});
