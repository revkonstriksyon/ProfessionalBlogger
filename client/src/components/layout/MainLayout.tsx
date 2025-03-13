import React, { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BreakingNews from "@/components/layout/BreakingNews";
import BackToTop from "@/components/layout/BackToTop";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <BreakingNews />
      {children}
      <Footer />
      <BackToTop />
    </>
  );
};

export default MainLayout;
