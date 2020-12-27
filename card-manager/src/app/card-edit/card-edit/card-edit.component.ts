import { ActivatedRoute, Router } from '@angular/router';
import { Card, CardManagerService, CardTypeDict } from 'src/app/card-manager-service/card-manager.service';
import { Component, OnInit } from '@angular/core';
import { ErrorDialogComponent } from 'src/app/error-dialog/error-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-card-edit',
  templateUrl: './card-edit.component.html',
  styleUrls: ['./card-edit.component.scss']
})
export class CardEditComponent implements OnInit {
  form!: FormGroup;
  id: number | null = null;
  card!: Card;
  cardTypes = Object.keys(CardTypeDict);
  cardTypeDict = CardTypeDict as { [type: string]: string };

  constructor(
    private cardManagerService: CardManagerService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = +params['cardId'];
      const color = params['color']

      if (!Number.isNaN(this.id)) {
        this.getCard(this.id, color);
      }
    });
  }

  private getCard(id: number, color: string) {
    this.cardManagerService.getCard(id, color).subscribe(
      card => {
        this.card = card;
        this.patchForm(card);
      },
      error => console.error(error)
    );
  }

  private patchForm(card: Card) {
    this.form.get('text')?.patchValue(card.text);
    this.form.get('type')?.patchValue(card.type);
  }

  private createForm() {
    this.form = this.formBuilder.group({
      text: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  send() {
    if (!Number.isNaN(this.id)) {
      this.cardManagerService.editCard(
        this.card.id,
        { ...this.card, ...this.form.getRawValue() },
        this.form.get('type')?.value === 'answer' ? 'white' : 'black'
       ).pipe(take(1)).subscribe(
         () => this.router.navigate(['/list']),
         error => this.dialog.open(ErrorDialogComponent, {
          data: { message: '' }
        })
       );
    } else {
      this.cardManagerService.addCard(
        { id: null, ...this.form.getRawValue() },
        this.form.get('type')?.value === 'answer' ? 'white' : 'black'
      ).pipe(take(1)).subscribe(
        () => this.router.navigate(['/list']),
        error => this.dialog.open(ErrorDialogComponent, {
          data: { message: '' }
        })
      );
    }
  }
}
