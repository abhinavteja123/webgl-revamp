/**
 * Shared constants for BetterSwitch — copied verbatim from the source app.
 * See ../../memory/CONTENT-INVENTORY.md (frozen content contract).
 */

export const colors = {
  primary: '#e27533',
  primaryHover: '#F28C38',
  obsidian: '#111111',
  obsidianLight: '#1A1A1A',
  canvas: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E5E5E5',
  green: '#22c55e',
} as const;

export const fonts = {
  sans: '"Figtree", Inter, sans-serif',
  display: '"Figtree", sans-serif',
  mono: '"JetBrains Mono", monospace',
  outfit: '"Outfit", sans-serif',
} as const;

export const CALENDLY_URL = 'https://calendly.com/biz-betterswitch/30min';

export const navLinks = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'Customers', href: '/#customers' },
  { label: 'Connectors', href: '/connectors' },
  { label: 'Blog', href: '/blog' },
] as const;

export const platformLinks = [
  { label: 'Overview', href: '/#platform' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Connectors', href: '/connectors' },
] as const;

export const companyLinks = [
  { label: 'Blog', href: '/blog' },
  { label: 'Careers', href: '/careers' },
  { label: 'About', href: '/about' },
] as const;

export const footerLinks = navLinks;

export const partnerLogos = [
  { name: 'dodopayments', href: 'https://dodopayments.com/', style: 'font-sans' },
  { name: 'VAULTERA', href: 'https://www.vaultera.co/', style: 'font-sans' },
  { name: 'PesaSwap', href: 'https://pesaswap.com/info/#/', style: 'font-sans' },
  { name: 'paycode', href: 'https://www.paycode.com/', style: 'font-mono' },
] as const;
