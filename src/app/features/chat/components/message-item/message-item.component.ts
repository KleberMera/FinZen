import { Component, inject, input, signal } from '@angular/core';
import { Message } from '@models/message';
import { ChatTransactionCardComponent } from "../chat-transaction-card/chat-transaction-card.component";
import { ChatMultipleTransactionsCardComponent } from "../chat-multiple-transactions-card/chat-multiple-transactions-card.component";
import { StorageService } from '../../../../shared/services/storage.service';
import { LogoComponent } from "../../../../shared/icons/logo/logo.component";
import { FormatTextPipe } from '@models/format-text.pipe';

@Component({
  selector: 'app-message-item',
  imports: [ChatTransactionCardComponent, ChatMultipleTransactionsCardComponent, LogoComponent, FormatTextPipe],
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.scss'
})
export class MessageItemComponent {
  message = input.required<Message>();
  protected readonly storageService = inject(StorageService);
  avatar = signal<string | null>(this.storageService.getAvatar());
}
