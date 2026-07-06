import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeoThemeComponent } from './neo-themed/neo.component';

const routes: Routes = [
  { path: '', component: NeoThemeComponent },
  { path: ':section', component: NeoThemeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
