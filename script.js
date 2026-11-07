// Boliyapur Community Website interactions + content renderer
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});
document.getElementById("year").textContent = new Date().getFullYear();

const data = window.BOLIYAPUR_CONTENT || { news: [], services: [], gallery: [] };
const safe = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));
const validLink = value => /^(https?:\/\/|tel:|mailto:|#)/i.test(value || "") ? value : "#contact";

// এলাকার আপডেট
const newsGrid = document.getElementById("newsGrid");
newsGrid.innerHTML = (data.news || []).map((item, index) => `
  <article class="news-card">
    ${item.image ? `<div class="news-photo-wrap"><img class="news-photo" src="${safe(item.image)}" alt="${safe(item.title)}" loading="lazy"></div>` : `<div class="news-visual ${["visual-green","visual-blue","visual-orange"][index % 3]}"><span>${String(index + 1).padStart(2,"0")}</span><b>${safe(item.category || "আপডেট")}</b><i>✦</i></div>`}
    <div class="news-content"><span class="category">${safe(item.category)}</span>${item.date ? `<small class="content-date">${safe(item.date)}</small>` : ""}<h3>${safe(item.title)}</h3><p>${safe(item.description)}</p><a href="${safe(validLink(item.link))}" class="text-link">${safe(item.linkText || "আরও জানুন")} <b>→</b></a></div>
  </article>`).join("") || `<p class="empty-state">এখনো কোনো আপডেট যোগ করা হয়নি। content.js ফাইলে খবর যোগ করুন।</p>`;

// স্থানীয় সেবা ডিরেক্টরি
const serviceGrid = document.getElementById("serviceGrid");
serviceGrid.innerHTML = (data.services || []).map(item => {
  const phone = item.phone ? `<a class="service-detail-link" href="tel:${safe(item.phone)}">ফোন: ${safe(item.phone)}</a>` : "";
  const address = item.address ? `<small class="service-address">ঠিকানা: ${safe(item.address)}</small>` : "";
  const link = item.link ? `<a class="service-detail-link" href="${safe(validLink(item.link))}" target="_blank" rel="noopener">ওয়েবসাইট / বিস্তারিত ↗</a>` : "";
  return `<article class="service-item"><span class="service-icon">${safe(item.icon || "•")}</span><span class="service-main"><b>${safe(item.title)}</b><small>${safe(item.description)}</small>${item.details ? `<small class="service-extra">${safe(item.details)}</small>` : ""}${address}${phone}${link}</span><i>↗</i></article>`;
}).join("") || `<p class="empty-state">এখনো কোনো সেবার তথ্য যোগ করা হয়নি। content.js ফাইলে যোগ করুন।</p>`;

// ফটো গ্যালারি: category অনুযায়ী filter
const galleryGrid = document.getElementById("galleryGrid");
const galleryFilters = document.getElementById("galleryFilters");
const galleryItems = data.gallery || [];
let activeCategory = "সব ছবি";
function renderGallery() {
  const categories = ["সব ছবি", ...new Set(galleryItems.map(item => item.category || "অন্যান্য"))];
  galleryFilters.innerHTML = categories.map(category => `<button type="button" class="gallery-filter ${category === activeCategory ? "active" : ""}" data-category="${safe(category)}">${safe(category)}</button>`).join("");
  const visible = activeCategory === "সব ছবি" ? galleryItems : galleryItems.filter(item => (item.category || "অন্যান্য") === activeCategory);
  galleryGrid.innerHTML = visible.length ? visible.map((item, index) => `
    <figure class="gallery-tile ${index === 0 ? "gallery-large" : ""}">
      <a class="gallery-image-link" href="${safe(item.image)}" target="_blank" rel="noopener" aria-label="${safe(item.title)} ছবি বড় করে দেখুন">
        <img class="gallery-photo" src="${safe(item.image)}" alt="${safe(item.title)}" loading="lazy">
      </a>
      <figcaption><b>${safe(item.title)}</b><span>${safe(item.category || "অন্যান্য")}${item.date ? " • " + safe(item.date) : ""}</span></figcaption>
    </figure>`).join("") : `<div class="gallery-empty"><div class="gallery-empty-icon">▧</div><h3>${galleryItems.length ? "এই বিভাগে এখনো ছবি নেই" : "গ্যালারিতে এখনো ছবি যোগ করা হয়নি"}</h3><p>স্কুলের অনুষ্ঠান, খেলাধুলা, সামাজিক আয়োজন বা বলিয়াপুরের ছবি যোগ করতে GitHub-এর <b>images/gallery</b> ফোল্ডারে ছবি আপলোড করুন, তারপর content.js ফাইলে ছবির তথ্য লিখুন।</p></div>`;
}
galleryFilters.addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderGallery();
});
renderGallery();

// Contact form: replace placeholder with the real community email before publishing
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = form.get("name");
  const reply = form.get("reply");
  const message = form.get("message");
  const subject = encodeURIComponent("Boliyapur Community Website - Message");
  const body = encodeURIComponent(`নাম: ${name}\nযোগাযোগ: ${reply}\n\nবার্তা:\n${message}`);
  window.location.href = `mailto:YOUR-EMAIL@example.com?subject=${subject}&body=${body}`;
});
