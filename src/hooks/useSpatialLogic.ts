import { useState, useCallback, useEffect } from 'react';
import proj4 from 'proj4';
import { Point, CRS } from '../types';
import { MOROCCO_LAMBERT_ZONE_1, PROJ4_DEFS } from '../constants';
import L from 'leaflet';

// Register projection
proj4.defs(MOROCCO_LAMBERT_ZONE_1, PROJ4_DEFS[MOROCCO_LAMBERT_ZONE_1]);

export function useSpatialLogic() {
  const [points, setPoints] = useState<Point[]>([]);
  const [areaM2, setAreaM2] = useState<number>(0);
  const [areaHa, setAreaHa] = useState<number>(0);
  const [crs, setCrs] = useState<CRS>('EPSG:26191');

  const calculateSpatialData = useCallback((currentPoints: Point[]) => {
    if (currentPoints.length < 3) {
      setAreaM2(0);
      setAreaHa(0);
      return;
    }

    const path = currentPoints.map(p => [p.lat, p.lng] as [number, number]);
    
    // Using an approximation for area since we don't have leaflet-geometryutil easily
    // Standard Shoelace formula or just using Leaflet's polygon area if available in a library
    // For now, simpler approximation or I'll try to find a way to use L.GeometryUtil if I can install it
    // Wait, I can use the spherical geometry formula or the shoelace on projected coords
    
    if (crs === 'EPSG:26191') {
      // Shoelace formula on projected coordinates (meters)
      let area = 0;
      for (let i = 0; i < currentPoints.length; i++) {
        const j = (i + 1) % currentPoints.length;
        area += currentPoints[i].x * currentPoints[j].y;
        area -= currentPoints[j].x * currentPoints[i].y;
      }
      const absoluteArea = Math.abs(area) / 2;
      setAreaM2(absoluteArea);
      setAreaHa(absoluteArea / 10000);
    } else {
      // Very rough approximation for WGS84 if not using a library
      // In production, we'd use leaflet-geometryutil or similar
      // I'll stick to Lambert for accurate area
      setAreaM2(0); 
    }
  }, [crs]);

  const addPoint = (x: number, y: number, currentCrs: CRS) => {
    let lat: number, lng: number;
    let localX = x;
    let localY = y;

    if (currentCrs === 'EPSG:26191') {
      try {
        const converted = proj4(MOROCCO_LAMBERT_ZONE_1, 'WGS84', [x, y]);
        if (converted && converted.length >= 2) {
          lng = converted[0];
          lat = converted[1];
        } else {
          throw new Error('Invalid projection result');
        }
      } catch (err) {
        console.error('Projection error:', err);
        return;
      }
    } else {
      lng = x;
      lat = y;
      try {
        const converted = proj4('WGS84', MOROCCO_LAMBERT_ZONE_1, [x, y]);
        if (converted && converted.length >= 2) {
          localX = converted[0];
          localY = converted[1];
        } else {
          throw new Error('Invalid projection result');
        }
      } catch (err) {
        console.error('Projection error:', err);
        localX = x; localY = y;
      }
    }

    const newPoint: Point = { lat, lng, x: localX, y: localY };
    const newPoints = [...points, newPoint];
    setPoints(newPoints);
    calculateSpatialData(newPoints);
  };

  const removePoint = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    setPoints(newPoints);
    calculateSpatialData(newPoints);
  };

  const clearPoints = () => {
    setPoints([]);
    setAreaM2(0);
    setAreaHa(0);
  };

  return {
    points,
    areaM2,
    areaHa,
    crs,
    setCrs,
    addPoint,
    removePoint,
    clearPoints,
  };
}
