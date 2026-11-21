import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteSettings } from '../../core/models/cms.models';
import { scrollToAnchor } from '../../core/utils/scroll-to-anchor';
import { SocialLinks } from '../../shared/social-links/social-links';

@Component({
  selector: 'app-site-footer',
  imports: [SocialLinks, RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  readonly settings = input<SiteSettings | null>(null);
  readonly year = new Date().getFullYear();
  readonly defaultLinkedIn = 'https://www.linkedin.com/company/exprimer-group/';
  readonly defaultInstagram = 'https://www.instagram.com/exprimergroup/';

  goToFragment(event: Event, id: string): void {
    if (document.getElementById(id)) {
      event.preventDefault();
      scrollToAnchor(id);
    }
  }
}
