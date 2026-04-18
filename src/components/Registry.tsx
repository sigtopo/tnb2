import React from 'react';
import { motion } from 'motion/react';
import { Search, Map as MapIcon, Phone, AlertTriangle, ExternalLink } from 'lucide-react';
import { LandDeclaration } from '../types';

interface RegistryProps {
  data: LandDeclaration[];
  onViewOnMap: (decl: LandDeclaration) => void;
  onRefresh: () => void;
}

export const Registry: React.FC<RegistryProps> = ({ data, onViewOnMap, onRefresh }) => {
  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gov-blue font-display">سجل الإقرارات العقارية</h1>
            <p className="text-gray-500 mt-1">إجمالي الإقرارات المسجلة: {data.length}</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="بحث في السجل..."
                className="bg-white border border-gray-200 rounded-full pr-10 pl-4 py-2 text-sm w-64 outline-none focus:ring-2 focus:ring-gov-blue"
              />
            </div>
            <button 
              onClick={onRefresh}
              className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              تحديث المعطيات
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">المالك / الرقم العقاري</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">المساحة</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-center">الرسم (DH)</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">التواصل</th>
                <th className="px-6 py-4 font-semibold uppercase tracking-wider">الموقع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item, i) => (
                <motion.tr 
                  key={item.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="font-bold text-gov-blue">{item.nom_titre}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">رسم: {item.num_titre} | {item.qualite}</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="text-gov-green font-medium">{(item.surf_m2 || 0).toLocaleString()} م²</div>
                    <div className="text-[10px] text-gray-400">{(item.surf_ha || 0).toFixed(4)} هـ</div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="font-black text-gov-red">{(item.taxe_dh || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-[10px] w-fit">
                        <Phone className="w-3 h-3" />
                        {item.tel}
                      </div>
                      {item.email && (
                        <div className="text-[10px] text-gray-400 px-3">{item.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => onViewOnMap(item)}
                      className="bg-gray-100 text-gray-500 p-2 rounded-xl group-hover:bg-gov-blue group-hover:text-white transition-all shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    لا توجد معطيات مسجلة حالياً
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
