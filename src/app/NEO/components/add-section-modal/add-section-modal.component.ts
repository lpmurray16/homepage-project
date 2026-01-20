import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RealtimeDatabaseService } from '../../../services/realtimedatabase.service';

@Component({
  selector: 'app-add-section-modal',
  templateUrl: './add-section-modal.component.html',
  styleUrls: ['./add-section-modal.component.scss'],
})
export class AddSectionModalComponent {
  @Input() isOpen = false;
  @Input() currentMaxOrder = 0;
  @Output() close = new EventEmitter<void>();

  sectionName = '';

  constructor(private realtimeDb: RealtimeDatabaseService) {}

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
