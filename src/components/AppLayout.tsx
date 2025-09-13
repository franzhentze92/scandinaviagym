import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Navigation from './Navigation';
import PromoBanner from './PromoBanner';
import Hero from './Hero';
import LocationsGrid from './LocationsGrid';
import PricingPlans from './PricingPlans';
import ClassSchedule from './ClassSchedule';
import TrainerGrid from './TrainerGrid';
import Features from './Features';
import Testimonials from './Testimonials';
import Newsletter from './Newsletter';
import Footer from './Footer';

const AppLayout: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-black">
      <PromoBanner />
      <Navigation />
      <main>
        <Hero />
        <Features />
        <LocationsGrid />
        <PricingPlans />
        <ClassSchedule />
        <TrainerGrid />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;