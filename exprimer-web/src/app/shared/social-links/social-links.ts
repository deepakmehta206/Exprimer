import { Component, computed, input } from '@angular/core';

export type SocialLink = {
  id: 'linkedin' | 'instagram' | 'facebook';
  label: string;
  href: string;
};

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.html',
  styleUrl: './social-links.scss',
})
export class SocialLinks {
  readonly linkedIn = input('https://www.linkedin.com/company/exprimer-group/');
  readonly instagram = input('https://www.instagram.com/exprimergroup/');
  readonly facebook = input('');
  readonly compact = input(false);

  readonly links = computed<SocialLink[]>(() => {
    const items: SocialLink[] = [
      { id: 'linkedin', label: 'LinkedIn', href: this.linkedIn().trim() },
      { id: 'instagram', label: 'Instagram', href: this.instagram().trim() },
      { id: 'facebook', label: 'Facebook', href: this.facebook().trim() },
    ];
    return items.filter((item) => !!item.href);
  });
}
