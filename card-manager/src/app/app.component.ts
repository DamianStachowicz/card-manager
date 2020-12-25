import { Card, CardManagerService } from './card-manager-service/card-manager.service';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
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
