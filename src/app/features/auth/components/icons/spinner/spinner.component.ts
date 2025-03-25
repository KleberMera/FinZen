import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  imports: [],
  template: ` <svg class="animate-spin w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
  viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
    d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.4 2.6L12 12" />
</svg>`
})
export class SpinnerComponent {

}
