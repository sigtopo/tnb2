import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  CreditCard, 
  Plus, 
  Trash2, 
  Save, 
  Calculator,
  Mail,
  Briefcase,
  FileText,
  Map as MapIcon,
  ChevronLeft,
  Undo2
} from 'lucide-react';
import { Point, CRS, LandDeclaration } from '../types';
import { cn } from '../lib/utils';

interface DeclarationFormProps {
  points: Point[];
  areaM2: number;
  areaHa: number;
  crs: CRS;
  setCrs: (crs: CRS) => void;
  onUndo: () => void;
  onClear: () => void;
  onSave: (data: Partial<LandDeclaration>) => void;
  loading?: boolean;
}

export const DeclarationForm: React.FC<DeclarationFormProps> = ({
  points,
  areaM2,
  areaHa,
  crs,
  setCrs,
  onUndo,
  onClear,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState({
    nom_titre: '',
    adresse: '',
    id_cin: '',
    tel: '',
    email: '',
    qualite: '',
    num_titre: '',
    site_loc: 'مركز جماعة اولاد صغير',
    prix_m: '',
  });

  const taxe_dh = areaM2 * (parseFloat(formData.prix_m) || 0);
  const coordText = points.length > 0 ? `${points[0].lat.toFixed(6)}, ${points[0].lng.toFixed(6)}` : '';

  const handleSave = () => {
    onSave({
      ...formData,
      prix_m: parseFloat(formData.prix_m) || 0,
      taxe_dh,
      surf_m2: areaM2,
      surf_ha: areaHa,
      coord: coordText,
      geometry_data: points.map(p => ({ lat: p.lat, lng: p.lng })),
    });
  };

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-y-auto w-full flex justify-center selection:bg-gov-blue/20" dir="rtl">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden self-start">
        {/* Header */}
        <div className="p-8 bg-gov-blue text-white relative">
          <div className="flex justify-between items-start mb-6">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
              <Building2 className="w-10 h-10 text-gov-green" />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onUndo}
                className="bg-white/10 hover:bg-white/20 p-2 px-3 rounded-xl transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
              >
                <Undo2 className="w-4 h-4" />
                تراجع
              </button>
              <button 
                onClick={() => {
                  onClear();
                  window.dispatchEvent(new CustomEvent('nav-to-map'));
                }}
                className="bg-red-500/20 hover:bg-red-500/40 p-2 px-3 rounded-xl transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-red-100"
              >
                <Trash2 className="w-4 h-4 text-red-300" />
                إلغاء الإقرار
              </button>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('nav-to-map'))}
                className="bg-white/10 hover:bg-white/20 p-2 px-3 rounded-xl transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
              >
                <ChevronLeft className="w-4 h-4" />
                المحل العقاري
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black font-display tracking-tight">إقرار العقار المجالي</h1>
            <p className="text-white/60 text-xs font-medium mt-1 uppercase tracking-widest">نموذج التصريح القانوني المعياري</p>
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
            <MapIcon className="w-80 h-80 -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Section: Context Overview */}
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gov-blue/5 p-3 rounded-2xl">
                <MapPin className="w-6 h-6 text-gov-blue" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 px-1">الموقع المحدد</div>
                <div className="text-sm font-black text-gov-blue bg-white px-3 py-1 rounded-lg border border-gray-100">{coordText || 'لم يتم تحديد موقع'}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 px-1">المساحة النهائية</div>
              <div className="text-lg font-black text-gov-green">{areaM2.toLocaleString()} م²</div>
            </div>
          </div>

          {/* Section: Personal Info */}
          <div className="space-y-4">
          <div className="flex items-center gap-2 text-gov-blue">
            <User className="w-4 h-4" />
            <h3 className="font-bold text-sm">معلومات صاحب الإقرار</h3>
          </div>

          <div className="grid gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 mr-2">الاسم الكامل / التجاري</label>
              <input 
                type="text" value={formData.nom_titre}
                onChange={(e) => setFormData({...formData, nom_titre: e.target.value})}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-gov-blue transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 mr-2">رقم البطاقة</label>
                <input 
                  type="text" value={formData.id_cin}
                  onChange={(e) => setFormData({...formData, id_cin: e.target.value})}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 mr-2">رقم الهاتف</label>
                <input 
                  type="text" value={formData.tel}
                  onChange={(e) => setFormData({...formData, tel: e.target.value})}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 mr-2 flex items-center gap-1">
                <Mail className="w-3 h-3" /> البريد الإلكتروني
              </label>
              <input 
                type="email" value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 mr-2 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> صفة صاحب الإقرار
                </label>
                <input 
                  type="text" value={formData.qualite}
                  onChange={(e) => setFormData({...formData, qualite: e.target.value})}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 mr-2 flex items-center gap-1">
                  <FileText className="w-3 h-3" /> رقم الرسم العقاري
                </label>
                <input 
                  type="text" value={formData.num_titre}
                  onChange={(e) => setFormData({...formData, num_titre: e.target.value})}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 mr-2">عنوان السكنى</label>
              <textarea 
                rows={2} value={formData.adresse}
                onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section: Financials */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gov-blue">
            <Calculator className="w-4 h-4" />
            <h3 className="font-bold text-sm">التصفية الضريبية</h3>
          </div>

          <div className="bg-gov-green/5 border border-gov-green/10 p-5 rounded-2xl space-y-4">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-gov-green/10">
              <span className="text-gray-500 font-medium">المساحة المحسوبة:</span>
              <div className="text-right">
                <div className="font-bold text-gov-green text-lg">{areaM2.toLocaleString(undefined, { maximumFractionDigits: 2 })} م²</div>
                <div className="text-[9px] text-gray-400 font-mono">{(areaHa).toFixed(4)} هكتار</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gov-green/70 mr-2 uppercase">ثمن المتر الواحد (DH)</label>
              <input 
                type="number" value={formData.prix_m}
                onChange={(e) => setFormData({...formData, prix_m: e.target.value})}
                placeholder="0.00"
                className="w-full bg-white border border-gov-green/20 rounded-xl px-4 py-3 text-lg font-bold text-gov-blue outline-none focus:ring-4 focus:ring-gov-green/10 transition-all font-mono"
              />
            </div>

            <div className="pt-2 text-center bg-white/50 rounded-xl p-4">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">إجمالي الرسم المستحق</div>
              <div className="text-3xl font-black text-gov-red font-mono">
                {taxe_dh.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm font-normal mr-1">DH</span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-white border-t border-gray-100">
        <button 
          onClick={handleSave}
          disabled={loading}
          className={cn(
            "w-full bg-gov-blue text-white rounded-2xl py-4 font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-gov-blue/20 active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100",
            loading && "cursor-wait"
          )}
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-6 h-6" />
              المصادقة والحفظ
            </>
          )}
        </button>
      </div>
      </div>
    </div>
  );
};
