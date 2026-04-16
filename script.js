const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.18,
});

reveals.forEach((element) => {
  revealObserver.observe(element);
});

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const imageSlots = [
  { key: "hero", label: "Image du haut", getNodes: () => Array.from(document.querySelectorAll(".hero-photo-frame img")) },
  { key: "signature-1", label: "Signature 1", getNodes: () => { const node = document.querySelectorAll(".signature-image")[0]; return node ? [node] : []; } },
  { key: "signature-2", label: "Signature 2", getNodes: () => { const node = document.querySelectorAll(".signature-image")[1]; return node ? [node] : []; } },
  { key: "signature-3", label: "Signature 3", getNodes: () => { const node = document.querySelectorAll(".signature-image")[2]; return node ? [node] : []; } },
  { key: "gallery-1", label: "Galerie 1", getNodes: () => { const node = document.querySelectorAll(".gallery-image")[0]; return node ? [node] : []; } },
  { key: "gallery-2", label: "Galerie 2", getNodes: () => { const node = document.querySelectorAll(".gallery-image")[1]; return node ? [node] : []; } },
  { key: "gallery-3", label: "Galerie 3", getNodes: () => { const node = document.querySelectorAll(".gallery-image")[2]; return node ? [node] : []; } },
];

function applyImage(slotKey, dataUrl) {
  const slot = imageSlots.find((item) => item.key === slotKey);
  if (!slot) return;
  slot.getNodes().forEach((node) => {
    if (node && node.tagName === "IMG") {
      node.src = dataUrl;
    }
  });
}

function buildImageManager() {
  const launcher = document.createElement("button");
  launcher.type = "button";
  launcher.textContent = "Changer les images";
  Object.assign(launcher.style, {
    position: "fixed",
    right: "18px",
    bottom: "18px",
    zIndex: "9999",
    border: "none",
    borderRadius: "999px",
    padding: "14px 18px",
    background: "linear-gradient(135deg, #f3c8dd, #b93f84)",
    color: "#fff",
    font: "600 14px Manrope, sans-serif",
    cursor: "pointer",
    boxShadow: "0 14px 30px rgba(185, 63, 132, 0.24)",
  });

  const panel = document.createElement("div");
  Object.assign(panel.style, {
    position: "fixed",
    right: "18px",
    bottom: "72px",
    width: "min(360px, calc(100vw - 36px))",
    maxHeight: "70vh",
    overflow: "auto",
    zIndex: "9999",
    padding: "16px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(210, 102, 162, 0.18)",
    boxShadow: "0 24px 60px rgba(185, 63, 132, 0.18)",
    display: "none",
    font: "14px Manrope, sans-serif",
  });

  const title = document.createElement("strong");
  title.textContent = "Importer tes images";
  title.style.display = "block";
  title.style.marginBottom = "6px";

  const help = document.createElement("p");
  help.textContent = "Choisis une image pour chaque bloc. Elle sera gardee sur ce navigateur.";
  help.style.margin = "0 0 14px";
  help.style.color = "#7b5e70";
  help.style.lineHeight = "1.5";

  panel.append(title, help);

  imageSlots.forEach((slot) => {
    const row = document.createElement("label");
    row.style.display = "grid";
    row.style.gap = "6px";
    row.style.marginBottom = "12px";

    const text = document.createElement("span");
    text.textContent = slot.label;
    text.style.fontWeight = "600";

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = String(reader.result || "");
        localStorage.setItem(`raffinato-image-${slot.key}`, result);
        applyImage(slot.key, result);
      };
      reader.readAsDataURL(file);
    });

    row.append(text, input);
    panel.append(row);
  });

  const reset = document.createElement("button");
  reset.type = "button";
  reset.textContent = "Reinitialiser les images";
  Object.assign(reset.style, {
    border: "1px solid rgba(210, 102, 162, 0.18)",
    borderRadius: "999px",
    padding: "10px 14px",
    background: "#fff",
    color: "#452436",
    cursor: "pointer",
    marginTop: "6px",
  });

  reset.addEventListener("click", () => {
    imageSlots.forEach((slot) => localStorage.removeItem(`raffinato-image-${slot.key}`));
    window.location.reload();
  });

  panel.append(reset);

  launcher.addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });

  document.body.append(launcher, panel);
}

imageSlots.forEach((slot) => {
  const storedImage = localStorage.getItem(`raffinato-image-${slot.key}`);
  if (storedImage) {
    applyImage(slot.key, storedImage);
  }
});

const adminMode = new URLSearchParams(window.location.search).get("admin") === "1";
if (adminMode) {
  buildImageManager();
}
