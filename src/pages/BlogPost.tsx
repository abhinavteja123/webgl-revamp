import React, { Suspense, lazy } from "react";
import { useParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Breadcrumb } from "../components/Breadcrumb";

interface BlogMeta {
  title: string;
  slug: string;
}

const blogLoaders: Record<string, () => Promise<{ default: React.FC }>> = {
  'agentic-commerce-reckoning': () => import('../blogs/agentic-commerce-reckoning'),
  'cbdc-catalyst': () => import('../blogs/cbdc-catalyst'),
};

const blogMeta: Record<string, BlogMeta> = {
  'agentic-commerce-reckoning': { title: 'Agentic Commerce Reckoning', slug: 'agentic-commerce-reckoning' },
  'cbdc-catalyst': { title: 'CBDC - The Catalyst', slug: 'cbdc-catalyst' },
};

const BlogPostFallback = () => (
  <div className="min-h-screen bg-canvas dark:bg-[#0B0B0B] flex items-center justify-center" aria-label="Loading article">
    <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
  </div>
);

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug || !blogLoaders[slug]) {
    return <Navigate to="/blog" replace />;
  }

  const meta = blogMeta[slug];
  const BlogComponent = lazy(blogLoaders[slug]);
  const allBlogs = Object.values(blogMeta);
  const currentIndex = allBlogs.findIndex(b => b.slug === slug);
  const nextBlog = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;

  return (
    <div className="relative min-h-screen bg-canvas dark:bg-[#0B0B0B] text-obsidian dark:text-white font-sans transition-colors duration-300">
      <div className="px-6 md:px-12 lg:px-20 py-4 bg-white dark:bg-[#121212] border-b border-gray-200/50 dark:border-white/5 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: meta.title, href: `/blog/${slug}` },
            ]}
          />
        </div>
      </div>

      <main id="main-content" className="relative z-10">
        <Suspense fallback={<BlogPostFallback />}>
          <div className="dark:text-white/90">
            <BlogComponent />
          </div>
        </Suspense>

        <div className="px-6 md:px-12 lg:px-20 py-12 bg-canvas dark:bg-[#0E0E0E] border-t border-gray-200 dark:border-white/5 transition-colors">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <a
                href="/blog"
                className="focus-ring flex items-center gap-2 text-sm font-bold text-accent hover:text-accent-hover transition-colors rounded-lg px-3 py-2 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Back to All Posts
              </a>

              {nextBlog && (
                <a
                  href={`/blog/${nextBlog.slug}`}
                  className="focus-ring flex items-center gap-2 text-sm font-bold text-accent hover:text-accent-hover transition-colors rounded-lg px-3 py-2 bg-white dark:bg-[#1A1A1E] border border-gray-200 dark:border-white/5 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                  title={`Read: ${nextBlog.title}`}
                >
                  Next Post: {nextBlog.title}
                  <ArrowLeft size={16} className="rotate-180" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPostPage;
