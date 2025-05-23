// import { createReducer, on } from '@ngrx/store';
// import { login, loginSuccess, loginFailure, logout } from './auth.actions';

// export interface AuthState {
//   token: string | null;
//   user: { id: string; name: string; role: string } | null;
//   error: string | null;
// }

// const initialState: AuthState = {
//   token: null,
//   user: null,
//   error: null,
// };

// export const authReducer = createReducer(
//   initialState,
//   on(login, state => ({ ...state, error: null })),
//   on(loginSuccess, (state, { token, user }) => ({ ...state, token, user, error: null })),
//   on(loginFailure, (state, { error }) => ({ ...state, error })),
//   on(logout, () => initialState)
// );
