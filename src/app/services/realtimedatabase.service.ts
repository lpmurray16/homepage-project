import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, map, take } from 'rxjs';
import { AngularFireModule } from '@angular/fire/compat';

export interface Link {
  id?: string | null;
  section: string;
  url: string;
  title: string;
  icon: string;
}

export interface SectionConfig {
  isOpen: boolean;
  sortOrder: number;
}

@Injectable({
  providedIn: 'root',
})
export class RealtimeDatabaseService {
  constructor(private realtimeDb: AngularFireDatabase) {}

  getLinks(): Observable<Link[]> {
    return this.realtimeDb
      .list<Link>('links')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions
            .map((a) => {
              const data = a.payload.val() as Partial<Link>;
              const id = a.payload.key;
              return {
                id: id ?? null,
                section: data.section ?? '',
                url: data.url ?? '',
                title: data.title ?? '',
                icon: data.icon ?? '',
              } as Link;
            })
            .filter((link) => link.id !== null),
        ),
      );
  }

  getSectionConfigs(): Observable<Record<string, SectionConfig>> {
    return this.realtimeDb
      .object<Record<string, SectionConfig>>('config/sections')
      .valueChanges()
      .pipe(map((config) => config || {}));
  }

  setSectionConfig(sectionName: string, config: SectionConfig): Promise<void> {
    return this.realtimeDb
      .object(`config/sections/${sectionName}`)
      .update(config);
  }

  updateSectionSortOrders(updates: Record<string, number>): Promise<void> {
    const updateObj: Record<string, number> = {};
    Object.keys(updates).forEach((key) => {
      updateObj[`config/sections/${key}/sortOrder`] = updates[key];
    });
    return this.realtimeDb.object('/').update(updateObj);
  }

  addLinkToDb(link: Link) {
    return this.realtimeDb.list<Link>('links').push(link);
  }

  updateLink(link: Link): Promise<void> {
    if (!link.id) {
      return Promise.reject('Link ID is missing');
    }
    const { id, ...data } = link;
    return this.realtimeDb.object(`links/${id}`).update(data);
  }

  removeLinkById(link: Link): void {
    if (link.id) {
      const path = `links/${link.id}`;
      this.realtimeDb
        .object(path)
        .remove()
        .catch((error) => console.log(error));
    }
  }
}
