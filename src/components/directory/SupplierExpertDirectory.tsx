import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { AgroSupplier, AgronomistExpert } from '../../types/index.ts';
import {
  Store,
  GraduationCap,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
  Search,
  Star,
  Tag,
  X,
  Send,
} from 'lucide-react';

export const SupplierExpertDirectory: React.FC = () => {
  const { t } = useLanguage();
  const { suppliers, experts, inquiries, submitInquiry, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'suppliers' | 'experts' | 'inquiries'>('suppliers');
  const [selectedExpert, setSelectedExpert] = useState<AgronomistExpert | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  // Inquiry form states
  const [inquiryCrop, setInquiryCrop] = useState('Maize (PAN 53)');
  const [inquiryTopic, setInquiryTopic] = useState('Fall Armyworm Leaf Damage');
  const [inquiryMessage, setInquiryMessage] = useState('');

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpert || !inquiryMessage.trim()) return;

    submitInquiry({
      farmerName: currentUser.fullName,
      farmerPhone: currentUser.phoneNumber,
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      crop: inquiryCrop,
      topic: inquiryTopic,
      message: inquiryMessage.trim(),
    });

    setSelectedExpert(null);
    setInquiryMessage('');
    setActiveTab('inquiries');
  };

  return (
    <div className="space-y-8">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {t('dir.title')}
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            {t('dir.subtitle')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 p-1 shadow-2xs">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'suppliers'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t('dir.suppliersTab')}</span>
          </button>

          <button
            onClick={() => setActiveTab('experts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'experts'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t('dir.expertsTab')}</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'inquiries'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>My Inquiries ({inquiries.length})</span>
          </button>
        </div>
      </div>

      {/* District Filter Bar */}
      {activeTab !== 'inquiries' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-stone-500 uppercase tracking-wider text-[11px] shrink-0">
            District:
          </span>
          {['all', 'Nyagatare', 'Musanze', 'Bugesera'].map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => setSelectedDistrict(dist)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 border ${
                selectedDistrict === dist
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                  : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
              }`}
            >
              {dist === 'all' ? 'All Rwanda Districts' : dist}
            </button>
          ))}
        </div>
      )}

      {/* SUPPLIERS TAB */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers
            .filter((s) => selectedDistrict === 'all' || (s.district || 'Nyagatare') === selectedDistrict)
            .map((sup) => (
            <div
              key={sup.id}
              className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {sup.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="font-semibold text-stone-700 dark:text-stone-300">
                        {sup.district ? `${sup.district} · ${sup.sector}` : `${sup.sector} Sector`}
                      </span>
                      <span>·</span>
                      <span className="truncate">{sup.locationDetails}</span>
                    </div>
                  </div>

                  {sup.isRABCertified && (
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                      RAB Certified
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{sup.category}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-mono">{sup.rating}</span>
                  </div>
                </div>

                {/* Featured Products List */}
                <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                  <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                    Available Stock & Indicative Prices
                  </span>
                  {sup.featuredProducts.map((prod, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-stone-50 dark:bg-stone-800/60"
                    >
                      <span className="text-stone-800 dark:text-stone-200 truncate pr-2">{prod.name}</span>
                      <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 whitespace-nowrap">
                        {prod.priceRwf.toLocaleString()} RWF
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="font-mono text-stone-600 dark:text-stone-400">{sup.phone}</span>
                <a
                  href={`tel:${sup.phone}`}
                  className="px-3 py-1.5 font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Supplier</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EXPERTS TAB */}
      {activeTab === 'experts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts
            .filter((e) => selectedDistrict === 'all' || (e.district || 'Nyagatare') === selectedDistrict)
            .map((exp) => (
            <div
              key={exp.id}
              className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {exp.name}
                    </h3>
                    <div className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold mt-0.5">
                      {exp.title}
                    </div>
                    <div className="text-[11px] text-stone-500">{exp.affiliation}</div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    {exp.district ? `${exp.district} · ${exp.sector}` : exp.sector}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg text-xs space-y-1">
                  <span className="text-stone-400 uppercase font-semibold text-[10px] block">Specialization</span>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                    {exp.specialization}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-1">
                  <div>
                    <span className="block font-semibold text-stone-400">Available:</span>
                    <span>{exp.availableDays}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-stone-400">Languages:</span>
                    <span>{exp.languages.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span className="text-xs font-mono text-stone-500">{exp.phone}</span>
                <button
                  onClick={() => setSelectedExpert(exp)}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('dir.bookAdvisory')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INQUIRIES TAB */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Agronomy Inquiries & Advisory History
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Track responses to pest, soil, and crop management queries submitted to certified experts.
            </p>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
              <MessageSquare className="w-10 h-10 text-stone-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                No active advisory inquiries
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Visit the Agronomists & Extension Workers tab to submit a question about soil testing or crop protection.
              </p>
            </div>
          ) : (
            inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      {inq.topic}
                    </h3>
                    <div className="text-xs text-stone-500">
                      Expert: <strong className="text-stone-700 dark:text-stone-300">{inq.expertName}</strong> · Crop: {inq.crop}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    Status: {inq.status}
                  </span>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/40 p-3 rounded-lg leading-relaxed">
                  "{inq.message}"
                </p>

                <div className="text-[11px] text-stone-400 pt-1 flex justify-between">
                  <span>Submitted: {new Date(inq.createdAt).toLocaleDateString()}</span>
                  <span>Expect extension worker review within 24 hours</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ADVISORY MODAL */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                  Request Advisory from {selectedExpert.name}
                </h3>
                <span className="text-[11px] text-stone-500">{selectedExpert.title}</span>
              </div>
              <button
                onClick={() => setSelectedExpert(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInquiry} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Target Crop *
                </label>
                <input
                  type="text"
                  required
                  value={inquiryCrop}
                  onChange={(e) => setInquiryCrop(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Inquiry Topic *
                </label>
                <input
                  type="text"
                  required
                  value={inquiryTopic}
                  onChange={(e) => setInquiryTopic(e.target.value)}
                  placeholder="e.g. Yellowing leaves or dosage recommendation"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Describe Field Symptoms / Problem *
                </label>
                <textarea
                  rows={4}
                  required
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="Describe what you observed in your plot in Nyagatare (e.g. soil texture, moisture, insect presence)..."
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedExpert(null)}
                  className="px-3.5 py-2 text-stone-600 dark:text-stone-400"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-2xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
