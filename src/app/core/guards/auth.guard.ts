import {CanActivateFn} from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};
