import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Undo2, 
  Trash2, 
  Navigation, 
  CheckCircle2, 
  Hash, 
  Move,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Globe,
  Milestone
} from 'lucide-react';
import { Point, CRS } from '../types';
import { cn } from '../lib/utils';

interface CoordinateToolProps {
  points: Point[];
  onAddPoint: (x: number, y: number, crs: CRS) => void;
  onRemovePoint: (index: number) => void;
  onUndo: () => void;
  onClear: () => void;
  crs: CRS;
  setCrs: (crs: CRS) => void;
  areaM2: number;
  onFinish: () => void;
}

export const CoordinateTool: React.FC<CoordinateToolProps> = ({
  points,
  onAddPoint,
  onRemovePoint,
  onUndo,
  onClear,
  crs,
  setCrs,
  areaM2,
  onFinish
}) => {
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [isListExpanded, setIsListExpanded] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const x = parseFloat(inputX);
    const y = parseFloat(inputY);
    if (!isNaN(x) && !isNaN(y)) {
      onAddPoint(x, y, crs);
      setInputX('');
      setInputY('');
    }
  };

  return (
    <div className="absolute left-6 top-6 z-[1001] w-85 space-y-4 font-sans" dir="rtl">
      {/* Official Tool Header */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#1a3a5a] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between group transition-all hover:bg-[#162e48] border border-white/10"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-all">
            <ShieldCheck className="w-5 h-5 text-gov-green" />
          </div>
          <div className="text-right">
            <div className="font-black text-sm tracking-tight">المنصة الجغرافية العقارية</div>
            <div className="text-[9px] text-white/50 uppercase font-bold tracking-[0.2em]">نظام إدخال الإحداثيات الرسمي</div>
          </div>
        </div>
        <Navigation className={cn("w-4 h-4 text-white/30 transition-transform duration-500", isOpen ? "rotate-180" : "")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="bg-white rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(26,58,90,0.25)] border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* System Selection Tab Bar */}
            <div className="p-2 bg-gray-50 flex gap-1">
              <button 
                onClick={() => setCrs('EPSG:26191')}
                className={cn(
                  "flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2",
                  crs === 'EPSG:26191' 
                    ? "bg-white text-gov-blue shadow-sm ring-1 ring-gray-200" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Milestone className="w-3.5 h-3.5" />
                لامبرت المغرب
              </button>
              <button 
                onClick={() => setCrs('WGS84')}
                className={cn(
                  "flex-1 py-2.5 px-3 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-2",
                  crs === 'WGS84' 
                    ? "bg-white text-gov-blue shadow-sm ring-1 ring-gray-200" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                WGS84 (درجات)
              </button>
            </div>

            {/* Main Input Form */}
            <div className="p-6 space-y-5">
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 mr-2 uppercase tracking-wider flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gov-blue/30" />
                      {crs === 'EPSG:26191' ? 'الإحداثي X' : 'خط الطول (Lng)'}
                    </label>
                    <input 
                      type="number" step="any"
                      required
                      value={inputX}
                      onChange={(e) => setInputX(e.target.value)}
                      placeholder={crs === 'EPSG:26191' ? '450000.00' : '-6.8400'}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gov-blue outline-none focus:border-gov-blue transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 mr-2 uppercase tracking-wider flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gov-red/30" />
                      {crs === 'EPSG:26191' ? 'الإحداثي Y' : 'خط العرض (Lat)'}
                    </label>
                    <input 
                      type="number" step="any"
                      required
                      value={inputY}
                      onChange={(e) => setInputY(e.target.value)}
                      placeholder={crs === 'EPSG:26191' ? '300000.00' : '33.9700'}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm font-bold text-gov-blue outline-none focus:border-gov-blue transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-gov-blue text-white rounded-2xl py-3.5 font-black text-sm flex items-center justify-center gap-3 hover:bg-[#162e48] active:scale-95 transition-all shadow-xl shadow-gov-blue/20 group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  إضافة النقطة المساحية
                </button>
              </form>
            </div>

            {/* Collapsible Points Table */}
            <div className="flex flex-col flex-1 border-t border-gray-100 overflow-hidden">
              <button 
                onClick={() => setIsListExpanded(!isListExpanded)}
                className="w-full flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gov-blue/10 p-1.5 rounded-lg">
                    <Hash className="w-4 h-4 text-gov-blue" />
                  </div>
                  <span className="text-[11px] font-black text-gov-blue uppercase tracking-wider">سجل النقط المحملة ({points.length})</span>
                </div>
                {isListExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              <AnimatePresence>
                {isListExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden border-b border-gray-100"
                  >
                    <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                      <table className="w-full text-right text-[10px]">
                        <thead className="bg-[#1a3a5a]/5 sticky top-0 backdrop-blur-sm z-10">
                          <tr>
                            <th className="p-3 font-black text-gray-500 uppercase tracking-widest text-[9px]">الرقم</th>
                            <th className="p-3 font-black text-gray-500 uppercase tracking-widest text-[9px]">X / Longitude</th>
                            <th className="p-3 font-black text-gray-500 uppercase tracking-widest text-[9px]">Y / Latitude</th>
                            <th className="p-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {points.map((p, i) => (
                            <motion.tr 
                              key={`pt-${i}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="hover:bg-gray-50/80 transition-colors group/row"
                            >
                              <td className="p-3 font-bold text-gray-400">{i + 1}</td>
                              <td className="p-3 font-mono text-gov-blue font-semibold">{(crs === 'EPSG:26191' ? p.x : p.lng).toFixed(4)}</td>
                              <td className="p-3 font-mono text-gov-blue font-semibold">{(crs === 'EPSG:26191' ? p.y : p.lat).toFixed(4)}</td>
                              <td className="p-3">
                                <button 
                                  onClick={() => onRemovePoint(i)}
                                  className="p-1.5 rounded-lg opacity-0 group-hover/row:opacity-100 hover:bg-red-50 text-red-300 hover:text-red-500 transition-all"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </motion.tr>
                          ))}
                          {points.length === 0 && (
                            <tr>
                              <td colSpan={4} className="p-12 text-center">
                                <div className="flex flex-col items-center gap-2 opacity-20 grayscale">
                                  <Hash className="w-8 h-8" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">في انتظار إدخال البيانات</span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Calculations & Final Validation */}
            <div className="p-6 bg-gray-50/80 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gov-green">
                    <Move className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider">المساحة م²</span>
                  </div>
                  <div className="text-xl font-black text-gov-green tracking-tight">{areaM2.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-gov-blue">
                    <Milestone className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-wider">المساحة Ha</span>
                  </div>
                  <div className="text-xl font-black text-gov-blue tracking-tight">{(areaM2 / 10000).toLocaleString(undefined, { maximumFractionDigits: 4 })}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={onUndo}
                  disabled={points.length === 0}
                  className="flex-1 bg-white text-gray-500 rounded-xl py-2.5 text-[10px] font-bold border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  تراجع
                </button>
                <button 
                  onClick={onClear}
                  disabled={points.length === 0}
                  className="flex-1 bg-white text-red-500 rounded-xl py-2.5 text-[10px] font-bold border border-gray-200 hover:bg-red-50 hover:border-red-100 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  إفراغ السجل
                </button>
              </div>

              <button 
                onClick={onFinish}
                disabled={points.length < 3}
                className="w-full bg-gov-green text-white rounded-[1.25rem] py-4 font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-gov-green/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale disabled:scale-100 group relative overflow-hidden"
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                <CheckCircle2 className="w-5 h-5" />
                المصادقة النهائية وحفظ المضلع
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
