import { Component, NgModule, OnInit, OnDestroy } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Observable, Subject, Subscription, interval } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  Link,
  RealtimeDatabaseService,
} from '../services/realtimedatabase.service';

interface TimeDate {
  dayName: string;
  dayNumber: number;
  month: string;
  hours: number;
  minutes: string;
  seconds: string;
  amOrPm: string;
}

interface SectionMap {
  [key: string]: Link[];
}

@Component({
  selector: 'neo-theme',
  templateUrl: './neo.component.html',
  styleUrls: ['./neo.component.scss'],
})
export class NeoThemeComponent implements OnInit, OnDestroy {
  searchTerm: string = '';
  filteredLinks: Link[] = [];
  private searchSubject = new Subject<string>();
  isSearchVisible = false;

  private sectionOrder: string[] = ['favorites', 'personal', 'work', 'gaming', 'streaming', 'others', 'servers', 'tools', 'ai-tools'];

  modalOpen = false;
  isDeleteMode = false;
  links: Observable<Link[]>;
  sectionsState: Record<string, boolean> = {};

  timeDate: TimeDate = {
    dayName: '',
    dayNumber: 0,
    month: '',
    hours: 0,
    minutes: '00',
    seconds: '00',
    amOrPm: 'AM',
  };

  sections: SectionMap = {
    favorites: [],
    work: [],
    gaming: [],
    streaming: [],
    others: [],
    servers: [],
    personal: [],
    tools: [],
    'ai-tools': [],
  };

  linkToAdd: Link = this.getEmptyLink();
  private subscriptions: Subscription[] = [];

  constructor(private realtimeDb: RealtimeDatabaseService) {
    this.links = this.realtimeDb.getLinks();
    this.initializeLinkSubscription();
    this.initializeSearchSubscription();
  }

  private getEmptyLink(): Link {
    return {
      section: '',
      url: '',
      title: '',
      icon: '',
    };
  }

  private initializeLinkSubscription(): void {
    const linkSub = this.links.subscribe((links) => {
      Object.keys(this.sections).forEach((section) => {
        this.sections[section] = links.filter(
          (link) => link.section === (section === 'others' ? 'others' : section)
        );
      });
    });
    this.subscriptions.push(linkSub);
  }

  private initializeSearchSubscription(): void {
    const searchSub = this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.filterLinks();
      });
    this.subscriptions.push(searchSub);
  }

  onSearchInput(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  get orderedSections(): { key: string; value: Link[] }[] {
    return Object.entries(this.sections)
      .sort(([keyA], [keyB]) => this.sectionOrder.indexOf(keyA) - this.sectionOrder.indexOf(keyB))
      .map(([key, value]) => ({ key, value }));
  }

  filterLinks(): void {
    if (!this.searchTerm) {
      this.filteredLinks = [];
      return;
    }

    const allLinks: Link[] = Object.values(this.sections).flat();
    this.filteredLinks = allLinks.filter((link) =>
      link.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
    if (!this.isSearchVisible) {
      this.searchTerm = '';
      this.filteredLinks = [];
    }
  }

  ngOnInit(): void {
    const sectionsSub = this.realtimeDb.getSectionsState().subscribe((data) => {
      this.sectionsState = data;
    });
    this.subscriptions.push(sectionsSub);
    this.startTimeUpdate();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.searchSubject.complete();
  }

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

  toggleSectionState(sectionName: string): void {
    this.realtimeDb.toggleSectionState(sectionName);
  }

  removeLinkById(link: Link): void {
    if (link.id) {
      this.realtimeDb.removeLinkById(link);
    }
  }

  toggleDeleteMode(): void {
    this.isDeleteMode = !this.isDeleteMode;
  }

  private resetLinkToAdd(): void {
    this.linkToAdd = this.getEmptyLink();
    this.closeModal();
  }

  openModal(): void {
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  private startTimeUpdate(): void {
    const timeSub = interval(1000).subscribe(() => {
      const date = new Date();
      this.updateTimeDate(date);
    });
    this.subscriptions.push(timeSub);
  }

  private updateTimeDate(date: Date): void {
    this.timeDate = {
      dayName: date.toLocaleString('default', { weekday: 'long' }),
      dayNumber: date.getDate(),
      month: date.toLocaleString('default', { month: 'long' }),
      hours: date.getHours() > 12 ? date.getHours() - 12 : date.getHours(),
      minutes: this.padNumber(date.getMinutes()),
      seconds: this.padNumber(date.getSeconds()),
      amOrPm: date.getHours() >= 12 ? 'PM' : 'AM',
    };
  }

  private padNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    FormsModule,
  ],
  exports: [NeoThemeComponent],
  declarations: [NeoThemeComponent],
  providers: [],
})
export class NeoThemeModule {}