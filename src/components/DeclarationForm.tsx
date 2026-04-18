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
  Map as MapIcon
} from 'lucide-react';
import { Point, CRS, LandDeclaration } from '../types';
import { cn } from '../lib/utils';

interface DeclarationFormProps {
  points: Point[];
  areaM2: number;
  areaHa: number;
  crs: CRS;
  setCrs: (crs: CRS) => void;
  onAddPoint: (x: number, y: number, crs: CRS) => void;
  onRemovePoint: (index: number) => void;
  onSave: (data: Partial<LandDeclaration>) => void;
  loading?: boolean;
}

export const DeclarationForm: React.FC<DeclarationFormProps> = ({
  points,
  areaM2,
  areaHa,
  crs,
  setCrs,
  onAddPoint,
  onRemovePoint,
  onSave,
  loading
}) => {
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
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

  const handleAddPoint = () => {
    const x = parseFloat(inputX);
    const y = parseFloat(inputY);
    if (!isNaN(x) && !isNaN(y)) {
      onAddPoint(x, y, crs);
      setInputX('');
      setInputY('');
    }
  };

  const handleSave = () => {
    if (points.length < 3) {
      alert('يجب إدخال 3 نقاط على الأقل للمضلع');
      return;
    }
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
    <div className="absolute top-24 right-8 bottom-8 w-[400px] bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white/20 flex flex-col overflow-hidden z-[1000] selection:bg-gov-blue/20">
      {/* Header */}
      <div className="p-6 bg-gov-blue text-white relative">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-gov-green" />
          <h1 className="text-xl font-bold font-display">إقرار العقار المجالي</h1>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
          <MapIcon className="w-64 h-64 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        {/* Section: Polygon Definition */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gov-blue">
            <MapPin className="w-4 h-4" />
            <h3 className="font-bold text-sm">تحديد الوعاء العقاري</h3>
          </div>
          
          <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-3">
            <select 
              value={crs}
              onChange={(e) => setCrs(e.target.value as CRS)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-gov-blue/50"
            >
              <option value="EPSG:26191">Lambert - المغرب (Zone 1)</option>
              <option value="WGS84">درجات (WGS84)</option>
            </select>

            <div className="flex gap-2">
              <input 
                type="number" placeholder="X" value={inputX} onChange={(e) => setInputX(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
              <input 
                type="number" placeholder="Y" value={inputY} onChange={(e) => setInputY(e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
              />
            </div>
            
            <button 
              onClick={handleAddPoint}
              className="w-full bg-gov-blue text-white rounded-xl py-2 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> إضافة نقطة
            </button>
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
          disabled={loading || points.length < 3}
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
  );
};
