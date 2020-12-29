import { Card, CardManagerService, CardTypeDict } from 'src/app/card-manager-service/card-manager.service';
import { Component, Input, OnInit } from '@angular/core';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ErrorDialogComponent } from 'src/app/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() color: 'white' | 'black' = 'white';

  public cards: Card[] = [];
  public typeLabels: { [key: string]: string } = {
    answer: 'odpowiedź',
    question: 'pytanie'
  };
  public dataSource: MatTableDataSource<Card> = new MatTableDataSource();
  public displayedColumns = ['id', 'text', 'type', 'buttons'];
  public searchQuery: string = '';
  public pageIndex: number = 0;
  public pageSize: number = 10;
  public length: number = 0;
  public cardTypeDict = CardTypeDict as { [type: string]: string };
  public showSpinner: boolean = true;

  constructor(
    private cardManagerService: CardManagerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.updateList('', this.color, this.pageIndex, this.pageSize);
  }

  public updateList(query: string, color: 'white' | 'black', page: number, size: number) {
    this.showSpinner = true;

    this.cardManagerService.getCards(query, color, page, size)
    .pipe(take(1), finalize(() => this.showSpinner = false))
    .subscribe(
      response => {
        this.cards = response.content;
        this.length = response.totalElements;
        this.dataSource = new MatTableDataSource(this.cards);
      },
      error => this.dialog.open(ErrorDialogComponent, {
        data: { message: '' }
      })
    );
  }

  applyFilter(target: EventTarget | null) {
    let filterValue = (target as HTMLInputElement).value;

    filterValue = filterValue.trim();
    this.searchQuery = filterValue;

    this.updateList(this.searchQuery, this.color, 0, this.pageSize);
  }

  openDeleteDialog(card: Card) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        cardId: card.id,
        cardColor: this.color
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(
      result => {
        if ( result === 'yes' ) {
          this.cardManagerService.removeCard(card.id, this.color).pipe(take(1)).subscribe(
            () => this.updateList('', this.color, this.pageIndex, this.pageSize),
            error => this.dialog.open(ErrorDialogComponent, {
              data: { message: '' }
            })
          );
        }
      }
    );
  }
}
