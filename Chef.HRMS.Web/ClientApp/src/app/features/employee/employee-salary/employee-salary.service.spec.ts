import { TestBed } from '@angular/core/testing';

import { EmployeeSalaryService } from './employee-salary-configuration-details.service';

describe('EmployeeSalaryService', () => {
  let service: EmployeeSalaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeSalaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
