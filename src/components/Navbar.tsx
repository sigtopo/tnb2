import React from 'react';
import { Map as MapIcon, Database, FileText, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  activeView: 'map' | 'registry' | 'declaration';
  onViewChange: (view: 'map' | 'registry' | 'declaration') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl p-1.5 gap-1">
      <button 
        onClick={() => onViewChange('map')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
          activeView === 'map' ? "bg-gov-blue text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
        )}
      >
        <MapIcon className="w-4 h-4" />
        خريطة العقارات
      </button>

      <button 
        onClick={() => onViewChange('registry')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
          activeView === 'registry' ? "bg-gov-blue text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
        )}
      >
        <Database className="w-4 h-4" />
        سجل البيانات
      </button>

      <div className="w-[1px] h-6 bg-gray-200 mx-2" />

      <button 
        onClick={() => onViewChange('declaration')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative overflow-hidden group",
          activeView === 'declaration' ? "bg-gov-green text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"
        )}
      >
        <FileText className="w-4 h-4" />
        تعبئة الإقرار
      </button>
    </div>
  );
};
