import React, { Suspense } from 'react';
import ImmersiveLayout from '../components/immersive/ImmersiveLayout';
import HeroScene01 from '../components/immersive/HeroScene01';
import Logos from '../components/Logos';
import Footer from '../components/Footer';

// Sections below the Hero are being rebuilt into their immersive scenes one by one
// (REDESIGN-PLAN.md §2). Until then they render on the dark stage via their dark: variants.
const Solutions = React.lazy(() => import('../components/Solutions'));
const Features = React.lazy(() => import('../components/Features'));
const Dashboard = React.lazy(() => import('../components/Dashboard'));
const Testimonials = React.lazy(() => import('../components/Testimonials'));
const Pricing = React.lazy(() => import('../components/Pricing'));
const CTA = React.lazy(() => import('../components/CTA'));

const SectionFallback = () => (
  <div className="flex justify-center py-24" aria-hidden="true">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
  </div>
);

const HomePage: React.FC = () => (
  <ImmersiveLayout>
    <main id="main-content">
      <HeroScene01 />
      <Logos />
      <Suspense fallback={<SectionFallback />}>
        <Solutions />
        <Features />
        <Dashboard />
        <Testimonials />
        <Pricing />
        <CTA />
      </Suspense>
    </main>
    <Footer />
  </ImmersiveLayout>
);

export default HomePage;
