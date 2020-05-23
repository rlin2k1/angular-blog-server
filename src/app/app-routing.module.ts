import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';\
import { EditComponent } from './edit/edit.component';


const routes: Routes = [
  { path: 'edit/:id', component: EditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
