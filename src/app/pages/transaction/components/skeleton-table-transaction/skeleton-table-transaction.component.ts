import { Component, inject } from '@angular/core';
import { BreakpointService } from '@services/breakpoint.service';
import { SkeletonMobileTransactionComponent } from "../skeleton-mobile-transaction/skeleton-mobile-transaction.component";

@Component({
  selector: 'app-skeleton-table-transaction',
  imports: [SkeletonMobileTransactionComponent],
  templateUrl: './skeleton-table-transaction.component.html',
  styleUrl: './skeleton-table-transaction.component.scss'
})
export class SkeletonTableTransactionComponent {

  public readonly _breakS = inject(BreakpointService)

}
