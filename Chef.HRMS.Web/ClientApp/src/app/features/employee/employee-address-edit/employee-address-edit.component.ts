import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeAddress } from './employee-address.model';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { EmployeeAddressService } from './employee-address.service';
import { getCurrentUserId } from '@shared/utils/utils.functions';
import { StateService } from '@settings/branch/state.service';
import { CountryService } from '@settings/branch/country.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hrms-employee-address-edit',
  templateUrl: './employee-address-edit.component.html',
  styleUrls: ['./employee-address-edit.component.scss']
})
export class EmployeeAddressEditComponent implements OnInit {

  editForm: FormGroup;
 // @Input() address: EmployeeAddress;
  public countries: any;
  public states: any;
  currentUserId: number;
  id:any
  public currentstatesByCountry: any;
  public permanentstatesByCountry: any;
  getStateValue: any;
  constructor(private formBuilder: FormBuilder,
    private toastr: ToasterDisplayService,
    private addressService: EmployeeAddressService,
    private stateService: StateService,
    private countryService: CountryService,
    private route: ActivatedRoute,
    ) { }


  ngOnInit(): void {
    //this.currentUserId = getCurrentUserId();
    this.editForm = this.createFormGroup();
    
    // if (this.address) {
    //   this.editForm.patchValue(this.address);
    //   this.getStatesByCountry(this.address.currentCountry, 'current');
    //   this.getStatesByCountry(this.address.currentCountry, 'permenant');
    // }
    this.route.params.subscribe((params: any) => {
      this.id = parseInt(params.id, 10);
      });
     this.getCountires()
     this.getStates()
     this.getAll()
     
   
  }
  getCountires() {
    this.countryService.getAll().subscribe(result => {
      this.countries = result;
    },
      error => {
        console.error(error);
      });
      this.getStates()
  }

  getStates() {
    this.stateService.getAll().subscribe(result => {
      this.states = result;
    },
      error => {
        console.error(error);
      });
  }
  getAll(){
    debugger
    this.addressService.get(this.id).subscribe((res)=>{
      this.editForm.value.currentCountry=res[0].currentCountry
      if(this.editForm.value.currentCountry){
    this.getStatesByCountry(this.editForm.value.currentCountry, 'current');
    this.getStatesByCountry(this.editForm.value.currentCountry, 'permenant');
      }
      this.getStateValue=res[0].id
      this.editForm.patchValue({
        employeeId: res[0].employeeId,
        currentAddressLine1:res[0].currentAddressLine1,
        currentAddressLine2:res[0].currentAddressLine2,
        currentCountry: res[0].currentCountry,
        currentState: res[0].currentState,
        currentPinCode: res[0].currentPinCode,
        permanentAddressLine1: res[0].permanentAddressLine1,
        permanentAddressLine2: res[0].permanentAddressLine2,
        permanentCountry: res[0].permanentCountry,
        permanentState: res[0].permanentState,
        permanentPinCode: res[0].permanentPinCode,
        id:res[0].id
      });
    })
  
    
  }
  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      currentAddressLine1: ['', [
        Validators.required,
        Validators.maxLength(128),
      ]],
      currentAddressLine2: ['', [
        Validators.maxLength(128),
      ]],
      currentCountry: ['', [
        Validators.required,
        Validators.maxLength(32),
      ]],
      currentPinCode: ['', [
        Validators.required,
        Validators.maxLength(16),
        Validators.pattern("^[0-9]*$")
      ]],
      currentState: ['', [
        Validators.required,
      ]],
      permanentAddressLine1: ['', [
        Validators.required,
        Validators.maxLength(128),
      ]],
      permanentAddressLine2: ['', [
        Validators.maxLength(128),
      ]],
      permanentCountry: ['', [
        Validators.required,
        Validators.maxLength(32),
      ]],
      permanentPinCode: ['', [
        Validators.required,
        Validators.maxLength(16),
        Validators.pattern("^[0-9]*$"),
      ]],
      permanentState: ['', [
        Validators.required,
      ]],
      ispermanentSameAsCurrent: [false],
      createdDate: []
     

    });
  }
  getStatesByCountry(countryId, addressType) {
    debugger
    if (addressType === 'current') {
      this.currentstatesByCountry = this.states?.filter((state) => state.countryId == countryId);
      this.setpermanentAsCurrent(this.editForm.controls.currentCountry.value, 'permanentCountry');
      if (this.editForm.controls.ispermanentSameAsCurrent.value) {
        this.permanentstatesByCountry = this.states?.filter((state) => state.countryId == countryId);
      }
    } else {
      this.permanentstatesByCountry = this.states?.filter((state) => state.countryId == countryId);
    }
  }
  currentAspermanent() {
    if (this.editForm.controls.ispermanentSameAsCurrent.value) {
      this.setpermanentAsCurrent(this.editForm.controls.currentAddressLine1.value, 'permanentAddressLine1');
      this.setpermanentAsCurrent(this.editForm.controls.currentAddressLine2.value, 'permanentAddressLine2');
      this.setpermanentAsCurrent(this.editForm.controls.currentCountry.value, 'permanentCountry');
      this.getStatesByCountry(this.editForm.controls.currentCountry.value, 'permanent');
      this.setpermanentAsCurrent(this.editForm.controls.currentState.value, 'permanentState');
      this.setpermanentAsCurrent(this.editForm.controls.currentPinCode.value, 'permanentPinCode');


      this.editForm.controls.permanentAddressLine1.disable();
      this.editForm.controls.permanentAddressLine2.disable();
      this.editForm.controls.permanentCountry.disable();
      this.editForm.controls.permanentPinCode.disable();
      this.editForm.controls.permanentState.disable();
    } else {
      this.editForm.controls.permanentAddressLine1.enable();
      this.editForm.controls.permanentAddressLine2.enable();
      this.editForm.controls.permanentCountry.enable();
      this.editForm.controls.permanentPinCode.enable();
      this.editForm.controls.permanentState.enable();
    }
  }
  setpermanentAsCurrent(value: any, field: string) {
    if (this.editForm.controls.ispermanentSameAsCurrent.value) {
      const updatevalue = {};
      updatevalue[field] = value;
      this.editForm.patchValue(updatevalue);
    }

  }
  onSubmit() {
    debugger
    const address = this.editForm.getRawValue();
    address.employeeId = this.id
    address.createdDate = new Date();
    if (this.getStateValue) {
      address.id = this.getStateValue;
    } 

    address.currentCountry = parseInt(address.currentCountry, 10);
    address.currentState = parseInt(address.currentState, 10);
    address.permanentCountry = parseInt(address.permanentCountry, 10);
    address.permanentState = parseInt(address.permanentState, 10);
    if(address.id){
    this.addressService.update(address).subscribe(res => {
      if (res) {
        this.toastr.showSuccessMessage('The address updated successfully');
        // this.activeModal.close('submit');
      }
    }, error => {
      console.error(error);
      this.toastr.showErrorMessage('Unable to update the address');
    });
  }else{

    this.addressService.update(address).subscribe(res => {
      if (res) {
        this.toastr.showSuccessMessage('The address added successfully');
        // this.activeModal.close('submit');
      }
    }, error => {
      console.error(error);
      this.toastr.showErrorMessage('Unable to add the address');
    });
  }


  }
}
