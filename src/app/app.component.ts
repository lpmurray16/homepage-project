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

  toggleSection(section: string): void {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
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
