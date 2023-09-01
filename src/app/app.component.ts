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

  isSectionOpen: { [key: string]: boolean } = {
    favorites: true,
    others: true,
    servers: true,
    personal: true,
  };

  constructor(private realtimeDb: RealtimeDatabaseService) {
    this.links = this.realtimeDb.getLinks();
    console.log(
      'Links: ',
      this.links.subscribe((x) => console.log(x))
    );
  }

  ngOnInit(): void {}

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
    }
    this.realtimeDb.addLinkToDb(this.linkToAdd);
    this.resetLinkToAdd();
  }

  removeLinkById(link: Link): void {
    console.log('Attempt to remove link with Id: ', link.id);
    if (link.id) {
      this.realtimeDb.removeLinkById(link);
      console.log('Remove was called with link Id: ', link.id);
    }
  }

  toggleSection(section: string): void {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
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
