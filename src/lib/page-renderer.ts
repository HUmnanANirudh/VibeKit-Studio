// Shared page HTML generator — used by the editor preview AND the public page renderer
// This ensures preview = published (same tokens, same layout rules)

import type {
  HeroSection,
  FeatureCard,
  GalleryImage,
  ContactSectionConfig,
  Theme,
  PageRenderData,
} from '#/types'

export type {
  HeroSection,
  FeatureCard,
  GalleryImage,
  ContactSectionConfig,
  Theme,
  PageRenderData,
}

const THEME_TOKENS = `
[data-theme="minimal"]{--vk-bg:#FAFAFA;--vk-surface:#FFFFFF;--vk-surface-alt:#F4F4F5;--vk-text:#111111;--vk-text-muted:#71717A;--vk-accent:#18181B;--vk-accent-fg:#FFFFFF;--vk-border:#E4E4E7;--vk-radius:4px;--vk-radius-lg:8px;--vk-font-heading:'Playfair Display',serif;--vk-font-body:'Inter',sans-serif;--vk-spacing-section:96px;--vk-shadow:0 1px 3px rgba(0,0,0,0.08);--vk-shadow-lg:0 4px 20px rgba(0,0,0,0.08)}
[data-theme="neo-brutal"]{--vk-bg:#F5F0E8;--vk-surface:#FDFAF4;--vk-surface-alt:#EEE8D8;--vk-text:#0A0A0A;--vk-text-muted:#444;--vk-accent:#FF3F00;--vk-accent-fg:#FFF;--vk-border:#0A0A0A;--vk-radius:0px;--vk-radius-lg:0px;--vk-font-heading:'Space Grotesk',sans-serif;--vk-font-body:'Space Grotesk',sans-serif;--vk-spacing-section:80px;--vk-shadow:3px 3px 0 #0A0A0A;--vk-shadow-lg:5px 5px 0 #0A0A0A}
[data-theme="dark-neon"]{--vk-bg:#090909;--vk-surface:#111111;--vk-surface-alt:#1A1A1A;--vk-text:#F0F0F0;--vk-text-muted:#888;--vk-accent:#00FFB2;--vk-accent-fg:#000;--vk-border:#2A2A2A;--vk-radius:6px;--vk-radius-lg:12px;--vk-font-heading:'Space Grotesk',sans-serif;--vk-font-body:'Inter',sans-serif;--vk-spacing-section:96px;--vk-shadow:0 0 20px rgba(0,255,178,.15);--vk-shadow-lg:0 0 40px rgba(0,255,178,.2)}
[data-theme="pastel"]{--vk-bg:#FEF6FB;--vk-surface:#FFF;--vk-surface-alt:#FDE8F5;--vk-text:#2D1B3D;--vk-text-muted:#8B6BA0;--vk-accent:#C084FC;--vk-accent-fg:#FFF;--vk-border:#E9D5F5;--vk-radius:16px;--vk-radius-lg:24px;--vk-font-heading:'Playfair Display',serif;--vk-font-body:'Inter',sans-serif;--vk-spacing-section:80px;--vk-shadow:0 4px 20px rgba(192,132,252,.15);--vk-shadow-lg:0 8px 40px rgba(192,132,252,.2)}
[data-theme="luxury"]{--vk-bg:#0F0E0D;--vk-surface:#1A1815;--vk-surface-alt:#252220;--vk-text:#E8DCC8;--vk-text-muted:#9A8E7A;--vk-accent:#C9A96E;--vk-accent-fg:#0F0E0D;--vk-border:#2E2B26;--vk-radius:2px;--vk-radius-lg:4px;--vk-font-heading:'DM Serif Display','Playfair Display',serif;--vk-font-body:'Inter',sans-serif;--vk-spacing-section:120px;--vk-shadow:0 2px 12px rgba(0,0,0,.4);--vk-shadow-lg:0 8px 40px rgba(0,0,0,.5)}
[data-theme="retro"]{--vk-bg:#1A1A2E;--vk-surface:#16213E;--vk-surface-alt:#0F3460;--vk-text:#E0E0E0;--vk-text-muted:#A0A0B0;--vk-accent:#FFD700;--vk-accent-fg:#1A1A2E;--vk-border:#0F3460;--vk-radius:0px;--vk-radius-lg:2px;--vk-font-heading:'Space Mono','Courier New',monospace;--vk-font-body:'Space Mono','Courier New',monospace;--vk-spacing-section:80px;--vk-shadow:2px 2px 0 #FFD700;--vk-shadow-lg:4px 4px 0 #FFD700}
`

export function generatePublishedPageHTML(page: PageRenderData): string {
  const { theme, heroSection, featuresSection, gallerySection, contactSection, sectionOrder, slug, title } = page

  const sectionHTML: Record<string, string> = {
    hero: `
      <section class="section hero-section reveal">
        <div class="container">
          <h1 class="hero-title">${heroSection.title}</h1>
          <p class="hero-subtitle">${heroSection.subtitle}</p>
          ${heroSection.buttonText ? `<a href="${heroSection.buttonUrl || '#contact'}" class="btn btn-primary">${heroSection.buttonText}</a>` : ''}
        </div>
      </section>`,

    features: `
      <section class="section reveal">
        <div class="container">
          <h2 class="section-heading">Features</h2>
          <div class="features-grid">
            ${featuresSection.map((f) => `
              <div class="feature-card card">
                <div class="feature-icon">✦</div>
                <h3>${f.title}</h3>
                <p>${f.description}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>`,

    gallery: `
      <section class="section gallery-section reveal">
        <div class="container">
          <h2 class="section-heading">Gallery</h2>
          <div class="gallery-grid">
            ${gallerySection.filter((i) => i.url).map((img) => `
              <div class="gallery-item">
                <img src="${img.url}" alt="${img.alt || ''}" loading="lazy" />
              </div>`).join('')}
          </div>
        </div>
      </section>`,

    contact: `
      <section class="section contact-section reveal" id="contact">
        <div class="container">
          <h2 class="section-heading">${contactSection.heading}</h2>
          <p class="section-subheading">${contactSection.subheading}</p>
          <form class="contact-form" id="contactForm" onsubmit="handleContactSubmit(event)">
            <div class="form-group">
              <label for="cf-name">Name</label>
              <input type="text" id="cf-name" name="name" class="input" placeholder="Your name" required />
            </div>
            <div class="form-group">
              <label for="cf-email">Email</label>
              <input type="email" id="cf-email" name="email" class="input" placeholder="you@example.com" required />
            </div>
            <div class="form-group">
              <label for="cf-message">Message</label>
              <textarea id="cf-message" name="message" class="input" placeholder="Your message…" rows="5" required></textarea>
            </div>
            <div id="form-status"></div>
            <button type="submit" class="btn btn-primary" id="submitBtn">Send message</button>
          </form>
        </div>
      </section>`,
  }

  const orderedSections = sectionOrder
    .filter((s) => sectionHTML[s])
    .map((s) => sectionHTML[s])
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@400;700;900&family=Space+Grotesk:wght@400;500;700&family=DM+Serif+Display&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    ${THEME_TOKENS}
    body{background:var(--vk-bg);color:var(--vk-text);font-family:var(--vk-font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
    h1,h2,h3,h4{font-family:var(--vk-font-heading);line-height:1.2;font-weight:700;color:var(--vk-text)}
    a{color:var(--vk-accent);text-decoration:none}
    img{max-width:100%;height:auto;display:block}
    .container{width:100%;max-width:1200px;margin:0 auto;padding:0 24px}
    @media(max-width:768px){.container{padding:0 16px}}
    .section{padding:var(--vk-spacing-section,96px) 0}
    @media(max-width:768px){.section{padding:60px 0}}
    @media(max-width:480px){.section{padding:48px 0}}
    .btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 28px;font-family:var(--vk-font-body);font-size:15px;font-weight:600;border-radius:var(--vk-radius);cursor:pointer;border:2px solid transparent;text-decoration:none;transition:all .2s ease;white-space:nowrap;min-height:44px}
    .btn-primary{background:var(--vk-accent);color:var(--vk-accent-fg);border-color:var(--vk-accent);box-shadow:var(--vk-shadow)}
    .btn-primary:hover{opacity:.9;transform:translateY(-1px);box-shadow:var(--vk-shadow-lg)}
    [data-theme="neo-brutal"] .btn-primary:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--vk-text);opacity:1}
    [data-theme="dark-neon"] .btn-primary{box-shadow:0 0 20px rgba(0,255,178,.4)}
    [data-theme="dark-neon"] .btn-primary:hover{box-shadow:0 0 40px rgba(0,255,178,.6)}
    [data-theme="retro"] .btn-primary{text-transform:uppercase;letter-spacing:.05em;font-size:13px}
    .card{background:var(--vk-surface);border:1px solid var(--vk-border);border-radius:var(--vk-radius-lg);padding:24px;box-shadow:var(--vk-shadow);transition:all .2s ease}
    .card:hover{box-shadow:var(--vk-shadow-lg);transform:translateY(-2px)}
    [data-theme="neo-brutal"] .card{border:2px solid var(--vk-border)}
    [data-theme="neo-brutal"] .card:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 var(--vk-text)}
    .input{width:100%;padding:12px 16px;font-family:var(--vk-font-body);font-size:15px;background:var(--vk-surface);color:var(--vk-text);border:1.5px solid var(--vk-border);border-radius:var(--vk-radius);outline:none;transition:border-color .2s;min-height:44px}
    .input:focus{border-color:var(--vk-accent)}
    textarea.input{min-height:120px;resize:vertical}
    .hero-section{text-align:center;background:var(--vk-bg)}
    .hero-title{font-size:clamp(2rem,5vw,4.5rem);font-weight:900;margin-bottom:20px}
    [data-theme="dark-neon"] .hero-title{text-shadow:0 0 60px rgba(0,255,178,.3)}
    [data-theme="retro"] .hero-title{text-shadow:2px 2px 0 var(--vk-accent)}
    .hero-subtitle{font-size:clamp(1rem,2.5vw,1.35rem);color:var(--vk-text-muted);max-width:600px;margin:0 auto 36px}
    .section-heading{font-size:clamp(1.5rem,3vw,2.5rem);text-align:center;margin-bottom:16px}
    .features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px}
    @media(max-width:1024px){.features-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:640px){.features-grid{grid-template-columns:1fr;gap:16px}}
    .feature-icon{font-size:1.5rem;color:var(--vk-accent);margin-bottom:14px}
    .feature-card h3{font-size:1.1rem;margin-bottom:8px}
    .feature-card p{color:var(--vk-text-muted);font-size:15px;line-height:1.6}
    .gallery-section{background:var(--vk-surface-alt)}
    .gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px}
    @media(max-width:1024px){.gallery-grid{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:480px){.gallery-grid{grid-template-columns:1fr}}
    .gallery-item{border-radius:var(--vk-radius-lg);overflow:hidden;aspect-ratio:4/3;background:var(--vk-surface)}
    .gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
    .gallery-item:hover img{transform:scale(1.04)}
    .contact-section{background:var(--vk-bg)}
    .section-subheading{text-align:center;color:var(--vk-text-muted);margin-bottom:48px;font-size:1.1rem}
    .contact-form{max-width:560px;margin:0 auto;display:flex;flex-direction:column;gap:20px}
    .form-group{display:flex;flex-direction:column;gap:6px}
    .form-group label{font-size:14px;font-weight:600}
    .form-success{background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);color:#166534;padding:12px 16px;border-radius:var(--vk-radius);font-size:14px}
    [data-theme="dark-neon"] .form-success,[data-theme="luxury"] .form-success,[data-theme="retro"] .form-success{color:#4ADE80}
    .reveal{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}
    .reveal.visible{opacity:1;transform:translateY(0)}
  </style>
</head>
<body>
  ${orderedSections}
  <script>
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)} });
    },{threshold:0.1});
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    async function handleContactSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const statusEl = document.getElementById('form-status');
      btn.disabled = true; btn.textContent = 'Sending\u2026';
      const fd = new FormData(e.target);
      try {
        const res = await fetch('/api/public/pages/${slug}/contact', {
          method:'POST',headers:{'Content-Type':'application/json'},
          body:JSON.stringify({name:fd.get('name'),email:fd.get('email'),message:fd.get('message')}),
        });
        if(res.ok){statusEl.innerHTML='<div class="form-success">\u2713 Message sent! We\u2019ll be in touch soon.</div>';e.target.reset();}
        else{statusEl.innerHTML='<div style="color:#EF4444;font-size:14px">Failed to send. Please try again.</div>';}
      }catch{statusEl.innerHTML='<div style="color:#EF4444;font-size:14px">Network error. Please try again.</div>';}
      finally{btn.disabled=false;btn.textContent='Send message';}
    }
  </script>
</body>
</html>`
}
