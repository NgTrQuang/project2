import React from 'react';

const FooterLinkSection = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
      <div className="mt-4 space-y-4">
        {links.map(({ text, href }, index) => (
          <a key={index} href={href} className="text-base text-gray-500 hover:text-gray-900 block">
            {text}
          </a>
        ))}
      </div>
    </div>
  );
};

export default FooterLinkSection;
