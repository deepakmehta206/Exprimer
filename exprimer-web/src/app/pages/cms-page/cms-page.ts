import { Component, OnInit, inject, signal } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { CmsPage as CmsPageModel, SiteSettings } from '../../core/models/cms.models';
import { CmsService } from '../../core/services/cms.service';
import { SiteFooter } from '../../layout/site-footer/site-footer';
import { SiteHeader } from '../../layout/site-header/site-header';
import { SectionHost } from '../../sections/section-host/section-host';
import { MouseGlow } from '../../shared/mouse-glow/mouse-glow';
import { WhatsappFab } from '../../shared/whatsapp-fab/whatsapp-fab';

@Component({
  selector: 'app-cms-page',
  imports: [SiteHeader, SiteFooter, SectionHost, MouseGlow, WhatsappFab],
  templateUrl: './cms-page.html',
  styleUrl: './cms-page.scss',
})
export class CmsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cms = inject(CmsService);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly settings = signal<SiteSettings | null>(null);
  readonly page = signal<CmsPageModel | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly whatsAppPhone = '917011982275';

  ngOnInit(): void {
    this.cms.getSettings().subscribe({
      next: (settings) => this.settings.set(settings),
    });

    this.route.paramMap
      .pipe(
        switchMap((params) => {
          this.loading.set(true);
          this.error.set('');
          return this.cms.getPage(params.get('slug') || 'home');
        })
      )
      .subscribe({
        next: (page) => {
          this.page.set(page);
          this.title.setTitle(page.title);
          this.meta.updateTag({ name: 'description', content: page.seoDescription });
          this.loading.set(false);
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        },
        error: () => {
          this.page.set(null);
          this.loading.set(false);
          this.error.set('Unable to load page content from CMS API.');
        },
      });
  }
}
