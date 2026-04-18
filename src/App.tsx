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
  const [activeView, setActiveView] = useState<'map' | 'registry'>('map');
  const [declarations, setDeclarations] = useState<LandDeclaration[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch from Supabase on mount
  const fetchDeclarations = async () => {
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
  };

  useEffect(() => {
    fetchDeclarations();
  }, []);

  const {
    points,
    areaM2,
    areaHa,
    crs,
    setCrs,
    addPoint,
    removePoint,
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

  const handleMapClick = (lat: number, lng: number) => {
    if (activeView === 'map') {
      addPoint(lng, lat, 'WGS84'); // WGS84 for direct map clicks
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans select-none bg-gray-50" dir="rtl">
      <Navbar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 flex overflow-hidden relative">
        {activeView === 'map' ? (
          <div className="w-full h-full relative flex">
            <div className="flex-1 relative">
              <MapControl 
                points={points} 
                onMapClick={handleMapClick}
                savedDeclarations={declarations}
                onQuickSave={() => {
                  // This will be handled by the form's handleSave, but we could trigger it from here
                  // For now, it just scrolls the form into view if needed, but the form is always visible
                  // Let's actually trigger a "draft" state or just focus the form
                  const saveBtn = document.querySelector('button[class*="bg-gov-blue"]') as HTMLButtonElement;
                  saveBtn?.scrollIntoView({ behavior: 'smooth' });
                }}
                onClear={clearPoints}
                areaM2={areaM2}
              />
            </div>
            <DeclarationForm 
              points={points}
              areaM2={areaM2}
              areaHa={areaHa}
              crs={crs}
              setCrs={setCrs}
              onAddPoint={addPoint}
              onRemovePoint={removePoint}
              onSave={handleSave}
              loading={loading}
            />
          </div>
        ) : (
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

