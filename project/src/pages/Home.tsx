import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, UserCircle } from 'lucide-react';
import Button from '../components/Button';
import DoctorCard from '../components/DoctorCard';
import SpecialtyCard from '../components/SpecialtyCard';
import ConsultationForm from '../components/ConsultationForm';
import { doctors } from '../data/doctors';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const featuredDoctors = doctors.slice(0, 4);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3376799/pexels-photo-3376799.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row relative">
          <div className="md:w-7/12 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              DOCHUB, Trung tâm<br /> kết nối bác sĩ và bệnh<br /> nhân nhanh nhất
            </h1>
            <p className="text-lg mb-8 opacity-90 max-w-lg">
              Tiện lợi và nhanh chóng với tính năng đặt lịch trực tuyến, tư vấn sức khỏe, kết nối giữa bệnh nhân và bác sĩ y tế nhanh an toàn cho người dùng.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                size="lg"
                to="/doctors"
                className="border-white text-white hover:bg-teal-700"
              >
                Tìm bác sĩ
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-teal-700"
                onClick={() => {
                  if (user) {
                    navigate('/appointments');
                  } else {
                    navigate('/login');
                  }
                }}
              >
                Đặt lịch khám
              </Button>
            </div>
          </div>

          <div className="md:w-5/12">
            <ConsultationForm />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-md mb-4">
                <UserCircle className="h-8 w-8 text-teal-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Bác sĩ chuyên khoa</h3>
              <p className="text-sm text-gray-600">
                Kết nối với bác sĩ chuyên nghiệp của chúng tôi
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-md mb-4">
                <Search className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Chăm sóc sức khỏe</h3>
              <p className="text-sm text-gray-600">
                Giải pháp y tế hiện đại, đáp ứng nhu cầu chăm sóc sức khỏe chất lượng cao
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-white w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-md mb-4">
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Đặt lịch dễ dàng</h3>
              <p className="text-sm text-gray-600">
                Nhanh chóng, dễ dàng và thuận tiện
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-5 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Đội ngũ bác sĩ tư vấn</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm và chuyên nghiệp của chúng tôi luôn sẵn sàng tư vấn và chăm sóc sức khỏe cho bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {featuredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button to="/doctors" variant="outline" size="lg">
              Xem tất cả bác sĩ
            </Button>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-teal-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Chuyên khoa</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Danh sách các chuyên khoa y tế tại DOCHUB
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <SpecialtyCard
              title="Nội tổng quát"
              icon="stethoscope"
              description="Khám và điều trị các bệnh lý nội khoa thông thường"
              to="/specialties/internal"
            />
            <SpecialtyCard
              title="Nhi khoa"
              icon="baby"
              description="Chăm sóc sức khỏe trẻ em từ sơ sinh đến 18 tuổi"
              to="/specialties/pediatrics"
            />
            <SpecialtyCard
              title="Thần kinh"
              icon="brain"
              description="Chẩn đoán và điều trị các bệnh lý thần kinh"
              to="/specialties/neurology"
            />
            <SpecialtyCard
              title="Tai mũi họng"
              icon="ear"
              description="Chẩn đoán và điều trị các bệnh lý tai, mũi, họng"
              to="/specialties/ent"
            />
            <SpecialtyCard
              title="Da liễu"
              icon="microscope"
              description="Khám và điều trị các bệnh về da"
              to="/specialties/dermatology"
            />
            <SpecialtyCard
              title="Tim mạch"
              icon="heart"
              description="Chẩn đoán và điều trị các bệnh lý tim mạch"
              to="/specialties/cardiology"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-teal-600 to-teal-800 text-white relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Bắt đầu đặt lịch khám ngay hôm nay</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Tiết kiệm thời gian và nhận được sự chăm sóc y tế tốt nhất với quy trình đặt lịch khám trực tuyến đơn giản
          </p>
          <Button
            variant="outline"
            size="lg"
            to="/doctors"
            className="bg-white text-teal-600 hover:bg-gray-100"
          >
            Đặt lịch bác sĩ tư vấn
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;