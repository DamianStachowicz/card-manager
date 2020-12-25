import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = +params['cardId'];

      if (this.id != null) {
        this.getCard(this.id);
      }
    });
  }

  private getCard(id: number) {
    this.cardManagerService.getCard(id).subscribe(
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
    if (this.id !== null) {
      this.cardManagerService.editCard(this.card.id, { ...this.card, ...this.form.getRawValue() })
    }
  }
}
