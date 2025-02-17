import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBankComponent } from './create.component';

describe('CreateComponent', () => {
  let component: CreateBankComponent;
  let fixture: ComponentFixture<CreateBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
