import { Component, NgModule, OnInit, OnDestroy } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Link,
  RealtimeDatabaseService,
  SectionConfig,
} from '../services/realtimedatabase.service';
import { AddLinkModalComponent } from './components/add-link-modal/add-link-modal.component';
import { SearchComponent } from './components/search/search.component';
import { ClockComponent } from './components/clock/clock.component';
import { ToolsTrayComponent } from './components/tools-tray/tools-tray.component';
import { AddSectionModalComponent } from './components/add-section-modal/add-section-modal.component';
import { ReorderModalComponent } from './components/reorder-modal/reorder-modal.component';
import { EditLinkModalComponent } from './components/edit-link-modal/edit-link-modal.component';

interface SectionMap {
  [key: string]: Link[];
}

@Component({
  selector: 'neo-theme',
  templateUrl: './neo.component.html',
  styleUrls: ['./neo.component.scss'],
})
export class NeoThemeComponent implements OnInit, OnDestroy {
  modalOpen = false;
  sectionModalOpen = false;
  reorderModalOpen = false;
  isDeleteMode = false;
  isEditMode = false;
  editModalOpen = false;
  linkToEdit: Link | null = null;

  // This will now hold the fully processed sections for the view
  orderedSections: {
    key: string;
    value: Link[];
    isOpen: boolean;
    sortOrder: number;
  }[] = [];

  // We keep a raw map of all links for search
  allLinks: Link[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private realtimeDb: RealtimeDatabaseService) {
    this.initializeDataSubscription();
  }

  private initializeDataSubscription(): void {
    const dataSub = combineLatest([
      this.realtimeDb.getLinks(),
      this.realtimeDb.getSectionConfigs(),
    ]).subscribe(([links, configs]) => {
      this.processData(links, configs);
    });

    this.subscriptions.push(dataSub);
  }

  private processData(
    links: Link[],
    configs: Record<string, SectionConfig>,
  ): void {
    this.allLinks = links;

    // 1. Start with all sections defined in the Config
    const sectionKeys = new Set<string>(Object.keys(configs));

    // 2. Discover any new sections from Links that aren't in Config yet
    const linksSections = new Set<string>(links.map((l) => l.section));
    const missingKeys = [...linksSections].filter((key) => !configs[key]);

    // 3. Auto-create config for missing sections
    if (missingKeys.length > 0) {
      // Determine the next sort order
      const maxOrder = Object.values(configs).reduce(
        (max, config) => Math.max(max, config.sortOrder || 0),
        0,
      );

      missingKeys.forEach((key, index) => {
        const newConfig: SectionConfig = {
          isOpen: true,
          sortOrder: maxOrder + index + 1,
        };
        this.realtimeDb.setSectionConfig(key, newConfig);
        // Add to our local set so it renders immediately (optimistic update)
        sectionKeys.add(key);
      });
    }

    // 4. Build the array of sections
    const sectionsArray = Array.from(sectionKeys).map((key) => {
      // Use existing config or default for the newly discovered ones
      const config = configs[key] || { isOpen: true, sortOrder: 999 };
      return {
        key: key,
        value: links.filter((link) => link.section === key),
        isOpen: config.isOpen,
        sortOrder: config.sortOrder,
      };
    });

    // 5. Sort based on the order
    this.orderedSections = sectionsArray.sort((a, b) => {
      return a.sortOrder - b.sortOrder;
    });
  }

  toggleSection(sectionKey: string): void {
    const section = this.orderedSections.find((s) => s.key === sectionKey);
    if (section) {
      this.realtimeDb.setSectionConfig(sectionKey, {
        isOpen: !section.isOpen,
        sortOrder: section.sortOrder,
      });
    }
  }

  promptAddSection(): void {
    this.sectionModalOpen = true;
  }

  toggleReorderMode(): void {
    this.reorderModalOpen = true;
  }

  closeReorderModal(): void {
    this.reorderModalOpen = false;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  removeLinkById(link: Link): void {
    if (link.id) {
      this.realtimeDb.removeLinkById(link);
    }
  }

  toggleDeleteMode(): void {
    this.isDeleteMode = !this.isDeleteMode;
    if (this.isDeleteMode) {
      this.isEditMode = false;
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.isDeleteMode = false;
    }
  }

  onLinkClick(event: Event, link: Link): void {
    if (this.isDeleteMode) {
      event.preventDefault();
      this.removeLinkById(link);
    } else if (this.isEditMode) {
      event.preventDefault();
      this.linkToEdit = link;
      this.editModalOpen = true;
    }
  }

  closeEditModal(): void {
    this.editModalOpen = false;
    this.linkToEdit = null;
  }

  openModal(): void {
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  closeSectionModal(): void {
    this.sectionModalOpen = false;
  }

  get currentMaxOrder(): number {
    return this.orderedSections.reduce(
      (max, s) => Math.max(max, s.sortOrder),
      0,
    );
  }
  get sectionKeys(): string[] {
    return this.orderedSections.map((s) => s.key);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    FormsModule,
    DragDropModule,
  ],
  exports: [NeoThemeComponent],
  declarations: [
    NeoThemeComponent,
    AddLinkModalComponent,
    SearchComponent,
    ClockComponent,
    ToolsTrayComponent,
    AddSectionModalComponent,
    ReorderModalComponent,
    EditLinkModalComponent,
  ],
  providers: [],
})
export class NeoThemeModule {}
