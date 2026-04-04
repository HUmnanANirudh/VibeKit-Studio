export function ThemeShowcase() {
  const exampleThemes = [
    { name: 'Minimal', theme: 'minimal', desc: 'Clean & whitespace-heavy' },
    { name: 'Neo-brutal', theme: 'neo-brutal', desc: 'High-contrast & bold' },
    { name: 'Dark Neon', theme: 'dark-neon', desc: 'Cyberpunk aesthetic' },
    { name: 'Pastel Soft', theme: 'pastel-soft', desc: 'Dreamy & gentle' },
    { name: 'Luxury Serif', theme: 'luxury-serif', desc: 'Elegant & premium' },
    { name: 'Retro Pixel', theme: 'retro-pixel', desc: 'Old-school arcade' }
  ]

  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black mb-4">6 themes, <br /><span className="text-accent underline decoration-accent/30 decoration-8 underline-offset-8 italic">endless possibilities.</span></h2>
            <p className="text-xl text-muted-foreground">Every theme dynamically updates your entire site.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-full border flex items-center justify-center cursor-pointer hover:bg-muted">←</div>
            <div className="w-12 h-12 rounded-full border flex items-center justify-center cursor-pointer hover:bg-muted">→</div>
          </div>
        </div>
        
        <div className="flex gap-8 pb-8 overflow-x-auto snap-x no-scrollbar">
          {exampleThemes.map((t, i) => (
            <div key={i} className="flex-shrink-0 w-80 snap-center group">
               <div data-theme={t.theme} className="aspect-[4/5] rounded-[2.5rem] border-4 border-surface shadow-lg overflow-hidden transition-all group-hover:-translate-y-2 group-hover:shadow-2xl">
                 <div className="h-full w-full bg-[var(--background)] p-8 flex flex-col justify-between">
                    <div>
                      <div className="w-1/2 h-8 bg-[var(--accent)] rounded-lg mb-4 opacity-50"></div>
                      <div className="w-full h-3 bg-[var(--text)] rounded-full mb-2 opacity-10"></div>
                      <div className="w-3/4 h-3 bg-[var(--text)] rounded-full mb-8 opacity-10"></div>
                      <div className="flex gap-2">
                        <div className="w-full aspect-square rounded-2xl bg-[var(--surface)] border-[var(--border)] border opacity-50"></div>
                        <div className="w-full aspect-square rounded-2xl bg-[var(--surface)] border-[var(--border)] border opacity-50"></div>
                      </div>
                    </div>
                    <div>
                        <div className="text-[var(--text)] font-black text-2xl uppercase tracking-widest opacity-20">Sample Site</div>
                    </div>
                 </div>
               </div>
               <div className="mt-6 text-center">
                 <h4 className="text-xl font-bold">{t.name}</h4>
                 <p className="text-sm text-muted-foreground">{t.desc}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
