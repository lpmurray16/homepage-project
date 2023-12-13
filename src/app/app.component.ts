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

  favoriteLinks: Link[] = [];
  workLinks: Link[] = [];
  otherLinks: Link[] = [];
  serverLinks: Link[] = [];
  personalLinks: Link[] = [];
  toolLinks: Link[] = [];

  dayName: string;
  dayNumber: number;
  month: string;
  hours: number;
  minutes: string;
  seconds: string;
  amOrPm: string;

  linkToAdd: Link = {
    section: '',
    url: '',
    title: '',
    icon: '',
  };

  sectionsState: any = {};

  constructor(private realtimeDb: RealtimeDatabaseService) {
    this.links = this.realtimeDb.getLinks();
    this.separateLinksBySection();
  }

  separateLinksBySection() {
    this.links.subscribe((links) => {
      this.favoriteLinks = links.filter((link) => link.section === 'favorites');
      this.workLinks = links.filter((link) => link.section === 'work');
      this.otherLinks = links.filter((link) => link.section === 'others');
      this.serverLinks = links.filter((link) => link.section === 'servers');
      this.personalLinks = links.filter((link) => link.section === 'personal');
      this.toolLinks = links.filter((link) => link.section === 'tools');
    });
  }

  ngOnInit(): void {
    this.realtimeDb.getSectionsState().subscribe((data) => {
      this.sectionsState = data;
    });
    this.getCurrentTimeAndDate();
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

    this.closeModal();
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  getCurrentTimeAndDate() {
    setInterval(() => {
      const date = new Date();
      this.dayName = date.toLocaleString('default', { weekday: 'long' });
      this.dayNumber = date.getDate();
      this.month = date.toLocaleString('default', { month: 'long' });
      this.hours =
        date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      this.minutes =
        date.getMinutes() < 10
          ? '0' + date.getMinutes().toString()
          : date.getMinutes().toString();
      this.seconds =
        date.getSeconds() < 10
          ? '0' + date.getSeconds().toString()
          : date.getSeconds().toString();
      this.amOrPm = date.getHours() >= 12 ? 'PM' : 'AM';
    }, 1000);
  }
}
