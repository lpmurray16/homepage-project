import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  RealtimeDatabaseService,
  Link,
} from '../../services/realtimedatabase.service';

@Component({
    selector: 'app-delete-section-modal',
    templateUrl: './delete-section-modal.component.html',
    styleUrls: ['./delete-section-modal.component.scss'],
    standalone: false
})
export class DeleteSectionModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() sections: string[] = [];
  @Input() allLinks: Link[] = [];
  @Output() close = new EventEmitter<void>();

  selectedSection: string | null = null;

  constructor(private realtimeDb: RealtimeDatabaseService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      console.log('DeleteSectionModal: isOpen changed to', this.isOpen);
    }
  }

  selectSection(section: string): void {
    this.selectedSection = section;
  }

  cancelSelection(): void {
    this.selectedSection = null;
  }

  confirmDelete(): void {
    if (this.selectedSection) {
      this.realtimeDb
        .deleteSection(this.selectedSection, this.allLinks)
        .then(() => {
          this.selectedSection = null;
          this.closeModal();
        })
        .catch((err) => {
          console.error('Error deleting section:', err);
          alert('Failed to delete section');
        });
    }
  }

  closeModal(): void {
    this.selectedSection = null;
    this.close.emit();
  }
}
