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
            .filter((link) => link.id !== null)
        )
      );
  }

  getSectionsState(): Observable<any> {
    return this.realtimeDb.object('sections').valueChanges();
  }

  toggleSectionState(sectionName: string) {
    const sectionRef = this.realtimeDb.object(`sections/${sectionName}`);

    sectionRef
      .valueChanges()
      .pipe(take(1))
      .subscribe((currentValue) => {
        sectionRef.set(!currentValue);
      });
  }

  addLinkToDb(link: Link) {
    return this.realtimeDb.list<Link>('links').push(link);
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
