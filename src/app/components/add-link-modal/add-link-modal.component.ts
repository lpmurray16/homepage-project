import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Link,
  RealtimeDatabaseService,
} from '../../services/realtimedatabase.service';
import { ToastService } from '../../services/toast.service';

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

  constructor(
    private realtimeDb: RealtimeDatabaseService,
    private toast: ToastService,
  ) {}

  addLink(): void {
    if (!this.isValidLink()) {
      return;
    }
    const title = this.linkToAdd.title;
    this.realtimeDb.addLinkToDb(this.linkToAdd);
    this.toast.success(`Added "${title}"`);
    // Reset the form but keep the modal open so multiple links can be added quickly
    this.linkToAdd = this.getEmptyLink();
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
