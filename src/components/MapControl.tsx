import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Point, CRS } from '../types';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../constants';
import L from 'leaflet';
import { CoordinateTool } from './CoordinateTool';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

interface MapControlProps {
  savedDeclarations: any[];
  points: Point[];
  onAddPoint: (x: number, y: number, crs: CRS) => void;
  onRemovePoint: (index: number) => void;
  onUndo: () => void;
  onClear: () => void;
  crs: CRS;
  setCrs: (crs: CRS) => void;
  areaM2: number;
  onFinishDrawing: () => void;
}

export const MapControl: React.FC<MapControlProps> = ({ 
  savedDeclarations, 
  points,
  onAddPoint,
  onRemovePoint,
  onUndo,
  onClear,
  crs,
  setCrs,
  areaM2,
  onFinishDrawing
}) => {
  const path = points.map(p => [p.lat, p.lng] as [number, number]);
  const center = points.length > 0 ? [points[points.length - 1].lat, points[points.length - 1].lng] as [number, number] : DEFAULT_MAP_CENTER;

  return (
    <div className="w-full h-full relative">
      <CoordinateTool 
        points={points}
        onAddPoint={onAddPoint}
        onRemovePoint={onRemovePoint}
        onUndo={onUndo}
        onClear={onClear}
        crs={crs}
        setCrs={setCrs}
        areaM2={areaM2}
        onFinish={onFinishDrawing}
      />

      <MapContainer
        center={DEFAULT_MAP_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; Google'
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        />

        {points.length > 0 && <ChangeView center={center} />}

        {points.length >= 3 && (
          <Polygon
            positions={path}
            pathOptions={{ color: '#27ae60', weight: 4, fillOpacity: 0.3 }}
          />
        )}

        {points.map((p, i) => (
          <CircleMarker
            key={`marker-${i}`}
            center={[p.lat, p.lng]}
            radius={i === points.length - 1 ? 6 : 4}
            pathOptions={{ 
              color: i === points.length - 1 ? '#27ae60' : '#1a3a5a', 
              fillColor: i === points.length - 1 ? '#27ae60' : '#1a3a5a', 
              fillOpacity: 1 
            }}
          />
        ))}

        {savedDeclarations.map((decl, i) => (
          decl.geometry_data && (
            <Polygon
              key={`saved-${i}`}
              positions={decl.geometry_data.map((p: any) => [p.lat, p.lng])}
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
          )
        ))}
      </MapContainer>
    </div>
  );
};
