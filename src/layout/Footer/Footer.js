import React from 'react';
import FooterLogo from './FooterLogo';
import FooterSocialLinks from './FooterSocialLinks';
import FooterLinkSection from './FooterLinkSection';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 pb-12 border-t border-gray-100">
      <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Social Media */}
        <div className="space-y-4">
          <FooterLogo />
          <p className="text-gray-500">
            Chúng tôi ở đây vì các bạn, cửa hàng mong muốn mang đến trải nghiệm tốt nhất cho khách hàng.
          </p>
          <FooterSocialLinks />
        </div>

        {/* Solutions and Support Sections */}
        <div className="grid grid-cols-2 gap-4 md:gap-8">
          <FooterLinkSection
            title="Giải pháp"
            links={[
              { text: 'Quảng cáo', href: '#' },
              { text: 'Thống kê', href: '#' },
              { text: 'Thương mại điện tử', href: '#' },
              { text: 'Thông tin chi tiết', href: '#' },
            ]}
          />
          <FooterLinkSection
            title="Hỗ trợ"
            links={[
              { text: 'Giá cả', href: '#' },
              { text: 'Hướng dẫn', href: '#' },
              { text: 'Về chúng tôi', href: '#' },
            ]}
          />
        </div>
        {/* <div className="grid grid-cols-2 gap-4 md:gap-8">
          <FooterLinkSection
            title="Solutions"
            links={[
              { text: 'Marketing', href: '#' },
              { text: 'Analitycs', href: '#' },
              { text: 'Commerce', href: '#' },
              { text: 'Insights', href: '#' },
            ]}
          />
          <FooterLinkSection
            title="Support"
            links={[
              { text: 'Pricing', href: '#' },
              { text: 'Guides', href: '#' },
              { text: 'API Status', href: '#' },
            ]}
          />
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
