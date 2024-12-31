import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {

  private isMobile = new BehaviorSubject<boolean>(window.innerWidth < 768);

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile.next(window.innerWidth < 768);
    });
  }

  isMobileView(): Observable<boolean> {
    return this.isMobile.asObservable();
  }
}
