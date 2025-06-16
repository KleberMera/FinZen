import { Component, inject } from '@angular/core';
import { BreakpointService } from '@services/breakpoint.service';
import { SkeletonMobileTransactionComponent } from "../skeleton-mobile-transaction/skeleton-mobile-transaction.component";

@Component({
    selector: 'app-skeleton-table-transaction',
    imports: [SkeletonMobileTransactionComponent],
    template: `
    @if (_breakS.isMobile()) {
        <app-skeleton-mobile-transaction></app-skeleton-mobile-transaction>
    } @else {
        <div class="bg-white/80 dark:bg-gray-900/80 rounded-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div class="overflow-x-auto custom-scrollbar">
                <table class="w-full text-sm">
                    <!-- Header -->
                    <thead>
                        <tr class="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200/50 dark:border-gray-700/50">
                            <th scope="col" class="px-6 py-4 text-left hidden sm:table-cell">
                                <div class="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </th>
                            <th scope="col" class="px-6 py-4 text-left">
                                <div class="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </th>
                            <th scope="col" class="px-6 py-4 text-left">
                                <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </th>
                            <th scope="col" class="px-6 py-4 text-left">
                                <div class="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </th>
                            <th scope="col" class="px-6 py-4 text-left hidden md:table-cell">
                                <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                            </th>
                            <th scope="col" class="px-6 py-4 text-right">
                                <div class="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto"></div>
                            </th>
                        </tr>
                    </thead>

                    <!-- Body -->
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                        @for (item of [1,2,3,4,5]; track item) {
                            <tr class="transition-all duration-200">
                                <td class="px-6 py-4 hidden sm:table-cell">
                                    <div class="h-5 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                        <div class="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                                </td>
                                <td class="px-6 py-4 hidden md:table-cell">
                                    <div class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="h-8 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ml-auto"></div>
                                </td>
                            </tr>
                        }
                    </tbody>

                    <!-- Footer -->
                    <tfoot class="bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50">
                        <tr>
                            <td colspan="4" class="text-right px-6 py-4">
                                <div class="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto"></div>
                            </td>
                            <td colspan="2" class="px-6 py-4">
                                <div class="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse float-right"></div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <!-- Paginación -->
            <div class="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200/50 dark:border-gray-700/50">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div class="flex items-center space-x-2">
                        @for (btn of [1,2,3,4,5]; track btn) {
                            <div class="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                        }
                        <div class="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    }`,


})
export class SkeletonTableTransactionComponent {
    public readonly _breakS = inject(BreakpointService);
}
     