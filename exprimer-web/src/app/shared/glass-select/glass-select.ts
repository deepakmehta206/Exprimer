import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type GlassSelectOption = {
  label: string;
  value: string;
};

@Component({
  selector: 'app-glass-select',
  templateUrl: './glass-select.html',
  styleUrl: './glass-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GlassSelect),
      multi: true,
    },
  ],
})
export class GlassSelect implements ControlValueAccessor, OnDestroy {
  readonly options = input<GlassSelectOption[]>([]);
  readonly placeholder = input('Select…');
  readonly ariaLabel = input('Select option');

  readonly open = signal(false);
  readonly value = signal('');
  readonly disabled = signal(false);
  readonly dropAbove = signal(false);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  ngOnDestroy(): void {
    this.unlockBody();
  }

  get selectedLabel(): string {
    const match = this.options().find((o) => o.value === this.value());
    return match?.label ?? '';
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    if (isDisabled) this.close();
  }

  toggle(): void {
    if (this.disabled()) return;
    if (this.open()) {
      this.close();
      return;
    }
    this.openMenu();
  }

  select(option: GlassSelectOption): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.onTouched();
    this.close();
  }

  close(): void {
    if (!this.open()) return;
    this.open.set(false);
    this.unlockBody();
    this.onTouched();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (!this.open()) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
    }
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocPointer(e: PointerEvent): void {
    if (!this.open()) return;
    if (!this.host.nativeElement.contains(e.target as Node)) {
      this.close();
    }
  }

  private openMenu(): void {
    this.open.set(true);
    this.onTouched();
    requestAnimationFrame(() => this.placeMenu());
    if (matchMedia('(pointer: coarse)').matches || matchMedia('(max-width: 900px)').matches) {
      document.body.style.overflow = 'hidden';
    }
  }

  private placeMenu(): void {
    const trigger = this.host.nativeElement.querySelector('.glass-select__trigger') as HTMLElement | null;
    const menu = this.host.nativeElement.querySelector('.glass-select__menu') as HTMLElement | null;
    if (!trigger || !menu) return;

    const rect = trigger.getBoundingClientRect();
    const menuH = menu.offsetHeight || 220;
    const spaceBelow = window.innerHeight - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    this.dropAbove.set(spaceBelow < menuH && spaceAbove > spaceBelow);
  }

  private unlockBody(): void {
    document.body.style.overflow = '';
  }
}
