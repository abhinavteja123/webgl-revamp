import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import PageLayout from "../components/layout/PageLayout";
import { blogPosts } from "../blogs/types";

const BlogPage: React.FC = () => {
  return (
    <PageLayout mainClassName="flex-grow bg-canvas dark:bg-[#0B0B0B] transition-colors duration-300 min-h-screen">
      <div className="container mx-auto max-w-[950px] px-6 py-12 md:px-10 md:py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 mt-6"
        >
          <span className="inline-block bg-accent/10 border border-accent/30 text-accent px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider mb-6">
            Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-obsidian dark:text-white tracking-tighter">
            Latest <span className="text-accent">Insights</span>
          </h1>
          <p className="text-base md:text-lg font-semibold text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
            Thought leadership, research, and insights from the BetterSwitch team on the future of payments.
          </p>
        </motion.div>

        <div className="space-y-8">
          {blogPosts.map((post, index) => {
            const coverImage = post.slug === 'agentic-commerce-reckoning' 
              ? '/blog_agentic_commerce.png' 
              : '/blog_cbdc_catalyst.png';

            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="focus-ring block bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 hover:shadow-xl hover:border-accent/40 dark:hover:border-accent/40 transition-all duration-300 group"
                >
                  <article className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Thumbnail Column */}
                    <div className="md:col-span-4 shrink-0 rounded-xl overflow-hidden border border-gray-200/50 dark:border-white/5 bg-gray-50 dark:bg-[#1A1A1E] h-40 flex items-center justify-center">
                      <img 
                        src={coverImage} 
                        alt={`${post.title} cover`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Content Column */}
                    <div className="md:col-span-8 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center gap-4 mb-3 flex-wrap select-none">
                          <span className="bg-accent/10 text-accent px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide">
                            {post.category}
                          </span>
                          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs font-semibold">
                            <Calendar size={13} aria-hidden="true" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs font-semibold">
                            <Clock size={13} aria-hidden="true" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-bold text-obsidian dark:text-white mb-3 group-hover:text-accent dark:group-hover:text-accent transition-colors leading-tight">
                          {post.title}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium leading-relaxed mb-5 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-accent font-bold text-sm group-hover:gap-2.5 transition-all mt-auto">
                        <span>Read Article</span>
                        <ArrowRight size={16} aria-hidden="true" />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-20" role="status">
            <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default BlogPage;
