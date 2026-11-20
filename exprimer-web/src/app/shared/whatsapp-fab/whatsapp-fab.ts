import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-whatsapp-fab',
  templateUrl: './whatsapp-fab.html',
  styleUrl: './whatsapp-fab.scss',
})
export class WhatsappFab {
  /** Digits only or with country code, e.g. 7011982275 or 917011982275 */
  readonly phone = input('7011982275');
  readonly message = input('Hi Exprimer, I would like to connect.');
  readonly label = input('Chat on WhatsApp');
  readonly corner = input<'br' | 'bl'>('br');
  readonly countryCode = input('91');

  readonly href = computed(() => {
    const digits = this.phone().replace(/\D/g, '');
    const withCc =
      digits.length <= 10 ? `${this.countryCode()}${digits}` : digits;
    const text = encodeURIComponent(this.message());
    return `https://wa.me/${withCc}?text=${text}`;
  });
}
