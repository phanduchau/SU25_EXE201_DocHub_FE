import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-teal-500 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">KẾT NỐI VỚI CHÚNG TÔI</h3>
          <p className="mb-4">Nền tảng kết nối y tế trực tuyến hàng đầu Việt Nam, kết nối bệnh nhân với bác sĩ</p>
          <div className="flex space-x-4">
            <Link to="https://www.facebook.com/profile.php?id=61576076924706" className="hover:text-teal-200 transition-colors">
              <Facebook size={20} />
            </Link>
            <Link to="#" className="hover:text-teal-200 transition-colors">
              <Twitter size={20} />
            </Link>
            <Link to="#" className="hover:text-teal-200 transition-colors">
              <Instagram size={20} />
            </Link>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">DOCHUB</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-teal-200 transition-colors">Về chúng tôi</Link></li>
            <li><Link to="/terms" className="hover:text-teal-200 transition-colors">Tin tức</Link></li>
            <li><Link to="/privacy" className="hover:text-teal-200 transition-colors">Liên hệ</Link></li>
            <li><Link to="/faq" className="hover:text-teal-200 transition-colors">Hỏi đáp</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">LIÊN HỆ VỚI CHÚNG TÔI</h3>
          <ul className="space-y-2">
            <li>Địa chỉ: Lô E2a-7, Đường D1 Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP. Hồ Chí Minh.</li>
            <li>Hotline: 1900 1234 (8h30 - 18h)</li>
            <li>Thời gian làm việc: 08:00 - 22:00 (T2 - CN)</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">CHÍNH SÁCH VÀ HỖ TRỢ</h3>
          <ul className="space-y-2">
            <li><Link to="/terms" className="hover:text-teal-200 transition-colors">Điều khoản sử dụng</Link></li>
            <li><Link to="/privacy" className="hover:text-teal-200 transition-colors">Chính sách bảo mật</Link></li>
            <li><Link to="/faq" className="hover:text-teal-200 transition-colors">Câu hỏi thường gặp</Link></li>
            <li><Link to="/support" className="hover:text-teal-200 transition-colors">Hướng dẫn sử dụng & đăng ký khám</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="text-center py-4 text-sm border-t border-teal-400">
        <p>© {new Date().getFullYear()} DOCHUB. Tất cả các quyền được bảo lưu. Thiết kế và phát triển bởi DocHub Team.</p>
      </div>
    </footer>
  );
};

export default Footer;