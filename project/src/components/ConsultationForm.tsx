import React, { useState } from 'react';
import Button from './Button';

const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    specialty: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit form data
    console.log(formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      specialty: '',
    });
    // Show success message
    alert('Yêu cầu tư vấn của bạn đã được gửi thành công!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-teal-500 text-white">
        <h3 className="text-lg font-semibold">Yêu cầu tư vấn ngay</h3>
        <p className="text-sm text-teal-100">Chúng tôi sẽ liên hệ với bạn trong 1-2 giờ</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
              Chuyên khoa
            </label>
            <select
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">- Chọn chuyên khoa -</option>
              <option value="nhi">Khoa Nhi</option>
              <option value="noi">Khoa Nội</option>
              <option value="than-kinh">Khoa Thần kinh</option>
              <option value="da-lieu">Khoa Da liễu</option>
              <option value="tai-mui-hong">Khoa Tai mũi họng</option>
              <option value="mat">Khoa Mắt</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả triệu chứng
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
            ></textarea>
          </div>
          
          <div>
            <Button type="submit" variant="primary" fullWidth size="lg">
              Tìm bác sĩ
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConsultationForm;