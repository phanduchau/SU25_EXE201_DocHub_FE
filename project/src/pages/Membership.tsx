// src/pages/Membership.tsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Loader2,
  Star,
  Crown,
  Shield,
  Heart,
  Users,
  Clock,
  Zap,
  Gift,
  ArrowRight,
  Phone,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { getMembershipPlans } from '../apis/membership/membershipApi';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../components/Button';

// Types based on existing data structure
interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  yearlyPrice?: number;
  features: string[];
  recommended?: boolean;
  popular?: boolean;
  description?: string;
  color?: string;
  icon?: React.ReactNode;
  maxDoctors?: number;
  consultationsPerMonth?: number;
  discount?: number;
}

const Membership: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced membership plans with Vietnamese content
  const fallbackPlans: MembershipPlan[] = [
    {
      id: '1',
      name: 'Gói Cơ Bản',
      description: 'Phù hợp cho nhu cầu chăm sóc sức khỏe cơ bản',
      price: 50000,
      yearlyPrice: 500000,
      color: 'blue',
      icon: <Shield className="w-6 h-6" />,
      maxDoctors: 1,
      consultationsPerMonth: 1,
      discount: 0,
      features: [
        'Tư vấn từ 1 bác sĩ mỗi tháng',
        'Truy cập thông tin y tế cơ bản',
        'Nhắc nhở lịch khám định kỳ',
        'Lưu trữ hồ sơ y tế cá nhân',
        'Hỗ trợ qua email trong giờ hành chính'
      ]
    },
    {
      id: '2',
      name: 'Gói Tiêu Chuẩn',
      description: 'Lựa chọn được yêu thích nhất cho gia đình',
      price: 100000,
      yearlyPrice: 1000000,
      color: 'green',
      icon: <Heart className="w-6 h-6" />,
      maxDoctors: 3,
      consultationsPerMonth: -1,
      discount: 5,
      recommended: true,
      popular: true,
      features: [
        'Tất cả tính năng của gói Cơ bản',
        'Tư vấn không giới hạn với 3 bác sĩ',
        'Ưu tiên đặt lịch khám',
        'Nhắc nhở dùng thuốc thông minh',
        'Tư vấn qua video call HD',
        'Giảm 5% phí khám bệnh',
        'Hỗ trợ 24/7 qua chat'
      ]
    },
    {
      id: '3',
      name: 'Gói Cao Cấp',
      description: 'Trải nghiệm chăm sóc sức khỏe VIP toàn diện',
      price: 250000,
      yearlyPrice: 2500000,
      color: 'purple',
      icon: <Crown className="w-6 h-6" />,
      maxDoctors: -1,
      consultationsPerMonth: -1,
      discount: 15,
      features: [
        'Tất cả tính năng của gói Tiêu chuẩn',
        'Tư vấn không giới hạn với TẤT CẢ bác sĩ',
        'Ưu tiên cao nhất đặt lịch khám',
        'Nhắc nhở và theo dõi sức khỏe tự động',
        'Hỗ trợ tư vấn 24/7 qua mọi kênh',
        'Giảm 15% phí khám và xét nghiệm',
        'Báo cáo sức khỏe toàn diện hàng tháng',
        'Tư vấn dinh dưỡng và lifestyle chuyên sâu',
        'Chăm sóc khách hàng VIP riêng biệt'
      ]
    }
  ];

  // Load membership plans on component mount
  useEffect(() => {
    loadMembershipPlans();
  }, []);

  const loadMembershipPlans = async () => {
    try {
      setLoadingPlans(true);
      setError(null);
      
      // Try to load from API first
      try {
        const apiPlans = await getMembershipPlans();
        if (apiPlans && apiPlans.length > 0) {
          const mappedPlans = apiPlans.map(plan => ({
            id: plan.planId,
            name: plan.name,
            description: plan.description,
            price: plan.monthlyPrice,
            yearlyPrice: plan.yearlyPrice,
            features: plan.features || [],
            recommended: plan.name.toLowerCase().includes('tiêu chuẩn') || plan.name.toLowerCase().includes('standard'),
            popular: plan.name.toLowerCase().includes('tiêu chuẩn') || plan.name.toLowerCase().includes('standard')
          }));
          setPlans(mappedPlans);
          if (mappedPlans.length > 0) {
            setSelectedPlan(mappedPlans.find(p => p.recommended)?.id || mappedPlans[0].id);
          }
          return;
        }
      } catch (apiError) {
        console.warn('Failed to load plans from API, using fallback data');
      }

      // Fallback to static data
      setPlans(fallbackPlans);
      setSelectedPlan(fallbackPlans.find(p => p.recommended)?.id || fallbackPlans[0].id);
    } catch (error) {
      console.error('Error loading membership plans:', error);
      setError('Không thể tải danh sách gói membership');
      toast.error('Có lỗi xảy ra khi tải danh sách gói membership');
    } finally {
      setLoadingPlans(false);
    }
  };

  const calculateYearlyDiscount = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyTotal = monthlyPrice * 12;
    const discount = ((monthlyTotal - yearlyPrice) / monthlyTotal) * 100;
    return Math.round(discount);
  };

  const getCurrentPrice = (plan: MembershipPlan) => {
    if (billingCycle === 'Yearly' && plan.yearlyPrice) {
      return plan.yearlyPrice;
    }
    return plan.price;
  };

  const getMonthlyEquivalent = (plan: MembershipPlan) => {
    if (billingCycle === 'Yearly' && plan.yearlyPrice) {
      return plan.yearlyPrice / 12;
    }
    return plan.price;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getColorClasses = (color: string = 'blue', isSelected: boolean) => {
    const colors = {
      blue: {
        bg: isSelected ? 'bg-blue-50' : 'bg-white',
        border: isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200',
        text: 'text-blue-600',
        button: isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
      },
      green: {
        bg: isSelected ? 'bg-green-50' : 'bg-white',
        border: isSelected ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200',
        text: 'text-green-600',
        button: isSelected ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'
      },
      purple: {
        bg: isSelected ? 'bg-purple-50' : 'bg-white',
        border: isSelected ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200',
        text: 'text-purple-600',
        button: isSelected ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

 const handleCreatePayment = async () => {
  if (!selectedPlan) {
    toast.error('Vui lòng chọn gói membership');
    return;
  }

  // Check if user is logged in
  if (!user) {
    toast.error('Vui lòng đăng nhập để tiếp tục');
    navigate('/login');
    return;
  }

  const plan = plans.find(p => p.id === selectedPlan);
  if (!plan) return;

  const price = getCurrentPrice(plan);
  
  // Navigate to Payment page với state data
  navigate('/payment', { 
    state: { 
      plan: {
        id: plan.id,
        name: plan.name,
        description: plan.description
      },
      billingCycle,
      price
    } 
  });
};

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Có lỗi xảy ra</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => loadMembershipPlans()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4" />
            Nâng cấp chăm sóc sức khỏe
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chọn gói thành viên <span className="text-teal-600">phù hợp</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trải nghiệm dịch vụ chăm sóc sức khỏe chuyên nghiệp với công nghệ hiện đại, 
            đội ngũ bác sĩ giàu kinh nghiệm và hỗ trợ 24/7
          </p>
        </div>

        {/* Loading State */}
        {loadingPlans ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-teal-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Đang tải các gói thành viên...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-12">
              <div className="bg-white p-1 rounded-xl shadow-md border border-gray-200">
                <button
                  onClick={() => setBillingCycle('Monthly')}
                  className={`px-8 py-3 rounded-lg transition-all font-medium ${
                    billingCycle === 'Monthly'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Thanh toán hàng tháng
                </button>
                <button
                  onClick={() => setBillingCycle('Yearly')}
                  className={`px-8 py-3 rounded-lg transition-all font-medium relative ${
                    billingCycle === 'Yearly'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Thanh toán hàng năm
                  <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Tiết kiệm 17%
                  </span>
                </button>
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                const currentPrice = getCurrentPrice(plan);
                const monthlyEquivalent = getMonthlyEquivalent(plan);
                const discount = plan.yearlyPrice ? calculateYearlyDiscount(plan.price, plan.yearlyPrice) : 0;
                const colorClasses = getColorClasses(plan.color, isSelected);

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                      colorClasses.bg
                    } ${colorClasses.border} ${
                      isSelected ? 'scale-105 shadow-xl' : 'hover:shadow-xl'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                          <Star className="w-4 h-4 fill-current" />
                          PHỔ BIẾN NHẤT
                        </div>
                      </div>
                    )}

                    {/* Recommended Badge */}
                    {plan.recommended && !plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-teal-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                          KHUYẾN NGHỊ
                        </div>
                      </div>
                    )}

                    <div className="p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-6">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${colorClasses.text} bg-white shadow-md mb-4`}>
                          {plan.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                        <p className="text-gray-600 text-sm">{plan.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center mb-2">
                          <span className="text-3xl font-bold text-gray-900">
                            {formatPrice(Math.round(monthlyEquivalent))}
                          </span>
                          <span className="text-gray-600 ml-2">/tháng</span>
                        </div>
                        
                        {billingCycle === 'Yearly' && plan.yearlyPrice && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">
                              Thanh toán {formatPrice(currentPrice)}/năm
                            </p>
                            <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              <Gift className="w-4 h-4" />
                              Tiết kiệm {discount}%
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colorClasses.text}`} />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Quick Stats */}
                      {(plan.maxDoctors || plan.consultationsPerMonth) && (
                        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {plan.maxDoctors === -1 ? '∞' : plan.maxDoctors}
                            </div>
                            <div className="text-xs text-gray-600">Bác sĩ</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xl font-bold text-gray-900">
                              {plan.consultationsPerMonth === -1 ? '∞' : plan.consultationsPerMonth}
                            </div>
                            <div className="text-xs text-gray-600">Tư vấn/tháng</div>
                          </div>
                        </div>
                      )}

                      {/* Select Button */}
                      <button
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${colorClasses.button}`}
                      >
                        {isSelected ? 'Đã chọn gói này' : 'Chọn gói này'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Purchase Button */}
            <div className="text-center mb-12">
              <Button
                onClick={handleCreatePayment}
                disabled={!selectedPlan}
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
              >
                <span>Tiếp tục thanh toán</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <p className="text-gray-600 mt-4 text-sm">
                Bạn có thể hủy hoặc thay đổi gói bất cứ lúc nào
              </p>
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Tại sao chọn Dochub?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Chúng tôi cam kết mang đến dịch vụ chăm sóc sức khỏe chất lượng cao với công nghệ hiện đại
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-teal-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Đội ngũ chuyên gia</h3>
                  <p className="text-gray-600">
                    Bác sĩ có kinh nghiệm và được đào tạo chuyên sâu
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Công nghệ tiên tiến</h3>
                  <p className="text-gray-600">
                    Ứng dụng AI và công nghệ 4.0 trong chăm sóc sức khỏe
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
                  <p className="text-gray-600">
                    Luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Câu hỏi thường gặp
                </h2>
                <p className="text-gray-600">
                  Giải đáp những thắc mắc phổ biến về các gói thành viên
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="border-l-4 border-teal-500 pl-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Tôi có thể thay đổi gói thành viên không?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Có, bạn có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào. 
                      Nâng cấp có hiệu lực ngay lập tức, hạ cấp sẽ có hiệu lực từ kỳ thanh toán tiếp theo.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Tôi có thể hủy gói thành viên không?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Có, bạn có thể hủy gói thành viên bất cứ lúc nào. 
                      Việc hủy sẽ có hiệu lực vào cuối chu kỳ thanh toán hiện tại.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Gói nào phù hợp với tôi?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Gói Cơ bản phù hợp nhu cầu cơ bản, Gói Tiêu chuẩn cho gia đình, 
                      Gói Cao cấp cho nhu cầu chăm sóc sức khỏe toàn diện.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-6">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Thanh toán có an toàn không?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Tuyệt đối an toàn! Chúng tôi sử dụng công nghệ mã hóa SSL 
                      và tích hợp với các cổng thanh toán uy tín như VNPay, Momo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Membership;