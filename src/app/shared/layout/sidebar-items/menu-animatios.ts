import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';

export const menuAnimations = {
  // Animación para la lista principal
  listAnimation: trigger('listAnimation', [
    transition('* <=> *', [
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(-15px)' }),
        stagger('50ms', [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ], { optional: true })
    ])
  ]),

  // Animación de aparición con fade
  fadeInAnimation: trigger('fadeInAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-10px)' }),
      animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
  ]),

  // Animación para el dropdown
  dropdownAnimation: trigger('dropdownAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-10px)' }),
      animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
    ])
  ]),

  // Animación para el ícono de rotación
  rotateAnimation: trigger('rotateAnimation', [
    state('true', style({ transform: 'rotate(180deg)' })),
    state('false', style({ transform: 'rotate(0deg)' })),
    transition('true <=> false', animate('300ms ease-out'))
  ])
};