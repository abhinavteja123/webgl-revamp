import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-gray-600 mb-8 flex-wrap"
    >
      {items.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <ChevronRight
              size={16}
              className="text-gray-400 flex-shrink-0"
              aria-hidden="true"
            />
          )}
          {index < items.length - 1 ? (
            <a
              href={item.href}
              className="hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded px-1"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
