import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingGoogleComponent } from './loading-google.component';

describe('LoadingGoogleComponent', () => {
  let component: LoadingGoogleComponent;
  let fixture: ComponentFixture<LoadingGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingGoogleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
