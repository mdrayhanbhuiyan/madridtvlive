interface PolicyProps {
  type: 'privacy' | 'dmca' | 'disclaimer';
}

export default function Policy({ type }: PolicyProps) {
  const titles = {
    privacy: 'Privacy Policy',
    dmca: 'DMCA Notice',
    disclaimer: 'Disclaimer'
  };

  return (
    <div className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 py-20 prose prose-invert">
      <h1 className="text-5xl font-black italic uppercase tracking-tighter glow-lime mb-12">{titles[type]}</h1>
      
      {type === 'privacy' && (
        <div className="space-y-8 text-white/60">
          <p>Your privacy is important to us. It is Madrid TV Live's policy to respect your privacy regarding any information we may collect from you across our website.</p>
          <h3 className="text-white font-bold">1. Information we collect</h3>
          <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
          <h3 className="text-white font-bold">2. Use of Information</h3>
          <p>We use collected information only to provide and improve our services, communicate with users, and for technical maintenance.</p>
        </div>
      )}

      {type === 'dmca' && (
        <div className="space-y-8 text-white/60">
          <p>Madrid TV Live acts as a service provider under 17 U.S.C. § 512, commony known as the Digital Millennium Copyright Act (“DMCA”).</p>
          <p>We do not host or store any videos on our servers. We provide a platform that links to content already publicly available on the internet. We respect the intellectual property of others.</p>
          <h3 className="text-white font-bold">How to report?</h3>
          <p>If you believe that your copyrighted work is being used in a way that constitutes copyright infringement, please provide our Copyright Agent with the following information via email at dmca@madridtvlive.com</p>
        </div>
      )}

      {type === 'disclaimer' && (
        <div className="space-y-8 text-white/60">
          <p>The information provided by Madrid TV Live (“we,” “us” or “our”) on this website is for general informational purposes only.</p>
          <p>All information on the site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the site.</p>
          <h3 className="text-white font-bold">External Links</h3>
          <p>The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy by us.</p>
        </div>
      )}
    </div>
  );
}
