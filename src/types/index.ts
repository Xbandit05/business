export type UserRole = 'farmer' | 'buyer' | 'agent' | 'supplier' | 'expert' | 'admin';

export type Language = 'en' | 'rw';

export type RwandaDistrict = string;
export type RwandaSector = string;

export type NyagatareSector =
  | 'Mimuri'
  | 'Rukomo'
  | 'Karangazi'
  | 'Katabagemu'
  | 'Rwempasha'
  | 'Nyagatare'
  | 'Matimba'
  | 'Musheri'
  | 'Rwimiyaga'
  | 'Kiyombe'
  | 'Tabagwe'
  | 'Gatunda'
  | 'Mukama'
  | 'Karama'
  | string;

export type CropType =
  | 'maize'
  | 'beans'
  | 'rice'
  | 'cassava'
  | 'soya'
  | 'sorghum'
  | 'vegetables'
  | 'dairy_fodder';

export type CropGrowthStage =
  | 'germination'
  | 'vegetative'
  | 'flowering'
  | 'maturing'
  | 'harvested';

export type QualityGrade =
  | 'Grade 1 (Premium / Export)'
  | 'Grade 2 (Commercial Standard)'
  | 'Grade 3 (Processing / Local Feed)';

export type PackagingType =
  | '50kg Woven Bags'
  | '100kg Grain Bags'
  | 'Bulk Truckload'
  | 'Standard Crates';

export type DeliveryOption =
  | 'Farmgate Pickup (Buyer arranges transport)'
  | 'Nyagatare Aggregation Center'
  | 'Delivered to Kigali Hub';

export type OfferStatus =
  | 'submitted'
  | 'countered'
  | 'accepted'
  | 'declined'
  | 'completed';

export type OrderStatus =
  | 'pending_dispatch'
  | 'in_transit'
  | 'delivered_at_aggregation'
  | 'completed'
  | 'disputed';

export type CommissionStatus = 'calculated' | 'due' | 'paid' | 'waived' | 'reversed';

export type UserCategory = 'seller' | 'buyer' | 'supplier' | 'agent' | 'expert' | 'admin';

export interface SavedUserCredentials {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  role: UserRole;
  category: UserCategory;
  nicheSpecialty?: string;
  businessOrFarmName?: string;
  tradeVolumeScale?: string;
  district: string;
  sector: NyagatareSector;
  cooperativeName?: string;
  savedAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  role: UserRole;
  category?: UserCategory;
  nicheSpecialty?: string;
  businessOrFarmName?: string;
  tradeVolumeScale?: string;
  district: string;
  sector: NyagatareSector;
  cooperativeName?: string;
  isVerified: boolean;
  isDemo: boolean;
  savedCredentials?: boolean;
  savedAt?: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  district?: string;
  sector: NyagatareSector;
  cell: string;
  totalAreaHa: number;
  soilType: string;
  waterSource: string;
  isDemo: boolean;
  createdAt: string;
}

export interface Plot {
  id: string;
  farmId: string;
  identifier: string;
  areaHa: number;
  currentStatus: 'fallow' | 'planted' | 'harvesting' | 'resting';
  isDemo: boolean;
  createdAt: string;
}

export interface CropCycle {
  id: string;
  plotId: string;
  farmId: string;
  cropType: CropType;
  cropName: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  estimatedYieldKg: number;
  actualHarvestKg?: number;
  stage: CropGrowthStage;
  notes?: string;
  isDemo: boolean;
  createdAt: string;
}

export interface ProduceListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cooperativeName?: string;
  cropCycleId?: string;
  cropType: CropType;
  cropName: string;
  variety: string;
  quantityAvailableKg: number;
  minimumOrderKg: number;
  unitPriceRwf: number;
  qualityGrade: QualityGrade;
  packaging: PackagingType;
  deliveryOption: DeliveryOption;
  status: 'active' | 'under_negotiation' | 'sold_out';
  harvestDate: string;
  district?: string;
  sector: NyagatareSector;
  isDemo: boolean;
  createdAt: string;
}

export interface BuyerOffer {
  id: string;
  listingId: string;
  listingCropName: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerCompany?: string;
  requestedQuantityKg: number;
  offeredPricePerKgRwf: number;
  originalAskingPriceRwf: number;
  totalOfferedRwf: number;
  proposedPickupDate: string;
  status: OfferStatus;
  counterPricePerKgRwf?: number;
  counterNotes?: string;
  buyerNotes?: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  offerId: string;
  listingId: string;
  cropName: string;
  variety: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerCompany?: string;
  district?: string;
  sector: NyagatareSector;
  quantityKg: number;
  unitPriceRwf: number;
  totalAmountRwf: number;
  commissionRatePercent: number; // e.g. 2.5%
  commissionAmountRwf: number;
  commissionStatus: CommissionStatus;
  status: OrderStatus;
  deliveryOption: DeliveryOption;
  dispatchDate: string;
  paymentMethod: 'Mobile Money (MTN/Airtel)' | 'Bank Transfer (BPR/Equity)' | 'Escrow via Sacco';
  receiptCode: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'seeds'
  | 'fertilizer'
  | 'pesticides'
  | 'hired_labor'
  | 'plowing_mechanization'
  | 'irrigation'
  | 'post_harvest_bags'
  | 'transport';

export interface FarmExpense {
  id: string;
  farmId: string;
  plotId?: string;
  farmerId: string;
  category: ExpenseCategory;
  itemName: string;
  quantity: number;
  unit: string;
  unitCostRwf: number;
  totalCostRwf: number;
  date: string;
  receiptNumber?: string;
  notes?: string;
  isDemo: boolean;
  createdAt: string;
}

export interface AgroSupplier {
  id: string;
  name: string;
  category: 'Certified Seeds' | 'Fertilizers & Chemicals' | 'Drip Irrigation & Pumps' | 'Animal Feed & Fodder';
  district?: string;
  sector: NyagatareSector;
  locationDetails: string;
  phone: string;
  isRABCertified: boolean;
  rating: number;
  featuredProducts: { name: string; priceRwf: number; unit: string }[];
  isDemo: boolean;
}

export interface AgronomistExpert {
  id: string;
  name: string;
  title: string;
  specialization: string;
  affiliation: string;
  district?: string;
  sector: NyagatareSector;
  phone: string;
  email: string;
  availableDays: string;
  languages: string[];
  isDemo: boolean;
}

export interface AdvisoryInquiry {
  id: string;
  farmerName: string;
  farmerPhone: string;
  expertId: string;
  expertName: string;
  crop: string;
  topic: string;
  message: string;
  status: 'pending' | 'answered';
  response?: string;
  createdAt: string;
}

export interface TrainingLesson {
  id: string;
  category: 'Crop Management' | 'Agrochemical Safety' | 'Harvest Quality' | 'Soil & Water';
  titleEn: string;
  titleRw: string;
  summaryEn: string;
  summaryRw: string;
  durationMinutes: number;
  kinyarwandaAudioText: string;
  keyTakeawaysRw: string[];
  keyTakeawaysEn: string[];
  isCompleted?: boolean;
}

export interface WeatherDayForecast {
  date: string;
  dayName: string;
  tempHighC: number;
  tempLowC: number;
  rainChancePercent: number;
  condition: 'Sunny' | 'Light Rain' | 'Scattered Showers' | 'Heavy Thunderstorms' | 'Partly Cloudy';
  farmingAdvisoryEn: string;
  farmingAdvisoryRw: string;
}

export interface MarketBenchmark {
  cropName: string;
  variety: string;
  unit: string;
  minicomMinRwf: number;
  minicomMaxRwf: number;
  avgMarketRwf: number;
  trend: 'rising' | 'stable' | 'dropping';
  lastUpdated: string;
}
