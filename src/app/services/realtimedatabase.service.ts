import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { AngularFireModule } from '@angular/fire/compat';

export interface Link {
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
    return this.realtimeDb.list<Link>('links').valueChanges();
  }

  addLinkToDb(link: Link) {
    return this.realtimeDb.list<Link>('links').push(link);
  }
}
