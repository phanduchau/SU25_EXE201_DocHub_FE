import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import Button from '../components/Button';
import { Doctor } from '../types';
import { getAllDoctors } from '../apis/doctors/doctorApi';

const DoctorsList: React.FC = () => {
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const apiData = await getAllDoctors();
        const mapped: Doctor[] = apiData.map((doc: any) => ({
          id: doc.doctorId,
          name: doc.userName,
          email: doc.userEmail,
          phone: doc.userPhone,
          specialty: doc.specialization || '',
          hospital: doc.hospitalName || '',
          experience: doc.yearsOfExperience || 0,
          image: doc.imageDoctor || 'https://via.placeholder.com/150',
          rating: doc.rating || 4.5 // fallback nếu không có rating
        }));
        setAllDoctors(mapped);
        setFilteredDoctors(mapped);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    let results = allDoctors;

    if (searchTerm) {
      results = results.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      results = results.filter(doctor =>
        doctor.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    setFilteredDoctors(results);
  }, [searchTerm, selectedSpecialty, allDoctors]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty === selectedSpecialty ? '' : specialty);
  };

  const specialtyList = Array.from(new Set(allDoctors.map(doc => doc.specialty))).filter(s => s);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Tìm kiếm bác sĩ</h1>
            <p className="text-gray-600">Tìm bác sĩ phù hợp với nhu cầu của bạn</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-teal-50 rounded-lg p-6 shadow-sm mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo tên, chuyên khoa"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Chuyên khoa</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">Tất cả chuyên khoa</option>
                {specialtyList.map((specialty, idx) => (
                  <option key={idx} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="self-end">
              <Button type="submit" variant="primary">
                Tìm kiếm
              </Button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Kết quả tìm kiếm ({filteredDoctors.length})</h2>
          <div className="grid grid-cols-1 gap-6">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} variant="full" />
            ))}
          </div>
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy bác sĩ nào</h3>
            <p className="text-gray-600 mb-4">Vui lòng thử với các tiêu chí tìm kiếm khác</p>
            <Button onClick={() => { setSearchTerm(''); setSelectedSpecialty(''); }}>
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
