import React, { useState, useEffect } from "react";
import MyCustomCarousel from "../components/Carousel/Carousel";
import HomeBanner from "../components/HomeBanner/HomeBanner";
import Partner from "../components/Partners/Partner";
import WhyUs from "../components/WhyUs/WhyUs";
import FAQHome from "../components/FAQ/FAQHome";

const Home = () => {
  return (
    <main className="main-content">
      <section className="hero">
        <MyCustomCarousel />
        <HomeBanner />
        <Partner />
        <WhyUs />
        <FAQHome />
      </section>
    </main>
  );
};

export default Home;
