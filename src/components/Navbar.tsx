import React from 'react';
import { Map as MapIcon, Database, FileText, ChevronLeft, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  activeView: 'map' | 'registry' | 'declaration';
  onViewChange: (view: 'map' | 'registry' | 'declaration') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm px-8 h-16" dir="rtl">
      <div className="flex items-center gap-4">
        <div className="bg-gov-blue p-2 rounded-xl">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div className="text-right">
          <div className="font-black text-gov-blue text-sm">المنصة الجغرافية</div>
          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Plateforme Géo-Foncière</div>
        </div>
      </div>

      <div className="flex items-center bg-gray-50 p-1 rounded-2xl gap-1">
        <button 
          onClick={() => onViewChange('map')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all",
            activeView === 'map' ? "bg-gov-blue text-white shadow-lg" : "text-gray-400 hover:text-gov-blue"
          )}
        >
          <MapIcon className="w-4 h-4" />
          خلفية الخريطة
        </button>

        <button 
          onClick={() => onViewChange('registry')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all",
            activeView === 'registry' ? "bg-gov-blue text-white shadow-lg" : "text-gray-400 hover:text-gov-blue"
          )}
        >
          <Database className="w-4 h-4" />
          سجل البيانات
        </button>

        <button 
          onClick={() => onViewChange('declaration')}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all",
            activeView === 'declaration' ? "bg-gov-green text-white shadow-lg" : "text-gray-400 hover:text-gov-green"
          )}
        >
          <FileText className="w-4 h-4" />
          تعبئة الإقرار
        </button>
      </div>

      <div className="w-40" /> {/* Spacer for balance */}
    </div>
  );
};
