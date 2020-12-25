import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CardEditComponent } from './card-edit/card-edit/card-edit.component';
import { ListComponent } from './list/list/list.component';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'edit', component: CardEditComponent },
  { path: '',   redirectTo: 'list', pathMatch: 'full' },
  { path: '**', component: ListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
