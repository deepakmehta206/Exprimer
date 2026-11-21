import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CtaData } from '../../core/models/cms.models';
import { CmsService } from '../../core/services/cms.service';
import { GlassSelect, GlassSelectOption } from '../../shared/glass-select/glass-select';

gsap.registerPlugin(ScrollTrigger);

const INTEREST_BY_SLUG: Record<string, string> = {
  media: 'Media Distribution',
  recruitment: 'Recruitment',
  verification: 'Background Verification',
  home: 'Media Distribution',
};

@Component({
  selector: 'app-cta-section',
  imports: [ReactiveFormsModule, GlassSelect],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.scss',
})
export class CtaSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<CtaData>();
  private readonly fb = inject(FormBuilder);
  private readonly cms = inject(CmsService);
  private readonly route = inject(ActivatedRoute);
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly error = signal('');

  readonly interestOptions: GlassSelectOption[] = [
    { label: 'Videos & Games', value: 'Media Distribution' },
    { label: 'Manpower Consulting', value: 'Recruitment' },
    { label: 'Background Verification', value: 'Background Verification' },
  ];

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
    interest: ['Media Distribution'],
    message: [''],
    consentAccepted: [false, Validators.requiredTrue],
  });

  constructor() {
    effect(() => {
      // Re-apply when CMS payload arrives / page slug context is ready
      void this.data();
      const next = this.resolveDefaultInterest();
      if (this.form.controls.interest.value !== next) {
        this.form.controls.interest.setValue(next);
      }
    });
  }

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.ctx = gsap.context(() => {
      if (reduce) return;
      gsap.from('.cta-card', {
        autoAlpha: 0,
        y: 36,
        scale: 0.98,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.error.set('');
    this.cms.submitLead(this.form.getRawValue()).subscribe({
      next: () => {
        this.success.set(true);
        this.submitting.set(false);
        this.form.reset({
          interest: this.resolveDefaultInterest(),
          consentAccepted: false,
        });
      },
      error: (err) => {
        const msg = err?.error?.message as string | undefined;
        this.error.set(msg || 'Could not send enquiry. Please try again.');
        this.submitting.set(false);
      },
    });
  }

  private resolveDefaultInterest(): string {
    try {
      const fromCms = this.data().defaultInterest?.trim();
      if (fromCms && this.interestOptions.some((o) => o.value === fromCms)) {
        return fromCms;
      }
    } catch {
      // input not bound yet
    }

    const slug = (this.route.snapshot.paramMap.get('slug') || 'home').toLowerCase();
    return INTEREST_BY_SLUG[slug] || 'Media Distribution';
  }
}
