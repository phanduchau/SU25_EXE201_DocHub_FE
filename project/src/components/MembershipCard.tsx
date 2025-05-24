import React from 'react';
import { MembershipPlan } from '../types';
import { CheckCircle } from 'lucide-react';
import Button from './Button';

interface MembershipCardProps {
  plan: MembershipPlan;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ plan }) => {
  return (
    <div className={`rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${plan.recommended ? 'border-2 border-teal-500 transform scale-105' : 'border border-gray-200'}`}>
      {plan.recommended && (
        <div className="bg-teal-500 text-white text-center py-1 font-medium text-sm">
          Gói được đề xuất
        </div>
      )}
      
      <div className="p-6 bg-teal-50">
        <h3 className="text-xl font-bold text-center mb-2">{plan.name}</h3>
        <div className="text-center">
          <span className="text-3xl font-bold text-teal-700">{plan.price.toLocaleString()}k</span>
          <span className="text-teal-600">/tháng</span>
        </div>
      </div>
      
      <div className="p-6 bg-white">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <CheckCircle className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-6">
          <Button 
            variant={plan.recommended ? "primary" : "outline"} 
            fullWidth
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MembershipCard;