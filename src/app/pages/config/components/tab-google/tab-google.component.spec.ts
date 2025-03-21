import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabGoogleComponent } from './tab-google.component';

describe('TabGoogleComponent', () => {
  let component: TabGoogleComponent;
  let fixture: ComponentFixture<TabGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabGoogleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
