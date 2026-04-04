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
  --border: #e5e7eb;
  --radius: 8px;
  --shadow: 0 1px 3px rgba(0,0,0,0.1);
  --heading-font: 'Inter', sans-serif;
  --body-font: 'Inter', sans-serif;
  --spacing-section: 6rem;
  --transition: 0.3s ease;
}

/* STYLE 1: MINIMAL */
[data-theme="minimal"] {
  --background: #FFFFFF;
  --surface: #F5F5F5;
  --text: #000000;
  --accent: #000000;
  --border: #E0E0E0;
  --radius: 0px;
  --shadow: none;
  --heading-font: 'Satoshi', sans-serif;
  --body-font: 'Satoshi', sans-serif;
  --transition: 0.2s ease-out;
}

/* STYLE 2: NEO-BRUTAL */
[data-theme="neo-brutal"] {
  --background: #FFFFFF;
  --surface: #FFFFFF;
  --text: #000000;
  --accent: #FFD700;
  --border: #000000;
  --radius: 0px;
  --shadow: 6px 6px 0px 0px #000;
  --heading-font: 'Cabinet Grotesk', sans-serif;
  --body-font: 'Cabinet Grotesk', sans-serif;
  --transition: 0.15s linear;
}

/* STYLE 3: DARK-NEON */
[data-theme="dark-neon"] {
  --background: #0A0E27;
  --surface: #1A1F3A;
  --text: #FFFFFF;
  --accent: #00FF41;
  --border: rgba(255,255,255,0.1);
  --radius: 8px;
  --shadow: 0 0 20px rgba(0,255,65,0.2);
  --heading-font: 'Space Grotesk', sans-serif;
  --body-font: 'Space Grotesk', sans-serif;
  --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* STYLE 4: PASTEL-SOFT */
[data-theme="pastel-soft"] {
  --background: #FFFFFF;
  --surface: #FFF5F5;
  --text: #5A5A5A;
  --accent: #FFB3D9;
  --border: rgba(0,0,0,0.05);
  --radius: 32px;
  --shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
  --heading-font: 'Plus Jakarta Sans', sans-serif;
  --body-font: 'Plus Jakarta Sans', sans-serif;
  --transition: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* STYLE 5: LUXURY-SERIF */
[data-theme="luxury-serif"] {
  --background: #F5F5F0;
  --surface: #FFFFFF;
  --text: #1A1A1A;
  --accent: #D4AF37;
  --border: rgba(0,0,0,0.1);
  --radius: 0px;
  --shadow: none;
  --heading-font: 'Playfair Display', serif;
  --body-font: 'Playfair Display', serif;
  --transition: 0.5s ease-in-out;
}

/* STYLE 6: RETRO-PIXEL */
[data-theme="retro-pixel"] {
  --background: #000000;
  --surface: #222222;
  --text: #00FF41;
  --accent: #FF006E;
  --border: #FFFFFF;
  --radius: 0px;
  --shadow: 4px 4px 0px #000;
  --heading-font: 'JetBrains Mono', monospace;
  --body-font: 'JetBrains Mono', monospace;
  --transition: 0.1s linear;
}
`

export function generatePublishedPageHTML(page: PageRenderData): string {
  const {
    theme,
    content,
    title,
    themeTokens,
    interactions,
  } = page

  const dynamicStyles = themeTokens?.colors ? `
    :root {
      ${Object.entries(themeTokens.colors).map(([k, v]) => `--${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v};`).join('\n')}
    }
  ` : '';

  // If content is an object with blocks, use those, otherwise use content as array
  const blocks = Array.isArray(content) ? content : (content as any)?.blocks || []

  const renderBlock = (block: any): string => {
    const childrenHTML = block.children ? block.children.map(renderBlock).join('\n') : ''
    
    switch (block.type) {
      case 'Section':
        return `
          <section class="section reveal ${block.props?.background === 'surface' ? 'bg-surface' : ''} p-${block.props?.padding || 'md'}">
            <div class="container">
              ${childrenHTML}
            </div>
          </section>`
      case 'Flex':
        return `
          <div class="flex-container flex-${block.props?.direction || 'row'} gap-${block.props?.gap || 'md'} align-${block.props?.align || 'center'}">
            ${childrenHTML}
          </div>`
      case 'Text':
        const Tag = block.props?.tag || 'p'
        return `
          <${Tag} class="text-block text-${block.props?.align || 'left'} color-${block.props?.color || 'default'}">
            ${block.props?.content || ''}
          </${Tag}>`
      case 'Image':
        return `
          <div class="image-block">
            <img src="${block.props?.url}" alt="${block.props?.alt || ''}" class="w-full h-auto rounded-lg shadow-sm" loading="lazy" />
          </div>`
      case 'Button':
        return `
          <div class="button-block">
            <a href="${block.props?.url || '#'}" class="btn btn-${block.props?.variant || 'primary'}">${block.props?.label}</a>
          </div>`
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;700&family=Space+Grotesk:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    ${THEME_TOKENS}
    ${dynamicStyles}
    body {
      background: var(--background);
      color: var(--text);
      font-family: var(--body-font);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      transition: background var(--transition), color var(--transition);
    }
    h1, h2, h3, h4 { font-family: var(--heading-font); line-height: 1.1; font-weight: 900; margin-bottom: 1rem; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    .section { padding: var(--spacing-section) 0; border-bottom: 1px solid var(--border); }
    
    .bg-surface { background: var(--surface); }
    .p-md { padding: 2rem 0; }
    .p-lg { padding: 4rem 0; }
    
    .flex-container { display: flex; width: 100%; }
    .flex-row { flex-direction: row; }
    .flex-col { flex-direction: column; }
    .gap-sm { gap: 1rem; }
    .gap-md { gap: 2rem; }
    .gap-lg { gap: 4rem; }
    .align-start { align-items: flex-start; text-align: left; }
    .align-center { align-items: center; text-align: center; }
    
    .text-block { margin-bottom: 1rem; max-width: 800px; }
    .text-center { text-align: center; margin-left: auto; margin-right: auto; }
    .text-left { text-align: left; }
    .color-default { color: var(--text); }
    .color-accent { color: var(--accent); }
    .color-muted { color: var(--text); opacity: 0.6; }
    
    .btn {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 1rem 2rem; font-weight: 900; text-transform: uppercase;
      letter-spacing: 0.1em; font-size: 0.75rem; border-radius: var(--radius);
      cursor: pointer; transition: all var(--transition);
      border: 2px solid var(--border); text-decoration: none;
      background: var(--background); color: var(--text);
      box-shadow: var(--shadow);
    }
    .btn-primary { background: var(--accent); color: var(--background); border-color: var(--accent); }
    .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
    .btn:active { transform: translateY(0); }
    
    .card {
      background: var(--surface); border: 2px solid var(--border);
      border-radius: var(--radius); padding: 2rem;
      transition: all var(--transition);
      box-shadow: var(--shadow);
    }
    .card:hover { transform: translateY(-4px); }
    
    .input {
      width: 100%; padding: 0.75rem 1rem; background: var(--surface);
      border: 2px solid var(--border); border-radius: var(--radius);
      color: inherit; outline: none; transition: all var(--transition);
    }
    .input:focus { border-color: var(--accent); }
    
    .hero-title { font-size: clamp(2.5rem, 8vw, 5rem); margin-bottom: 1.5rem; letter-spacing: -0.03em; }
    .hero-subtitle { font-size: clamp(1.1rem, 2vw, 1.25rem); margin-bottom: 2.5rem; opacity: 0.8; max-width: 700px; margin-left: auto; margin-right: auto; }
    
    .gallery-item { aspect-ratio: 1; overflow: hidden; border-radius: var(--radius); border: 1px solid var(--border); }
    .gallery-item img { transition: transform 0.5s ease; }
    .gallery-item:hover img { transform: scale(1.1); }
    
    .reveal { opacity: 0; transform: translateY(30px); transition: all 0.8s cubic-bezier(0,0,0.2,1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* Theme Specific Overrides */
    [data-theme="neo-brutal"] .btn:active, [data-theme="retro-pixel"] .btn:active { transform: translate(2px, 2px); box-shadow: none; }
    
    [data-theme="dark-neon"] .hero-title { text-shadow: 0 0 20px var(--accent); }
    [data-theme="dark-neon"] .btn { box-shadow: 0 0 10px rgba(0, 255, 65, 0.2); }
    [data-theme="dark-neon"] .btn:hover { box-shadow: 0 0 20px rgba(0, 255, 65, 0.4); }

    [data-theme="pastel-soft"] .btn:hover { transform: scale(1.05); }
    [data-theme="pastel-soft"] .card:hover { transform: translateY(-8px) scale(1.02); }

    [data-theme="luxury-serif"] .hero-title { font-style: italic; font-weight: 400; letter-spacing: -0.05em; }
    [data-theme="luxury-serif"] .btn { letter-spacing: 0.3em; border-color: var(--accent); color: var(--accent); }

    [data-theme="retro-pixel"] { image-rendering: pixelated; }
    [data-theme="retro-pixel"] .hero-title { text-shadow: 4px 4px 0 var(--accent); }
  </style>
</head>
<body>
  ${sectionsHTML}
  <script>
    const interactions = ${JSON.stringify(interactions || {})};
    // Apply basic interactions (example: adding classes or styles)
    if (interactions.animations === 'fade') {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('animate-fade'));
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  </script>
</body>
</html>`
}
