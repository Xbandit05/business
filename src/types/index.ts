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
  | 'Standard Crates'
  | string;

export type DeliveryOption =
  | 'Farmgate Pickup (Buyer arranges transport)'
  | 'Nyagatare Aggregation Center'
  | 'Delivered to Kigali Hub'
  | string;

export type OfferStatus =
  | 'submitted'
  | 'countered'
  | 'accepted'
  | 'declined'
  | 'completed';

export type OrderStatus =
  | 'pending'
  | 'pending_dispatch'
  | 'in_transit'
  | 'delivered_at_aggregation'
  | 'completed'
  | 'disputed';

export type CommissionStatus = 'pending' | 'calculated' | 'due' | 'paid' | 'waived' | 'reversed';

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
  phone?: string;
  organization?: string;
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
  photoURL?: string;
  avatarUrl?: string;
  createdAt?: string;
  savedCredentials?: boolean;
  savedAt?: string;
  activePortfolioId?: string;
  agentId?: string;
}

export interface UserPortfolio {
  id: string;
  userId: string;
  name: string;
  category: UserCategory;
  role: UserRole;
  district: string;
  sector: string;
  cell?: string;
  nicheSpecialty?: string;
  businessOrFarmName?: string;
  cooperativeName?: string;
  tradeVolumeScale?: string;
  isPrimary?: boolean;
  createdAt: string;
  updatedAt?: string;
  metrics?: {
    plotsCount?: number;
    activeListingsCount?: number;
    completedDealsCount?: number;
    totalAreaHa?: number;
  };
}

export interface AuthSession {
  token: string;
  userId: string;
  user: UserProfile;
  portfolios: UserPortfolio[];
  activePortfolioId: string;
  isAgent?: boolean;
  agentId?: string;
  loginTime: string;
}

export interface PortfolioRegistrationPayload {
  fullName: string;
  phoneNumber: string;
  email?: string;
  passwordOrPin: string;
  securityQuestion?: string;
  securityAnswer?: string;
  category: UserCategory;
  role: UserRole;
  district: string;
  sector: string;
  cell?: string;
  portfolioName: string;
  nicheSpecialty?: string;
  businessOrFarmName?: string;
  cooperativeName?: string;
  tradeVolumeScale?: string;
}

export interface Farm {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  province?: string;
  provinceId?: string;
  district?: string;
  districtId?: string;
  sector: NyagatareSector;
  sectorId?: string;
  cell: string;
  cellId?: string;
  village?: string;
  villageId?: string;
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
  orderNumber?: string;
  offerId?: string;
  listingId?: string;
  cropName?: string;
  cropType?: CropType | string;
  variety: string;
  farmerId?: string;
  farmerName?: string;
  farmerPhone?: string;
  sellerId?: string;
  sellerName?: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerCompany?: string;
  district?: string;
  sector?: NyagatareSector;
  quantityKg: number;
  unitPriceRwf?: number;
  pricePerKgRwf?: number;
  totalAmountRwf: number;
  commissionRatePercent?: number; // e.g. 2.5%
  commissionAmountRwf: number;
  commissionStatus: CommissionStatus;
  status: OrderStatus;
  deliveryOption?: DeliveryOption;
  deliveryLocation?: string;
  pickupDate?: string;
  dispatchDate?: string;
  paymentMethod?: 'Mobile Money (MTN/Airtel)' | 'Bank Transfer (BPR/Equity)' | 'Escrow via Sacco' | string;
  paymentStatus?: 'unpaid' | 'payment_pending' | 'partially_paid' | 'paid' | 'payment_failed' | 'refunded';
  pawapayDepositId?: string;
  receiptCode?: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt?: string;
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

// ==========================================
// MODULE 1: PAYMENT TERMINAL & VERIFICATION
// ==========================================

export type PaymentStatus =
  | 'CREATED'
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REFUNDED'
  | 'PARTIALLY_PAID'
  | 'UNDER_REVIEW';

export type PaymentMethod =
  | 'momo_mtn'
  | 'airtel_money'
  | 'bank_transfer'
  | 'gateway_card';

export interface PaymentRecord {
  id: string;
  reference: string; // e.g. AGP-20261109-7841
  orderId: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  sellerId: string;
  sellerName: string;
  amountRwf: number;
  marketplaceFeeRwf: number; // 2.5% or configured rate
  providerFeeRwf: number; // telecom/bank fee
  farmerPayoutRwf: number; // net to farmer
  commissionRatePercent: number;
  method: PaymentMethod;
  methodName: string;
  status: PaymentStatus;
  statusReason?: string;
  description: string;
  idempotencyKey: string;
  providerTransactionRef?: string;
  customerPhone: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  initiatedAt: string;
  expiresAt: string;
  completedAt?: string;
  verifiedAt?: string;
  reconciledAt?: string;
  reconciledBy?: string;
  reconciliationNotes?: string;
  supportingEvidenceRef?: string;
  refundedAt?: string;
  refundReason?: string;
  refundAmountRwf?: number;
  isSandboxSimulation: boolean;
  // Official PawaPay v2 metadata
  pawapayDepositId?: string;
  pawapayStatus?: 'ACCEPTED' | 'SUBMITTED' | 'COMPLETED' | 'FAILED' | 'REJECTED';
  pawapayProvider?: 'MTN_MOMO_RWA' | 'AIRTEL_RWA';
  pawapayFailureReason?: { failureCode?: string; failureMessage?: string };
}

export type PawaPayProvider = 'MTN_MOMO_RWA' | 'AIRTEL_RWA';

export type PawaPayInitiationStatus = 'ACCEPTED' | 'REJECTED' | 'DUPLICATE_IGNORED';

export type PawaPayTransactionStatus = 'ACCEPTED' | 'SUBMITTED' | 'COMPLETED' | 'FAILED';

export interface PawaPayFailureReason {
  failureCode?: string;
  failureMessage?: string;
}

export interface PawaPayDepositResponse {
  depositId: string;
  status: PawaPayInitiationStatus;
  created?: string;
  rejectionReason?: PawaPayFailureReason;
}

export interface PawaPayCallbackPayload {
  depositId: string;
  status: 'COMPLETED' | 'FAILED' | 'SUBMITTED';
  amount: string;
  currency: 'RWF';
  country?: string;
  payer?: {
    type: string;
    accountDetails: {
      phoneNumber: string;
      provider: string;
    };
  };
  customerMessage?: string;
  clientReferenceId: string;
  created?: string;
  providerTransactionId?: string;
  failureReason?: PawaPayFailureReason;
  metadata?: Array<Record<string, any>>;
}

export type PaymentAuditAction =
  | 'initiated'
  | 'provider_pending'
  | 'provider_processing'
  | 'provider_success'
  | 'provider_failed'
  | 'webhook_received'
  | 'verified'
  | 'rejected'
  | 'manually_reconciled'
  | 'refunded'
  | 'adjusted'
  | 'expired';

export interface PaymentAuditLogEntry {
  id: string;
  paymentId: string;
  paymentReference: string;
  action: PaymentAuditAction;
  previousStatus: PaymentStatus | 'NONE';
  newStatus: PaymentStatus;
  actor: 'system' | 'admin' | 'webhook' | 'buyer' | 'seller';
  actorName: string;
  timestamp: string;
  reason?: string;
  evidenceRef?: string;
  metadata?: Record<string, any>;
}

export interface PaymentReconciliationItem {
  id: string;
  paymentId: string;
  paymentReference: string;
  orderNumber: string;
  expectedAmountRwf: number;
  receivedAmountRwf: number;
  discrepancyRwf: number;
  reconciliationStatus: 'matched' | 'unmatched' | 'under_review' | 'manually_resolved';
  method: PaymentMethod;
  proofReference?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface CommissionConfig {
  ratePercent: number; // e.g. 2.5%
  minimumFeeRwf: number; // e.g. 500 RWF
  maximumFeeRwf?: number;
  providerFeeShare: 'deduct_from_marketplace' | 'deduct_from_seller' | 'add_to_buyer';
  effectiveDate: string;
  updatedBy: string;
}

// ==========================================
// MODULE 2: RWANDA ADMINISTRATIVE LOCATIONS
// ==========================================

export interface ProvinceEntity {
  id: string;
  code: string;
  name: string;
  nameRw: string;
  districtsCount: number;
}

export interface DistrictEntity {
  id: string;
  code: string;
  provinceId: string;
  name: string;
  nameRw: string;
  sectorsCount: number;
}

export interface SectorEntity {
  id: string;
  code: string;
  districtId: string;
  name: string;
  nameRw: string;
  cellsCount: number;
  primaryCrops?: string[];
  cooperativesCount?: number;
}

export interface CellEntity {
  id: string;
  code: string;
  sectorId: string;
  name: string;
  nameRw: string;
  villagesCount: number;
}

export interface VillageEntity {
  id: string;
  code: string;
  cellId: string;
  name: string;
  nameRw: string;
}

export interface LocationHierarchyNode {
  province: ProvinceEntity;
  district: DistrictEntity;
  sector: SectorEntity;
  cell: CellEntity;
  village: VillageEntity;
}

export interface LocationImportReport {
  version: string;
  importedAt: string;
  totalProvinces: number;
  totalDistricts: number;
  totalSectors: number;
  totalCells: number;
  totalVillages: number;
  duplicatesRemoved: number;
  orphansDetected: number;
  validationStatus: 'valid' | 'has_warnings' | 'failed';
  warnings: string[];
}

// ==========================================
// MODULE 3: BUYER-FARMER PRICE NEGOTIATION INBOX
// ==========================================

export type NegotiationMessageSenderRole = 'buyer' | 'farmer' | 'system';

export interface PriceProposal {
  id: string;
  proposedPricePerKgRwf: number;
  requestedQuantityKg: number;
  totalAmountRwf: number;
  platformFeeRwf: number; // 2.5% platform commission
  proposedDeliveryOption?: DeliveryOption;
  proposedPickupDate?: string;
  termsNotes?: string;
  status: 'pending' | 'accepted' | 'declined' | 'countered' | 'converted_to_order';
  counterPricePerKgRwf?: number;
  counterNotes?: string;
  proposerRole: 'buyer' | 'farmer';
  createdAt: string;
  respondedAt?: string;
}

export interface NegotiationMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: NegotiationMessageSenderRole;
  content: string;
  timestamp: string;
  priceProposal?: PriceProposal;
  isRead?: boolean;
}

export interface NegotiationThread {
  id: string;
  listingId: string;
  cropName: string;
  variety: string;
  cropType?: CropType | string;
  listingCropType?: CropType;
  listingUnitPriceRwf: number;
  quantityAvailableKg: number;
  minimumOrderKg?: number;
  deliveryOption?: DeliveryOption;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerCoop?: string;
  farmerDistrict: string;
  farmerSector: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerCompany?: string;
  status: 'negotiating' | 'price_agreed' | 'order_placed' | 'order_created' | 'archived';
  currentAgreedPricePerKgRwf?: number;
  latestPriceProposal?: PriceProposal;
  latestMessageSnippet?: string;
  lastMessageTimestamp: string;
  unreadCountBuyer: number;
  unreadCountFarmer: number;
  orderId?: string;
  convertedOrderId?: string;
  messages: NegotiationMessage[];
}

