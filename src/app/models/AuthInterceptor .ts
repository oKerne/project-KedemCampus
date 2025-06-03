import { HttpInterceptorFn } from '@angular/common/http';

const BASE_URL = 'http://localhost:3000';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
 
  if (!req.url.startsWith('http')) {
    const apiReq = req.clone({ url: `${BASE_URL}${req.url}` });
    return next(apiReq);
  }
  return next(req);
};
