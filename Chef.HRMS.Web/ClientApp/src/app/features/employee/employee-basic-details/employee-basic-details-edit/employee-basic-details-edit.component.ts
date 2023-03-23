import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeBasicDetailsService } from '../employee-basic-details.service';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { GenderType } from '../../../../models/common/types/gendertype';
import { getCurrentUserId } from '@shared/utils/utils.functions';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';

@Component({
  selector: 'hrms-employee-basic-details-edit',
  templateUrl: './employee-basic-details-edit.component.html',
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class EmployeeBasicDetailsEditComponent implements OnInit {

  editForm: FormGroup;
  currentUserId: number;
  id: any;
  genderTypeKeys: number[];
  genderType = GenderType;
  maxDate;
  emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  constructor(
    private employeeBasicDetailsService: EmployeeBasicDetailsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToasterDisplayService,
    private router: Router
  ) {
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear() - 18,
      month: current.getMonth() + 1,
      day: current.getDate()
    };
  }

  ngOnInit(): void {
    this.currentUserId = getCurrentUserId();
    this.editForm = this.createFormGroup();
    this.genderTypeKeys = Object.keys(this.genderType).filter(Number).map(Number);
    this.route.params.subscribe((params: any) => {
      this.id = params['id'];
    });
    this.getBasicDetailsId();
  }

  getBasicDetailsId() {
    debugger
    this.employeeBasicDetailsService.get(this.id).subscribe(result => {
      result.dateOfBirth = new Date(result.dateOfBirth);
      this.editForm.patchValue(result);
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Employee Basic Details');
      });
  }

  onSubmit() {
    var editBasicDetails = this.editForm.value;
    this.employeeBasicDetailsService.update(editBasicDetails).subscribe((result: any) => {
      this.toastr.showSuccessMessage('Employee Basic Details updated successfully!');
    },
      error => {
        console.error(error);
        this.toastr.showErrorMessage('Unable to fetch the Employee Basic Details');
      });
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      firstName: ['', [
        Validators.maxLength(18),
        Validators.required
      ]],
      middleName: ['', [Validators.maxLength(18)]],
      lastName: ['', [
        Validators.maxLength(18),
        Validators.required
      ]],
      displayName: ['', [
        Validators.maxLength(12),
        Validators.required
      ]],
      gender: [null, [
        Validators.required
      ]],
      dateOfBirth: ['', [
        Validators.required
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(this.emailRegex),
      ]],
      fileNum: ['', [
        Validators.required,
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      ]],
      religion: ['', [
        Validators.required,
      ]],
      uid: ['', [
        Validators.required,
        // Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      ]],
      createdDate: [],
      language: [null,[
        Validators.required]
      ],
      remarks:[null,[
        Validators.required,
        Validators.maxLength(250)]
      ],
      refno:[null,[
        Validators.required,
        Validators.maxLength(25)]
      ],
    });
  }

}
