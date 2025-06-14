import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Calendar, Shield, Heart, Clock, Award } from 'lucide-react';
import Button from '../components/Button';

const Landing: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-teal-500" />,
      title: 'Đặt lịch dễ dàng',
      description: 'Đặt lịch khám với bác sĩ chỉ trong vài phút, mọi lúc mọi nơi'
    },
    {
      icon: <Users className="h-8 w-8 text-teal-500" />,
      title: 'Bác sĩ chuyên nghiệp',
      description: 'Đội ngũ bác sĩ giàu kinh nghiệm, được chứng nhận và tận tâm'
    },
    {
      icon: <Shield className="h-8 w-8 text-teal-500" />,
      title: 'Bảo mật thông tin',
      description: 'Thông tin cá nhân và y tế được bảo mật tuyệt đối'
    },
    {
      icon: <Clock className="h-8 w-8 text-teal-500" />,
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc'
    }
  ];

  const testimonials = [
    {
      name: 'Nguyễn Thị Mai',
      role: 'Bệnh nhân',
      content: 'DOCHUB đã giúp tôi tiết kiệm rất nhiều thời gian. Việc đặt lịch khám rất đơn giản và bác sĩ rất chuyên nghiệp.',
      rating: 5
    },
    {
      name: 'Trần Văn Nam',
      role: 'Bệnh nhân',
      content: 'Tôi rất hài lòng với dịch vụ tư vấn trực tuyến. Bác sĩ tận tình và chu đáo trong việc giải đáp thắc mắc.',
      rating: 5
    },
    {
      name: 'Lê Thị Hoa',
      role: 'Bệnh nhân',
      content: 'Giao diện dễ sử dụng, quy trình đặt lịch nhanh chóng. Đây là nền tảng y tế tốt nhất tôi từng sử dụng.',
      rating: 5
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Bệnh nhân tin tưởng' },
    { number: '500+', label: 'Bác sĩ chuyên nghiệp' },
    { number: '50,000+', label: 'Lịch hẹn thành công' },
    { number: '4.9/5', label: 'Đánh giá trung bình' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3376799/pexels-photo-3376799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-10 bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Kết nối bạn với
              <br />
              <span className="text-teal-200">bác sĩ tốt nhất</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              Nền tảng y tế trực tuyến hàng đầu Việt Nam, mang đến dịch vụ chăm sóc sức khỏe chất lượng cao, tiện lợi và an toàn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                to="/register"
                variant="outline"
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-100 border-white"
              >
                Đăng ký ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                to="/doctors"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-teal-700"
              >
                Tìm bác sĩ
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn DOCHUB?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm chăm sóc sức khỏe tốt nhất với công nghệ hiện đại và đội ngũ y tế chuyên nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600">
              Chỉ với 3 bước đơn giản để có được sự chăm sóc y tế tốt nhất
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Đăng ký tài khoản
              </h3>
              <p className="text-gray-600">
                Tạo tài khoản miễn phí và hoàn thiện thông tin cá nhân của bạn
              </p>
            </div>

            <div className="text-center">
              <div className="bg-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Chọn bác sĩ và đặt lịch
              </h3>
              <p className="text-gray-600">
                Tìm kiếm bác sĩ phù hợp và đặt lịch khám theo thời gian thuận tiện
              </p>
            </div>

            <div className="text-center">
              <div className="bg-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Nhận tư vấn chuyên nghiệp
              </h3>
              <p className="text-gray-600">
                Tham gia buổi tư vấn và nhận được lời khuyên y tế chất lượng cao
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của DOCHUB
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bắt đầu hành trình chăm sóc sức khỏe?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Tham gia cùng hàng nghìn người dùng đã tin tưởng DOCHUB cho nhu cầu chăm sóc sức khỏe của họ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              to="/register"
              variant="outline"
              size="lg"
              className="bg-white text-teal-600 hover:bg-gray-100 border-white"
            >
              Đăng ký miễn phí
            </Button>
            <Button
              to="/doctors"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-teal-700"
            >
              Khám phá ngay
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;