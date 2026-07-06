import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RealtimeDatabaseService, Link } from '../../services/realtimedatabase.service';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-reorder-modal',
    templateUrl: './reorder-modal.component.html',
    styleUrls: ['./reorder-modal.component.scss'],
    standalone: false
})
export class ReorderModalComponent {
  @Input() isOpen = false;
  @Input() set sections(value: { key: string; value: Link[]; sortOrder: number }[]) {
    // Create a local copy for drag and drop manipulation
    this.localSections = [...value];
  }
  @Output() close = new EventEmitter<void>();

  localSections: { key: string; value: Link[]; sortOrder: number }[] = [];

  constructor(
    private realtimeDb: RealtimeDatabaseService,
    private toast: ToastService,
  ) {}

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.localSections, event.previousIndex, event.currentIndex);
  }

  saveOrder(): void {
    const updates: Record<string, number> = {};
    
    this.localSections.forEach((section, index) => {
      // Index + 1 because we want 1-based ordering
      updates[section.key] = index + 1;
    });

    this.realtimeDb.updateSectionSortOrders(updates)
      .then(() => {
        this.toast.success('Section order saved');
        this.closeModal();
      })
      .catch((err) => {
        console.error('Failed to update sort order', err);
        this.toast.error('Failed to save order. Please try again.');
      });
  }

  closeModal(): void {
    this.close.emit();
  }
}
