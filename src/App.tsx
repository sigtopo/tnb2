/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DeclarationForm } from './components/DeclarationForm';
import { MapControl } from './components/MapControl';
import { Registry } from './components/Registry';
import { Navbar } from './components/Navbar';
import { useSpatialLogic } from './hooks/useSpatialLogic';
import { LandDeclaration, Point } from './types';
import { supabase } from './lib/supabase';
import proj4 from 'proj4';
import { MOROCCO_LAMBERT_ZONE_1 } from './constants';

export default function App() {
  const [activeView, setActiveView] = useState<'map' | 'registry' | 'declaration'>('map');
  const [declarations, setDeclarations] = useState<LandDeclaration[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingDecl, setEditingDecl] = useState<LandDeclaration | null>(null);

  const {
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
  } = useSpatialLogic();

  // Fetch from Supabase
  const fetchDeclarations = async () => {
    if (typeof supabase === 'undefined') return;
    const { data, error } = await supabase
      .from('polygons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching declarations:', error);
      return;
    }
    
    if (data) setDeclarations(data as LandDeclaration[]);
  };

  useEffect(() => {
    fetchDeclarations();
  }, []);

  const handleSave = async (data: Partial<LandDeclaration>) => {
    setLoading(true);
    
    let result;
    if (data.id) {
      // Update
      result = await supabase
        .from('polygons')
        .update(data)
        .eq('id', data.id);
    } else {
      // Insert
      result = await supabase
        .from('polygons')
        .insert([data]);
    }

    if (result.error) {
      alert('حدث خطأ أثناء حفظ الإقرار: ' + result.error.message);
      setLoading(false);
      return;
    }

    await fetchDeclarations();
    setLoading(false);
    clearPoints();
    setEditingDecl(null);
    setActiveView('registry');
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('polygons')
      .delete()
      .eq('id', id);
    
    if (error) {
      alert('خطأ أثناء الحذف: ' + error.message);
    } else {
      fetchDeclarations();
    }
  };

  const loadPointsToLogic = (geom: { lat: number, lng: number }[]) => {
    const newPoints: Point[] = geom.map(p => {
      const converted = proj4('WGS84', MOROCCO_LAMBERT_ZONE_1, [p.lng, p.lat]);
      return {
        lat: p.lat,
        lng: p.lng,
        x: converted[0],
        y: converted[1]
      };
    });
    setPoints(newPoints);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans select-none bg-gray-50" dir="rtl">
      <Navbar 
        activeView={activeView} 
        onViewChange={(view) => {
          if (view !== 'declaration' && view !== 'map') {
            setEditingDecl(null);
            clearPoints();
          }
          setActiveView(view);
        }} 
      />

      <div className="flex-1 flex flex-col overflow-hidden relative pt-16">
        <div className="flex-1 relative overflow-hidden">
          {activeView === 'map' && (
            <div className="w-full h-full relative">
              <MapControl 
                savedDeclarations={declarations}
                points={points}
                onAddPoint={addPoint}
                onRemovePoint={removePoint}
                onUndo={undoLastPoint}
                onClear={clearPoints}
                crs={crs}
                setCrs={setCrs}
                areaM2={areaM2}
                onFinishDrawing={() => setActiveView('declaration')}
              />
            </div>
          )}

          {activeView === 'declaration' && (
            <DeclarationForm 
              points={points}
              areaM2={areaM2}
              areaHa={areaHa}
              crs={crs}
              setCrs={setCrs}
              onUndo={undoLastPoint}
              onClear={() => {
                clearPoints();
                setEditingDecl(null);
                setActiveView('map');
              }}
              onSave={handleSave}
              loading={loading}
              initialData={editingDecl}
            />
          )}

          {activeView === 'registry' && (
            <Registry 
              data={declarations}
              onViewOnMap={(decl) => {
                loadPointsToLogic(decl.geometry_data);
                setActiveView('map');
              }}
              onEditData={(decl) => {
                setEditingDecl(decl);
                loadPointsToLogic(decl.geometry_data);
                setActiveView('declaration');
              }}
              onEditPolygon={(decl) => {
                setEditingDecl(decl);
                loadPointsToLogic(decl.geometry_data);
                setActiveView('map');
              }}
              onDelete={handleDelete}
              onRefresh={fetchDeclarations}
            />
          )}
        </div>
      </div>
    </div>
  );
}

