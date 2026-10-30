# AgriBridge Rwanda — Architecture & Implementation Plan

A production-oriented agricultural technology platform launching in Nyagatare District (Eastern Province, Rwanda) that bridges smallholder farmers with commodity buyers, agricultural input suppliers, certified agronomists, and local community agents.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Key Architectural Strategy & Staging Agreement**:
> 1. **Zero Fake Operations Policy**: Per your explicit instruction, genuine user records will be strictly segregated from seed demonstration data via a persistent source tag (`is_demo: boolean`), and no mock transactions or fake partner testimonials will ever be presented as completed business results.
> 2. **Database & Auth Roadmap**: In this Google AI Studio environment, the backend supports either **Cloud SQL PostgreSQL (Developer Edition) with Drizzle ORM and Firebase Auth**, or direct integration with an **External Supabase project (via project URL + API keys)**. To ensure you have an immediate, fully functional, responsive, and testable application before setting cloud credentials, **Milestone 1 provides a clean, decoupled Repository Pattern with an Offline-First Persistent Storage Layer (IndexedDB / LocalStorage)** whose schema exactly mirrors PostgreSQL tables. This allows immediate end-to-end testing of farmer-to-buyer workflows, and can be seamlessly switched to PostgreSQL/Supabase via environment configuration.
> 3. **Milestone 1 Target Scope**: The foundational stage focuses on the core farmer-to-buyer value loop: **Farmer Farm & Plot Management + Crop Tracking + Produce Marketplace + Buyer Offer & Negotiation Workflow + English/Kinyarwanda bilingual interface**.

---

## 1. Overview & Core Concept

### 1.1 What It Does
AgriBridge Rwanda enables smallholder farmers in rural Rwanda—initially centered on the agricultural hubs of Nyagatare (e.g., Mimuri, Rukomo, Karangazi, Rwempasha)—to register farms and GPS/size-measured plots, record planting and projected harvests (maize, beans, rice, cassava, dairy fodder, soya, sorghum), list surplus produce for sale with quality grades and farmgate pricing, and receive, negotiate, and accept purchase offers from buyers.

### 1.2 Target Audience & User Roles
1. **Smallholder Farmer (`farmer`)**: Manages plots, logs planting dates, tracks expected harvest yields, lists commodities in kilograms/bags, reviews buyer offers, and tracks farm earnings.
2. **Commercial / Aggregator Buyer (`buyer`)**: Searches verified Nyagatare harvests by crop, variety, district sector, minimum quantity, and grade; posts buying tenders; submits price offers and negotiates delivery terms.
3. **Community Agent (`agent`)**: Assists farmers who have limited digital literacy or basic feature phones to register plots, list crops, and submit transactions on their behalf.
4. **Agro-Supplier (`supplier`)**: Lists certified seeds, fertilizers (e.g., DAP, Urea, NPK), pest control inputs, and equipment.
5. **Agronomist / Agricultural Expert (`expert`)**: Publishes verified seasonal advice, disease alerts (e.g., Fall Armyworm, Maize Lethal Necrosis), and answers agronomy queries.
6. **Platform Administrator (`admin`)**: Verifies buyer licenses, audits cooperative IDs, monitors market prices, and manages disputes.

### 1.3 Key Value
- **Fair Farmgate Pricing**: Removes exploitative middlemen by directly connecting Nyagatare growers with Kigali and regional wholesale buyers.
- **Production Forecasting**: Gives buyers reliable harvest lead times before crops are reaped.
- **Low-Literacy & Rural Accessibility**: Clear typography, high-contrast visual cues, Kinyarwanda language toggles, metric units (kg, Ha, RWF), and assisted community agent workflows.

---

## 2. User Experience & Visual Design

### 2.1 Key User Flows (Milestone 1)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ROLE & LOCALE SWITCHER                          │
│  [Role: Smallholder Farmer / Buyer / Agent]  [Locale: Kinyarwanda / EN] │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌─────────────────────────────────┐         ┌─────────────────────────────────┐
│        FARMER WORKFLOW          │         │         BUYER WORKFLOW          │
├─────────────────────────────────┤         ├─────────────────────────────────┤
│ 1. View Nyagatare Farms & Plots │         │ 1. Browse Verified Marketplace  │
│ 2. Register New Plot & Crop     │         │ 2. Filter: Crop, Sector, Grade  │
│    (Variety, Area Ha, Est Date) │         │ 3. Submit Binding Offer / Bid   │
│ 3. Create Produce Listing       │         │ 4. Track Counteroffers & Status │
│ 4. Manage Inbound Buyer Offers  │         │ 5. View Farmer Plot Proof & ID  │
│    [Accept / Counter / Decline] │         │                                 │
└─────────────────────────────────┘         └─────────────────────────────────┘
```

### 2.2 Visual Identity & Theme
- **Aesthetic Direction**: Utilitarian, tactile, trustworthy East African agricultural system. Grounded in earth and harvest greens, high contrast for outdoor sunlight legibility on mobile and tablet screens.
- **Color Tokens**:
  - Primary Canvas: Deep organic slate `#0A0F0D` (Dark) / Crisp warm sunlight off-white `#F9FAF6` (Light).
  - Forest Green Accent: `#15803D` (Rwanda harvest green) for key confirmations and agricultural badges.
  - Terracotta / Ochre Tone: `#C2410C` and Amber `#D97706` for pending offers, harvest alerts, and counteroffers.
  - Surface Containers: Subdued borders `rgba(0,0,0,0.08)` and `rgba(255,255,255,0.08)` with single-elevation depth.
- **Typography**:
  - Display & Headings: `Plus Jakarta Sans` (bold, authoritative, readable).
  - Body & Form Controls: `DM Sans` / `Manrope` for clear scannability.
  - Quantities & Currency: Tabular monospace figures (`tabular-nums font-mono`) for Rwandan Francs (`RWF`), hectares (`Ha`), and kilograms (`kg`).
- **Accessibility & Digital Literacy**:
  - Explicit icon + text pairings on all key interactive elements.
  - Large click/touch targets ($\ge 44\text{px}$).
  - Kinyarwanda terms embedded naturally (*Icyerekezo*, *Umurenge*, *Umusaruro*, *Ibiro*, *Amafaranga*).
  - Clear banner distinguishing **Demo Simulation Records** from **Authenticated Local User Records**.

---

## 3. Technical Architecture & Data Strategy

### 3.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AgriBridge Rwanda Client                           │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────────┐  │
│  │   Role & Auth Context   │  │        Bilingual i18n Context            │  │
│  │ (Farmer, Buyer, Agent)  │  │   (English & Ikinyarwanda Strings)       │  │
│  └───────────┬─────────────┘  └───────────────────┬──────────────────────┘  │
│              │                                    │                         │
│  ┌───────────▼────────────────────────────────────▼──────────────────────┐  │
│  │                     Presentation & UI Layer                           │  │
│  │  • Nyagatare Plot & Crop Manager  • Produce Listing Publisher        │  │
│  │  • Interactive Marketplace Grid   • Offer Negotiation Desk           │  │
│  │  • Demo / User Records Filter     • Nyagatare Sector Selectors        │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
│                                      │                                      │
│  ┌───────────────────────────────────▼───────────────────────────────────┐  │
│  │                 Repository / Service Layer (Decoupled)                │  │
│  │  • FarmService    • CropService    • MarketService    • OfferService  │  │
│  └───────────────────────────────────┬───────────────────────────────────┘  │
└──────────────────────────────────────┼──────────────────────────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
      ┌───────────────────────────┐         ┌───────────────────────────┐
      │  Local Persistent Store   │         │ Cloud PostgreSQL / SQL    │
      │  (IndexedDB / LocalStore) │         │ (Drizzle ORM / Supabase)  │
      │  [Milestone 1 Active]     │         │ [Milestone 5 Plug-in]     │
      └───────────────────────────┘         └───────────────────────────┘
```

### 3.2 Relational Database Schema Design (PostgreSQL / Drizzle Definition)

The data model uses strict foreign key constraints, timestamps, and relational schemas:

1. **`users`**
   - `id`: `uuid` (Primary Key)
   - `phone_number`: `varchar(20)` (Essential for Rwanda SMS/USSD alignment)
   - `full_name`: `varchar(120)`
   - `role`: `enum('farmer', 'buyer', 'agent', 'supplier', 'expert', 'admin')`
   - `district`: `varchar(50)` (default: `'Nyagatare'`)
   - `sector`: `varchar(50)` (e.g., `'Mimuri'`, `'Rukomo'`, `'Karangazi'`, `'Katabagemu'`)
   - `cooperative_name`: `varchar(150)` (optional)
   - `is_verified`: `boolean` (default: `false`)
   - `created_at`: `timestamp`

2. **`farms`**
   - `id`: `uuid` (Primary Key)
   - `farmer_id`: `uuid` (references `users.id`)
   - `name`: `varchar(120)` (e.g., *"Umurima w'Ibigori - Mimuri"*)
   - `location_sector`: `varchar(50)`
   - `location_cell`: `varchar(50)`
   - `total_area_hectares`: `numeric(6,2)`
   - `soil_type`: `varchar(50)` (e.g., `'Sandy Loam'`, `'Clay'`)
   - `water_source`: `varchar(50)` (e.g., `'Muvumba River Irrigation'`, `'Rainfed'`, `'Borehole'`)
   - `created_at`: `timestamp`

3. **`plots`**
   - `id`: `uuid` (Primary Key)
   - `farm_id`: `uuid` (references `farms.id`)
   - `plot_identifier`: `varchar(50)` (e.g., *"Plot A1 - Valley"*)
   - `area_hectares`: `numeric(6,2)`
   - `current_status`: `enum('fallow', 'planted', 'harvesting', 'resting')`
   - `created_at`: `timestamp`

4. **`crop_cycles`**
   - `id`: `uuid` (Primary Key)
   - `plot_id`: `uuid` (references `plots.id`)
   - `crop_type`: `enum('maize', 'beans', 'rice', 'cassava', 'soya', 'sorghum', 'vegetables', 'dairy_fodder')`
   - `variety`: `varchar(100)` (e.g., *"PAN 53"*, *"RWR 2245"*, *"H628"*)
   - `planting_date`: `date`
   - `expected_harvest_date`: `date`
   - `estimated_yield_kg`: `integer`
   - `actual_harvest_kg`: `integer` (nullable until reaped)
   - `stage`: `enum('germination', 'vegetative', 'flowering', 'maturing', 'harvested')`
   - `notes`: `text`

5. **`produce_listings`**
   - `id`: `uuid` (Primary Key)
   - `farmer_id`: `uuid` (references `users.id`)
   - `crop_cycle_id`: `uuid` (optional reference to `crop_cycles.id`)
   - `crop_name`: `varchar(100)`
   - `variety`: `varchar(100)`
   - `quantity_available_kg`: `integer`
   - `minimum_order_kg`: `integer`
   - `unit_price_rwf`: `integer` (price per kg in Rwandan Francs)
   - `quality_grade`: `enum('Grade 1 (Export/Premium)', 'Grade 2 (Commercial)', 'Grade 3 (Processing)')`
   - `packaging`: `enum('50kg Bags', '100kg Bags', 'Bulk Truckload', 'Crates')`
   - `delivery_option`: `enum('Farmgate Pickup', 'Buyer Collects at Aggregation Center', 'Delivered to Kigali')`
   - `status`: `enum('active', 'under_negotiation', 'sold_out', 'expired')`
   - `harvest_date`: `date`
   - `sector`: `varchar(50)`
   - `is_demo`: `boolean` (ensures clear distinction between system demo and real records)
   - `created_at`: `timestamp`

6. **`buyer_offers`**
   - `id`: `uuid` (Primary Key)
   - `listing_id`: `uuid` (references `produce_listings.id`)
   - `buyer_id`: `uuid` (references `users.id`)
   - `offered_price_per_kg_rwf`: `integer`
   - `requested_quantity_kg`: `integer`
   - `offered_total_rwf`: `integer`
   - `proposed_pickup_date`: `date`
   - `status`: `enum('submitted', 'countered', 'accepted', 'declined', 'completed')`
   - `counter_price_per_kg_rwf`: `integer` (nullable)
   - `notes`: `text`
   - `is_demo`: `boolean`
   - `updated_at`: `timestamp`
   - `created_at`: `timestamp`

---

## 4. Phased Implementation Roadmap

### Phase 1: Foundation & Core Farmer-to-Buyer Loop (Milestone 1 — Current Target)
- Setup clean TypeScript domain contracts, Nyagatare administrative sector data, and Kinyarwanda/English translation engine.
- Responsive accessible Navigation and Role Switcher (`Farmer`, `Buyer`, `Community Agent`).
- **Farmer Module**:
  - Farm & Plot Registration interface with land size calculations, soil/water properties, and status.
  - Crop Cycle Tracking (maize, beans, rice, cassava) with planting date, growth stage progress, and yield estimation.
  - Produce Listing Publisher: publish harvested or upcoming crop lots with packaging, grade, and farmgate pricing.
- **Buyer Module**:
  - Real-time marketplace with Nyagatare sector filters, crop search, quality grade tags, and price per kg in RWF.
  - Direct Offer & Negotiation Dialog: submit price offers and requested quantities.
  - Farmer Offer Management: accept, decline, or counteroffer with real-time state updates.
- **Data Integrity**:
  - Persistent repository with explicit demo vs. genuine user records toggle.
  - Zero mock "completed partner deals" or unverified claims.

### Phase 2: Farm Financial Ledger & Profitability (Milestone 2)
- Farm input expense tracking (seeds, fertilizers, hired labor, tractor hire, transport).
- Sales revenue reconciliation linked to accepted buyer orders.
- Gross margin and per-plot ROI calculation in RWF.

### Phase 3: Supplier & Agronomist Directories + Verified Education (Milestone 3)
- Nyagatare agricultural supplier directory (authorized seed, fertilizer, and spray equipment stockists).
- Certified agronomist advisory booking and seasonal pest warning bulletin.
- Crop-specific best practice guides with simulated Kinyarwanda audio readout for low-literacy users.

### Phase 4: Community Agent Portal & Admin Dashboard (Milestone 4)
- Agent delegation mode allowing rural agents to register multiple farmer cooperatives and plot batches.
- Admin verification and dispute resolution interface.

### Phase 5: Cloud PostgreSQL / Supabase Migration & SMS Integration (Milestone 5)
- Provisioning remote PostgreSQL database (via Cloud SQL developer edition or Supabase credentials).
- Drizzle ORM schema deployment, Row Level Security (RLS) enforcement, and optional SMS gateway hook.

---

## First Milestone Deliverables (Awaiting Approval)
Upon your approval, we will immediately implement **Milestone 1**:
1. Domain models, Nyagatare sectors reference, and full bilingual locale system (English / Ikinyarwanda).
2. Production-grade Farm & Plot Manager with crop cycle logs.
3. Produce Marketplace with live filtering and quality specs.
4. Complete interactive Buyer Offer submission & Farmer Counteroffer/Acceptance workflow.
5. Persistent storage with explicit Demo vs. Genuine User Records toggle.
