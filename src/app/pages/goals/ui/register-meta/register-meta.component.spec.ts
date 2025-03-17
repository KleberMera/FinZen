import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMetaComponent } from './register-meta.component';

describe('RegisterMetaComponent', () => {
  let component: RegisterMetaComponent;
  let fixture: ComponentFixture<RegisterMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterMetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
