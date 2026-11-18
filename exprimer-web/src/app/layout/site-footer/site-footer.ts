import { Component, input } from '@angular/core';
import { SiteSettings } from '../../core/models/cms.models';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  readonly settings = input<SiteSettings | null>(null);
  readonly year = new Date().getFullYear();
}
