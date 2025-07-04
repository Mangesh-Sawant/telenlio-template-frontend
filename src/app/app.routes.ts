import {Routes} from '@angular/router';
import {RegisterComponent} from './features/auth/register/register.component';
import {LoginComponent} from './features/auth/login/login.component';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {EditorComponent} from './features/editor/editor.component';
import {DocumentComponent} from './features/document/document.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'document', component: DocumentComponent},
  {path: 'editor/:id', component: EditorComponent},
];
