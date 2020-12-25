import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardManagerService {
  private baseUrl: string = '';

  mockCards = [{
    id: 0,
    text: 'Pudel Ciastek',
    type: 'answer'
  }, {
    id: 1,
    text: 'Karty Przeciwko Jackowi',
    type: 'answer'
  }, {
    id: 2,
    text: 'Sucha ryba',
    type: 'answer'
  }, {
    id: 3,
    text: 'W przypływie pijackiej szczerości postanowiłem ucałować ___',
    type: 'question'
  }];

  constructor(private http: HttpClient) { }

  getCards(searchQuery: string = ''): Observable<Card[]> {
    const params = new HttpParams().set('searchQuery', searchQuery);
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.mockCards.filter(card => JSON.stringify(card).includes(searchQuery)));
        observer.complete();
      }, 1000);
    });
    return this.http.get<Card[]>(`${this.baseUrl}`, { params });
  }

  getCard(id: number): Observable<Card> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.mockCards.find(card => card.id === id));
        observer.complete();
      }, 1000);
    });
    return this.http.get<Card>(`${this.baseUrl}/card/${id}`);
  }

  addCard(card: Card): Observable<any> {
    return this.http.post(`${this.baseUrl}`, card);
  }

  removeCard(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/card/${id}`);
  }

  editCard(id: number, card: Card): Observable<any> {
    return this.http.put(`${this.baseUrl}/card/${id}`, card);
  }
}

export interface Card {
  id: number;
  text: string;
  playerId?: number;
  type: string;
}

