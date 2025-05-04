import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrentComponent } from './recurrent.component';

describe('RecurrentComponent', () => {
  let component: RecurrentComponent;
  let fixture: ComponentFixture<RecurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurrentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
