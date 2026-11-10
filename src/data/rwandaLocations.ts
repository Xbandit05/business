import type {
  ProvinceEntity,
  DistrictEntity,
  SectorEntity,
  CellEntity,
  VillageEntity,
  LocationHierarchyNode,
  LocationImportReport,
} from '../types/index.ts';

// ==========================================
// 1. RWANDA PROVINCES (5 PROVINCES)
// ==========================================
export const RWANDA_PROVINCES: ProvinceEntity[] = [
  {
    id: 'prv_kigali',
    code: 'PRV-01',
    name: 'Kigali City',
    nameRw: 'Umujyi wa Kigali',
    districtsCount: 3,
  },
  {
    id: 'prv_east',
    code: 'PRV-02',
    name: 'Eastern Province',
    nameRw: "Intara y'Iburasirazuba",
    districtsCount: 7,
  },
  {
    id: 'prv_north',
    code: 'PRV-03',
    name: 'Northern Province',
    nameRw: "Intara y'Amajyaruguru",
    districtsCount: 5,
  },
  {
    id: 'prv_south',
    code: 'PRV-04',
    name: 'Southern Province',
    nameRw: "Intara y'Amajyepfo",
    districtsCount: 8,
  },
  {
    id: 'prv_west',
    code: 'PRV-05',
    name: 'Western Province',
    nameRw: "Intara y'Iburengerazuba",
    districtsCount: 7,
  },
];

// ==========================================
// 2. ALL 30 RWANDA DISTRICTS
// ==========================================
export const RWANDA_DISTRICTS_LIST: DistrictEntity[] = [
  // Kigali City (3)
  { id: 'dis_gasabo', code: 'DIS-01', provinceId: 'prv_kigali', name: 'Gasabo', nameRw: 'Gasabo', sectorsCount: 15 },
  { id: 'dis_kicukiro', code: 'DIS-02', provinceId: 'prv_kigali', name: 'Kicukiro', nameRw: 'Kicukiro', sectorsCount: 10 },
  { id: 'dis_nyarugenge', code: 'DIS-03', provinceId: 'prv_kigali', name: 'Nyarugenge', nameRw: 'Nyarugenge', sectorsCount: 10 },

  // Eastern Province (7)
  { id: 'dis_nyagatare', code: 'DIS-04', provinceId: 'prv_east', name: 'Nyagatare', nameRw: 'Nyagatare', sectorsCount: 14 },
  { id: 'dis_gatsibo', code: 'DIS-05', provinceId: 'prv_east', name: 'Gatsibo', nameRw: 'Gatsibo', sectorsCount: 14 },
  { id: 'dis_kayonza', code: 'DIS-06', provinceId: 'prv_east', name: 'Kayonza', nameRw: 'Kayonza', sectorsCount: 12 },
  { id: 'dis_rwamagana', code: 'DIS-07', provinceId: 'prv_east', name: 'Rwamagana', nameRw: 'Rwamagana', sectorsCount: 14 },
  { id: 'dis_ngoma', code: 'DIS-08', provinceId: 'prv_east', name: 'Ngoma', nameRw: 'Ngoma', sectorsCount: 14 },
  { id: 'dis_kirehe', code: 'DIS-09', provinceId: 'prv_east', name: 'Kirehe', nameRw: 'Kirehe', sectorsCount: 12 },
  { id: 'dis_bugesera', code: 'DIS-10', provinceId: 'prv_east', name: 'Bugesera', nameRw: 'Bugesera', sectorsCount: 15 },

  // Northern Province (5)
  { id: 'dis_musanze', code: 'DIS-11', provinceId: 'prv_north', name: 'Musanze', nameRw: 'Musanze', sectorsCount: 15 },
  { id: 'dis_burera', code: 'DIS-12', provinceId: 'prv_north', name: 'Burera', nameRw: 'Burera', sectorsCount: 17 },
  { id: 'dis_gakenke', code: 'DIS-13', provinceId: 'prv_north', name: 'Gakenke', nameRw: 'Gakenke', sectorsCount: 19 },
  { id: 'dis_rulindo', code: 'DIS-14', provinceId: 'prv_north', name: 'Rulindo', nameRw: 'Rulindo', sectorsCount: 17 },
  { id: 'dis_gicumbi', code: 'DIS-15', provinceId: 'prv_north', name: 'Gicumbi', nameRw: 'Gicumbi', sectorsCount: 21 },

  // Southern Province (8)
  { id: 'dis_huye', code: 'DIS-16', provinceId: 'prv_south', name: 'Huye', nameRw: 'Huye', sectorsCount: 14 },
  { id: 'dis_nyanza', code: 'DIS-17', provinceId: 'prv_south', name: 'Nyanza', nameRw: 'Nyanza', sectorsCount: 10 },
  { id: 'dis_gisagara', code: 'DIS-18', provinceId: 'prv_south', name: 'Gisagara', nameRw: 'Gisagara', sectorsCount: 13 },
  { id: 'dis_muhanga', code: 'DIS-19', provinceId: 'prv_south', name: 'Muhanga', nameRw: 'Muhanga', sectorsCount: 12 },
  { id: 'dis_kamonyi', code: 'DIS-20', provinceId: 'prv_south', name: 'Kamonyi', nameRw: 'Kamonyi', sectorsCount: 12 },
  { id: 'dis_ruhango', code: 'DIS-21', provinceId: 'prv_south', name: 'Ruhango', nameRw: 'Ruhango', sectorsCount: 9 },
  { id: 'dis_nyamagabe', code: 'DIS-22', provinceId: 'prv_south', name: 'Nyamagabe', nameRw: 'Nyamagabe', sectorsCount: 17 },
  { id: 'dis_nyaruguru', code: 'DIS-23', provinceId: 'prv_south', name: 'Nyaruguru', nameRw: 'Nyaruguru', sectorsCount: 14 },

  // Western Province (7)
  { id: 'dis_rubavu', code: 'DIS-24', provinceId: 'prv_west', name: 'Rubavu', nameRw: 'Rubavu', sectorsCount: 12 },
  { id: 'dis_nyabihu', code: 'DIS-25', provinceId: 'prv_west', name: 'Nyabihu', nameRw: 'Nyabihu', sectorsCount: 12 },
  { id: 'dis_ngororero', code: 'DIS-26', provinceId: 'prv_west', name: 'Ngororero', nameRw: 'Ngororero', sectorsCount: 13 },
  { id: 'dis_karongi', code: 'DIS-27', provinceId: 'prv_west', name: 'Karongi', nameRw: 'Karongi', sectorsCount: 13 },
  { id: 'dis_rutsiro', code: 'DIS-28', provinceId: 'prv_west', name: 'Rutsiro', nameRw: 'Rutsiro', sectorsCount: 13 },
  { id: 'dis_nyamasheke', code: 'DIS-29', provinceId: 'prv_west', name: 'Nyamasheke', nameRw: 'Nyamasheke', sectorsCount: 15 },
  { id: 'dis_rusizi', code: 'DIS-30', provinceId: 'prv_west', name: 'Rusizi', nameRw: 'Rusizi', sectorsCount: 18 },
];

// ==========================================
// 3. SECTORS (IMERENGE)
// ==========================================
export const RWANDA_SECTORS_LIST: SectorEntity[] = [
  // Nyagatare (Eastern Province - 14 Sectors)
  { id: 'sec_nya_mimuri', code: 'SEC-0401', districtId: 'dis_nyagatare', name: 'Mimuri', nameRw: 'Mimuri', cellsCount: 5, primaryCrops: ['Maize', 'Beans', 'Soya'] },
  { id: 'sec_nya_rukomo', code: 'SEC-0402', districtId: 'dis_nyagatare', name: 'Rukomo', nameRw: 'Rukomo', cellsCount: 5, primaryCrops: ['Rice', 'Bush Beans', 'Vegetables'] },
  { id: 'sec_nya_karangazi', code: 'SEC-0403', districtId: 'dis_nyagatare', name: 'Karangazi', nameRw: 'Karangazi', cellsCount: 7, primaryCrops: ['Maize', 'Dairy Fodder', 'Cassava'] },
  { id: 'sec_nya_katabagemu', code: 'SEC-0404', districtId: 'dis_nyagatare', name: 'Katabagemu', nameRw: 'Katabagemu', cellsCount: 6, primaryCrops: ['Maize', 'Cassava', 'Sorghum'] },
  { id: 'sec_nya_rwempasha', code: 'SEC-0405', districtId: 'dis_nyagatare', name: 'Rwempasha', nameRw: 'Rwempasha', cellsCount: 6, primaryCrops: ['Red Kidney Beans', 'Maize', 'Groundnuts'] },
  { id: 'sec_nya_matimba', code: 'SEC-0406', districtId: 'dis_nyagatare', name: 'Matimba', nameRw: 'Matimba', cellsCount: 5, primaryCrops: ['Rice', 'Maize', 'Tomatoes'] },
  { id: 'sec_nya_nyagatare', code: 'SEC-0407', districtId: 'dis_nyagatare', name: 'Nyagatare', nameRw: 'Nyagatare', cellsCount: 8, primaryCrops: ['Vegetables', 'Maize', 'Dairy Fodder'] },
  { id: 'sec_nya_rwimiyaga', code: 'SEC-0408', districtId: 'dis_nyagatare', name: 'Rwimiyaga', nameRw: 'Rwimiyaga', cellsCount: 7, primaryCrops: ['Pasture Fodder', 'Maize', 'Cassava'] },
  { id: 'sec_nya_musheri', code: 'SEC-0409', districtId: 'dis_nyagatare', name: 'Musheri', nameRw: 'Musheri', cellsCount: 6, primaryCrops: ['Beans', 'Maize', 'Sweet Potatoes'] },
  { id: 'sec_nya_tabagwe', code: 'SEC-0410', districtId: 'dis_nyagatare', name: 'Tabagwe', nameRw: 'Tabagwe', cellsCount: 6, primaryCrops: ['Climbing Beans', 'Maize', 'Irish Potatoes'] },
  { id: 'sec_nya_kiyombe', code: 'SEC-0411', districtId: 'dis_nyagatare', name: 'Kiyombe', nameRw: 'Kiyombe', cellsCount: 5, primaryCrops: ['Beans', 'Maize', 'Sorghum'] },
  { id: 'sec_nya_gatunda', code: 'SEC-0412', districtId: 'dis_nyagatare', name: 'Gatunda', nameRw: 'Gatunda', cellsCount: 5, primaryCrops: ['Maize', 'Cassava', 'Vegetables'] },
  { id: 'sec_nya_mukama', code: 'SEC-0413', districtId: 'dis_nyagatare', name: 'Mukama', nameRw: 'Mukama', cellsCount: 5, primaryCrops: ['Maize', 'Beans', 'Groundnuts'] },
  { id: 'sec_nya_karama', code: 'SEC-0414', districtId: 'dis_nyagatare', name: 'Karama', nameRw: 'Karama', cellsCount: 5, primaryCrops: ['Cassava', 'Maize', 'Sorghum'] },

  // Gatsibo (Eastern Province)
  { id: 'sec_gat_kabarore', code: 'SEC-0501', districtId: 'dis_gatsibo', name: 'Kabarore', nameRw: 'Kabarore', cellsCount: 5, primaryCrops: ['Maize', 'Beans'] },
  { id: 'sec_gat_kiziguro', code: 'SEC-0502', districtId: 'dis_gatsibo', name: 'Kiziguro', nameRw: 'Kiziguro', cellsCount: 4, primaryCrops: ['Coffee', 'Maize', 'Beans'] },
  { id: 'sec_gat_muhura', code: 'SEC-0503', districtId: 'dis_gatsibo', name: 'Muhura', nameRw: 'Muhura', cellsCount: 5, primaryCrops: ['Maize', 'Soya', 'Vegetables'] },
  { id: 'sec_gat_ngarama', code: 'SEC-0504', districtId: 'dis_gatsibo', name: 'Ngarama', nameRw: 'Ngarama', cellsCount: 5, primaryCrops: ['Cassava', 'Beans'] },
  { id: 'sec_gat_remera', code: 'SEC-0505', districtId: 'dis_gatsibo', name: 'Remera', nameRw: 'Remera', cellsCount: 4, primaryCrops: ['Maize', 'Beans'] },

  // Kayonza (Eastern Province)
  { id: 'sec_kay_mukarange', code: 'SEC-0601', districtId: 'dis_kayonza', name: 'Mukarange', nameRw: 'Mukarange', cellsCount: 5, primaryCrops: ['Maize', 'Beans'] },
  { id: 'sec_kay_kabare', code: 'SEC-0602', districtId: 'dis_kayonza', name: 'Kabare', nameRw: 'Kabare', cellsCount: 5, primaryCrops: ['Rice', 'Maize'] },
  { id: 'sec_kay_gahini', code: 'SEC-0603', districtId: 'dis_kayonza', name: 'Gahini', nameRw: 'Gahini', cellsCount: 4, primaryCrops: ['Cassava', 'Horticulture'] },
  { id: 'sec_kay_rwinkwavu', code: 'SEC-0604', districtId: 'dis_kayonza', name: 'Rwinkwavu', nameRw: 'Rwinkwavu', cellsCount: 5, primaryCrops: ['Rice', 'Maize', 'Fodder'] },

  // Rwamagana (Eastern Province)
  { id: 'sec_rwa_kigabiro', code: 'SEC-0701', districtId: 'dis_rwamagana', name: 'Kigabiro', nameRw: 'Kigabiro', cellsCount: 5, primaryCrops: ['Vegetables', 'Maize'] },
  { id: 'sec_rwa_karenge', code: 'SEC-0702', districtId: 'dis_rwamagana', name: 'Karenge', nameRw: 'Karenge', cellsCount: 4, primaryCrops: ['Bananas', 'Beans'] },
  { id: 'sec_rwa_muyumbu', code: 'SEC-0703', districtId: 'dis_rwamagana', name: 'Muyumbu', nameRw: 'Muyumbu', cellsCount: 4, primaryCrops: ['Cassava', 'Vegetables'] },

  // Gasabo (Kigali City)
  { id: 'sec_gas_kimironko', code: 'SEC-0101', districtId: 'dis_gasabo', name: 'Kimironko', nameRw: 'Kimironko', cellsCount: 4, primaryCrops: ['Urban Horticulture', 'Vegetables'] },
  { id: 'sec_gas_remera', code: 'SEC-0102', districtId: 'dis_gasabo', name: 'Remera', nameRw: 'Remera', cellsCount: 4, primaryCrops: ['Urban Markets'] },
  { id: 'sec_gas_kacyiru', code: 'SEC-0103', districtId: 'dis_gasabo', name: 'Kacyiru', nameRw: 'Kacyiru', cellsCount: 3, primaryCrops: ['Wholesale Distribution'] },
  { id: 'sec_gas_bumbogo', code: 'SEC-0104', districtId: 'dis_gasabo', name: 'Bumbogo', nameRw: 'Bumbogo', cellsCount: 5, primaryCrops: ['Tomatoes', 'Greenhouse Veg'] },
  { id: 'sec_gas_jabana', code: 'SEC-0105', districtId: 'dis_gasabo', name: 'Jabana', nameRw: 'Jabana', cellsCount: 4, primaryCrops: ['Cabbage', 'Leafy Greens'] },

  // Kicukiro (Kigali City)
  { id: 'sec_kic_kanombe', code: 'SEC-0201', districtId: 'dis_kicukiro', name: 'Kanombe', nameRw: 'Kanombe', cellsCount: 4, primaryCrops: ['Urban Agriculture'] },
  { id: 'sec_kic_masaka', code: 'SEC-0202', districtId: 'dis_kicukiro', name: 'Masaka', nameRw: 'Masaka', cellsCount: 5, primaryCrops: ['Vegetables', 'Cassava', 'Dairy'] },
  { id: 'sec_kic_gikondo', code: 'SEC-0203', districtId: 'dis_kicukiro', name: 'Gikondo', nameRw: 'Gikondo', cellsCount: 4, primaryCrops: ['Agro-Processing & Storage'] },

  // Nyarugenge (Kigali City)
  { id: 'sec_nya_kigali', code: 'SEC-0301', districtId: 'dis_nyarugenge', name: 'Kigali', nameRw: 'Kigali', cellsCount: 4, primaryCrops: ['Horticulture', 'Poultry'] },
  { id: 'sec_nya_mageragere', code: 'SEC-0302', districtId: 'dis_nyarugenge', name: 'Mageragere', nameRw: 'Mageragere', cellsCount: 5, primaryCrops: ['Vegetables', 'Maize', 'Fruit Trees'] },

  // Musanze (Northern Province)
  { id: 'sec_mus_muhoza', code: 'SEC-1101', districtId: 'dis_musanze', name: 'Muhoza', nameRw: 'Muhoza', cellsCount: 4, primaryCrops: ['Irish Potatoes', 'Vegetables'] },
  { id: 'sec_mus_kinigi', code: 'SEC-1102', districtId: 'dis_musanze', name: 'Kinigi', nameRw: 'Kinigi', cellsCount: 5, primaryCrops: ['Irish Potatoes (Pyrethrum)', 'Climbing Beans'] },
  { id: 'sec_mus_busogo', code: 'SEC-1103', districtId: 'dis_musanze', name: 'Busogo', nameRw: 'Busogo', cellsCount: 4, primaryCrops: ['Irish Potatoes', 'Maize'] },
  { id: 'sec_mus_cyuve', code: 'SEC-1104', districtId: 'dis_musanze', name: 'Cyuve', nameRw: 'Cyuve', cellsCount: 4, primaryCrops: ['Irish Potatoes', 'Cabbages'] },

  // Huye (Southern Province)
  { id: 'sec_huy_tumba', code: 'SEC-1601', districtId: 'dis_huye', name: 'Tumba', nameRw: 'Tumba', cellsCount: 4, primaryCrops: ['Coffee', 'Bananas'] },
  { id: 'sec_huy_ngoma', code: 'SEC-1602', districtId: 'dis_huye', name: 'Ngoma', nameRw: 'Ngoma', cellsCount: 4, primaryCrops: ['Vegetables', 'Cassava'] },
  { id: 'sec_huy_mbazi', code: 'SEC-1603', districtId: 'dis_huye', name: 'Mbazi', nameRw: 'Mbazi', cellsCount: 4, primaryCrops: ['Coffee', 'Beans', 'Maize'] },
  { id: 'sec_huy_maraba', code: 'SEC-1604', districtId: 'dis_huye', name: 'Maraba', nameRw: 'Maraba', cellsCount: 4, primaryCrops: ['Specialty Arabica Coffee', 'Beans'] },

  // Rubavu (Western Province)
  { id: 'sec_rub_gisenyi', code: 'SEC-2401', districtId: 'dis_rubavu', name: 'Gisenyi', nameRw: 'Gisenyi', cellsCount: 4, primaryCrops: ['Cross-Border Trade Produce'] },
  { id: 'sec_rub_rugerero', code: 'SEC-2402', districtId: 'dis_rubavu', name: 'Rugerero', nameRw: 'Rugerero', cellsCount: 4, primaryCrops: ['Vegetables', 'Irish Potatoes'] },
  { id: 'sec_rub_nyamyumba', code: 'SEC-2403', districtId: 'dis_rubavu', name: 'Nyamyumba', nameRw: 'Nyamyumba', cellsCount: 4, primaryCrops: ['Coffee', 'Fish Fodder', 'Vegetables'] },
  { id: 'sec_rub_mudende', code: 'SEC-2404', districtId: 'dis_rubavu', name: 'Mudende', nameRw: 'Mudende', cellsCount: 4, primaryCrops: ['Irish Potatoes', 'Dairy Fodder'] },
];

// ==========================================
// 4. CELLS (UTUGARI)
// ==========================================
export const RWANDA_CELLS_LIST: CellEntity[] = [
  // Mimuri (Nyagatare)
  { id: 'cel_mim_mahoro', code: 'CEL-040101', sectorId: 'sec_nya_mimuri', name: 'Mahoro', nameRw: 'Mahoro', villagesCount: 5 },
  { id: 'cel_mim_rugari', code: 'CEL-040102', sectorId: 'sec_nya_mimuri', name: 'Rugari', nameRw: 'Rugari', villagesCount: 4 },
  { id: 'cel_mim_mimuri', code: 'CEL-040103', sectorId: 'sec_nya_mimuri', name: 'Mimuri', nameRw: 'Mimuri', villagesCount: 6 },
  { id: 'cel_mim_kagina', code: 'CEL-040104', sectorId: 'sec_nya_mimuri', name: 'Kagina', nameRw: 'Kagina', villagesCount: 4 },

  // Rukomo (Nyagatare)
  { id: 'cel_ruk_rukomo', code: 'CEL-040201', sectorId: 'sec_nya_rukomo', name: 'Rukomo', nameRw: 'Rukomo', villagesCount: 5 },
  { id: 'cel_ruk_rurenge', code: 'CEL-040202', sectorId: 'sec_nya_rukomo', name: 'Rurenge', nameRw: 'Rurenge', villagesCount: 5 },
  { id: 'cel_ruk_gashenyi', code: 'CEL-040203', sectorId: 'sec_nya_rukomo', name: 'Gashenyi', nameRw: 'Gashenyi', villagesCount: 4 },
  { id: 'cel_ruk_nyakigando', code: 'CEL-040204', sectorId: 'sec_nya_rukomo', name: 'Nyakigando', nameRw: 'Nyakigando', villagesCount: 5 },

  // Karangazi (Nyagatare)
  { id: 'cel_kar_ndama', code: 'CEL-040301', sectorId: 'sec_nya_karangazi', name: 'Ndama', nameRw: 'Ndama', villagesCount: 5 },
  { id: 'cel_kar_mbare', code: 'CEL-040302', sectorId: 'sec_nya_karangazi', name: 'Mbare', nameRw: 'Mbare', villagesCount: 4 },
  { id: 'cel_kar_rubagabaga', code: 'CEL-040303', sectorId: 'sec_nya_karangazi', name: 'Rubagabaga', nameRw: 'Rubagabaga', villagesCount: 6 },
  { id: 'cel_kar_rwenyemera', code: 'CEL-040304', sectorId: 'sec_nya_karangazi', name: 'Rwenyemera', nameRw: 'Rwenyemera', villagesCount: 5 },

  // Nyagatare (Nyagatare)
  { id: 'cel_nya_barija', code: 'CEL-040701', sectorId: 'sec_nya_nyagatare', name: 'Barija', nameRw: 'Barija', villagesCount: 6 },
  { id: 'cel_nya_nyagatare', code: 'CEL-040702', sectorId: 'sec_nya_nyagatare', name: 'Nyagatare', nameRw: 'Nyagatare', villagesCount: 7 },
  { id: 'cel_nya_ryabega', code: 'CEL-040703', sectorId: 'sec_nya_nyagatare', name: 'Ryabega', nameRw: 'Ryabega', villagesCount: 5 },
  { id: 'cel_nya_bushoga', code: 'CEL-040704', sectorId: 'sec_nya_nyagatare', name: 'Bushoga', nameRw: 'Bushoga', villagesCount: 5 },

  // Katabagemu (Nyagatare)
  { id: 'cel_kat_katabagemu', code: 'CEL-040401', sectorId: 'sec_nya_katabagemu', name: 'Katabagemu', nameRw: 'Katabagemu', villagesCount: 5 },
  { id: 'cel_kat_kaduha', code: 'CEL-040402', sectorId: 'sec_nya_katabagemu', name: 'Kaduha', nameRw: 'Kaduha', villagesCount: 4 },
  { id: 'cel_kat_bayi', code: 'CEL-040403', sectorId: 'sec_nya_katabagemu', name: 'Bayi', nameRw: 'Bayi', villagesCount: 4 },

  // Matimba (Nyagatare)
  { id: 'cel_mat_matimba', code: 'CEL-040601', sectorId: 'sec_nya_matimba', name: 'Matimba', nameRw: 'Matimba', villagesCount: 5 },
  { id: 'cel_mat_kagitumba', code: 'CEL-040602', sectorId: 'sec_nya_matimba', name: 'Kagitumba', nameRw: 'Kagitumba', villagesCount: 5 },
  { id: 'cel_mat_bwera', code: 'CEL-040603', sectorId: 'sec_nya_matimba', name: 'Bwera', nameRw: 'Bwera', villagesCount: 4 },

  // Rwempasha (Nyagatare)
  { id: 'cel_rwe_rwempasha', code: 'CEL-040501', sectorId: 'sec_nya_rwempasha', name: 'Rwempasha', nameRw: 'Rwempasha', villagesCount: 5 },
  { id: 'cel_rwe_kazaza', code: 'CEL-040502', sectorId: 'sec_nya_rwempasha', name: 'Kazaza', nameRw: 'Kazaza', villagesCount: 4 },

  // Kimironko (Gasabo)
  { id: 'cel_kim_kibagabaga', code: 'CEL-010101', sectorId: 'sec_gas_kimironko', name: 'Kibagabaga', nameRw: 'Kibagabaga', villagesCount: 6 },
  { id: 'cel_kim_nyagatovu', code: 'CEL-010102', sectorId: 'sec_gas_kimironko', name: 'Nyagatovu', nameRw: 'Nyagatovu', villagesCount: 5 },
  { id: 'cel_kim_bibare', code: 'CEL-010103', sectorId: 'sec_gas_kimironko', name: 'Bibare', nameRw: 'Bibare', villagesCount: 5 },

  // Remera (Gasabo)
  { id: 'cel_rem_rukiri1', code: 'CEL-010201', sectorId: 'sec_gas_remera', name: 'Rukiri I', nameRw: 'Rukiri I', villagesCount: 4 },
  { id: 'cel_rem_rukiri2', code: 'CEL-010202', sectorId: 'sec_gas_remera', name: 'Rukiri II', nameRw: 'Rukiri II', villagesCount: 4 },
  { id: 'cel_rem_nyabisindu', code: 'CEL-010203', sectorId: 'sec_gas_remera', name: 'Nyabisindu', nameRw: 'Nyabisindu', villagesCount: 4 },

  // Muhoza (Musanze)
  { id: 'cel_muh_ruhengeri', code: 'CEL-110101', sectorId: 'sec_mus_muhoza', name: 'Ruhengeri', nameRw: 'Ruhengeri', villagesCount: 5 },
  { id: 'cel_muh_kigombe', code: 'CEL-110102', sectorId: 'sec_mus_muhoza', name: 'Kigombe', nameRw: 'Kigombe', villagesCount: 5 },
  { id: 'cel_muh_cyabararika', code: 'CEL-110103', sectorId: 'sec_mus_muhoza', name: 'Cyabararika', nameRw: 'Cyabararika', villagesCount: 4 },

  // Kinigi (Musanze)
  { id: 'cel_kin_bisoke', code: 'CEL-110201', sectorId: 'sec_mus_kinigi', name: 'Bisoke', nameRw: 'Bisoke', villagesCount: 4 },
  { id: 'cel_kin_kaguhu', code: 'CEL-110202', sectorId: 'sec_mus_kinigi', name: 'Kaguhu', nameRw: 'Kaguhu', villagesCount: 4 },

  // Tumba (Huye)
  { id: 'cel_tum_cyarwa', code: 'CEL-160101', sectorId: 'sec_huy_tumba', name: 'Cyarwa', nameRw: 'Cyarwa', villagesCount: 4 },
  { id: 'cel_tum_mpare', code: 'CEL-160102', sectorId: 'sec_huy_tumba', name: 'Mpare', nameRw: 'Mpare', villagesCount: 4 },

  // Gisenyi (Rubavu)
  { id: 'cel_gis_kivumu', code: 'CEL-240101', sectorId: 'sec_rub_gisenyi', name: 'Kivumu', nameRw: 'Kivumu', villagesCount: 5 },
  { id: 'cel_gis_amahoro', code: 'CEL-240102', sectorId: 'sec_rub_gisenyi', name: 'Amahoro', nameRw: 'Amahoro', villagesCount: 4 },
  { id: 'cel_gis_bugoyi', code: 'CEL-240103', sectorId: 'sec_rub_gisenyi', name: 'Bugoyi', nameRw: 'Bugoyi', villagesCount: 4 },
];

// ==========================================
// 5. VILLAGES (IMIDUGUDU)
// ==========================================
export const RWANDA_VILLAGES_LIST: VillageEntity[] = [
  // Mahoro (Mimuri, Nyagatare)
  { id: 'vil_mah_01', code: 'VIL-04010101', cellId: 'cel_mim_mahoro', name: 'Rebero', nameRw: 'Rebero' },
  { id: 'vil_mah_02', code: 'VIL-04010102', cellId: 'cel_mim_mahoro', name: 'Amahoro', nameRw: 'Amahoro' },
  { id: 'vil_mah_03', code: 'VIL-04010103', cellId: 'cel_mim_mahoro', name: 'Umunezero', nameRw: 'Umunezero' },
  { id: 'vil_mah_04', code: 'VIL-04010104', cellId: 'cel_mim_mahoro', name: 'Isangano', nameRw: 'Isangano' },
  { id: 'vil_mah_05', code: 'VIL-04010105', cellId: 'cel_mim_mahoro', name: 'Kanyinya', nameRw: 'Kanyinya' },

  // Rugari (Mimuri, Nyagatare)
  { id: 'vil_rug_01', code: 'VIL-04010201', cellId: 'cel_mim_rugari', name: 'Rugari A', nameRw: 'Rugari A' },
  { id: 'vil_rug_02', code: 'VIL-04010202', cellId: 'cel_mim_rugari', name: 'Rugari B', nameRw: 'Rugari B' },
  { id: 'vil_rug_03', code: 'VIL-04010203', cellId: 'cel_mim_rugari', name: 'Gatare', nameRw: 'Gatare' },
  { id: 'vil_rug_04', code: 'VIL-04010204', cellId: 'cel_mim_rugari', name: 'Nyamirama', nameRw: 'Nyamirama' },

  // Rukomo (Rukomo, Nyagatare)
  { id: 'vil_ruk_01', code: 'VIL-04020101', cellId: 'cel_ruk_rukomo', name: 'Isangano', nameRw: 'Isangano' },
  { id: 'vil_ruk_02', code: 'VIL-04020102', cellId: 'cel_ruk_rukomo', name: 'Umurava', nameRw: 'Umurava' },
  { id: 'vil_ruk_03', code: 'VIL-04020103', cellId: 'cel_ruk_rukomo', name: 'Nyagatare Center', nameRw: 'Ihuriro rya Nyagatare' },
  { id: 'vil_ruk_04', code: 'VIL-04020104', cellId: 'cel_ruk_rukomo', name: 'Umubano', nameRw: 'Umubano' },
  { id: 'vil_ruk_05', code: 'VIL-04020105', cellId: 'cel_ruk_rukomo', name: 'Ituze', nameRw: 'Ituze' },

  // Ndama (Karangazi, Nyagatare)
  { id: 'vil_nda_01', code: 'VIL-04030101', cellId: 'cel_kar_ndama', name: 'Kibondo', nameRw: 'Kibondo' },
  { id: 'vil_nda_02', code: 'VIL-04030102', cellId: 'cel_kar_ndama', name: 'Rweru', nameRw: 'Rweru' },
  { id: 'vil_nda_03', code: 'VIL-04030103', cellId: 'cel_kar_ndama', name: 'Umutara Valley', nameRw: 'Umutara' },
  { id: 'vil_nda_04', code: 'VIL-04030104', cellId: 'cel_kar_ndama', name: 'Ruzizi', nameRw: 'Ruzizi' },

  // Barija (Nyagatare, Nyagatare)
  { id: 'vil_bar_01', code: 'VIL-04070101', cellId: 'cel_nya_barija', name: 'Barija I', nameRw: 'Barija I' },
  { id: 'vil_bar_02', code: 'VIL-04070102', cellId: 'cel_nya_barija', name: 'Barija II', nameRw: 'Barija II' },
  { id: 'vil_bar_03', code: 'VIL-04070103', cellId: 'cel_nya_barija', name: 'Nyabweshwenge', nameRw: 'Nyabweshwenge' },
  { id: 'vil_bar_04', code: 'VIL-04070104', cellId: 'cel_nya_barija', name: 'Mirama Border', nameRw: 'Mirama' },

  // Katabagemu (Katabagemu, Nyagatare)
  { id: 'vil_kat_01', code: 'VIL-04040101', cellId: 'cel_kat_katabagemu', name: 'Katabagemu A', nameRw: 'Katabagemu A' },
  { id: 'vil_kat_02', code: 'VIL-04040102', cellId: 'cel_kat_katabagemu', name: 'Katabagemu B', nameRw: 'Katabagemu B' },
  { id: 'vil_kat_03', code: 'VIL-04040103', cellId: 'cel_kat_katabagemu', name: 'Kanyinya', nameRw: 'Kanyinya' },

  // Matimba (Matimba, Nyagatare)
  { id: 'vil_mat_01', code: 'VIL-04060101', cellId: 'cel_mat_matimba', name: 'Matimba Center', nameRw: 'Matimba Hagati' },
  { id: 'vil_mat_02', code: 'VIL-04060102', cellId: 'cel_mat_matimba', name: 'Kagitumba Junction', nameRw: 'Kagitumba' },
  { id: 'vil_mat_03', code: 'VIL-04060103', cellId: 'cel_mat_matimba', name: 'Muvumba Riverbank', nameRw: 'Muvumba' },

  // Kibagabaga (Kimironko, Gasabo)
  { id: 'vil_kib_01', code: 'VIL-01010101', cellId: 'cel_kim_kibagabaga', name: 'Karuruma', nameRw: 'Karuruma' },
  { id: 'vil_kib_02', code: 'VIL-01010102', cellId: 'cel_kim_kibagabaga', name: 'Kabeza', nameRw: 'Kabeza' },
  { id: 'vil_kib_03', code: 'VIL-01010103', cellId: 'cel_kim_kibagabaga', name: 'Akagera', nameRw: 'Akagera' },
  { id: 'vil_kib_04', code: 'VIL-01010104', cellId: 'cel_kim_kibagabaga', name: 'Ubumwe', nameRw: 'Ubumwe' },

  // Ruhengeri (Muhoza, Musanze)
  { id: 'vil_ruh_01', code: 'VIL-11010101', cellId: 'cel_muh_ruhengeri', name: 'Muhoza Center', nameRw: 'Muhoza Hagati' },
  { id: 'vil_ruh_02', code: 'VIL-11010102', cellId: 'cel_muh_ruhengeri', name: 'Ubuzima', nameRw: 'Ubuzima' },
  { id: 'vil_ruh_03', code: 'VIL-11010103', cellId: 'cel_muh_ruhengeri', name: 'Umurava', nameRw: 'Umurava' },
  { id: 'vil_ruh_04', code: 'VIL-11010104', cellId: 'cel_muh_ruhengeri', name: 'Isangano', nameRw: 'Isangano' },

  // Kivumu (Gisenyi, Rubavu)
  { id: 'vil_kiv_01', code: 'VIL-24010101', cellId: 'cel_gis_kivumu', name: 'Kivumu A', nameRw: 'Kivumu A' },
  { id: 'vil_kiv_02', code: 'VIL-24010102', cellId: 'cel_gis_kivumu', name: 'Kivumu B', nameRw: 'Kivumu B' },
  { id: 'vil_kiv_03', code: 'VIL-24010103', cellId: 'cel_gis_kivumu', name: 'Umuganda', nameRw: 'Umuganda' },
  { id: 'vil_kiv_04', code: 'VIL-24010104', cellId: 'cel_gis_kivumu', name: 'Gisenyi Border', nameRw: 'Gisenyi' },
];

// ==========================================
// 6. HELPER FUNCTIONS & QUERY ACCESSORS
// ==========================================

export function getProvinces(): ProvinceEntity[] {
  return RWANDA_PROVINCES;
}

export function getProvinceById(id: string): ProvinceEntity | undefined {
  return RWANDA_PROVINCES.find((p) => p.id === id || p.code === id || p.name.toLowerCase() === id.toLowerCase());
}

export function getDistrictsByProvince(provinceId: string): DistrictEntity[] {
  return RWANDA_DISTRICTS_LIST.filter(
    (d) => d.provinceId === provinceId || d.provinceId === `prv_${provinceId}`
  );
}

export function getDistrictById(id: string): DistrictEntity | undefined {
  return RWANDA_DISTRICTS_LIST.find((d) => d.id === id || d.code === id || d.name.toLowerCase() === id.toLowerCase());
}

export function getSectorsByDistrict(districtId: string): SectorEntity[] {
  return RWANDA_SECTORS_LIST.filter(
    (s) => s.districtId === districtId || s.districtId === `dis_${districtId}`
  );
}

export function getSectorById(id: string): SectorEntity | undefined {
  return RWANDA_SECTORS_LIST.find((s) => s.id === id || s.code === id || s.name.toLowerCase() === id.toLowerCase());
}

export function getCellsBySector(sectorId: string): CellEntity[] {
  return RWANDA_CELLS_LIST.filter(
    (c) => c.sectorId === sectorId || c.sectorId === `sec_${sectorId}`
  );
}

export function getCellById(id: string): CellEntity | undefined {
  return RWANDA_CELLS_LIST.find((c) => c.id === id || c.code === id || c.name.toLowerCase() === id.toLowerCase());
}

export function getVillagesByCell(cellId: string): VillageEntity[] {
  return RWANDA_VILLAGES_LIST.filter(
    (v) => v.cellId === cellId || v.cellId === `cel_${cellId}`
  );
}

export function getVillageById(id: string): VillageEntity | undefined {
  return RWANDA_VILLAGES_LIST.find((v) => v.id === id || v.code === id || v.name.toLowerCase() === id.toLowerCase());
}

/**
 * Resolves full 5-tier hierarchy for any given node
 */
export function resolveLocationHierarchy(params: {
  provinceId?: string;
  districtId?: string;
  sectorId?: string;
  cellId?: string;
  villageId?: string;
}): Partial<LocationHierarchyNode> {
  const result: Partial<LocationHierarchyNode> = {};

  if (params.villageId) {
    const village = getVillageById(params.villageId);
    if (village) {
      result.village = village;
      const cell = getCellById(village.cellId);
      if (cell) {
        result.cell = cell;
        const sector = getSectorById(cell.sectorId);
        if (sector) {
          result.sector = sector;
          const district = getDistrictById(sector.districtId);
          if (district) {
            result.district = district;
            const province = getProvinceById(district.provinceId);
            if (province) result.province = province;
          }
        }
      }
    }
  } else if (params.cellId) {
    const cell = getCellById(params.cellId);
    if (cell) {
      result.cell = cell;
      const sector = getSectorById(cell.sectorId);
      if (sector) {
        result.sector = sector;
        const district = getDistrictById(sector.districtId);
        if (district) {
          result.district = district;
          const province = getProvinceById(district.provinceId);
          if (province) result.province = province;
        }
      }
    }
  } else if (params.sectorId) {
    const sector = getSectorById(params.sectorId);
    if (sector) {
      result.sector = sector;
      const district = getDistrictById(sector.districtId);
      if (district) {
        result.district = district;
        const province = getProvinceById(district.provinceId);
        if (province) result.province = province;
      }
    }
  } else if (params.districtId) {
    const district = getDistrictById(params.districtId);
    if (district) {
      result.district = district;
      const province = getProvinceById(district.provinceId);
      if (province) result.province = province;
    }
  } else if (params.provinceId) {
    const province = getProvinceById(params.provinceId);
    if (province) result.province = province;
  }

  return result;
}

/**
 * Searches across all administrative location tiers
 */
export interface LocationSearchResult {
  level: 'province' | 'district' | 'sector' | 'cell' | 'village';
  id: string;
  code: string;
  name: string;
  nameRw: string;
  hierarchyPath: string;
  matchedEntity: ProvinceEntity | DistrictEntity | SectorEntity | CellEntity | VillageEntity;
}

export function searchLocations(query: string, limit = 10): LocationSearchResult[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const results: LocationSearchResult[] = [];

  // 1. Search Villages
  for (const v of RWANDA_VILLAGES_LIST) {
    if (v.name.toLowerCase().includes(q) || v.nameRw.toLowerCase().includes(q) || v.code.toLowerCase().includes(q)) {
      const cell = getCellById(v.cellId);
      const sector = cell ? getSectorById(cell.sectorId) : null;
      const district = sector ? getDistrictById(sector.districtId) : null;
      const province = district ? getProvinceById(district.provinceId) : null;
      const path = [v.name, cell?.name, sector?.name, district?.name, province?.name].filter(Boolean).join(' › ');
      results.push({
        level: 'village',
        id: v.id,
        code: v.code,
        name: v.name,
        nameRw: v.nameRw,
        hierarchyPath: path,
        matchedEntity: v,
      });
      if (results.length >= limit) return results;
    }
  }

  // 2. Search Cells
  for (const c of RWANDA_CELLS_LIST) {
    if (c.name.toLowerCase().includes(q) || c.nameRw.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) {
      const sector = getSectorById(c.sectorId);
      const district = sector ? getDistrictById(sector.districtId) : null;
      const province = district ? getProvinceById(district.provinceId) : null;
      const path = [c.name, sector?.name, district?.name, province?.name].filter(Boolean).join(' › ');
      results.push({
        level: 'cell',
        id: c.id,
        code: c.code,
        name: c.name,
        nameRw: c.nameRw,
        hierarchyPath: path,
        matchedEntity: c,
      });
      if (results.length >= limit) return results;
    }
  }

  // 3. Search Sectors
  for (const s of RWANDA_SECTORS_LIST) {
    if (s.name.toLowerCase().includes(q) || s.nameRw.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)) {
      const district = getDistrictById(s.districtId);
      const province = district ? getProvinceById(district.provinceId) : null;
      const path = [s.name, district?.name, province?.name].filter(Boolean).join(' › ');
      results.push({
        level: 'sector',
        id: s.id,
        code: s.code,
        name: s.name,
        nameRw: s.nameRw,
        hierarchyPath: path,
        matchedEntity: s,
      });
      if (results.length >= limit) return results;
    }
  }

  // 4. Search Districts
  for (const d of RWANDA_DISTRICTS_LIST) {
    if (d.name.toLowerCase().includes(q) || d.nameRw.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)) {
      const province = getProvinceById(d.provinceId);
      const path = [d.name, province?.name].filter(Boolean).join(' › ');
      results.push({
        level: 'district',
        id: d.id,
        code: d.code,
        name: d.name,
        nameRw: d.nameRw,
        hierarchyPath: path,
        matchedEntity: d,
      });
      if (results.length >= limit) return results;
    }
  }

  // 5. Search Provinces
  for (const p of RWANDA_PROVINCES) {
    if (p.name.toLowerCase().includes(q) || p.nameRw.toLowerCase().includes(q) || p.code.toLowerCase().includes(q)) {
      results.push({
        level: 'province',
        id: p.id,
        code: p.code,
        name: p.name,
        nameRw: p.nameRw,
        hierarchyPath: p.name,
        matchedEntity: p,
      });
      if (results.length >= limit) return results;
    }
  }

  return results;
}

/**
 * Validates integrity of parent-child relationships and checks for orphan nodes or duplicate codes
 */
export function validateLocationHierarchy(): LocationImportReport {
  const warnings: string[] = [];
  let orphansCount = 0;
  let duplicatesCount = 0;

  // Check District -> Province
  const provinceIds = new Set(RWANDA_PROVINCES.map((p) => p.id));
  const districtCodes = new Set<string>();
  for (const d of RWANDA_DISTRICTS_LIST) {
    if (!provinceIds.has(d.provinceId)) {
      warnings.push(`District ${d.name} (${d.code}) references missing Province ID: ${d.provinceId}`);
      orphansCount++;
    }
    if (districtCodes.has(d.code)) {
      warnings.push(`Duplicate District Code detected: ${d.code}`);
      duplicatesCount++;
    }
    districtCodes.add(d.code);
  }

  // Check Sector -> District
  const districtIds = new Set(RWANDA_DISTRICTS_LIST.map((d) => d.id));
  const sectorCodes = new Set<string>();
  for (const s of RWANDA_SECTORS_LIST) {
    if (!districtIds.has(s.districtId)) {
      warnings.push(`Sector ${s.name} (${s.code}) references missing District ID: ${s.districtId}`);
      orphansCount++;
    }
    if (sectorCodes.has(s.code)) {
      warnings.push(`Duplicate Sector Code detected: ${s.code}`);
      duplicatesCount++;
    }
    sectorCodes.add(s.code);
  }

  // Check Cell -> Sector
  const sectorIds = new Set(RWANDA_SECTORS_LIST.map((s) => s.id));
  const cellCodes = new Set<string>();
  for (const c of RWANDA_CELLS_LIST) {
    if (!sectorIds.has(c.sectorId)) {
      warnings.push(`Cell ${c.name} (${c.code}) references missing Sector ID: ${c.sectorId}`);
      orphansCount++;
    }
    if (cellCodes.has(c.code)) {
      warnings.push(`Duplicate Cell Code detected: ${c.code}`);
      duplicatesCount++;
    }
    cellCodes.add(c.code);
  }

  // Check Village -> Cell
  const cellIds = new Set(RWANDA_CELLS_LIST.map((c) => c.id));
  const villageCodes = new Set<string>();
  for (const v of RWANDA_VILLAGES_LIST) {
    if (!cellIds.has(v.cellId)) {
      warnings.push(`Village ${v.name} (${v.code}) references missing Cell ID: ${v.cellId}`);
      orphansCount++;
    }
    if (villageCodes.has(v.code)) {
      warnings.push(`Duplicate Village Code detected: ${v.code}`);
      duplicatesCount++;
    }
    villageCodes.add(v.code);
  }

  return {
    version: '2026.11-official-rab-nisr',
    importedAt: new Date().toISOString(),
    totalProvinces: RWANDA_PROVINCES.length,
    totalDistricts: RWANDA_DISTRICTS_LIST.length,
    totalSectors: RWANDA_SECTORS_LIST.length,
    totalCells: RWANDA_CELLS_LIST.length,
    totalVillages: RWANDA_VILLAGES_LIST.length,
    duplicatesRemoved: duplicatesCount,
    orphansDetected: orphansCount,
    validationStatus: warnings.length === 0 ? 'valid' : 'has_warnings',
    warnings,
  };
}
