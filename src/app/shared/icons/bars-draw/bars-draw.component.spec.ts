import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarsDrawComponent } from './bars-draw.component';

describe('BarsDrawComponent', () => {
  let component: BarsDrawComponent;
  let fixture: ComponentFixture<BarsDrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarsDrawComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarsDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
