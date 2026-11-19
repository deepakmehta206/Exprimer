import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  ViewChild,
  afterNextRender,
  computed,
  inject,
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
  isCountries: boolean;
};

@Component({
  selector: 'app-stats-section',
  templateUrl: './stats-section.html',
  styleUrl: './stats-section.scss',
})
export class StatsSection implements AfterViewInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly injector = inject(Injector);

  readonly data = input.required<StatsData>();
  readonly items = signal<StatView[]>([]);
  readonly mapOpen = signal(false);
  readonly mapReady = signal(false);

  readonly prepared = computed(() =>
    (this.data().items || []).map((item) => this.toStatView(item.value, item.label))
  );

  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  @ViewChild('mapHost') mapHost?: ElementRef<HTMLElement>;

  private ctx?: gsap.Context;
  private closeTimer = 0;
  private openTimer = 0;
  private mapSvgCached = '';
  private mapInjected = false;
  private highlightTimers: gsap.core.Tween[] = [];

  ngAfterViewInit(): void {
    this.items.set(
      this.prepared().map((item) => ({
        ...item,
        display: item.numeric ? `0${item.suffix}` : item.raw,
      }))
    );

    const el = this.root.nativeElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    afterNextRender(() => {
      this.prefetchMap();
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
    }, { injector: this.injector });
  }

  ngOnDestroy(): void {
    clearTimeout(this.closeTimer);
    clearTimeout(this.openTimer);
    this.highlightTimers.forEach((t) => t.kill());
    const host = this.mapHost?.nativeElement;
    if (host) {
      gsap.killTweensOf(host.querySelectorAll('.neon-dot, .neon-dot__ring'));
    }
    this.ctx?.revert();
  }

  openMap(): void {
    clearTimeout(this.closeTimer);
    clearTimeout(this.openTimer);
    this.mapOpen.set(true);
    // Wait one frame so #mapHost is queryable after first paint of countries row
    this.openTimer = window.setTimeout(() => this.ensureMap(true), 0);
  }

  scheduleClose(): void {
    clearTimeout(this.closeTimer);
    this.closeTimer = window.setTimeout(() => this.mapOpen.set(false), 220);
  }

  keepOpen(): void {
    clearTimeout(this.closeTimer);
    this.mapOpen.set(true);
  }

  toggleMap(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.mapOpen()) {
      this.mapOpen.set(false);
      return;
    }
    this.openMap();
  }

  private prefetchMap(): void {
    this.http.get('/maps/world.svg', { responseType: 'text' }).subscribe({
      next: (svg) => {
        this.mapSvgCached = svg;
        this.ensureMap(false);
      },
    });
  }

  private ensureMap(runHighlight: boolean): void {
    const host = this.mapHost?.nativeElement;
    if (!host) {
      if (runHighlight) {
        this.openTimer = window.setTimeout(() => this.ensureMap(true), 40);
      }
      return;
    }

    if (!this.mapInjected) {
      if (!this.mapSvgCached) {
        this.http.get('/maps/world.svg', { responseType: 'text' }).subscribe({
          next: (svg) => {
            this.mapSvgCached = svg;
            this.injectSvg(host);
            if (runHighlight) this.animateHighlights(host);
          },
        });
        return;
      }
      this.injectSvg(host);
    }

    if (runHighlight) {
      this.animateHighlights(host);
    }
  }

  private injectSvg(host: HTMLElement): void {
    host.innerHTML = this.mapSvgCached;
    const rootSvg = host.querySelector('svg');
    if (rootSvg) {
      rootSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      rootSvg.removeAttribute('width');
      rootSvg.removeAttribute('height');

      // Neon glow filter for red dots
      const ns = 'http://www.w3.org/2000/svg';
      let defs = rootSvg.querySelector('defs');
      if (!defs) {
        defs = document.createElementNS(ns, 'defs');
        rootSvg.prepend(defs);
      }
      defs.insertAdjacentHTML(
        'beforeend',
        `<filter id="neon-gold" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>`
      );

      const dotsLayer = document.createElementNS(ns, 'g');
      dotsLayer.setAttribute('id', 'neon-dots');
      rootSvg.appendChild(dotsLayer);
    }

    host.querySelectorAll('path[id], polygon[id]').forEach((node) => {
      const el = node as SVGElement;
      el.setAttribute('fill', '#161616');
      el.setAttribute('stroke', '#2a2a2a');
      el.setAttribute('stroke-width', '0.3');
    });

    this.mapInjected = true;
    this.mapReady.set(true);
  }

  private animateHighlights(host: HTMLElement): void {
    const svg = host.querySelector('svg');
    const dotsLayer = host.querySelector('#neon-dots');
    if (!svg || !dotsLayer) return;

    this.highlightTimers.forEach((t) => t.kill());
    this.highlightTimers = [];
    gsap.killTweensOf(dotsLayer.querySelectorAll('.neon-dot, .neon-dot__ring'));
    dotsLayer.innerHTML = '';

    const allPaths = [...host.querySelectorAll<SVGGraphicsElement>('path[id], polygon[id]')];
    const picked = this.pickHighlightedCountries(allPaths, 95);
    const ns = 'http://www.w3.org/2000/svg';

    picked.forEach((path, index) => {
      const center = this.pathCenter(path);
      if (!center) return;

      const group = document.createElementNS(ns, 'g');
      group.setAttribute('class', 'neon-dot');
      group.style.opacity = '0';

      const glow = document.createElementNS(ns, 'circle');
      glow.setAttribute('cx', String(center.x));
      glow.setAttribute('cy', String(center.y));
      glow.setAttribute('r', '7');
      glow.setAttribute('fill', 'rgba(214, 178, 94, 0.32)');
      glow.setAttribute('filter', 'url(#neon-gold)');

      const core = document.createElementNS(ns, 'circle');
      core.setAttribute('cx', String(center.x));
      core.setAttribute('cy', String(center.y));
      core.setAttribute('r', '2.6');
      core.setAttribute('fill', '#d6b25e');
      core.setAttribute('stroke', '#ffe7a8');
      core.setAttribute('stroke-width', '0.7');
      core.setAttribute('filter', 'url(#neon-gold)');

      const ring = document.createElementNS(ns, 'circle');
      ring.setAttribute('cx', String(center.x));
      ring.setAttribute('cy', String(center.y));
      ring.setAttribute('r', '4.2');
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', 'rgba(255, 214, 120, 0.9)');
      ring.setAttribute('stroke-width', '1.1');
      ring.setAttribute('class', 'neon-dot__ring');

      group.append(glow, ring, core);
      dotsLayer.appendChild(group);

      const tween = gsap.delayedCall(index * 0.012, () => {
        gsap.fromTo(
          group,
          { opacity: 0, scale: 0.35, transformOrigin: `${center.x}px ${center.y}px` },
          { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }
        );
        gsap.fromTo(
          ring,
          { attr: { r: 2.2 }, opacity: 1 },
          {
            attr: { r: 9 },
            opacity: 0,
            duration: 1.4,
            repeat: -1,
            ease: 'power1.out',
            delay: Math.random() * 0.8,
          }
        );
      });
      this.highlightTimers.push(tween);
    });
  }

  private pickHighlightedCountries(
    items: SVGGraphicsElement[],
    count: number
  ): SVGGraphicsElement[] {
    const india = items.find((el) => el.id === 'in');
    const pool = items.filter((el) => el.id !== 'pk' && el.id !== 'in');

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const restCount = Math.max(0, count - (india ? 1 : 0));
    const picked = pool.slice(0, restCount);
    if (india) {
      picked.unshift(india);
    }
    return picked;
  }

  private pathCenter(path: SVGGraphicsElement): { x: number; y: number } | null {
    try {
      const box = path.getBBox();
      if (!box.width && !box.height) return null;
      return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    } catch {
      return null;
    }
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
    const isCountries = /countr/i.test(label);
    if (!match) {
      return { label, raw, target: 0, suffix: '', numeric: false, display: raw, isCountries };
    }
    return {
      label,
      raw,
      target: Number(match[1]),
      suffix: match[2] || '',
      numeric: true,
      display: raw,
      isCountries,
    };
  }
}
