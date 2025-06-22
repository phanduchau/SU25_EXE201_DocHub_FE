import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  ArrowRight, Calendar, Users, Shield, Clock, Star
} from 'lucide-react';
import Button from '../components/Button';

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-teal-600" />,
      title: 'Đặt lịch dễ dàng',
      description: 'Đặt lịch khám với bác sĩ chỉ trong vài phút, mọi lúc mọi nơi',
    },
    {
      icon: <Users className="h-8 w-8 text-teal-600" />,
      title: 'Bác sĩ chuyên nghiệp',
      description: 'Đội ngũ bác sĩ giàu kinh nghiệm, được chứng nhận và tận tâm',
    },
    {
      icon: <Shield className="h-8 w-8 text-teal-600" />,
      title: 'Bảo mật thông tin',
      description: 'Thông tin cá nhân và y tế được bảo mật tuyệt đối',
    },
    {
      icon: <Clock className="h-8 w-8 text-teal-600" />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc',
    },
  ];

  const testimonials = [
    {
      name: 'Nguyễn Thị Mai',
      role: 'Bệnh nhân',
      content:
        'DOCHUB đã giúp tôi tiết kiệm rất nhiều thời gian. Việc đặt lịch khám rất đơn giản và bác sĩ rất chuyên nghiệp.',
      rating: 5,
    },
    {
      name: 'Trần Văn Nam',
      role: 'Bệnh nhân',
      content:
        'Tôi rất hài lòng với dịch vụ tư vấn trực tuyến. Bác sĩ tận tình và chu đáo trong việc giải đáp thắc mắc.',
      rating: 5,
    },
    {
      name: 'Lê Thị Hoa',
      role: 'Bệnh nhân',
      content:
        'Giao diện dễ sử dụng, quy trình đặt lịch nhanh chóng. Đây là nền tảng y tế tốt nhất tôi từng sử dụng.',
      rating: 5,
    },
  ];

  const stats = [
    { number: '10,000+', label: 'Bệnh nhân tin tưởng' },
    { number: '500+', label: 'Bác sĩ chuyên nghiệp' },
    { number: '50,000+', label: 'Lịch hẹn thành công' },
    { number: '4.9/5', label: 'Đánh giá trung bình' },
  ];

  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3376799/pexels-photo-3376799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-20 bg-cover bg-center blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Kết nối bạn với <br />
            <span className="text-teal-200">bác sĩ tốt nhất</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90"
          >
            Nền tảng y tế trực tuyến hàng đầu Việt Nam, mang đến dịch vụ chăm sóc sức khỏe chất lượng cao, tiện lợi và an toàn
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/register" className="border-white text-white hover:bg-teal-700">
              Đăng ký ngay <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button to="/doctors" className="border-white text-white hover:bg-teal-700">
              Tìm bác sĩ
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="border-r last:border-none border-gray-300 px-2">
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tại sao chọn DOCHUB?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trải nghiệm y tế hiện đại, tiện lợi, bảo mật và chuyên nghiệp
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="rounded-lg border p-6 text-center hover:shadow-xl transition-transform hover:-translate-y-1"
              >
                <div className="bg-teal-50 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Cách thức hoạt động</h2>
            <p className="text-xl text-gray-600">Chỉ 3 bước đơn giản để được chăm sóc y tế chất lượng cao</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {['Đăng ký tài khoản', 'Chọn bác sĩ và đặt lịch', 'Nhận tư vấn chuyên nghiệp'].map((title, idx) => (
              <div key={idx}>
                <div className="bg-teal-500 text-white w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">
                  {[
                    'Tạo tài khoản miễn phí và hoàn thiện hồ sơ cá nhân',
                    'Tìm bác sĩ phù hợp và đặt lịch dễ dàng',
                    'Nhận tư vấn và hướng dẫn điều trị chất lượng cao',
                  ][idx]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Khách hàng nói gì</h2>
          <p className="text-xl text-gray-600 mb-12">Niềm tin của bạn là động lực cho chúng tôi</p>
          <Swiper spaceBetween={30} slidesPerView={1} breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
            {testimonials.map((t, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white p-6 rounded-xl shadow text-left">
                  <div className="flex items-center mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-current h-5 w-5" />
                    ))}
                  </div>
                  <p className="italic text-gray-700 mb-4">"{t.content}"</p>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-800 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng chăm sóc sức khỏe của bạn?</h2>
          <p className="text-xl opacity-90 mb-8">Tham gia cùng hàng nghìn người dùng tin tưởng DOCHUB mỗi ngày</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button to="/register" className="border-white text-white hover:bg-teal-700">
              Đăng ký miễn phí
            </Button>
            <Button to="/doctors" className="border-white text-white hover:bg-teal-700">
              Khám phá ngay
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
