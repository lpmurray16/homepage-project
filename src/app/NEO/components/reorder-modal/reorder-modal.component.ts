import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { RealtimeDatabaseService } from '../../../services/realtimedatabase.service';
import { Link } from '../../../services/realtimedatabase.service';

@Component({
  selector: 'app-reorder-modal',
  templateUrl: './reorder-modal.component.html',
  styleUrls: ['./reorder-modal.component.scss'],
})
export class ReorderModalComponent {
  @Input() isOpen = false;
  @Input() set sections(value: { key: string; value: Link[]; sortOrder: number }[]) {
    // Create a local copy for drag and drop manipulation
    this.localSections = [...value];
  }
  @Output() close = new EventEmitter<void>();

  localSections: { key: string; value: Link[]; sortOrder: number }[] = [];

  constructor(private realtimeDb: RealtimeDatabaseService) {}

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
        this.closeModal();
      })
      .catch((err) => {
        console.error('Failed to update sort order', err);
        alert('Failed to save order. Please try again.');
      });
  }

  closeModal(): void {
    this.close.emit();
  }
}
