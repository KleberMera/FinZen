import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StrategyMainComponent } from "../../components/strategy-components/strategy-main/strategy-main.component";

@Component({
  selector: 'app-strategy',
  imports: [StrategyMainComponent],
  templateUrl: './strategy.component.html',
  styleUrl: './strategy.component.scss'
})
export default class StrategyComponent {
  
}