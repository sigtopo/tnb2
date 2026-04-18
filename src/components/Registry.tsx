import React from 'react';
import { motion } from 'motion/react';
import { Search, Map as MapIcon, Phone, ExternalLink, Trash2, Edit3, MapPin, AlertTriangle } from 'lucide-react';
import { LandDeclaration } from '../types';

interface RegistryProps {
  data: LandDeclaration[];
  onViewOnMap: (decl: LandDeclaration) => void;
  onEditData: (decl: LandDeclaration) => void;
  onEditPolygon: (decl: LandDeclaration) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export const Registry: React.FC<RegistryProps> = ({ 
  data, 
  onViewOnMap, 
  onEditData, 
  onEditPolygon, 
  onDelete, 
  onRefresh 
}) => {
  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gov-blue font-display tracking-tight">سجل الإقرارات العقارية</h1>
            <p className="text-gray-500 mt-1 font-medium">إجمالي الإقرارات الموثقة: {data.length}</p>
          </div>
          
          <div className="flex gap-4">
            <div className="relative group">
              <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gov-blue transition-colors" />
              <input 
                type="text" 
                placeholder="بحث برقم الرسم أو اسم المالك..."
                className="bg-white border border-gray-200 rounded-2xl pr-10 pl-4 py-3 text-sm w-80 outline-none focus:ring-4 focus:ring-gov-blue/5 focus:border-gov-blue transition-all"
              />
            </div>
            <button 
              onClick={onRefresh}
              className="bg-white border border-gray-200 rounded-2xl px-6 py-2 text-sm font-black text-gov-blue hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
            >
              تحديث المعطيات
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-gov-blue/5 border border-gray-100 overflow-hidden">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-5">البيانات التعريفية</th>
                <th className="px-8 py-5 text-center">المساحة المحققة</th>
                <th className="px-8 py-5 text-center">الرسم المستحق (DH)</th>
                <th className="px-8 py-5">معلومات التواصل</th>
                <th className="px-8 py-5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((item, i) => (
                <motion.tr 
                  key={item.id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50/80 transition-all group"
                >
                  <td className="px-8 py-6">
                    <div className="font-black text-gov-blue text-sm">{item.nom_titre}</div>
                    <div className="text-[10px] text-gray-400 mt-1 font-bold">
                      <span className="bg-gray-100 px-2 py-0.5 rounded-md mr-1">رقم: {item.num_titre}</span>
                      <span className="opacity-50 mx-1">|</span>
                      <span>{item.qualite}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="text-gov-green font-black text-sm">{(item.surf_m2 || 0).toLocaleString()} م²</div>
                    <div className="text-[9px] text-gray-400 font-mono mt-1">{(item.surf_ha || 0).toFixed(4)} Ha</div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="font-black text-gov-red text-lg tracking-tight">{(item.taxe_dh || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 bg-gov-blue/5 text-gov-blue rounded-lg px-3 py-1 text-[10px] font-black w-fit">
                        <Phone className="w-3.5 h-3.5" />
                        {item.tel}
                      </div>
                      {item.email && (
                        <div className="text-[10px] text-gray-400 font-medium px-1 flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-gray-300" />
                          {item.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => onViewOnMap(item)}
                        title="عرض الموقع"
                        className="bg-white border border-gray-100 text-gray-400 p-2.5 rounded-xl hover:bg-gov-blue hover:text-white hover:border-gov-blue transition-all shadow-sm active:scale-95"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => onEditPolygon(item)}
                        title="تعديل المضلع"
                        className="bg-white border border-gray-100 text-gov-green p-2.5 rounded-xl hover:bg-gov-green hover:text-white hover:border-gov-green transition-all shadow-sm active:scale-95"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => onEditData(item)}
                        title="تعديل البيانات"
                        className="bg-white border border-gray-100 text-amber-500 p-2.5 rounded-xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm active:scale-95"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => {
                          if(confirm('هل أنت متأكد من حذف هذا السجل نهائياً؟')) {
                            onDelete(item.id!);
                          }
                        }}
                        title="حذف نهائي"
                        className="bg-white border border-gray-100 text-red-300 p-2.5 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <AlertTriangle className="w-12 h-12" />
                      <span className="font-black text-sm uppercase tracking-widest">لا توجد معطيات موثقة حالياً</span>
                    </div>
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
