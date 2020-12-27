import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { merge, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardManagerService {
  private baseUrl: string = 'http://localhost:8080/cards';

  constructor(private http: HttpClient) { }

  getCards(searchQuery: string = ''): Observable<Card[]> {
    const params = new HttpParams().set('searchQuery', searchQuery);
    return merge(
      this.http.get<Card[]>(`${this.baseUrl}/white`, { params }),
      this.http.get<Card[]>(`${this.baseUrl}/black`, { params })
    );
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
  type: string;
}

