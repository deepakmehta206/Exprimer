import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SiteSettings } from '../../core/models/cms.models';
import { scrollToAnchor } from '../../core/utils/scroll-to-anchor';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  readonly settings = input<SiteSettings | null>(null);
  menuOpen = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  goToFragment(event: Event, id: string): void {
    this.closeMenu();
    // Same-page: scroll immediately; cross-page: routerLink + fragment handles nav
    if (document.getElementById(id)) {
      event.preventDefault();
      scrollToAnchor(id);
    }
  }
}
