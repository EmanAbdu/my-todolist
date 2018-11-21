import {trigger, animate, style, group, query, transition} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
  transition('signup => login', [
    query(':enter, :leave', style({ position: 'fixed', width:'100%' ,top:'50%',transform: 'translateY(-50%)' })
      , { optional: true }),
    group([
      query(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
      ], { optional: true }),
    ])
  ]),
  transition('login => signup', [
    group([
      query(':enter, :leave', style({ position: 'fixed', width:'100%',top:'50%',transform: 'translateY(-50%)' })
      , { optional: true }),
      query(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
      ], { optional: true }),
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
      ], { optional: true }),
    ])
  ]),
//   transition('* => sidenav', [
//     group([
//       query(':enter, :leave', style({ position: 'fixed', width:'100%',top:'0%' })
//       , { optional: true }),
//       query(':enter', [
//         style({ transform: 'translateY(100%)' }),
//         animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
//       ], { optional: true }),
//       query(':leave', [
//         style({ transform: 'translateY(0%)' }),
//         animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
//       ], { optional: true }),
//     ])
//   ]),
])