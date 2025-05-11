import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export default class SuccessComponent {
  private _router = inject(Router);

  goToLogin() {
    this._router.navigateByUrl('/login');
  }
}
