import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFrancesComponent } from './table-frances.component';

describe('TableFrancesComponent', () => {
  let component: TableFrancesComponent;
  let fixture: ComponentFixture<TableFrancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFrancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableFrancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
