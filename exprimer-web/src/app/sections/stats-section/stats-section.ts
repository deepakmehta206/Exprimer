import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  input,
  signal,
} from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StatsData } from '../../core/models/cms.models';

gsap.registerPlugin(ScrollTrigger);

type StatView = {
  label: string;
  raw: string;
  target: number;
  suffix: string;
  numeric: boolean;
  display: string;
};

@Component({
  selector: 'app-stats-section',
  templateUrl: './stats-section.html',
  styleUrl: './stats-section.scss',
})
export class StatsSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<StatsData>();
  readonly items = signal<StatView[]>([]);

  readonly prepared = computed(() =>
    (this.data().items || []).map((item) => this.toStatView(item.value, item.label))
  );

  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  ngAfterViewInit(): void {
    this.items.set(
      this.prepared().map((item) => ({
        ...item,
        display: item.numeric ? `0${item.suffix}` : item.raw,
      }))
    );

    const el = this.root.nativeElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.ctx = gsap.context(() => {
      gsap.from('.stat', {
        autoAlpha: 0,
        y: 36,
        stagger: 0.12,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          if (reduce) {
            this.items.set(this.prepared().map((item) => ({ ...item, display: item.raw })));
            return;
          }
          this.animateCounts();
        },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  private animateCounts(): void {
    const current = this.items();
    current.forEach((item, index) => {
      if (!item.numeric) {
        this.patchDisplay(index, item.raw);
        return;
      }

      const state = { value: 0 };
      gsap.to(state, {
        value: item.target,
        duration: 1.8,
        delay: index * 0.12,
        ease: 'power3.out',
        onUpdate: () => {
          const n = Math.round(state.value);
          this.patchDisplay(index, `${n}${item.suffix}`);
        },
        onComplete: () => this.patchDisplay(index, item.raw),
      });
    });
  }

  private patchDisplay(index: number, display: string): void {
    this.items.update((list) =>
      list.map((item, i) => (i === index ? { ...item, display } : item))
    );
  }

  private toStatView(raw: string, label: string): StatView {
    const match = raw.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      return { label, raw, target: 0, suffix: '', numeric: false, display: raw };
    }
    return {
      label,
      raw,
      target: Number(match[1]),
      suffix: match[2] || '',
      numeric: true,
      display: raw,
    };
  }
}
