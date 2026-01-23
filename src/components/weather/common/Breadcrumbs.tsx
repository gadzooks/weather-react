// Breadcrumbs.tsx
// Reusable breadcrumb navigation component for location and hourly forecast pages

import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumbs.scss';

export interface BreadcrumbItem {
  label: string;
  to?: string; // If undefined, this is the current page (no link)
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className='breadcrumbs' aria-label='Breadcrumb'>
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} aria-current={isLast ? 'page' : undefined}>
              {item.to ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
