import { Card, CardManagerService } from 'src/app/card-manager-service/card-manager.service';
import { Component, OnInit } from '@angular/core';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ErrorDialogComponent } from 'src/app/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public cards: Card[] = [];
  public typeLabels: { [key: string]: string } = {
    answer: 'odpowiedź',
    question: 'pytanie'
  };
  public dataSource: MatTableDataSource<Card> = new MatTableDataSource();
  public displayedColumns = ['id', 'text', 'type', 'buttons'];

  constructor(
    private cardManagerService: CardManagerService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.updateList();
  }

  private updateList() {
    this.cardManagerService.getCards().pipe(take(1)).subscribe(
      cards => {
        this.cards = cards;
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
    filterValue = filterValue.toLowerCase();

    this.dataSource.filter = filterValue;
  }

  openDeleteDialog(card: Card) {
    const color = card.type === 'answer' ? 'white' : 'black';

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        cardId: card.id,
        cardColor: color
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(
      result => {
        if ( result === 'yes' ) {
          this.cardManagerService.removeCard(card.id, color).pipe(take(1)).subscribe(
            () => this.updateList(),
            error => this.dialog.open(ErrorDialogComponent, {
              data: { message: '' }
            })
          );
        }
      }
    );
  }
}
