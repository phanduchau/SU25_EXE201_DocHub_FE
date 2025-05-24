import React from 'react';
import { ActivitySquare } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <ActivitySquare className="h-8 w-8 text-blue-700" />
      <span className="ml-2 text-2xl font-bold text-blue-700">DOCHUB</span>
    </div>
  );
};

export default Logo;