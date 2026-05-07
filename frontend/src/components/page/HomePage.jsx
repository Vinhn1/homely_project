import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import HeroSection from '@/components/shared/HeroSection'
import CategorySection from '@/components/shared/CategorySection'
import FeaturedListings from '@/components/shared/FeaturedListings'
import CitySection from '@/components/shared/CitySection'
import TestimonialsSection from '@/components/shared/TestimonialsSection'
import LandlordCTA from '@/components/shared/LandlordCTA'
import Footer from '@/components/shared/Footer'

function HomePage() {
  return (
    <div className="trotot-app">
      <Navbar />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedListings />
        <CitySection />
        <TestimonialsSection />
        <LandlordCTA />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
