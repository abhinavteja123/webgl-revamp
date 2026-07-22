import React, { useState, useMemo, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PageLayout from '../components/layout/PageLayout';
import { CALENDLY_URL } from '../lib/constants';
import { Search, Globe, CreditCard, Wallet, Landmark, ShoppingBag, Shield, Lock, Network } from 'lucide-react';
import { useSceneEnabled } from '../three/SceneManager';

// Decorative 3D hero galaxy — lazy so it never blocks first paint; only mounts on capable, motion-OK devices.
const ConnectorsGalaxy = lazy(() => import('../three/ConnectorsGalaxy'));

type Connector = {
  name: string;
  logo: string;
  category: string;
  regions: string[];
};

const connectors: Connector[] = [
  // ── Processors ──
  { name: 'Stripe', logo: 'STRIPE.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Adyen', logo: 'ADYEN.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Checkout.com', logo: 'CHECKOUT.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Braintree', logo: 'BRAINTREE.svg', category: 'Processor', regions: ['Global'] },
  { name: 'CyberSource', logo: 'CYBERSOURCE.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Worldpay', logo: 'WORLDPAY.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Worldpay XML', logo: 'WORLDPAYXML.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Fiserv', logo: 'FISERV.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Fiserv CommerceHub', logo: 'FISERVCOMMERCEHUB.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Authorize.net', logo: 'AUTHORIZEDOTNET.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Square', logo: 'SQUARE.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Mollie', logo: 'MOLLIE.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'dLocal', logo: 'DLOCAL.svg', category: 'Processor', regions: ['Latin America'] },
  { name: 'PayU', logo: 'PAYU.svg', category: 'Processor', regions: ['Europe', 'Asia Pacific', 'Latin America'] },
  { name: 'Nuvei', logo: 'NUVEI.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Airwallex', logo: 'AIRWALLEX.svg', category: 'Processor', regions: ['Asia Pacific'] },
  { name: 'Rapyd', logo: 'RAPYD.svg', category: 'Processor', regions: ['Global'] },
  { name: 'BlueSnap', logo: 'BLUESNAP.svg', category: 'Processor', regions: ['Global'] },
  { name: 'NMI', logo: 'NMI.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Shift4', logo: 'SHIFT4.svg', category: 'Processor', regions: ['North America', 'Europe'] },
  { name: 'Noon', logo: 'NOON.svg', category: 'Processor', regions: ['Middle East & Africa'] },
  { name: 'Ebanx', logo: 'EBANX.svg', category: 'Processor', regions: ['Latin America'] },
  { name: 'Bambora', logo: 'BAMBORA.svg', category: 'Processor', regions: ['North America', 'Europe'] },
  { name: 'Helcim', logo: 'HELCIM.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Forte', logo: 'FORTE.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Stax', logo: 'STAX.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Elavon', logo: 'ELAVON.svg', category: 'Processor', regions: ['North America', 'Europe'] },
  { name: 'GlobalPay', logo: 'GLOBALPAY.svg', category: 'Processor', regions: ['Global'] },
  { name: 'MPGS', logo: 'MPGS.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Datatrans', logo: 'DATATRANS.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'Nexinets', logo: 'NEXINETS.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'Nexi XPay', logo: 'NEXIXPAY.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'Novalnet', logo: 'NOVALNET.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'Redsys', logo: 'REDSYS.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'PlaceToPay', logo: 'PLACETOPAY.svg', category: 'Processor', regions: ['Latin America'] },
  { name: 'PowerTranz', logo: 'POWERTRANZ.svg', category: 'Processor', regions: ['Latin America'] },
  { name: 'Moneris', logo: 'MONERIS.svg', category: 'Processor', regions: ['North America'] },
  { name: 'HiPay', logo: 'HIPAY.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'Paybox', logo: 'PAYBOX.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'Peach Payments', logo: 'PEACHPAYMENTS.svg', category: 'Processor', regions: ['Middle East & Africa'] },
  { name: 'Xendit', logo: 'XENDIT.svg', category: 'Processor', regions: ['Asia Pacific'] },
  { name: 'Silverflow', logo: 'SILVERFLOW.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'JPMorgan', logo: 'JPMORGAN.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Wells Fargo', logo: 'WELLSFARGO.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Bank of America', logo: 'BANKOFAMERICA.svg', category: 'Processor', regions: ['North America'] },
  { name: 'TSYS', logo: 'TSYS.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Adyen Platform', logo: 'ADYENPLATFORM.svg', category: 'Processor', regions: ['Global'] },
  { name: 'ACI', logo: 'ACI.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Worldline', logo: 'WORLDLINE.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'Paysafe', logo: 'PAYSAFE.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Razorpay', logo: 'RAZORPAY.svg', category: 'Processor', regions: ['Asia Pacific'] },
  { name: 'Paystack', logo: 'PAYSTACK.svg', category: 'Processor', regions: ['Middle East & Africa'] },
  { name: 'Bambora APAC', logo: 'BAMBORAAPAC.svg', category: 'Processor', regions: ['Asia Pacific'] },
  { name: 'Fiserv EMEA', logo: 'FISERVEMEA.svg', category: 'Processor', regions: ['Europe', 'Middle East & Africa'] },
  { name: 'Fiserv IPG', logo: 'FISERVIPG.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Worldpay Modular', logo: 'WORLDPAYMODULAR.svg', category: 'Processor', regions: ['Global'] },
  { name: 'Worldpay Vantiv', logo: 'WORLDPAYVANTIV.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Barclaycard', logo: 'BARCLAYCARD.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'Authipay', logo: 'AUTHIPAY.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'Unzer', logo: 'UNZER.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'MultiSafepay', logo: 'MULTISAFEPAY.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'TrustPayments', logo: 'TRUSTPAYMENTS.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'Fiuu', logo: 'FIUU.svg', category: 'Processor', regions: ['Asia Pacific'] },
  { name: 'Nomupay', logo: 'NOMUPAY.svg', category: 'Processor', regions: ['Europe', 'Asia Pacific'] },
  { name: 'GlobePay', logo: 'GLOBEPAY.svg', category: 'Processor', regions: ['Asia Pacific'] },
  { name: 'Finix', logo: 'FINIX.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Celero', logo: 'CELERO.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Revolv3', logo: 'REVOLV3.svg', category: 'Processor', regions: ['North America'] },
  { name: 'Zen', logo: 'ZEN.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'FacilitaPay', logo: 'FACILITAPAY.svg', category: 'Processor', regions: ['Latin America'] },
  { name: 'NetsEllerPay', logo: 'NETSELLERPAY.svg', category: 'Processor', regions: ['Europe'] },
  { name: 'TrustPay', logo: 'TRUSTPAY.svg', category: 'Processor', regions: ['Europe'] },

  // ── Wallets ──
  { name: 'Apple Pay', logo: 'APPLE_PAY.svg', category: 'Wallet', regions: ['Global'] },
  { name: 'Google Pay', logo: 'GOOGLE_PAY.svg', category: 'Wallet', regions: ['Global'] },
  { name: 'Amazon Pay', logo: 'AMAZONPAY.svg', category: 'Wallet', regions: ['Global'] },
  { name: 'PayPal', logo: 'PAYPAL.svg', category: 'Wallet', regions: ['Global'] },
  { name: 'PayTM', logo: 'PAYTM.svg', category: 'Wallet', regions: ['Asia Pacific'] },
  { name: 'PhonePe', logo: 'PHONEPE.svg', category: 'Wallet', regions: ['Asia Pacific'] },

  // ── Bank Transfer ──
  { name: 'GoCardless', logo: 'GOCARDLESS.svg', category: 'Bank Transfer', regions: ['Europe'] },
  { name: 'TrueLayer', logo: 'TRUELAYER.svg', category: 'Bank Transfer', regions: ['Europe'] },
  { name: 'Plaid', logo: 'PLAID.svg', category: 'Bank Transfer', regions: ['North America'] },
  { name: 'Trustly', logo: 'TRUSTLY.svg', category: 'Bank Transfer', regions: ['Europe'] },
  { name: 'Volt', logo: 'VOLT.svg', category: 'Bank Transfer', regions: ['Europe'] },
  { name: 'Wise', logo: 'WISE.svg', category: 'Bank Transfer', regions: ['Global'] },
  { name: 'iDEAL', logo: 'IDEAL.svg', category: 'Bank Transfer', regions: ['Europe'] },
  { name: 'SEPA / Sofort', logo: 'SOFORT.svg', category: 'Bank Transfer', regions: ['Europe'] },
  { name: 'Giropay', logo: 'GIROPAY.svg', category: 'Bank Transfer', regions: ['Europe'] },
  { name: 'EPS', logo: 'EPS.svg', category: 'Bank Transfer', regions: ['Europe'] },
  { name: 'Token.io', logo: 'TOKENIO.svg', category: 'Bank Transfer', regions: ['Europe'] },
  { name: 'InesaPay', logo: 'INESPAY.svg', category: 'Bank Transfer', regions: ['Europe'] },
  { name: 'Dwolla', logo: 'DWOLLA.svg', category: 'Bank Transfer', regions: ['North America'] },

  // ── BNPL ──
  { name: 'Klarna', logo: 'KLARNA.svg', category: 'BNPL', regions: ['Global'] },
  { name: 'Affirm', logo: 'AFFIRM.svg', category: 'BNPL', regions: ['North America'] },
  { name: 'Afterpay', logo: 'AFTERPAY.svg', category: 'BNPL', regions: ['North America', 'Europe', 'Asia Pacific'] },

  // ── Fraud & Risk ──
  { name: 'Signifyd', logo: 'SIGNIFYD.svg', category: 'Fraud & Risk', regions: ['Global'] },
  { name: 'Riskified', logo: 'RISKIFIED.svg', category: 'Fraud & Risk', regions: ['Global'] },

  // ── 3DS ──
  { name: 'Netcetera', logo: 'NETCETERA.svg', category: '3DS', regions: ['Global'] },
  { name: 'Juspay 3DS Server', logo: 'JUSPAYTHREEDSSERVER.svg', category: '3DS', regions: ['Global'] },
  { name: 'ThreeDSecure.io', logo: 'THREEDSECUREIO.svg', category: '3DS', regions: ['Global'] },

  // ── Card Networks ──
  { name: 'Visa', logo: 'VISA.svg', category: 'Card Network', regions: ['Global'] },
  { name: 'Mastercard', logo: 'MASTERCARD.svg', category: 'Card Network', regions: ['Global'] },
  { name: 'American Express', logo: 'AMERICANEXPRESS.svg', category: 'Card Network', regions: ['Global'] },
  { name: 'Discover', logo: 'DISCOVER.svg', category: 'Card Network', regions: ['Global'] },
  { name: 'Diners Club', logo: 'DINERSCLUB.svg', category: 'Card Network', regions: ['Global'] },
  { name: 'JCB', logo: 'JCB.svg', category: 'Card Network', regions: ['Global'] },
  { name: 'UnionPay', logo: 'UNIONPAY.svg', category: 'Card Network', regions: ['Asia Pacific'] },
  { name: 'Interac', logo: 'INTERAC.svg', category: 'Card Network', regions: ['North America'] },
  { name: 'Cartes Bancaires', logo: 'CARTESBANCAIRES.svg', category: 'Card Network', regions: ['Europe'] },
];

const categories = ['All', 'Processor', 'Wallet', 'Bank Transfer', 'BNPL', 'Fraud & Risk', '3DS', 'Card Network'];
const regions = ['All Regions', 'Global', 'North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'];

const categoryIcons: Record<string, React.ReactNode> = {
  'All': <Globe size={14} />,
  'Processor': <CreditCard size={14} />,
  'Wallet': <Wallet size={14} />,
  'Bank Transfer': <Landmark size={14} />,
  'BNPL': <ShoppingBag size={14} />,
  'Fraud & Risk': <Shield size={14} />,
  '3DS': <Lock size={14} />,
  'Card Network': <Network size={14} />,
};

const ConnectorsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRegion, setActiveRegion] = useState('All Regions');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestedName, setRequestedName] = useState('');
  const [requestedEmail, setRequestedEmail] = useState('');
  const [requestNotes, setRequestNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedName || !requestedEmail) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setIsSubmitted(false);
      setRequestedName('');
      setRequestedEmail('');
      setRequestNotes('');
      alert(`Request received! We will coordinate the implementation of ${requestedName} with you shortly.`);
    }, 1500);
  };

  const sceneEnabled = useSceneEnabled();

  const filtered = useMemo(() => {
    return connectors.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
      const matchesRegion = activeRegion === 'All Regions' || c.regions.includes(activeRegion);
      return matchesSearch && matchesCategory && matchesRegion;
    });
  }, [search, activeCategory, activeRegion]);

  return (
    <PageLayout mainClassName="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-12 pb-24 relative bg-canvas dark:bg-[#0B0B0B] transition-colors duration-300">
        {/* Decorative 3D galaxy hero — above the heading; renders nothing on low-tier / reduced-motion */}
        {sceneEnabled && (
          <Suspense fallback={null}>
            <ConnectorsGalaxy />
          </Suspense>
        )}

        {/* Page header */}
        <div className="mb-10 mt-6">
          <h1 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tighter text-obsidian dark:text-white leading-[1.1] mb-3">
            200+ Payment Connectors
          </h1>
          <p className="font-sans text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
            Processors, wallets, banks, BNPL, fraud tools, and card networks. Global coverage, one integration.
          </p>
        </div>

        {/* Search & Filters Toolbar */}
        <div className="bg-white dark:bg-[#121212] border border-gray-200/80 dark:border-white/5 rounded-2xl p-6 shadow-sm mb-8 space-y-6 transition-colors">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30" />
            <label htmlFor="connector-search" className="sr-only">Search connectors</label>
            <input
              id="connector-search"
              type="search"
              placeholder="Search connectors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="focus-ring w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/10 rounded-lg font-sans text-sm text-obsidian dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/35 focus:border-accent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 pt-4 border-t border-gray-150/40 dark:border-white/5">
            {/* Category */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const count = cat === 'All' ? connectors.length : connectors.filter(c => c.category === cat).length;
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={isActive}
                    className={`focus-ring inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-accent text-white shadow-sm'
                        : 'bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {categoryIcons[cat]}
                    {cat === 'All' ? 'All' : cat}
                    <span className={isActive ? 'text-white/70' : 'text-gray-400 dark:text-white/20'}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Region */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-extrabold text-gray-450 dark:text-white/30 uppercase tracking-widest mr-2 select-none">Region</span>
              {regions.map((region) => {
                const isActive = activeRegion === region;
                return (
                  <button
                    key={region}
                    onClick={() => setActiveRegion(region)}
                    aria-pressed={isActive}
                    className={`focus-ring px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${
                      isActive
                        ? 'bg-obsidian dark:bg-white text-white dark:text-obsidian shadow-sm'
                        : 'text-gray-650 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {region === 'All Regions' ? 'All' : region}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-xs font-bold text-gray-500 dark:text-white/40 mb-5 select-none" role="status" aria-live="polite">
          {filtered.length} connector{filtered.length !== 1 ? 's' : ''}
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          {activeRegion !== 'All Regions' ? ` · ${activeRegion}` : ''}
          {search ? ` · "${search}"` : ''}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((connector) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  key={connector.name}
                  className="group bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-xl p-4 transition-all duration-300 hover:border-accent/30 dark:hover:border-accent/30 hover:shadow-lg hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-accent/20"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    {/* Visual container for Logo: White backdrop is kept for clarity since SVG logos have hardcoded colors */}
                    <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden bg-white border border-gray-100 dark:border-white/10 p-2 group-hover:border-accent/15 transition-all">
                      <img
                        src={`/connectors/${connector.logo}`}
                        alt={connector.name}
                        className="w-12 h-12 object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <h3 className="font-sans text-[13px] font-bold text-obsidian dark:text-white leading-tight">
                      {connector.name}
                    </h3>
                    <div className="text-[9px] font-extrabold text-gray-450 dark:text-white/30 uppercase tracking-widest space-x-1 select-none">
                      {connector.regions.map((region, idx) => (
                        <span key={idx}>{region}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-xl shadow-sm">
            <p className="font-sans text-sm font-semibold text-gray-400 dark:text-gray-500 mb-2">No connectors found matching filters</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); setActiveRegion('All Regions'); }}
              className="text-xs font-bold text-accent hover:underline focus:outline-none focus:ring-2 focus:ring-accent/20 rounded px-2.5 py-1.5"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-obsidian dark:text-white">Need a connector not listed here?</h3>
            <p className="font-sans text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
              We integrate custom local processors and third-party APIs within one week, at zero extra cost.
            </p>
          </div>
          <button
            onClick={() => setShowRequestModal(true)}
            className="focus-ring flex-shrink-0 bg-accent text-white text-xs font-bold px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors text-center shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            Request Custom Integration
          </button>
        </div>

        {/* Request Modal */}
        <AnimatePresence>
          {showRequestModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { if (e.target === e.currentTarget) setShowRequestModal(false); }}
              className="fixed inset-0 bg-black/45 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 6 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className="bg-white dark:bg-[#151518] border border-gray-200 dark:border-white/10 rounded-2xl max-w-md w-full shadow-2xl p-6 overflow-hidden transition-colors"
              >
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100 dark:border-white/5">
                  <h3 className="text-base font-bold text-obsidian dark:text-white">Request Custom Connector</h3>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="text-gray-400 dark:text-white/40 hover:text-obsidian dark:hover:text-white text-sm font-bold"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="connector-name" className="block text-xs font-bold text-gray-650 dark:text-white/60 mb-1.5">Connector / PSP Name</label>
                    <input
                      id="connector-name"
                      type="text"
                      required
                      placeholder="e.g. M-Pesa, PayFast, custom bank gateway..."
                      value={requestedName}
                      onChange={(e) => setRequestedName(e.target.value)}
                      className="focus-ring w-full px-3.5 py-2.5 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/10 rounded-lg text-sm text-obsidian dark:text-white placeholder:text-gray-450 focus:border-accent"
                    />
                  </div>

                  <div>
                    <label htmlFor="requester-email" className="block text-xs font-bold text-gray-650 dark:text-white/60 mb-1.5">Your Corporate Email</label>
                    <input
                      id="requester-email"
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={requestedEmail}
                      onChange={(e) => setRequestedEmail(e.target.value)}
                      className="focus-ring w-full px-3.5 py-2.5 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/10 rounded-lg text-sm text-obsidian dark:text-white placeholder:text-gray-450 focus:border-accent"
                    />
                  </div>

                  <div>
                    <label htmlFor="request-notes" className="block text-xs font-bold text-gray-650 dark:text-white/60 mb-1.5">Implementation Notes (Optional)</label>
                    <textarea
                      id="request-notes"
                      rows={3}
                      placeholder="Preferred regions, sandbox API details, timeline requirements..."
                      value={requestNotes}
                      onChange={(e) => setRequestNotes(e.target.value)}
                      className="focus-ring w-full px-3.5 py-2.5 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/10 rounded-lg text-sm text-obsidian dark:text-white placeholder:text-gray-450 focus:border-accent"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="px-4 py-2.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-xs font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitted}
                      className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-xs font-bold shadow-sm transition-all disabled:bg-gray-700"
                    >
                      {isSubmitted ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </PageLayout>
  );
};

export default ConnectorsPage;
