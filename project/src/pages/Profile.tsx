import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera } from 'lucide-react';
import Button from '../components/Button';
import { useAuthContext } from '../contexts/AuthContext';
import { getUserById, updateUserById } from '../apis/users/userApi';
import { toast } from 'react-toastify';
import { uploadImageToCloudinary } from '../utils/uploadImageToCloudinary';

const Profile: React.FC = () => {
  const { user } = useAuthContext(); // chỉ dùng để lấy user.sub
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    avatar: '',
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user?.sub) {
        try {
          const data = await getUserById(user.sub);
          if (!data) {
            console.error('❌ Không có dữ liệu user trả về');
            return;
          }
          console.log('✅ Thông tin user:', data);
          setProfileData({
            name: data.fullName || '',
            email: data.email || '',
            phone: data.phoneNumber || '',
            address: data.address || '',
            dateOfBirth: data.dateOfBirth?.split('T')[0] || '',
            avatar:
              data.imageUrl ||
              'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
          });
        } catch (error) {
          console.error('❌ Lỗi khi lấy thông tin người dùng:', error);
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.sub) {
      console.error('❌ Không có userId');
      toast.error('Không thể xác định người dùng.');
      return;
    }

    let imageUrl = profileData.avatar;

    if (selectedImage) {
      try {
        imageUrl = await uploadImageToCloudinary(selectedImage);
      } catch (error) {
        toast.error('Tải ảnh lên thất bại.');
        console.error(error);
        return;
      }
    }

    const updatedUser = {
      fullName: profileData.name,
      address: profileData.address,
      dateOfBirth: new Date(profileData.dateOfBirth).toISOString(),
      imageUrl,
      phoneNumber: profileData.phone,
    };

    console.log('📤 Gửi dữ liệu cập nhật:', updatedUser);

    try {
      await updateUserById(user.sub, updatedUser);
      toast.success('Cập nhật thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('❌ Lỗi cập nhật:', error);
      toast.error('Cập nhật thất bại');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-teal-500 text-white">
            <h1 className="text-2xl font-bold">Thông tin cá nhân</h1>
            <p>Quản lý thông tin cá nhân của bạn</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover"
                />
                {isEditing && (
                  <>
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full hover:bg-teal-600"
                    >
                      <Camera className="h-5 w-5" />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedImage(file);
                          setProfileData((prev) => ({
                            ...prev,
                            avatar: URL.createObjectURL(file),
                          }));
                        }
                      }}
                      className="mt-2 w-64 text-sm px-3 py-2 border rounded-md"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ tên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="block w-full pl-10 pr-3 py-2 border rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Ngày sinh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-2 border rounded-md disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="mt-6 flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" variant="primary">
                    Lưu thay đổi
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </form>

          {/* Bảo mật */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Bảo mật</h2>
            <div className="space-y-4">
              <Button
                variant="outline"
                to="/change-password"
                className="w-full md:w-auto"
              >
                Đổi mật khẩu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
