import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ResumeData } from '../../core/models/cms.models';
import { CmsService } from '../../core/services/cms.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-resume-section',
  imports: [ReactiveFormsModule],
  templateUrl: './resume-section.html',
  styleUrl: './resume-section.scss',
})
export class ResumeSection implements AfterViewInit, OnDestroy {
  readonly data = input.required<ResumeData>();
  private readonly fb = inject(FormBuilder);
  private readonly cms = inject(CmsService);
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  private ctx?: gsap.Context;

  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly error = signal('');
  readonly fileName = signal('');
  private resumeFile: File | null = null;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    role: [''],
    message: [''],
  });

  ngAfterViewInit(): void {
    const el = this.root.nativeElement;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.ctx = gsap.context(() => {
      gsap.from('.resume-card', {
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.resumeFile = file;
    this.fileName.set(file?.name ?? '');
    this.error.set('');
  }

  submit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.resumeFile) {
      this.error.set('Please attach your resume (PDF, DOC, or DOCX).');
      return;
    }

    const allowed = ['.pdf', '.doc', '.docx'];
    const lower = this.resumeFile.name.toLowerCase();
    if (!allowed.some((ext) => lower.endsWith(ext))) {
      this.error.set('Only PDF, DOC, or DOCX resumes are accepted.');
      return;
    }

    if (this.resumeFile.size > 5 * 1024 * 1024) {
      this.error.set('Resume must be 5 MB or smaller.');
      return;
    }

    this.submitting.set(true);
    this.error.set('');
    const values = this.form.getRawValue();
    this.cms
      .submitResume({
        ...values,
        resume: this.resumeFile,
      })
      .subscribe({
        next: () => {
          this.success.set(true);
          this.submitting.set(false);
          this.form.reset();
          this.resumeFile = null;
          this.fileName.set('');
        },
        error: (err) => {
          const msg = err?.error?.message as string | undefined;
          this.error.set(msg || 'Could not upload resume. Please try again.');
          this.submitting.set(false);
        },
      });
  }
}
