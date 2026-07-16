import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Link } from '../../services/realtimedatabase.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: false
})
export class SearchComponent implements OnInit, OnDestroy {
  @Input() allLinks: Link[] = [];
  @ViewChild('searchInput') searchInput!: ElementRef;

  searchTerm: string = '';
  filteredLinks: Link[] = [];
  isSearchVisible = true;
  selectedIndex: number = -1;
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
    this.selectedIndex = -1;
    this.searchSubject.next(event.target.value);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.filteredLinks.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % this.filteredLinks.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex = this.selectedIndex <= 0 ? this.filteredLinks.length - 1 : this.selectedIndex - 1;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.selectedIndex >= 0 && this.selectedIndex < this.filteredLinks.length) {
        window.open(this.filteredLinks[this.selectedIndex].url, '_blank');
        this.toggleSearch();
      }
    }
  }

  filterLinks(): void {
    if (!this.searchTerm) {
      this.filteredLinks = [];
      return;
    }

    this.filteredLinks = this.allLinks.filter((link) =>
      link.title.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }

  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
    if (!this.isSearchVisible) {
      this.searchTerm = '';
      this.filteredLinks = [];
      this.selectedIndex = -1;
    } else {
      setTimeout(() => {
        this.focusInput();
      }, 0);
    }
  }

  focusInput(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }
}
