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
import { LandDeclaration } from './types';
import { supabase } from './lib/supabase';

export default function App() {
  const [activeView, setActiveView] = useState<'map' | 'registry' | 'declaration'>('map');
  const [declarations, setDeclarations] = useState<LandDeclaration[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch from Supabase on mount
  const fetchDeclarations = typeof supabase !== 'undefined' ? async () => {
    const { data, error } = await supabase
      .from('polygons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching declarations:', error);
      return;
    }
    
    if (data) {
      setDeclarations(data as LandDeclaration[]);
    }
  } : () => {};

  useEffect(() => {
    if (typeof fetchDeclarations === 'function') {
      fetchDeclarations();
    }
  }, []);

  useEffect(() => {
    const handleNav = () => setActiveView('map');
    window.addEventListener('nav-to-map', handleNav);
    return () => window.removeEventListener('nav-to-map', handleNav);
  }, []);

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

  const handleSave = async (data: Partial<LandDeclaration>) => {
    setLoading(true);
    
    const { error } = await supabase
      .from('polygons')
      .insert([data]);

    if (error) {
      alert('حدث خطأ أثناء حفظ الإقرار: ' + error.message);
      setLoading(false);
      return;
    }

    await fetchDeclarations();
    setLoading(false);
    clearPoints();
    setActiveView('registry');
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans select-none bg-gray-50" dir="rtl">
      <Navbar 
        activeView={activeView} 
        onViewChange={setActiveView} 
      />

      <div className="flex-1 flex overflow-hidden relative">
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
            onClear={clearPoints}
            onSave={handleSave}
            loading={loading}
          />
        )}

        {activeView === 'registry' && (
          <Registry 
            data={declarations}
            onViewOnMap={(decl) => {
              setActiveView('map');
            }}
            onRefresh={fetchDeclarations}
          />
        )}
      </div>
    </div>
  );
}

