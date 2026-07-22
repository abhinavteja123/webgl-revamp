import React from 'react';
import { motion } from 'motion/react';
import Header from '../Header';
import Footer from '../Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  mainClassName?: string;
  showFooter?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  mainClassName = '',
  showFooter = true,
}) => {
  return (
    <div className="w-full relative bg-canvas min-h-screen">
      <Header />
      <motion.main
        id="main-content"
        className={mainClassName}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
