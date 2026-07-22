export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'cbdc-catalyst',
    title: 'CBDC — The Catalyst Shifting the Global Landscape',
    excerpt: 'Every central bank is evaluating the future of money. In the age of AI and quantum, the real question is: who controls the code it runs on?',
    date: 'April 2, 2026',
    readTime: '7 min read',
    category: 'Research Insights',
  },
  {
    slug: 'agentic-commerce-reckoning',
    title: 'The Agentic Commerce Reckoning',
    excerpt: 'What Payment Leaders Need to Know—And Why Your Stack Isn\'t Ready for 2030',
    date: 'March 10, 2026',
    readTime: '8 min read',
    category: 'Research Insights',
  },
];
