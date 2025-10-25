import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import HeroBanner from "./HeroBanner";
import Navbar from "./Navbar";

export type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const banner = document.getElementById("hero-banner");
      const bannerHeight = banner ? banner.offsetHeight : 360;
      const trigger = Math.max(80, bannerHeight - 120);
      setScrolled(window.scrollY > trigger);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", mt: 0 }}>
      <HeroBanner />

      <Header scrolled={scrolled} />
      <Navbar scrolled={scrolled} />

      {/* Nội dung chính */}
      <Box component="main" sx={{ flex: 1, width: "100%" }}>
        {/* <Toolbar sx={{ minHeight: { xs: 56, md: 64 } }} /> */}
        {/* <Toolbar sx={{ minHeight: 48 }} /> */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>{children}</Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default MainLayout;
