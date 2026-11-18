import { Component, input } from '@angular/core';
import {
  CtaData,
  FeatureListData,
  HeroData,
  OfficesData,
  PageSection,
  ProcessData,
  ServicesData,
  StatsData,
} from '../../core/models/cms.models';
import { CtaSection } from '../cta-section/cta-section';
import { FeatureListSection } from '../feature-list-section/feature-list-section';
import { HeroSection } from '../hero-section/hero-section';
import { OfficesSection } from '../offices-section/offices-section';
import { ProcessSection } from '../process-section/process-section';
import { ServicesSection } from '../services-section/services-section';
import { StatsSection } from '../stats-section/stats-section';

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
}
