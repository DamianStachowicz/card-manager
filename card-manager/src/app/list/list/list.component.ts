import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Card, CardManagerService } from 'src/app/card-manager-service/card-manager.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {  
  public cards: Card[] = [];
  public typeLabels: { [key: string]: string } = {
    answer: 'odpowiedź',
    question: 'pytanie'
  };
  public dataSource: MatTableDataSource<Card> = new MatTableDataSource();
  public displayedColumns = ['id', 'text', 'type', 'buttons'];

  constructor(
    private cardManagerService: CardManagerService
  ) {
    this.cardManagerService.getCards().subscribe(cards => {
      this.cards = cards;
      this.dataSource = new MatTableDataSource(this.cards);
    });
  }

  applyFilter(target: EventTarget | null) {
    let filterValue = (target as HTMLInputElement).value;

    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();

    this.dataSource.filter = filterValue;
  }
}
