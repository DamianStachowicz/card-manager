import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardManagerService {
  private baseUrl: string = 'http://localhost:8080/cards';

  constructor(private http: HttpClient) { }

  getCards(
    searchQuery: string = '',
    color: 'white' | 'black',
    page: number = 0,
    size: number = 10
  ): Observable<CardsGetResponse> {
    const params = new HttpParams()
    .set('query', searchQuery)
    .set('page', `${page}`)
    .set('size', `${size}`);

    return this.http.get<CardsGetResponse>(`${this.baseUrl}/${color}`, { params });
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

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface CardsGetResponse {
  content: Card[];
  pageable: Pageable;
  totalElements: number;
  last: boolean;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
