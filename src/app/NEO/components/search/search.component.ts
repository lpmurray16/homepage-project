import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Link } from '../../../services/realtimedatabase.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() allLinks: Link[] = [];

  searchTerm: string = '';
  filteredLinks: Link[] = [];
  isSearchVisible = false;
  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor() {
    this.initializeSearchSubscription();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.searchSubject.complete();
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

  filterLinks(): void {
    if (!this.searchTerm) {
      this.filteredLinks = [];
      return;
    }

    this.filteredLinks = this.allLinks.filter((link) =>
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
}
