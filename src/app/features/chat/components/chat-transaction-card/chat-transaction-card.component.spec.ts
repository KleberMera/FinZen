import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTransactionCardComponent } from './chat-transaction-card.component';

describe('ChatTransactionCardComponent', () => {
  let component: ChatTransactionCardComponent;
  let fixture: ComponentFixture<ChatTransactionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTransactionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatTransactionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
