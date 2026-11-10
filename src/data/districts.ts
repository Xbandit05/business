import type { NyagatareSector } from '../types/index.ts';

export interface SectorDetail {
  name: string;
  primaryCrops: string[];
  cooperatives: string[];
  waterAccess: string;
}

export interface DistrictInfo {
  name: string;
  nameRw: string;
  province: 'Eastern' | 'Northern' | 'Southern' | 'Western' | 'Kigali City';
  provinceRw: 'Iburasirazuba' | 'Amajyaruguru' | 'Amajyepfo' | 'Iburengerazuba' | 'Umujyi wa Kigali';
  zoneSpecialty: string;
  zoneSpecialtyRw: string;
  keyCrops: string[];
  sectors: SectorDetail[];
}

export const RWANDA_DISTRICTS: DistrictInfo[] = [
  // ==================== EASTERN PROVINCE (IBURASIRAZUBA) ====================
  {
    name: 'Nyagatare',
    nameRw: 'Nyagatare',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    zoneSpecialty: 'Eastern Savannah: Large-scale grain belts, commercial maize, beans, marshland rice, and dairy cattle.',
    zoneSpecialtyRw: 'Ubutayu bw\'Uburasirazuba: Ibigori byinshi, ibishyimbo, umuceri w\'i Muvumba, n\'inka z\'amata.',
    keyCrops: ['Maize', 'Beans', 'Rice', 'Dairy Fodder', 'Cassava'],
    sectors: [
      {
        name: 'Mimuri',
        primaryCrops: ['Maize', 'Climbing Beans', 'Soya Beans'],
        cooperatives: ['COOPAMA Mimuri Maize Union', 'Abahuje Beans Group'],
        waterAccess: 'Muvumba River tributary irrigation & seasonal rainfed',
      },
      {
        name: 'Rukomo',
        primaryCrops: ['Rice', 'Bush Beans', 'Horticultural Vegetables'],
        cooperatives: ['CORIMU Rice Farmers Co-op', 'Dukundumurimo Rukomo'],
        waterAccess: 'Muvumba Marshland Irrigation Canal Scheme',
      },
      {
        name: 'Karangazi',
        primaryCrops: ['Maize', 'Dairy Fodder (Napier & Rhodes grass)', 'Cassava'],
        cooperatives: ['Karangazi Dairy & Grains Federation'],
        waterAccess: 'Valley dams and borehole networks',
      },
      {
        name: 'Katabagemu',
        primaryCrops: ['Maize', 'Cassava', 'Sorghum'],
        cooperatives: ['Katabagemu Smallholder Growers'],
        waterAccess: 'Rainfed with smallholder water retention trenches',
      },
      {
        name: 'Rwempasha',
        primaryCrops: ['Maize', 'Red Kidney Beans', 'Groundnuts'],
        cooperatives: ['Rwempasha Border Farmers Co-op'],
        waterAccess: 'Borehole-fed communal water points',
      },
      {
        name: 'Matimba',
        primaryCrops: ['Rice', 'Maize', 'Tomatoes'],
        cooperatives: ['Kagitumba & Matimba Irrigated Farmers'],
        waterAccess: 'Kagitumba/Muvumba convergence perimeter',
      },
      {
        name: 'Nyagatare',
        primaryCrops: ['Urban Market Vegetables', 'Maize', 'Beans'],
        cooperatives: ['Nyagatare Central Agro-Hub'],
        waterAccess: 'Municipal irrigation and perimeter canals',
      },
      {
        name: 'Rwimiyaga',
        primaryCrops: ['Pasture Fodder', 'Maize', 'Cassava'],
        cooperatives: ['Rwimiyaga Livestock & Grain Union'],
        waterAccess: 'Earth dams and seasonal streams',
      },
      {
        name: 'Musheri',
        primaryCrops: ['Beans', 'Maize', 'Sweet Potatoes'],
        cooperatives: ['Musheri Farmers Union'],
        waterAccess: 'Rainfed high-terrace conservation',
      },
      {
        name: 'Tabagwe',
        primaryCrops: ['Climbing Beans', 'Maize', 'Irish Potatoes'],
        cooperatives: ['Tabagwe Highland Growers'],
        waterAccess: 'High altitude spring channels',
      },
      {
        name: 'Kiyombe',
        primaryCrops: ['Beans', 'Maize', 'Sorghum'],
        cooperatives: ['Kiyombe Agricultural Producers'],
        waterAccess: 'Rainfed and contour terraces',
      },
      {
        name: 'Gatunda',
        primaryCrops: ['Maize', 'Cassava', 'Vegetables'],
        cooperatives: ['Gatunda Farmers Collective'],
        waterAccess: 'Spring water channels',
      },
      {
        name: 'Mukama',
        primaryCrops: ['Maize', 'Soya Beans', 'Beans'],
        cooperatives: ['Mukama Grain Producers'],
        waterAccess: 'Valley floor catchments',
      },
      {
        name: 'Karama',
        primaryCrops: ['Bush Beans', 'Maize', 'Sweet Potatoes'],
        cooperatives: ['Karama Mixed Crop Farmers'],
        waterAccess: 'Seasonal rainfall and earth trenches',
      },
    ],
  },
  {
    name: 'Gatsibo',
    nameRw: 'Gatsibo',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    zoneSpecialty: 'Savannah and hillside farming: High-yield hybrid maize, yellow beans, bananas, and coffee wash stations.',
    zoneSpecialtyRw: 'Umusozi n\'ikibaya: Ibigori bitanga umusaruro mwinshi, ibishyimbo by\'umuhondo, ibitoki, n\'ikawa.',
    keyCrops: ['Maize', 'Yellow Beans', 'Bananas', 'Coffee', 'Sorghum'],
    sectors: [
      {
        name: 'Kabarore',
        primaryCrops: ['Hybrid Maize', 'Yellow Beans', 'Bananas'],
        cooperatives: ['Kabarore Agro-Producers Union'],
        waterAccess: 'Spring fed and gravity-flow irrigation',
      },
      {
        name: 'Kiziguro',
        primaryCrops: ['Cooking Bananas', 'Maize', 'Coffee'],
        cooperatives: ['Kiziguro Coffee & Grain Federation'],
        waterAccess: 'Terraced rain retention and hillside water reservoirs',
      },
      {
        name: 'Kiramuruzi',
        primaryCrops: ['Maize', 'Bush Beans', 'Soya'],
        cooperatives: ['Kiramuruzi Grain Aggregation Center'],
        waterAccess: 'Community borehole solar pumps',
      },
      {
        name: 'Muhura',
        primaryCrops: ['Coffee', 'Maize', 'Beans'],
        cooperatives: ['Muhura Quality Coffee Washing Station'],
        waterAccess: 'Mountain spring catchments',
      },
      {
        name: 'Murambi',
        primaryCrops: ['Maize', 'Vegetables', 'Cassava'],
        cooperatives: ['Murambi Smallholder Association'],
        waterAccess: 'Valley drainage channels',
      },
      {
        name: 'Ngarama',
        primaryCrops: ['Beans', 'Sorghum', 'Maize'],
        cooperatives: ['Ngarama Producers Co-op'],
        waterAccess: 'Seasonal rainfed farming',
      },
      {
        name: 'Nyagihanga',
        primaryCrops: ['Maize', 'Groundnuts', 'Cassava'],
        cooperatives: ['Nyagihanga Seed Multiplication Co-op'],
        waterAccess: 'Rain catchment terraces',
      },
      {
        name: 'Remera',
        primaryCrops: ['Coffee', 'Bananas', 'Beans'],
        cooperatives: ['Remera Farmers Union'],
        waterAccess: 'Gravity pipelines',
      },
      {
        name: 'Rugarama',
        primaryCrops: ['Maize', 'Vegetables', 'Beans'],
        cooperatives: ['Rugarama Commercial Growers'],
        waterAccess: 'Marshland irrigation canals',
      },
      {
        name: 'Rwimbogo',
        primaryCrops: ['Maize', 'Pasture Grass', 'Sorghum'],
        cooperatives: ['Rwimbogo Livestock & Crops Co-op'],
        waterAccess: 'Valley dams and ponds',
      },
    ],
  },
  {
    name: 'Kayonza',
    nameRw: 'Kayonza',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    zoneSpecialty: 'Drought-resilient agriculture: Cassava, soya beans, commercial horticulture around Lake Muhazi, and livestock.',
    zoneSpecialtyRw: 'Ubuhinzi bwo kwihanganira izuba: Imyumbati, soya, imboga n\'imbuto byo ku Kiyaga cya Muhazi.',
    keyCrops: ['Cassava', 'Soya Beans', 'Maize', 'Bananas', 'Dairy'],
    sectors: [
      {
        name: 'Mukarange',
        primaryCrops: ['Cassava', 'Maize', 'Horticultural Tomatoes'],
        cooperatives: ['Mukarange Central Agri-Market Union'],
        waterAccess: 'Lake Muhazi pump irrigation',
      },
      {
        name: 'Gahini',
        primaryCrops: ['Vegetables', 'Cooking Bananas', 'Beans'],
        cooperatives: ['Gahini Lakeshore Farmers'],
        waterAccess: 'Solar pumping from Lake Muhazi',
      },
      {
        name: 'Kabarondo',
        primaryCrops: ['Commercial Bananas', 'Soya Beans', 'Maize'],
        cooperatives: ['Kabarondo Banana & Grain Trading Co-op'],
        waterAccess: 'Marshland perimeter channels',
      },
      {
        name: 'Murama',
        primaryCrops: ['Cassava Flour Processing', 'Sorghum', 'Maize'],
        cooperatives: ['Murama Cassava Value Chain Group'],
        waterAccess: 'Deep drilled wells',
      },
      {
        name: 'Murundi',
        primaryCrops: ['Maize', 'Dairy Fodder', 'Bush Beans'],
        cooperatives: ['Murundi Livestock Breeders Co-op'],
        waterAccess: 'Earth retention dams',
      },
      {
        name: 'Mwiri',
        primaryCrops: ['Cassava', 'Maize', 'Groundnuts'],
        cooperatives: ['Mwiri Resilient Farmers Co-op'],
        waterAccess: 'Rainfed with contour terraces',
      },
      {
        name: 'Ndego',
        primaryCrops: ['Watermelon', 'Tomatoes', 'Onions', 'Maize'],
        cooperatives: ['Ndego Irrigated Farmers Scheme'],
        waterAccess: 'Akagera / Lake Ihema perimeter irrigation',
      },
      {
        name: 'Rukara',
        primaryCrops: ['Maize', 'Beans', 'Sweet Potatoes'],
        cooperatives: ['Rukara Agro-Union'],
        waterAccess: 'Valley spring drainage',
      },
    ],
  },
  {
    name: 'Bugesera',
    nameRw: 'Bugesera',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    zoneSpecialty: 'Irrigated lake basins: Cassava processing, commercial French beans, chillies for export, and marshland paddy rice.',
    zoneSpecialtyRw: 'Ibibaya by\'ibiyaga bitererwaho umuti n\'amazi: Imyumbati, imiteja yo kohereza hanze, urusenda, n\'umuceri.',
    keyCrops: ['Cassava', 'French Beans', 'Rice', 'Chillies', 'Watermelon'],
    sectors: [
      {
        name: 'Nyamata',
        primaryCrops: ['Export French Beans', 'Chillies', 'Sweet Potatoes'],
        cooperatives: ['Nyamata Horticultural Exporters Union'],
        waterAccess: 'Lake Cyohoha solar drip irrigation',
      },
      {
        name: 'Gashora',
        primaryCrops: ['Paddy Rice', 'Watermelon', 'Maize'],
        cooperatives: ['Gashora Marshland Rice Farmers'],
        waterAccess: 'Lake Mirayi pumped irrigation perimeter',
      },
      {
        name: 'Mayange',
        primaryCrops: ['Cassava (NAROCAS 1)', 'Sorghum', 'Groundnuts'],
        cooperatives: ['Mayange Cassava Processing Millennium Co-op'],
        waterAccess: 'Community rainwater harvesting reservoirs',
      },
      {
        name: 'Rilima',
        primaryCrops: ['Vegetables', 'Cassava', 'Fish farming fodder'],
        cooperatives: ['Rilima Lakeshore Co-op'],
        waterAccess: 'Lake Mugesera pump access',
      },
      {
        name: 'Ruhuha',
        primaryCrops: ['Maize', 'Beans', 'Pineapples'],
        cooperatives: ['Ruhuha Fruit & Grain Producers'],
        waterAccess: 'Borehole network',
      },
      {
        name: 'Juru',
        primaryCrops: ['Sweet Potatoes', 'Cassava', 'Beans'],
        cooperatives: ['Juru Farmers Group'],
        waterAccess: 'Rainfed contour trenches',
      },
    ],
  },
  {
    name: 'Kirehe',
    nameRw: 'Kirehe',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    zoneSpecialty: 'Nasho solar irrigation hub: Premium export bananas, certified soya, seed maize, and groundnuts.',
    zoneSpecialtyRw: 'Icyanya cyo kuhira cya Nasho: Ibitoki by\'umwimerere, soya yemejwe, ibigori by\'imbuto, n\'ubunyobwa.',
    keyCrops: ['Bananas', 'Soya', 'Maize', 'Groundnuts', 'Beans'],
    sectors: [
      {
        name: 'Nasho',
        primaryCrops: ['Center Pivot Irrigated Maize', 'Soya Beans'],
        cooperatives: ['Nasho Solar Center Pivot Irrigation Co-op'],
        waterAccess: 'Nasho 1,200 Ha solar center-pivot system',
      },
      {
        name: 'Gatore',
        primaryCrops: ['Commercial Bananas (FIA 17)', 'Coffee', 'Beans'],
        cooperatives: ['Gatore Banana Producers & Exporters'],
        waterAccess: 'Hillside spring conduits',
      },
      {
        name: 'Kirehe',
        primaryCrops: ['Yellow Maize', 'Beans', 'Tomatoes'],
        cooperatives: ['Kirehe Central Grain Aggregators'],
        waterAccess: 'Valley marshland irrigation',
      },
      {
        name: 'Mahama',
        primaryCrops: ['Cassava', 'Sorghum', 'Sweet Potatoes'],
        cooperatives: ['Mahama Valley Farmers'],
        waterAccess: 'Akagera river basin catchment',
      },
      {
        name: 'Mpanga',
        primaryCrops: ['Irrigated Vegetables', 'Maize', 'Watermelon'],
        cooperatives: ['Mpanga Irrigation Scheme Farmers'],
        waterAccess: 'Mpanga-Cyambwe pump station',
      },
    ],
  },
  {
    name: 'Rwamagana',
    nameRw: 'Rwamagana',
    province: 'Eastern',
    provinceRw: 'Iburasirazuba',
    zoneSpecialty: 'Agro-processing hub: Specialty coffee, cooking bananas, greenhouse bell peppers, and grain warehousing.',
    zoneSpecialtyRw: 'Ihuzanganda ry\'ubuhinzi: Ikawa y\'akarusho, ibitoki byo guteka, puwavuro zo muri greenhouse, n\'ububiko bw\'ibinyampeke.',
    keyCrops: ['Coffee', 'Bananas', 'Greenhouse Vegetables', 'Maize', 'Beans'],
    sectors: [
      {
        name: 'Kigabiro',
        primaryCrops: ['Greenhouse Sweet Peppers', 'Tomatoes', 'Coffee'],
        cooperatives: ['Rwamagana Horticulture Federation'],
        waterAccess: 'Lakeside solar booster pumps',
      },
      {
        name: 'Gishari',
        primaryCrops: ['Specialty Arabica Coffee', 'Bananas', 'Beans'],
        cooperatives: ['Gishari Coffee Cooperative Society'],
        waterAccess: 'Mountain spring catchments',
      },
      {
        name: 'Muhazi',
        primaryCrops: ['Lakefront Vegetables', 'Bananas', 'Maize'],
        cooperatives: ['Muhazi Lakeside Agro-Tourism & Growers'],
        waterAccess: 'Lake Muhazi direct pipeline',
      },
      {
        name: 'Karenge',
        primaryCrops: ['Cooking Bananas', 'Cassava', 'Beans'],
        cooperatives: ['Karenge Banana Farmers Union'],
        waterAccess: 'Valley catchment dams',
      },
    ],
  },

  // ==================== NORTHERN PROVINCE (AMAJYARUGURU) ====================
  {
    name: 'Musanze',
    nameRw: 'Musanze',
    province: 'Northern',
    provinceRw: 'Amajyaruguru',
    zoneSpecialty: 'Volcanic Highland Soils: High-grade Irish potatoes (Kinigi & Kuruseke), pyrethrum, climbing beans, and cold-climate brassicas.',
    zoneSpecialtyRw: 'Ubutaka bw\'Ibirunga: Ibirayi bya Kinigi na Kuruseke, ibireti, ibishyimbo by\'imishingiriro, na shukabu.',
    keyCrops: ['Irish Potatoes', 'Climbing Beans', 'Pyrethrum', 'Cabbages', 'Wheat'],
    sectors: [
      {
        name: 'Kinigi',
        primaryCrops: ['Irish Potatoes (Kinigi Variety)', 'Pyrethrum'],
        cooperatives: ['COOPAC Kinigi Potato Seed Producers', 'SOPYRWA Pyrethrum Union'],
        waterAccess: 'Volcanic mountain runoff channels & year-round rain',
      },
      {
        name: 'Muhoza',
        primaryCrops: ['Fresh Market Cabbages', 'Carrots', 'Irish Potatoes'],
        cooperatives: ['Musanze Urban Agro-Distribution Center'],
        waterAccess: 'Municipal gravity pipelines',
      },
      {
        name: 'Cyuve',
        primaryCrops: ['Irish Potatoes (Kuruseke)', 'Climbing Beans', 'Wheat'],
        cooperatives: ['Cyuve Seed Multiplication Union'],
        waterAccess: 'Perennial volcanic springs',
      },
      {
        name: 'Gacaca',
        primaryCrops: ['Climbing Beans', 'Maize (Highland)', 'Irish Potatoes'],
        cooperatives: ['Gacaca Highland Farmers Co-op'],
        waterAccess: 'Terraced rain retention',
      },
      {
        name: 'Nyange',
        primaryCrops: ['Irish Potatoes', 'Pyrethrum', 'Peas'],
        cooperatives: ['Nyange Volcanic Soils Growers'],
        waterAccess: 'Volcanic infiltration springs',
      },
      {
        name: 'Shingiro',
        primaryCrops: ['Irish Potatoes', 'Climbing Beans', 'Vegetables'],
        cooperatives: ['Shingiro Potato Producers Co-op'],
        waterAccess: 'High altitude spring channels',
      },
    ],
  },
  {
    name: 'Gicumbi',
    nameRw: 'Gicumbi',
    province: 'Northern',
    provinceRw: 'Amajyaruguru',
    zoneSpecialty: 'High-altitude ridges: Premium orthodox tea plantations, high-yield dairy cows, wheat, and peas.',
    zoneSpecialtyRw: 'Imisozi miremire: Icyayi cyiza cyane, inka zitanga amata menshi (Gicumbi Dairy), ingano, n\'amashaza.',
    keyCrops: ['Tea', 'Dairy Milk', 'Wheat', 'Peas', 'Irish Potatoes'],
    sectors: [
      {
        name: 'Byumba',
        primaryCrops: ['Commercial Dairy Fodder', 'Vegetables', 'Irish Potatoes'],
        cooperatives: ['Gicumbi Dairy Farmers Cooperative Union'],
        waterAccess: 'High altitude mountain springs',
      },
      {
        name: 'Miyove',
        primaryCrops: ['Highland Tea', 'Irish Potatoes', 'Beans'],
        cooperatives: ['Miyove Tea Smallholders Co-op'],
        waterAccess: 'Abundant high-altitude rainfall',
      },
      {
        name: 'Manyagiro',
        primaryCrops: ['Wheat', 'Peas', 'Climbing Beans'],
        cooperatives: ['Manyagiro Grain Growers'],
        waterAccess: 'Terraced runoff canals',
      },
      {
        name: 'Rukomo (Gicumbi)',
        primaryCrops: ['Vegetables', 'Maize', 'Dairy Milk'],
        cooperatives: ['Northern Rukomo Farmers Association'],
        waterAccess: 'Perennial valley springs',
      },
    ],
  },
  {
    name: 'Burera',
    nameRw: 'Burera',
    province: 'Northern',
    provinceRw: 'Amajyaruguru',
    zoneSpecialty: 'Twin lakes & mountain slopes: Clean Irish potato seed varieties, climbing beans, wheat, and freshwater tilapia aquaculture.',
    zoneSpecialtyRw: 'Ibiyaga by\'impanga n\'imisozi: Imbuto z\'ibirayi zifite isuku, ibishyimbo by\'imishingiriro, ingano, n\'ubworozi bw\'amafi.',
    keyCrops: ['Irish Potatoes', 'Wheat', 'Climbing Beans', 'Tilapia Fish', 'Maize'],
    sectors: [
      {
        name: 'Cyanika',
        primaryCrops: ['Irish Potatoes (Victoria)', 'Climbing Beans'],
        cooperatives: ['Cyanika Cross-Border Produce Union'],
        waterAccess: 'Lake Burera perimeter springs',
      },
      {
        name: 'Butaro',
        primaryCrops: ['Irish Potatoes', 'Wheat', 'Peas'],
        cooperatives: ['Butaro Farmers Collective'],
        waterAccess: 'Gravity spring scheme',
      },
      {
        name: 'Ruhunde',
        primaryCrops: ['Climbing Beans', 'Irish Potatoes', 'Maize'],
        cooperatives: ['Ruhunde Producers Co-op'],
        waterAccess: 'Contour drainage',
      },
    ],
  },

  // ==================== SOUTHERN PROVINCE (AMAJYEPFO) ====================
  {
    name: 'Huye',
    nameRw: 'Huye',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    zoneSpecialty: 'Specialty coffee & marshland rice: Award-winning Maraba specialty coffee, marshland rice schemes, and sweet potato roots.',
    zoneSpecialtyRw: 'Ikawa y\'akarusho n\'umuceri wo mu gishanga: Ikawa yatsindiye ibihembo ya Maraba, umuceri wo mu bishanga, n\'ibijumba.',
    keyCrops: ['Specialty Coffee', 'Rice', 'Sweet Potatoes', 'Soya Beans', 'Cassava'],
    sectors: [
      {
        name: 'Maraba',
        primaryCrops: ['Maraba Bourbon Specialty Coffee', 'Bananas', 'Beans'],
        cooperatives: ['Abahuzamugambi Maraba Coffee Cooperative'],
        waterAccess: 'Mountain spring washing stations',
      },
      {
        name: 'Ngoma (Huye)',
        primaryCrops: ['Valley Marshland Rice', 'Vegetables', 'Maize'],
        cooperatives: ['Huye Marshland Rice Growers Union'],
        waterAccess: 'Rwasave marshland irrigation grid',
      },
      {
        name: 'Mbazi',
        primaryCrops: ['Sweet Potatoes (Orange-fleshed)', 'Beans', 'Coffee'],
        cooperatives: ['Mbazi Root Crop Growers Association'],
        waterAccess: 'Rainfed contour terraces',
      },
      {
        name: 'Tumba (Huye)',
        primaryCrops: ['Urban Horticulture', 'Poultry & Dairy Fodder'],
        cooperatives: ['Tumba Urban Farming Network'],
        waterAccess: 'Municipal water and valley ponds',
      },
    ],
  },
  {
    name: 'Muhanga',
    nameRw: 'Muhanga',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    zoneSpecialty: 'Central agricultural trading crossroads: Cassava flour processing, sweet potato vine propagation, and Arabica coffee.',
    zoneSpecialtyRw: 'Ihuriro ry\'ubucuruzi bw\'ubuhinzi: Isubiranyamakuru ry\'imyumbati (ifuni), ingemwe z\'ibijumba, n\'ikawa ya Arabica.',
    keyCrops: ['Cassava', 'Sweet Potatoes', 'Coffee', 'Beans', 'Maize'],
    sectors: [
      {
        name: 'Nyamabuye',
        primaryCrops: ['Processed Cassava Flour', 'Grain Trading', 'Vegetables'],
        cooperatives: ['Muhanga Regional Commodity Aggregation Union'],
        waterAccess: 'Valley floor water collectors',
      },
      {
        name: 'Shyogwe',
        primaryCrops: ['Specialty Coffee', 'Beans', 'Bananas'],
        cooperatives: ['Shyogwe Coffee Farmers Cooperative'],
        waterAccess: 'Perennial hillside springs',
      },
      {
        name: 'Cyeza',
        primaryCrops: ['Sweet Potatoes', 'Cassava', 'Maize'],
        cooperatives: ['Cyeza Producers Association'],
        waterAccess: 'Terrace trenches',
      },
    ],
  },
  {
    name: 'Kamonyi',
    nameRw: 'Kamonyi',
    province: 'Southern',
    provinceRw: 'Amajyepfo',
    zoneSpecialty: 'Nyabarongo basin fertility: Commercial sugar cane, passion fruit, fresh vegetables supplying Kigali city, and dairy.',
    zoneSpecialtyRw: 'Icyanya cy\'Uruzi rwa Nyabarongo: Ibikara, marakuja, imboga zihaza Umujyi wa Kigali, n\'amata.',
    keyCrops: ['Vegetables', 'Sugar Cane', 'Passion Fruit', 'Maize', 'Beans'],
    sectors: [
      {
        name: 'Runda',
        primaryCrops: ['Fresh Market Tomatoes', 'Amaranth (Dodo)', 'Cabbages'],
        cooperatives: ['Runda Fresh Produce Supplies for Kigali'],
        waterAccess: 'Nyabarongo alluvial river plain irrigation',
      },
      {
        name: 'Gacurabwenge',
        primaryCrops: ['Passion Fruit (Marakuja)', 'Coffee', 'Beans'],
        cooperatives: ['Gacurabwenge Horticulture Co-op'],
        waterAccess: 'Spring-fed gravity pipes',
      },
      {
        name: 'Rukoma (Kamonyi)',
        primaryCrops: ['Sweet Potatoes', 'Maize', 'Cassava'],
        cooperatives: ['Rukoma Producers Federation'],
        waterAccess: 'Rain catchment channels',
      },
    ],
  },

  // ==================== WESTERN PROVINCE (IBURENGERAZUBA) ====================
  {
    name: 'Rubavu',
    nameRw: 'Rubavu',
    province: 'Western',
    provinceRw: 'Iburengerazuba',
    zoneSpecialty: 'Volcanic lakeside microclimate: Export vegetables to Goma (DRC), Irish potatoes, Arabica washing stations, and passion fruit.',
    zoneSpecialtyRw: 'Ikirere cy\'Ikiyaga cya Kivu n\'Ibirunga: Imboga zoherezwa i Goma, ibirayi, ikawa yujuje ubuziranenge, na marakuja.',
    keyCrops: ['Irish Potatoes', 'Cabbages', 'Carrots', 'Coffee', 'Passion Fruit'],
    sectors: [
      {
        name: 'Gisenyi',
        primaryCrops: ['Fresh Market Carrots & Onions', 'Cabbages', 'Irish Potatoes'],
        cooperatives: ['Rubavu Cross-Border Farmers & Traders Union'],
        waterAccess: 'Lake Kivu perimeter pumping and volcanic springs',
      },
      {
        name: 'Mudende',
        primaryCrops: ['Irish Potatoes (Cruza & Kinigi)', 'Vegetables', 'Pyrethrum'],
        cooperatives: ['Mudende Highland Potato Association'],
        waterAccess: 'High altitude volcanic springs',
      },
      {
        name: 'Nyamyumba',
        primaryCrops: ['Lakeshore Arabica Coffee', 'Bananas', 'Beans'],
        cooperatives: ['Nyamyumba Coffee Washing Station Co-op'],
        waterAccess: 'Lake Kivu spring runoffs',
      },
      {
        name: 'Kanama',
        primaryCrops: ['Irish Potatoes', 'Vegetables', 'Climbing Beans'],
        cooperatives: ['Kanama Commercial Growers'],
        waterAccess: 'Sebeya river catchment',
      },
    ],
  },
  {
    name: 'Rusizi',
    nameRw: 'Rusizi',
    province: 'Western',
    provinceRw: 'Iburengerazuba',
    zoneSpecialty: 'Bugarama marshland: High-tonnage paddy rice, tropical export fruits (mangoes, avocadoes), and Lake Kivu fisheries.',
    zoneSpecialtyRw: 'Igishanga cya Bugarama: Umuceri mwinshi cyane, imbuto zo mu bushyuhe (imyembe, avoka), n\'isambaza.',
    keyCrops: ['Paddy Rice', 'Avocado', 'Mangoes', 'Coffee', 'Cassava'],
    sectors: [
      {
        name: 'Bugarama',
        primaryCrops: ['Bugarama High-Yield Paddy Rice', 'Maize'],
        cooperatives: ['COOPRIRU Bugarama Rice Farmers Union'],
        waterAccess: 'Rubyiro and Ruhwa river gravity canal network',
      },
      {
        name: 'Kamembe',
        primaryCrops: ['Export Hass Avocado', 'Specialty Coffee', 'Bananas'],
        cooperatives: ['Rusizi Horticultural Exporters Federation'],
        waterAccess: 'Lake Kivu shoreline catchments',
      },
      {
        name: 'Gashonga',
        primaryCrops: ['Specialty Coffee', 'Cassava', 'Beans'],
        cooperatives: ['Gashonga Coffee Producers Society'],
        waterAccess: 'Hillside natural fountains',
      },
    ],
  },

  // ==================== KIGALI CITY (UMUJYI WA KIGALI) ====================
  {
    name: 'Gasabo',
    nameRw: 'Gasabo',
    province: 'Kigali City',
    provinceRw: 'Umujyi wa Kigali',
    zoneSpecialty: 'Capital city agribusiness & aggregation: Hydroponic urban farms, modern grain silos, flour mills, and wholesale markets.',
    zoneSpecialtyRw: 'Ubuhinzi n\'ikusanyirizo mu murwa mukuru: Greenhouses, ibigega by\'ibinyampeke, inganda z\'ifu, n\'amasoko manini.',
    keyCrops: ['Greenhouse Tomatoes', 'Lettuce & Herbs', 'Milled Grain', 'Mushrooms'],
    sectors: [
      {
        name: 'Kimironko',
        primaryCrops: ['Urban Horticultural Logistics', 'Fresh Vegetable Hub'],
        cooperatives: ['Kimironko Central Fresh Produce Market Union'],
        waterAccess: 'Municipal utility and rainwater recycling',
      },
      {
        name: 'Jabana',
        primaryCrops: ['Marshland Vegetables', 'Maize Milling', 'Poultry Fodder'],
        cooperatives: ['Jabana Valley Agro-Producers'],
        waterAccess: 'Nyabugogo-Jabana valley drainage network',
      },
      {
        name: 'Ndera',
        primaryCrops: ['Greenhouse Bell Peppers', 'Hydroponic Strawberries', 'Mushrooms'],
        cooperatives: ['Ndera Innovation Agri-Park Cooperative'],
        waterAccess: 'Deep automated borehole drip system',
      },
      {
        name: 'Rusororo',
        primaryCrops: ['High-Value Vegetables', 'Maize', 'Beans'],
        cooperatives: ['Rusororo Smallholder Agri-Collective'],
        waterAccess: 'Valley spring collection reservoirs',
      },
    ],
  },
  {
    name: 'Kicukiro',
    nameRw: 'Kicukiro',
    province: 'Kigali City',
    provinceRw: 'Umujyi wa Kigali',
    zoneSpecialty: 'National agro-processing: Large grain mills (MINIMEX), animal feed factories, aggregation cold storage, and export packaging.',
    zoneSpecialtyRw: 'Inganda zitunganya umusaruro: Inganda z\'ifu y\'ibigori (MINIMEX), ibiryo by\'amatungo, n\'ububiko bukonjesha.',
    keyCrops: ['Milled Maize Flour', 'Animal Feeds', 'Packaged Beans', 'Processed Oils'],
    sectors: [
      {
        name: 'Masaka',
        primaryCrops: ['Maize Processing Logistics', 'Vegetables', 'Cassava Flour'],
        cooperatives: ['Masaka Agro-Industrial Hub Association'],
        waterAccess: 'Commercial water pipelines & catchment ponds',
      },
      {
        name: 'Gahanga',
        primaryCrops: ['Urban Greenery', 'Vegetables', 'Poultry'],
        cooperatives: ['Gahanga Farmers Network'],
        waterAccess: 'Nyabarongo valley pump schemes',
      },
      {
        name: 'Kanombe',
        primaryCrops: ['Horticultural Export Hub', 'Air Cargo Aggregation'],
        cooperatives: ['Kanombe Fresh Freight Collective'],
        waterAccess: 'Municipal chilled aggregation storage',
      },
    ],
  },
  {
    name: 'Nyarugenge',
    nameRw: 'Nyarugenge',
    province: 'Kigali City',
    provinceRw: 'Umujyi wa Kigali',
    zoneSpecialty: 'National commodity trade & price setting: Nyabugogo Wholesale Commodity Market, MINICOM e-Soko national benchmarks.',
    zoneSpecialtyRw: 'Isoko rikuru ry\'igihugu n\'ibiciro: Isoko rya Nyabugogo, ibiciro fatizo bya MINICOM / e-Soko mu gihugu hose.',
    keyCrops: ['Commodity Grain Trading', 'Wholesale Beans', 'Rice Wholesaling'],
    sectors: [
      {
        name: 'Nyarugenge',
        primaryCrops: ['Central Wholesale Trading', 'Agricultural Brokerage'],
        cooperatives: ['Nyabugogo Wholesalers Commodity Syndicate'],
        waterAccess: 'Municipal commercial network',
      },
      {
        name: 'Kanyinya',
        primaryCrops: ['Lakeside Vegetables', 'Sweet Potatoes', 'Maize'],
        cooperatives: ['Kanyinya Riverbank Farmers'],
        waterAccess: 'Nyabarongo perimeter extraction',
      },
      {
        name: 'Mageragere',
        primaryCrops: ['Cassava', 'Sweet Potatoes', 'Vegetables'],
        cooperatives: ['Mageragere Agro-Cooperative'],
        waterAccess: 'Valley retention systems',
      },
    ],
  },
];

// Helper functions for easy querying across the app
export const getAllDistricts = (): DistrictInfo[] => RWANDA_DISTRICTS;

export const getDistrictByName = (name: string): DistrictInfo | undefined => {
  return RWANDA_DISTRICTS.find(
    (d) => d.name.toLowerCase() === name.toLowerCase() || d.nameRw.toLowerCase() === name.toLowerCase()
  );
};

export const getSectorsForDistrict = (districtName: string): SectorDetail[] => {
  const district = getDistrictByName(districtName);
  return district ? district.sectors : [];
};

export const getAllDistrictNames = (): string[] => {
  return RWANDA_DISTRICTS.map((d) => d.name);
};

// Re-export original Nyagatare sector array for full backward compatibility
export const NYAGATARE_SECTOR_NAMES: NyagatareSector[] = [
  'Mimuri',
  'Rukomo',
  'Karangazi',
  'Katabagemu',
  'Rwempasha',
  'Nyagatare',
  'Matimba',
  'Musheri',
  'Rwimiyaga',
  'Kiyombe',
  'Tabagwe',
  'Gatunda',
  'Mukama',
  'Karama',
];
