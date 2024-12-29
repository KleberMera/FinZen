import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { catchError, throwError } from 'rxjs';

export const handleErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      //console.error(`Error Status: ${error.status} - ${error.message}`);
      return throwError(() => toast.error(error.error.message));
    })
  );
};
