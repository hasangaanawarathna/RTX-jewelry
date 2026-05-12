import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Toast } from '../../services/toast';

interface AdminSettingsValue {
  storeName: string;
  contactEmail: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettings {
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(Toast);
  private readonly storageKey = 'rtx_admin_settings';

  readonly isSaving = signal(false);

  readonly settingsForm = this.formBuilder.group({
    storeName: ['RTX Jewelry', [Validators.required]],
    contactEmail: ['admin@rtxjewelry.lk', [Validators.required, Validators.email]],
    phone: ['+94 77 123 4567', [Validators.required]],
    address: ['Colombo, Sri Lanka', [Validators.required]],
  });

  constructor() {
    const settings = this.readSettings();

    if (settings) {
      this.settingsForm.patchValue(settings);
    }
  }

  saveSettings(): void {
    if (this.settingsForm.invalid || this.isSaving()) {
      this.settingsForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    localStorage.setItem(this.storageKey, JSON.stringify(this.settingsForm.getRawValue()));
    this.toast.success('Settings saved.');
    this.isSaving.set(false);
  }

  private readSettings(): AdminSettingsValue | null {
    const rawValue = localStorage.getItem(this.storageKey);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as AdminSettingsValue;
    } catch {
      return null;
    }
  }
}
