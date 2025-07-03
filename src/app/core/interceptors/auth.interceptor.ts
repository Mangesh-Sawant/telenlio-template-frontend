// FILE: src/app/core/interceptors/auth.interceptor.ts

// REMOVE: All of these imports as they are for classes
// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

// ADD: These imports for the functional approach
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

// CONVERT the class to a const function of type HttpInterceptorFn
export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {
  const token = localStorage.getItem('access_token');

  if (token) {
    // Note: The logic inside is exactly the same
    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    // The only difference is you call next() directly, not next.handle()
    return next(clonedRequest);
  }

  return next(request);
};
