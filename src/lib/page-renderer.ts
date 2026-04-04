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
:root {
  --background: #ffffff;
  --surface: #f9fafb;
  --text: #111827;
  --accent: #2563eb;
  --radius: 8px;
  --heading-font: 'Inter', sans-serif;
  --body-font: 'Inter', sans-serif;
  --spacing-section: 6rem;
}

[data-theme="minimal"] {
  --background: #ffffff;
  --surface: #f9fafb;
  --text: #111827;
  --accent: #000000;
  --radius: 4px;
  --heading-font: 'Inter', sans-serif;
}

[data-theme="neo-brutal"] {
  --background: #fff4e0;
  --surface: #ffffff;
  --text: #000000;
  --accent: #ff3333;
  --radius: 0px;
  --heading-font: 'Space Grotesk', sans-serif;
}

[data-theme="dark-neon"] {
  --background: #0a0a0a;
  --surface: #1a1a1a;
  --text: #ffffff;
  --accent: #00ff99;
  --radius: 12px;
  --heading-font: 'Space Grotesk', sans-serif;
}

[data-theme="pastel-soft"] {
  --background: #fff5f5;
  --surface: #ffffff;
  --text: #4a4a4a;
  --accent: #ffb7b7;
  --radius: 32px;
  --heading-font: 'Outfit', sans-serif;
}

[data-theme="luxury-serif"] {
  --background: #0f0f0f;
  --surface: #1a1a1a;
  --text: #f5f5f5;
  --accent: #d4af37;
  --radius:0px;
  --heading-font: 'Playfair Display', serif;
}

[data-theme="retro-pixel"] {
  --background: #1a1a1a;
  --surface: #2a2a2a;
  --text: #33ff33;
  --accent: #ff00ff;
  --radius: 0px;
  --heading-font: 'Courier New', monospace;
}
`

export function generatePublishedPageHTML(page: PageRenderData): string {
  const {
    theme,
    content,
    title,
  } = page

  // If content is an object with blocks, use those, otherwise use content as array
  const blocks = Array.isArray(content) ? content : (content as any)?.blocks || []

  const renderBlock = (block: any): string => {
    switch (block.type) {
      case 'Hero':
        return `
          <section class="section hero-section reveal">
            <div class="container text-center">
              <h1 class="hero-title">${block.props.title}</h1>
              <p class="hero-subtitle">${block.props.subtitle}</p>
              ${block.props.buttonText ? `<a href="${block.props.buttonUrl || '#'}" class="btn btn-primary">${block.props.buttonText}</a>` : ''}
            </div>
          </section>`
      case 'Features':
        return `
          <section class="section reveal">
            <div class="container text-center">
              <h2 class="section-heading">Features</h2>
              <div class="features-grid">
                ${(block.props.items || [])
                  .map(
                    (f: any) => `
                  <div class="feature-card card">
                    <div class="feature-icon">✦</div>
                    <h3 class="font-bold mb-2">${f.title}</h3>
                    <p class="text-sm opacity-80">${f.description}</p>
                  </div>`,
                  )
                  .join('')}
              </div>
            </div>
          </section>`
      case 'Gallery':
        return `
          <section class="section gallery-section reveal">
            <div class="container text-center">
              <h2 class="section-heading">Gallery</h2>
              <div class="gallery-grid mt-12">
                ${(block.props.images || [])
                  .map(
                    (img: any) => `
                  <div class="gallery-item">
                    <img src="${img.url}" alt="${img.alt || ''}" class="w-full h-full object-cover" loading="lazy" />
                  </div>`,
                  )
                  .join('')}
              </div>
            </div>
          </section>`
      case 'Contact':
        return `
          <section class="section contact-section reveal" id="contact">
            <div class="container text-center">
              <h2 class="section-heading">${block.props.heading || 'Contact Us'}</h2>
              <p class="section-subheading mb-12 opacity-80">${block.props.subheading || ''}</p>
              <form class="contact-form max-w-lg mx-auto text-left" id="contactForm">
                <div class="form-group mb-4">
                  <label class="block text-xs font-bold uppercase tracking-wider mb-1">Name</label>
                  <input type="text" class="input" placeholder="Your name" required />
                </div>
                <div class="form-group mb-4">
                  <label class="block text-xs font-bold uppercase tracking-wider mb-1">Email</label>
                  <input type="email" class="input" placeholder="you@example.com" required />
                </div>
                <div class="form-group mb-6">
                  <label class="block text-xs font-bold uppercase tracking-wider mb-1">Message</label>
                  <textarea class="input" placeholder="Your message…" rows="5" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary w-full">Send message</button>
              </form>
            </div>
          </section>`
      default:
        return ''
    }
  }

  const sectionsHTML = blocks.map(renderBlock).join('\n')

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Space+Grotesk:wght@400;700&family=Outfit:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    ${THEME_TOKENS}
    body{
      background: var(--background);
      color: var(--text);
      font-family: var(--body-font);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    h1,h2,h3,h4{font-family:var(--heading-font);line-height:1.1;font-weight:900}
    .container{max-width:1200px;margin:0 auto;padding:0 2rem}
    .section{padding:var(--spacing-section) 0}
    .text-center{text-align:center}
    .text-left{text-align:left}
    .mb-2{margin-bottom:0.5rem}
    .mb-4{margin-bottom:1rem}
    .mb-6{margin-bottom:1.5rem}
    .mb-12{margin-bottom:3rem}
    .mt-12{margin-top:3rem}
    .w-full{width:100%}
    .mx-auto{margin-left:auto;margin-right:auto}
    .max-w-lg{max-width:32rem}
    
    .btn{
      display:inline-flex;align-items:center;justify-content:center;
      padding:1rem 2rem;font-weight:900;text-transform:uppercase;
      letter-spacing:0.1em;font-size:0.75rem;border-radius:var(--radius);
      cursor:pointer;transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
      border:none;text-decoration:none;
    }
    .btn-primary{background:var(--accent);color:var(--background)}
    .btn-primary:hover{opacity:0.9;transform:translateY(-2px)}
    
    .card{
      background:var(--surface);border:1px solid rgba(0,0,0,0.05);
      border-radius:var(--radius);padding:2rem;
      transition:all 0.3s ease;
    }
    .card:hover{transform:translateY(-4px);box-shadow:0 20px 40px -10px rgba(0,0,0,0.1)}
    
    .input{
      width:100%;padding:0.75rem 1rem;background:var(--surface);
      border:2px solid rgba(0,0,0,0.05);border-radius:var(--radius);
      color:inherit;outline:none;transition:all 0.2s;
    }
    .input:focus{border-color:var(--accent)}
    
    .hero-title{font-size:clamp(2.5rem,8vw,5rem);margin-bottom:1.5rem;letter-spacing:-0.03em}
    .hero-subtitle{font-size:clamp(1.1rem,2vw,1.25rem);margin-bottom:2.5rem;opacity:0.8;max-width:700px;margin-left:auto;margin-right:auto}
    
    .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2rem;margin-top:4rem}
    .gallery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem}
    .gallery-item{aspect-ratio:1;overflow:hidden;border-radius:var(--radius)}
    .gallery-item img{transition:transform 0.5s ease}
    .gallery-item:hover img{transform:scale(1.1)}
    
    .reveal{opacity:0;transform:translateY(30px);transition:all 0.8s cubic-bezier(0,0,0.2,1)}
    .reveal.visible{opacity:1;transform:translateY(0)}

    /* Theme Specific Overrides */
    [data-theme="neo-brutal"] .card { border: 3px solid #000; box-shadow: 8px 8px 0 #000; }
    [data-theme="neo-brutal"] .card:hover { transform: translate(-4px, -4px); box-shadow: 12px 12px 0 #000; }
    [data-theme="neo-brutal"] .btn { border: 3px solid #000; box-shadow: 4px 4px 0 #000; }
    [data-theme="neo-brutal"] .input { border: 3px solid #000; }

    [data-theme="dark-neon"] .hero-title { text-shadow: 0 0 20px var(--accent); }
    [data-theme="dark-neon"] .card { border-color: rgba(0,255,153,0.1); box-shadow: 0 0 20px rgba(0,255,153,0.05); }

    [data-theme="retro-pixel"] { image-rendering: pixelated; }
    [data-theme="retro-pixel"] .hero-title { text-shadow: 4px 4px 0 var(--accent); }
  </style>
</head>
<body>
  ${sectionsHTML}
  <script>
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  </script>
</body>
</html>`
}
