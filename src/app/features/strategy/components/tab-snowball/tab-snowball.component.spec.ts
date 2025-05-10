import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabSnowballComponent } from './tab-snowball.component';

describe('TabSnowballComponent', () => {
  let component: TabSnowballComponent;
  let fixture: ComponentFixture<TabSnowballComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabSnowballComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabSnowballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
