import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Link,
  RealtimeDatabaseService,
} from '../../services/realtimedatabase.service';

@Component({
    selector: 'app-add-link-modal',
    templateUrl: './add-link-modal.component.html',
    styleUrls: ['./add-link-modal.component.scss'],
    standalone: false
})
export class AddLinkModalComponent {
  @Input() isOpen = false;
  @Input() sections: string[] = [];
  @Output() close = new EventEmitter<void>();

  linkToAdd: Link = this.getEmptyLink();

  constructor(private realtimeDb: RealtimeDatabaseService) {}

  addLink(): void {
    if (!this.isValidLink()) {
      return;
    }
    this.realtimeDb.addLinkToDb(this.linkToAdd);
    this.resetLinkToAdd();
  }

  private isValidLink(): boolean {
    if (
      !this.linkToAdd.section ||
      !this.linkToAdd.url ||
      !this.linkToAdd.title ||
      !this.linkToAdd.icon
    ) {
      alert('Please fill out all fields');
      return false;
    }

    if (!this.linkToAdd.url.includes('http')) {
      alert('Please enter a valid URL');
      return false;
    }

    return true;
  }

  private resetLinkToAdd(): void {
    this.linkToAdd = this.getEmptyLink();
    this.closeModal();
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
