import { Component, input } from '@angular/core';
import {
  AudiencesData,
  ChecksData,
  CollectionsData,
  CtaData,
  FaqData,
  FeatureListData,
  HeroData,
  HighlightsData,
  IndustryMixData,
  OfficesData,
  PageSection,
  ProcessData,
  ResumeData,
  RolesData,
  ServicesData,
  ShowcaseData,
  StatsData,
  TestimonialsData,
  TrustedData,
} from '../../core/models/cms.models';
import { AudiencesSection } from '../audiences-section/audiences-section';
import { ChecksSection } from '../checks-section/checks-section';
import { CollectionsSection } from '../collections-section/collections-section';
import { CtaSection } from '../cta-section/cta-section';
import { FaqSection } from '../faq-section/faq-section';
import { FeatureListSection } from '../feature-list-section/feature-list-section';
import { HeroSection } from '../hero-section/hero-section';
import { HighlightsSection } from '../highlights-section/highlights-section';
import { IndustryMixSection } from '../industry-mix-section/industry-mix-section';
import { OfficesSection } from '../offices-section/offices-section';
import { ProcessSection } from '../process-section/process-section';
import { ResumeSection } from '../resume-section/resume-section';
import { RolesSection } from '../roles-section/roles-section';
import { ServicesSection } from '../services-section/services-section';
import { ShowcaseSection } from '../showcase-section/showcase-section';
import { StatsSection } from '../stats-section/stats-section';
import { TestimonialsSection } from '../testimonials-section/testimonials-section';
import { TrustedSection } from '../trusted-section/trusted-section';

@Component({
  selector: 'app-section-host',
  imports: [
    HeroSection,
    StatsSection,
    ServicesSection,
    ProcessSection,
    CtaSection,
    OfficesSection,
    FeatureListSection,
    CollectionsSection,
    AudiencesSection,
    TrustedSection,
    HighlightsSection,
    IndustryMixSection,
    TestimonialsSection,
    RolesSection,
    ResumeSection,
    ChecksSection,
    ShowcaseSection,
    FaqSection,
  ],
  templateUrl: './section-host.html',
})
export class SectionHost {
  readonly sections = input.required<PageSection[]>();

  asHero(data: Record<string, unknown>): HeroData {
    return data as unknown as HeroData;
  }

  asStats(data: Record<string, unknown>): StatsData {
    return data as unknown as StatsData;
  }

  asServices(data: Record<string, unknown>): ServicesData {
    return data as unknown as ServicesData;
  }

  asProcess(data: Record<string, unknown>): ProcessData {
    return data as unknown as ProcessData;
  }

  asCta(data: Record<string, unknown>): CtaData {
    return data as unknown as CtaData;
  }

  asOffices(data: Record<string, unknown>): OfficesData {
    return data as unknown as OfficesData;
  }

  asFeatures(data: Record<string, unknown>): FeatureListData {
    return data as unknown as FeatureListData;
  }

  asCollections(data: Record<string, unknown>): CollectionsData {
    return data as unknown as CollectionsData;
  }

  asAudiences(data: Record<string, unknown>): AudiencesData {
    return data as unknown as AudiencesData;
  }

  asTrusted(data: Record<string, unknown>): TrustedData {
    return data as unknown as TrustedData;
  }

  asHighlights(data: Record<string, unknown>): HighlightsData {
    return data as unknown as HighlightsData;
  }

  asIndustryMix(data: Record<string, unknown>): IndustryMixData {
    return data as unknown as IndustryMixData;
  }

  asTestimonials(data: Record<string, unknown>): TestimonialsData {
    return data as unknown as TestimonialsData;
  }

  asRoles(data: Record<string, unknown>): RolesData {
    return data as unknown as RolesData;
  }

  asResume(data: Record<string, unknown>): ResumeData {
    return data as unknown as ResumeData;
  }

  asChecks(data: Record<string, unknown>): ChecksData {
    return data as unknown as ChecksData;
  }

  asShowcase(data: Record<string, unknown>): ShowcaseData {
    return data as unknown as ShowcaseData;
  }

  asFaq(data: Record<string, unknown>): FaqData {
    return data as unknown as FaqData;
  }
}
