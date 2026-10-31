import React, { useState } from 'react';
import { Sprout, ExternalLink, MessageCircle, Send, Check, Copy } from 'lucide-react';

export interface SocialChannel {
  id: string;
  name: string;
  platform: 'x' | 'instagram' | 'whatsapp' | 'linkedin' | 'youtube' | 'telegram';
  handle: string;
  intendedReach: string;
  reachPerson: string;
  url: string;
  description: string;
}

export const OFFICIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'x',
    name: 'X (Twitter)',
    platform: 'x',
    handle: '@AgriBridgeRw',
    intendedReach: 'Founders & Agritech Updates',
    reachPerson: 'Idris & Melody (Co-Founders)',
    url: 'https://x.com/intent/tweet?text=Exploring%20AgriBridge%20Rwanda%20-%20Empowering%20smallholder%20farmers%20across%20Rwanda.%20%40AgriBridgeRw',
    description: 'Direct news, founder updates, and national agricultural market announcements.',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    platform: 'instagram',
    handle: '@xbandit._',
    intendedReach: 'Farmer Stories & Field Updates',
    reachPerson: 'Media & Founders Desk',
    url: 'https://www.instagram.com/xbandit._/',
    description: 'Visual stories of harvest progress, Nyagatare cooperatives, and community agents.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    platform: 'whatsapp',
    handle: '+250 794 752 281',
    intendedReach: 'Instant Farmer & Buyer Support',
    reachPerson: 'Nyagatare & National Field Agents',
    url: 'https://wa.me/250794752281?text=Muraho%20AgriBridge%20Rwanda%20-%20I%20would%20like%20assistance%20with%20market%20access%20or%20produce%20orders.',
    description: 'Direct messaging for rural farmers, USSD agent escalations, and real-time orders.',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    platform: 'linkedin',
    handle: 'AgriBridge Rwanda',
    intendedReach: 'Institutional Off-takers & Investors',
    reachPerson: 'Partnerships & Executive Team',
    url: 'https://www.linkedin.com',
    description: 'Commercial buyer matchmaking, MINAGRI/RAB alignments, and export logistics.',
  },
  {
    id: 'telegram',
    name: 'Telegram Alerts',
    platform: 'telegram',
    handle: '@AgriBridgeRwAlerts',
    intendedReach: 'Daily Produce Prices & Weather',
    reachPerson: 'Agronomy Information Desk',
    url: 'https://t.me',
    description: 'Automated daily crop price benchmarks and rainfall advisory notifications.',
  },
];

// Custom SVGs for platform glyphs
const PlatformIcon: React.FC<{ platform: SocialChannel['platform']; className?: string }> = ({
  platform,
  className = 'w-4 h-4',
}) => {
  switch (platform) {
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.476-.15-.677.15-.201.3-.777.98-.952 1.181-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.675-2.085-.176-.3-.019-.463.132-.613.136-.134.301-.35.452-.525.15-.175.2-.3.301-.5.101-.2.05-.375-.025-.525-.075-.15-.677-1.632-.927-2.235-.244-.587-.492-.507-.677-.517-.175-.008-.376-.01-.577-.01-.201 0-.527.075-.802.375-.276.3-1.054 1.03-1.054 2.513 0 1.482 1.079 2.914 1.23 3.115.15.2 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.723.23 1.381.197 1.901.12.58-.087 1.782-.728 2.032-1.43.251-.702.251-1.303.176-1.43-.075-.127-.276-.202-.577-.353zm-5.42 7.618h-.002c-1.808 0-3.58-.487-5.127-1.408l-.367-.218-3.812 1 1.018-3.717-.239-.38a10.428 10.428 0 01-1.602-5.595c0-5.787 4.708-10.495 10.498-10.495 2.804 0 5.44 1.093 7.422 3.076 1.982 1.983 3.073 4.62 3.072 7.426 0 5.79-4.708 10.496-10.498 10.496zM12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.185 1.603 6.007L0 24l6.168-1.579A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case 'telegram':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      );
    default:
      return <Sprout className={className} />;
  }
};

export const SocialOutreachBar: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<SocialChannel | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHandle = (channel: SocialChannel, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard?.writeText(channel.handle);
    setCopiedId(channel.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner introducing Official Channels */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-2">
          {/* AgriBridge Sprout Emblem */}
          <div className="w-6 h-6 rounded-md bg-emerald-800 flex items-center justify-center text-emerald-200 shadow-2xs">
            <Sprout className="w-3.5 h-3.5 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Official Platform Outreach &amp; Community Channels
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Connect directly with AgriBridge Rwanda founders, field agents, and rural cooperatives.
            </p>
          </div>
        </div>

        <div className="text-[11px] font-medium text-emerald-800 dark:text-emerald-400">
          Minagri &middot; RAB &middot; 30 Districts Nationwide
        </div>
      </div>

      {/* Grid of Platform Links with Consistent AgriBridge Emblem Badging */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {OFFICIAL_CHANNELS.map((channel) => (
          <a
            key={channel.id}
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-500/50 dark:hover:border-emerald-600/50 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
            title={`Open ${channel.name} to reach ${channel.reachPerson}`}
          >
            <div>
              {/* Header: AgriBridge Emblem + Platform Icon */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  {/* Unified AgriBridge logo badge */}
                  <div className="w-5 h-5 rounded-md bg-emerald-800 flex items-center justify-center text-emerald-200">
                    <Sprout className="w-3 h-3 text-emerald-300" />
                  </div>
                  <span className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                    {channel.name}
                  </span>
                </div>

                {/* Platform SVG Icon */}
                <div className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  <PlatformIcon platform={channel.platform} className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Handle with quick copy */}
              <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/60 px-2 py-1 rounded-md">
                <span className="truncate">{channel.handle}</span>
                <button
                  type="button"
                  onClick={(e) => handleCopyHandle(channel, e)}
                  title="Copy handle or contact"
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 shrink-0 p-0.5"
                >
                  {copiedId === channel.id ? (
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              {/* Intended Reach & Person */}
              <div className="mt-2 text-[11px] space-y-0.5">
                <div className="font-semibold text-emerald-800 dark:text-emerald-400 truncate">
                  {channel.intendedReach}
                </div>
                <div className="text-stone-500 dark:text-stone-400 text-[10px] truncate">
                  Target: <span className="text-stone-700 dark:text-stone-300 font-medium">{channel.reachPerson}</span>
                </div>
              </div>
            </div>

            {/* Direct Open CTA Link */}
            <div className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] font-medium text-emerald-800 dark:text-emerald-400 group-hover:text-emerald-900 dark:group-hover:text-emerald-300">
              <span>Open Channel</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
