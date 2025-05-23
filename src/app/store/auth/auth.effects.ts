// // import { Injectable } from '@angular/core';
// // import { Actions, createEffect, ofType } from '@ngrx/effects';
// // import { AuthService } from '../../services/auth.service';
// // import { login, loginSuccess, loginFailure } from './auth.actions'; 
// // import { catchError, map, mergeMap, of, tap } from 'rxjs';
// // import { Route, Router } from '@angular/router';
// // @Injectable()
// // export class AuthEffects {

// //   constructor(
// //     private actions$: Actions, 
// //     private authService: AuthService,
// //     private router: Router
// //   ) {}

// //     Login$ = createEffect(() =>
// //       this.actions$.pipe(
// //         ofType(login),
// //         mergeMap(action =>
// //           this.authService.login({ email: action.email, password: action.password }).pipe(
// //             map(response => {
// //               const user = {
// //                 id: response.userId,
// //                 role: response.role,
// //                 name: action.email.split('@')[0]
// //               };
// //               localStorage.setItem('userName', user.name);
// //               localStorage.setItem('userInitial', user.name.charAt(0).toUpperCase());
// //               localStorage.setItem('token', response.token);

// //               return loginSuccess({ token: response.token, user });
// //             }),
// //             catchError(() => of(loginFailure({ error: 'אירעה שגיאה בהתחברות' })))
// //           )
// //         )
// //       )
// //     )
// //      loginSuccess$ = createEffect(
// //     () =>
// //       this.actions$.pipe(
// //         ofType(loginSuccess),
// //         tap(() => {
// //           alert('התחברת בהצלחה!');
// //           this['router'].navigate(['/']);
// //         })
// //       ),
// //     { dispatch: false }
// //   );
// // }
// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { AuthService } from '../../services/auth.service';
// import { login, loginSuccess, loginFailure } from './auth.actions'; 
// import { of } from 'rxjs';
// import { catchError, map, mergeMap, tap } from 'rxjs/operators';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root' // נסה להוסיף את זה
// })
// export class AuthEffects {
//   // השתמש בהתחלה קטנה לשם האפקט הראשון (login$ במקום Login$)
//   login$ = createEffect(() => {
//     return this.actions$.pipe(
//       ofType(login),
//       mergeMap(action =>
//         this.authService.login({ email: action.email, password: action.password }).pipe(
//           map(response => {
//             const user = {
//               id: response.userId,
//               role: response.role,
//               name: action.email.split('@')[0]
//             };
//             localStorage.setItem('userName', user.name);
//             localStorage.setItem('userInitial', user.name.charAt(0).toUpperCase());
//             localStorage.setItem('token', response.token);

//             return loginSuccess({ token: response.token, user });
//           }),
//           catchError(error => of(loginFailure({ error: 'אירעה שגיאה בהתחברות' })))
//         )
//       )
//     );
//   });

//   loginSuccess$ = createEffect(() => {
//     return this.actions$.pipe(
//       ofType(loginSuccess),
//       tap(() => {
//         alert('התחברת בהצלחה!');
//         this.router.navigate(['/']);
//       })
//     );
//   }, { dispatch: false });

//   constructor(
//     private actions$: Actions,
//     private authService: AuthService,
//     private router: Router
//   ) {}
// }