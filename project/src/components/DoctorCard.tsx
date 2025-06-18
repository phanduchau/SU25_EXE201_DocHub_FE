import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Phone, Video, MessageCircle } from 'lucide-react';
import { Doctor } from '../types';
import Button from './Button';

interface DoctorCardProps {
  doctor: Doctor;
  variant?: 'compact' | 'full';
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, variant = 'compact' }) => {
  return (
    <Link to={`/doctors/${doctor.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all group-hover:shadow-xl border border-gray-100 cursor-pointer">
        <div className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-shrink-0">
              <img 
                src={doctor.image ?? 'https://cdn-icons-png.flaticon.com/512/3870/3870822.png'} 
                alt={doctor.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover shadow-md"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>

                {doctor.rating && (
                  <div className="flex items-center mt-1 md:mt-0">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
                  </div>
                )}
              </div>

              {variant === 'full' && doctor.hospital && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Bệnh viện:</span> {doctor.hospital}
                </p>
              )}

              {variant === 'full' && doctor.experience && (
                <p className="mt-1 text-sm text-gray-600">
                  <span className="font-medium">Kinh nghiệm:</span> {doctor.experience} năm
                </p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  Video
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  Chat
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 border-t border-gray-100">
          <div className="flex gap-2 justify-between">
            <Button variant="outline" size="sm" className="flex-1 pointer-events-none">
              <Phone size={16} className="mr-1" /> Gọi điện
            </Button>
            <Button variant="outline" size="sm" className="flex-1 pointer-events-none">
              <Video size={16} className="mr-1" /> Video
            </Button>
            <Button variant="outline" size="sm" className="flex-1 pointer-events-none">
              <MessageCircle size={16} className="mr-1" /> Chat
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DoctorCard;
