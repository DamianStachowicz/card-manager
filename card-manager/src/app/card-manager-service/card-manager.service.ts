import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, zip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardManagerService {
  private baseUrl: string = 'http://localhost:8080/cards';

  constructor(private http: HttpClient) { }

  getCards(searchQuery: string = ''): Observable<Card[]> {
    const params = new HttpParams().set('searchQuery', searchQuery);
    return zip(
      this.http.get<Card[]>(`${this.baseUrl}/white`, { params }),
      this.http.get<Card[]>(`${this.baseUrl}/black`, { params })
    ).pipe(map(([white, black]) => [...white, ...black]));
  }

  getCard(id: number, color: string): Observable<Card> {
    return this.http.get<Card>(`${this.baseUrl}/${color}/${id}`);
  }

  addCard(card: Card, color: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${color}`, card);
  }

  removeCard(id: number, color: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${color}/${id}`);
  }

  editCard(id: number, card: Card, color: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${color}/${id}`, card);
  }
}

export interface Card {
  id: number;
  text: string;
  playerId?: number;
  type: CardType;
}

export enum CardType {
  ANSWER = 'answer',
  PICK_1 = 'pick_1',
  PICK_2 = 'pick_2',
  DRAW_2_PICK_3 = 'draw_2_pick_3'
}

export const CardTypeDict = {
  'answer': 'Odpowiedź',
  'pick_1': 'Wybierz 1',
  'pick_2': 'Wybierz 2',
  'draw_2_pick_3': 'Weź 2 wybierz 3'
}