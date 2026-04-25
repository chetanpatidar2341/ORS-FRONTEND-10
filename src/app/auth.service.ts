import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements HttpInterceptor {

  token: any

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('in auth service intercept method....!!!')

    if (localStorage.getItem('fname') && localStorage.getItem('token')) {
      this.token = localStorage.getItem('token')
      req = req.clone({
        setHeaders: {
          "withCredentials": "true",
          "name": "Sawan",
          Authorization: this.token
        }
      })
    }
    console.log(req.headers.get("Authorization"))
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          localStorage.clear();
          this.router.navigate(['/login'], {
            queryParams: { errorMessage: error.error.result.message },
          });
        }

        if (error.status === 403) {
          localStorage.clear();
          this.router.navigate(['/login'], {
            queryParams: { errorMessage: error.error.message },
          });
        }

        if (error.status === 503) {
          this.router.navigate([this.router.url], {
            queryParams: { errorMessage: error.error.result.message }
          });
        }

        if (error.status === 500) {
          this.router.navigate([this.router.url], {
            queryParams: { errorMessage: error.error.result.message }
          });
        }

        if (error.status === 0) {
          this.router.navigate([this.router.url], {
            queryParams: { errorMessage: "Your backend is not responding, Please Start Backend Server" }
          });
        }


        return throwError(error);
      })
    );
  }
}
