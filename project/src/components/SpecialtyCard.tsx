import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Baby, Brain, Ear, Microscope, Eye, Scissors, Heart, Pill, Bone, Bluetooth as Tooth } from 'lucide-react';

interface SpecialtyCardProps {
  title: string;
  icon: string;
  description: string;
  to: string;
}

const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ title, icon, description, to }) => {
  const getIcon = () => {
    switch (icon) {
      case 'stethoscope':
        return <Stethoscope className="h-8 w-8 text-teal-500" />;
      case 'baby':
        return <Baby className="h-8 w-8 text-teal-500" />;
      case 'brain':
        return <Brain className="h-8 w-8 text-teal-500" />;
      case 'ear':
        return <Ear className="h-8 w-8 text-teal-500" />;
      case 'microscope':
        return <Microscope className="h-8 w-8 text-teal-500" />;
      case 'eye':
        return <Eye className="h-8 w-8 text-teal-500" />;
      case 'scissors':
        return <Scissors className="h-8 w-8 text-teal-500" />;
      case 'heart':
        return <Heart className="h-8 w-8 text-teal-500" />;
      case 'pill':
        return <Pill className="h-8 w-8 text-teal-500" />;
      case 'bone':
        return <Bone className="h-8 w-8 text-teal-500" />;
      case 'teeth':
        return <Tooth className="h-8 w-8 text-teal-500" />;
      default:
        return <Stethoscope className="h-8 w-8 text-teal-500" />;
    }
  };

  return (
    <Link 
      to={to} 
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100"
    >
      <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto">
        {getIcon()}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">{title}</h3>
      <p className="text-sm text-gray-600 text-center">{description}</p>
    </Link>
  );
};

export default SpecialtyCard;