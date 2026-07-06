import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RealtimeDatabaseService } from '../../services/realtimedatabase.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-add-section-modal',
    templateUrl: './add-section-modal.component.html',
    styleUrls: ['./add-section-modal.component.scss'],
    standalone: false
})
export class AddSectionModalComponent {
  @Input() isOpen = false;
  @Input() currentMaxOrder = 0;
  @Output() close = new EventEmitter<void>();

  sectionName = '';

  constructor(
    private realtimeDb: RealtimeDatabaseService,
    private toast: ToastService,
  ) {}

  addSection(): void {
    if (!this.sectionName.trim()) {
      alert('Please enter a section name');
      return;
    }

    const formattedName = this.sectionName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');

    this.realtimeDb.setSectionConfig(formattedName, {
      isOpen: true,
      sortOrder: this.currentMaxOrder + 1,
    });

    this.toast.success(`Added section "${formattedName}"`);
    this.resetForm();
  }

  resetForm(): void {
    this.sectionName = '';
    this.closeModal();
  }

  closeModal(): void {
    this.close.emit();
  }
}
