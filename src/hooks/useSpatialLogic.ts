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

  useEffect(() => {
    if (points.length < 3) {
      setAreaM2(0);
      setAreaHa(0);
      return;
    }

    // Always calculate using Lambert (meters) for accuracy
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    const absoluteArea = Math.abs(area) / 2;
    setAreaM2(absoluteArea);
    setAreaHa(absoluteArea / 10000);
  }, [points]);

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
    setPoints(prev => [...prev, newPoint]);
  };

  const removePoint = (index: number) => {
    setPoints(prev => prev.filter((_, i) => i !== index));
  };

  const undoLastPoint = () => {
    setPoints(prev => prev.slice(0, -1));
  };

  const clearPoints = () => {
    setPoints([]);
    setAreaM2(0);
    setAreaHa(0);
  };

  return {
    points,
    setPoints,
    areaM2,
    areaHa,
    crs,
    setCrs,
    addPoint,
    removePoint,
    undoLastPoint,
    clearPoints,
  };
}
