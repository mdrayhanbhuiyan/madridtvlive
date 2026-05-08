export default function About() {
  return (
    <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-20 prose prose-invert">
      <h1 className="text-5xl font-black italic uppercase tracking-tighter glow-lime mb-12">About Madrid TV Live</h1>
      <p className="text-lg text-white/70 leading-relaxed overflow-hidden">
        Madrid TV Live is a premier sports streaming platform dedicated to bringing you high-quality, real-time sports content from across the globe. Whether you're a fan of the English Premier League, the NBA, Grand Slam Tennis, or IPL Cricket, we provide the best streaming experience for every sports enthusiast.
      </p>
      
      <h2 className="text-neon-lime font-black uppercase tracking-tight mt-12">Our Mission</h2>
      <p className="text-white/60">
        Our mission is to democratize access to live sports. We believe that every sports event should be accessible to everyone, anywhere, anytime. We leverage the latest in streaming technology—including HLS.js and low-latency delivery networks—to ensure you never miss a goal, a wicket, or a slam dunk.
      </p>

      <h2 className="text-neon-lime font-black uppercase tracking-tight mt-12">Technology</h2>
      <p className="text-white/60">
        Our platform is built using modern full-stack development practices, utilizing React for high-performance UI components and Firebase for real-time data synchronization. We support a variety of streaming formats, ensuring compatibility across all devices from mobile phones to desktops.
      </p>

      <div className="bg-zinc-900 p-8 rounded-3xl border border-white/5 mt-16">
        <h4 className="text-white font-black uppercase tracking-tight mb-2">Legal Disclaimer</h4>
        <p className="text-white/40 text-sm italic">
          Madrid TV Live is a search engine for live sports streams. We do not host any content on our servers. All streams are crawled from public platforms. For copyright concerns, please visit our DMCA page.
        </p>
      </div>
    </div>
  );
}
