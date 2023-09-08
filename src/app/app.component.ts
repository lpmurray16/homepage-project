import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Link,
  RealtimeDatabaseService,
} from './services/realtimedatabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  modalOpen = false;
  isDeleteMode = false;
  links: Observable<Link[]>;

  linkToAdd: Link = {
    section: '',
    url: '',
    title: '',
    icon: '',
  };

  sectionsState: any = {};

  constructor(private realtimeDb: RealtimeDatabaseService) {
    this.links = this.realtimeDb.getLinks();
  }

  ngOnInit(): void {
    this.realtimeDb.getSectionsState().subscribe((data) => {
      this.sectionsState = data;
    });
  }

  ngOnDestroy() {}

  addLink() {
    if (
      this.linkToAdd.section === '' ||
      this.linkToAdd.url === '' ||
      this.linkToAdd.title === '' ||
      this.linkToAdd.icon === ''
    ) {
      alert('Please fill out all fields');
      return;
    } else if (this.linkToAdd.url.indexOf('http') === -1) {
      alert('Please enter a valid URL');
      return;
    }
    this.realtimeDb.addLinkToDb(this.linkToAdd);
    this.resetLinkToAdd();
  }

  toggleSectionState(sectionName: string) {
    this.realtimeDb.toggleSectionState(sectionName);
  }

  removeLinkById(link: Link): void {
    console.log('Attempt to remove link with Id: ', link.id);
    if (link.id) {
      this.realtimeDb.removeLinkById(link);
      console.log('Remove was called with link Id: ', link.id);
    }
  }

  toggleDeleteMode() {
    this.isDeleteMode = !this.isDeleteMode;
  }

  resetLinkToAdd() {
    this.linkToAdd = {
      section: '',
      url: '',
      title: '',
      icon: '',
    };
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }
}
