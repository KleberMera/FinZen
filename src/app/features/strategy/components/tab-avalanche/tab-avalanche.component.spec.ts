import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabAvalancheComponent } from './tab-avalanche.component';

describe('TabAvalancheComponent', () => {
  let component: TabAvalancheComponent;
  let fixture: ComponentFixture<TabAvalancheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabAvalancheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabAvalancheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
