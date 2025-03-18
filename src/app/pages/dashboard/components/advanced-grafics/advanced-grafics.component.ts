import { Component, effect, inject, OnInit, signal, viewChild } from '@angular/core';
import { GraficsService } from '../../services/grafics.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { StorageService } from '@services/storage.service';
import { CardMovementsComponent } from "./components/card-movements/card-movements.component";


@Component({
  selector: 'app-advanced-grafics',
  imports: [CardMovementsComponent],
  templateUrl: './advanced-grafics.component.html',
  styleUrl: './advanced-grafics.component.scss',
})
export class AdvancedGraficsComponent {
 

}