import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Link, RealtimeDatabaseService } from '../../services/realtimedatabase.service';

@Component({
    selector: 'app-edit-link-modal',
    templateUrl: './edit-link-modal.component.html',
    styleUrls: ['./edit-link-modal.component.scss'],
    standalone: false
})
export class EditLinkModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() linkToEdit: Link | null = null;
  @Input() sections: string[] = [];
  @Output() close = new EventEmitter<void>();

  editableLink: Link = this.getEmptyLink();

  constructor(private realtimeDb: RealtimeDatabaseService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['linkToEdit'] && this.linkToEdit) {
      this.editableLink = { ...this.linkToEdit };
    }
  }

  saveLink(): void {
    if (!this.isValidLink()) {
      return;
    }
    this.realtimeDb.updateLink(this.editableLink)
      .then(() => {
        this.closeModal();
      })
      .catch((err) => {
        console.error('Error updating link:', err);
        alert('Failed to update link');
      });
  }

  private isValidLink(): boolean {
    if (
      !this.editableLink.section ||
      !this.editableLink.url ||
      !this.editableLink.title ||
      !this.editableLink.icon
    ) {
      alert('Please fill out all fields');
      return false;
    }

    if (!this.editableLink.url.includes('http')) {
      alert('Please enter a valid URL');
      return false;
    }

    return true;
  }

  closeModal(): void {
    this.close.emit();
  }

  private getEmptyLink(): Link {
    return {
      section: '',
      url: '',
      title: '',
      icon: '',
    };
  }
}
