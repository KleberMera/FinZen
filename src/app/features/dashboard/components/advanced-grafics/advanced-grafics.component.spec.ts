import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedGraficsComponent } from './advanced-grafics.component';

describe('AdvancedGraficsComponent', () => {
  let component: AdvancedGraficsComponent;
  let fixture: ComponentFixture<AdvancedGraficsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedGraficsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedGraficsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
