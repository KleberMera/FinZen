import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabDeviceComponent } from './tab-device.component';

describe('TabDeviceComponent', () => {
  let component: TabDeviceComponent;
  let fixture: ComponentFixture<TabDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabDeviceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
