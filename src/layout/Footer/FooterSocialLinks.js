import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

const socialLinks = [
  { href: '#', iconClass: 'fa-brands fa-facebook-square' },
  { href: '#', iconClass: 'fa-brands fa-instagram-square' },
  { href: '#', iconClass: 'fa-brands fa-twitter-square' },
  { href: '#', iconClass: 'fa-brands fa-github-square' },
];

const FooterSocialLinks = () => {
  return (
    <div className="flex space-x-5">
      {socialLinks.map(({ href, iconClass }, index) => (
        <a key={index} href={href} className="text-gray-400 hover:text-gray-500">
          <i className={iconClass}></i>
        </a>
      ))}
    </div>
  );
};

export default FooterSocialLinks;
