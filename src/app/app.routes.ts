import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LessonsComponent } from './components/lessons/lessons.component';
import { TeachersComponent } from './components/teachers/teachers.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
{
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(m => m.RegisterComponent)
},

{
  path: 'courses',
  loadComponent: () =>
 import('./components/courses/courses.component').then(m => m.CoursesComponent)
}
,

{ path: 'course/:id', component: LessonsComponent },
{ path:  'campus-learning',  component: TeachersComponent },


]
