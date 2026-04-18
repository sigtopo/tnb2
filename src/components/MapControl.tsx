import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, useMap, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Point } from '../types';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../constants';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Trash2, MousePointer2 } from 'lucide-react';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapEvents({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

interface MapControlProps {
  points: Point[];
  onMapClick: (lat: number, lng: number) => void;
  savedDeclarations: any[];
  onQuickSave: () => void;
  onClear: () => void;
  areaM2: number;
}

export const MapControl: React.FC<MapControlProps> = ({ 
  points, 
  onMapClick, 
  savedDeclarations, 
  onQuickSave,
  onClear,
  areaM2
}) => {
  const path = points.map(p => [p.lat, p.lng] as [number, number]);
  const center = points.length > 0 ? [points[points.length - 1].lat, points[points.length - 1].lng] as [number, number] : DEFAULT_MAP_CENTER;

  return (
    <div className="w-full h-full relative group">
      <MapContainer
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; Google'
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        />
        <MapEvents onClick={onMapClick} />
        {points.length > 0 && <ChangeView center={center} />}

        {points.map((p, i) => (
          <CircleMarker
            key={`marker-${i}`}
            center={[p.lat, p.lng]}
            radius={6}
            pathOptions={{ color: '#1a3a5a', fillColor: '#1a3a5a', fillOpacity: 1 }}
          />
        ))}

        {points.length >= 3 && (
          <Polygon
            positions={path}
            pathOptions={{ color: '#27ae60', weight: 4, fillOpacity: 0.3, className: 'animate-pulse' }}
          />
        )}

        {savedDeclarations.map((decl, i) => {
          if (!decl?.geometry_data || !Array.isArray(decl.geometry_data) || decl.geometry_data.length < 3) return null;
          
          const positions = decl.geometry_data
            .filter((p: any) => p && typeof p.lat === 'number' && typeof p.lng === 'number')
            .map((p: any) => [p.lat, p.lng] as [number, number]);

          if (positions.length < 3) return null;

          return (
            <Polygon
              key={`saved-${i}`}
              positions={positions}
              pathOptions={{ color: '#1a3a5a', weight: 1, fillOpacity: 0.1 }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-right" dir="rtl">
                  <div className="font-bold text-gov-blue border-b pb-1">{decl.nom_titre}</div>
                  <div className="text-[10px] text-gray-600"><strong>المساحة:</strong> {decl.surf_m2?.toLocaleString()} م²</div>
                  <div className="text-[10px] text-gov-red font-bold"><strong>الرسم:</strong> {decl.taxe_dh?.toLocaleString()} DH</div>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>

      {/* Floating Instructions */}
      <div className="absolute top-8 left-8 z-[1000] flex flex-col gap-3">
        <AnimatePresence>
          {points.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3 text-gov-blue"
            >
              <div className="bg-gov-blue text-white p-2 rounded-xl">
                <MousePointer2 className="w-5 h-5" />
              </div>
              <div className="text-sm font-bold">انقر على الخريطة لبدء رسم المضلع</div>
            </motion.div>
          )}

          {points.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-2"
            >
              <button 
                onClick={onClear}
                className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/50 text-red-500 hover:bg-red-50 transition-all flex items-center gap-2 font-bold text-sm"
              >
                <Trash2 className="w-4 h-4" />
                مسح الرسم
              </button>
              
              {points.length >= 3 && (
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={onQuickSave}
                  className="bg-gov-green text-white p-3 px-6 rounded-2xl shadow-xl shadow-gov-green/20 flex items-center gap-2 font-black text-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                  إرسال المعطيات ({areaM2.toFixed(0)} م²)
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
