import { Component, input } from '@angular/core';
import {
  AudiencesData,
  CollectionsData,
  CtaData,
  FeatureListData,
  HeroData,
  OfficesData,
  PageSection,
  ProcessData,
  ServicesData,
  StatsData,
  TrustedData,
} from '../../core/models/cms.models';
import { AudiencesSection } from '../audiences-section/audiences-section';
import { CollectionsSection } from '../collections-section/collections-section';
import { CtaSection } from '../cta-section/cta-section';
import { FeatureListSection } from '../feature-list-section/feature-list-section';
import { HeroSection } from '../hero-section/hero-section';
import { OfficesSection } from '../offices-section/offices-section';
import { ProcessSection } from '../process-section/process-section';
import { ServicesSection } from '../services-section/services-section';
import { StatsSection } from '../stats-section/stats-section';
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
}
