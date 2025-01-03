import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDesktopComponent } from './view-desktop.component';

describe('ViewDesktopComponent', () => {
  let component: ViewDesktopComponent;
  let fixture: ComponentFixture<ViewDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDesktopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
