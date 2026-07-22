import React from 'react';

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight?: boolean;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  image: string;
}

export interface Statistic {
  val: string;
  lbl: string;
}

export interface LifecycleStep {
  id: string;
  threshold: number;
  label: string;
  title: string;
  desc: string;
  content: React.ReactNode;
}