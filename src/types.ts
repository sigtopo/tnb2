export interface Point {
  lat: number;
  lng: number;
  x: number;
  y: number;
}

export interface LandDeclaration {
  id?: string;
  nom_titre: string;
  adresse: string;
  id_cin: string;
  tel: string;
  email: string;
  qualite: string;
  num_titre: string;
  site_loc: string;
  coord: string;
  surf_m2: number;
  surf_ha: number;
  prix_m: number;
  taxe_dh: number;
  date_decl?: string;
  geometry_data: { lat: number, lng: number }[];
  created_at?: string;
}

export type CRS = 'EPSG:26191' | 'WGS84';
