import { Component, input } from '@angular/core';
import { SiteSettings } from '../../core/models/cms.models';
import { SocialLinks } from '../../shared/social-links/social-links';

@Component({
  selector: 'app-site-footer',
  imports: [SocialLinks],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  readonly settings = input<SiteSettings | null>(null);
  readonly year = new Date().getFullYear();
  readonly defaultLinkedIn = 'https://www.linkedin.com/company/exprimer-group/';
  readonly defaultInstagram = 'https://www.instagram.com/exprimergroup/';
}
