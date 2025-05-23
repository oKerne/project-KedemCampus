import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

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
// {
//   path:'lessons/',
//   loadComponent: () =>
//     import('./components/lessons/lessons.component').then(m => m.LessonComponent)
// },
{ path:'campus-learning',
    loadComponent: () =>
      import('./components/teachers/teachers.component').then(m => m.TeachersComponent)
}
// {
//   path: 'lessons/:courseId',
//   loadComponent: () =>
//     import('./components/lessons/lessons.component').then(m => m.LessonComponent)
// }

]
