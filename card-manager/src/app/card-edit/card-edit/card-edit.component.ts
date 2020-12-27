import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Card, CardManagerService } from 'src/app/card-manager-service/card-manager.service';

@Component({
  selector: 'app-card-edit',
  templateUrl: './card-edit.component.html',
  styleUrls: ['./card-edit.component.scss']
})
export class CardEditComponent implements OnInit {
  form!: FormGroup;
  id: number | null = null;
  card!: Card;

  constructor(
    private cardManagerService: CardManagerService,
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
       ).subscribe(
         () => this.router.navigate(['/list']),
         error => console.error(error)
       );
    } else {
      this.cardManagerService.addCard(
        { id: null, ...this.form.getRawValue() },
        this.form.get('type')?.value === 'answer' ? 'white' : 'black'
      ).subscribe(
        () => this.router.navigate(['/list']),
        error => console.error(error)
      );
    }
  }
}
