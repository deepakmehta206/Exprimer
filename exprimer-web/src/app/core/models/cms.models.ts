export interface SiteSettings {
  id: number;
  brandName: string;
  tagline: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  whatsApp: string;
  linkedIn?: string;
  instagram?: string;
  facebook?: string;
}

export interface PageSection {
  id: number;
  type: string;
  sortOrder: number;
  data: Record<string, unknown>;
}

export interface CmsPage {
  slug: string;
  title: string;
  seoDescription: string;
  sections: PageSection[];
}

export interface LeadEnquiry {
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  message: string;
}

export interface HeroData {
  brand: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  primaryCtaHref: string;
  secondaryCta: string;
  secondaryCtaHref: string;
  imageUrl: string;
}

export interface StatsData {
  items: Array<{ value: string; label: string }>;
}

export interface ServicesData {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: Array<{
    slug: string;
    title: string;
    summary: string;
    description: string;
    accent: string;
    imageUrl?: string;
  }>;
}

export interface ProcessData {
  id?: string;
  eyebrow: string;
  title: string;
  steps: Array<{ number: string; title: string; text: string }>;
}

export interface CtaData {
  id?: string;
  title: string;
  subtitle: string;
  bullets: string[];
  ctaLabel: string;
}

export interface OfficesData {
  title: string;
  items: Array<{ city: string; country: string; address: string }>;
}

export interface FeatureListData {
  title: string;
  items: Array<{ text: string }>;
}

export interface CollectionsData {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  items: Array<{
    title: string;
    hours: string;
    titles: string;
    accent?: string;
    imageUrl?: string;
  }>;
}

export interface AudiencesData {
  eyebrow: string;
  title: string;
  items: Array<{ text: string }>;
}

export interface TrustedData {
  eyebrow: string;
  title: string;
  items: Array<{ name: string; logoUrl?: string }>;
}

export interface HighlightsData {
  eyebrow: string;
  title: string;
  subtitle?: string;
  items: Array<{ title: string; text: string; accent?: string }>;
}

export interface IndustryMixData {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: Array<{ label: string; value: string; percent: number }>;
}

export interface TestimonialsData {
  eyebrow: string;
  title: string;
  items: Array<{ quote: string; name: string; role: string }>;
}

export interface RolesData {
  eyebrow: string;
  title: string;
  subtitle?: string;
  items: Array<{ label: string }>;
}
