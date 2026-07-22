import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useRouteTransition } from './hooks/useRouteTransition';

const HomePage = React.lazy(() => import('./pages/Home'));
const BlogPage = React.lazy(() => import('./pages/Blog'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPost'));
const ConnectorsPage = React.lazy(() => import('./pages/Connectors'));
const AboutPage = React.lazy(() => import('./pages/About'));
const CareersPage = React.lazy(() => import('./pages/Careers'));

const PageFallback = () => (
  <div className="min-h-screen bg-canvas flex items-center justify-center" aria-label="Loading page">
    <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  const isLoading = useRouteTransition();

  return (
    <>
      {isLoading && (
        <div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-accent-hover z-50 animate-pulse"
          role="progressbar"
          aria-label="Page loading"
        />
      )}

      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/connectors" element={<ConnectorsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/careers" element={<CareersPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
