import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ExpensePeriodType } from 'src/app/models/common/types/expenseperiodtype';
import { ExpenseConfigurationService } from '../expense-configuration.service';
import { ExpenseConfiguration } from '../expense-configuration.model';
import { getCurrentUserId } from '@shared/utils/utils.functions';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';


@Component({
  selector: 'hrms-expense-configuration-general',
  templateUrl: './expense-configuration-general.component.html'
})
export class ExpenseConfigurationGeneralComponent implements OnChanges {
  editForm: FormGroup;
  currentUserId: number;
  expensePeriodTypes = ExpensePeriodType;
  expensePeriodTypeKeys: number[];

  @Input() expenseConfiguration: ExpenseConfiguration;
  @Input() isView: boolean;
  @Output() saveConfiguration = new EventEmitter<boolean>();

  constructor(
    private expenseConfigurationService: ExpenseConfigurationService,
    private formBuilder: FormBuilder,
    private toastr: ToasterDisplayService) { }

  ngOnChanges(changes: SimpleChanges) {
    this.currentUserId = getCurrentUserId();

    if (changes.expenseConfiguration) {
      this.editForm = this.createFormGroup();
      this.editForm.patchValue(this.expenseConfiguration);
      this.expensePeriodTypeKeys = Object.keys(this.expensePeriodTypes).filter(Number).map(Number);
    }

    if (this.isView) {
      this.editForm.disable();
    }

    this.expensePeriodTypeKeys.splice(this.expensePeriodTypeKeys.indexOf(this.expensePeriodTypes.Daily), 1);
  }

  onChange(element) {
    if (element.checked) {
      switch (element.id) {
        case 'isExpenseLimitEnabled': {
          this.editForm.get('maximumExpenseLimit').enable();
          this.editForm.get('expensePeriodType').enable();
          break;
        }
        case 'isInstanceLimitEnabled': {
          this.editForm.get('maximumInstancesLimit').enable();
          this.editForm.get('instancesPeriodType').enable();
          break;
        }
        case 'isExpiryMarked': {
          this.editForm.get('daysPassed').enable();
          break;
        }
        case 'isCommentRequired': {
          this.editForm.get('maximumLimitComment').enable();
          break;
        }
        case 'isReceiptRequired': {
          this.editForm.get('maximumLimitReceipt').enable();
          break;
        }
      }
    } else {
      switch (element.id) {
        case 'isExpenseLimitEnabled': {
          this.editForm.get('maximumExpenseLimit').disable();
          this.editForm.get('expensePeriodType').disable();
          this.editForm.patchValue({
            maximumExpenseLimit: 0,
            expensePeriodType: 0
          });
          break;
        }
        case 'isInstanceLimitEnabled': {
          this.editForm.get('maximumInstancesLimit').disable();
          this.editForm.get('instancesPeriodType').disable();
          this.editForm.patchValue({
            maximumInstancesLimit: 0,
            instancesPeriodType: 0
          });
          break;
        }
        case 'isExpiryMarked': {
          this.editForm.get('daysPassed').disable();
          this.editForm.patchValue({
            daysPassed: 0,
          });
          break;
        }
        case 'isCommentRequired': {
          this.editForm.get('maximumLimitComment').disable();
          this.editForm.patchValue({
            maximumLimitComment: 0,
          });
          break;
        }
        case 'isReceiptRequired': {
          this.editForm.get('maximumLimitReceipt').disable();
          this.editForm.patchValue({
            maximumLimitReceipt: 0,
          });
          break;
        }
      }
    }
  }

  onSubmit() {
    this.editForm.patchValue({ isConfigured: true });
    this.expenseConfigurationService.update(this.editForm.value).subscribe(() => {
      this.toastr.showSuccessMessage('Expense type configured successfully!');
      this.saveConfiguration.emit(this.editForm.value);
    },
      error => {
        this.saveConfiguration.emit(false);
        console.error(error);
        this.toastr.showErrorMessage('Unable to configure expense policy');
      });
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      category: [null],
      expenseTypeId: [null],
      expensePolicyId: [null],
      expensePolicyName: [null],
      isConfigured: [false],
      name: [''],
      code: [''],
      currency: [''],
      isExpenseLimitEnabled: [false],
      maximumExpenseLimit: [{
        value: null,
        disabled: !this.expenseConfiguration.isExpenseLimitEnabled
      }, [
        Validators.required,
        Validators.min(1),
        Validators.max(999999999)
      ]],
      expensePeriodType: [{
        value: null,
        disabled: !this.expenseConfiguration.isExpenseLimitEnabled
      }, [
        Validators.required,
        Validators.min(1)
      ]],
      isInstanceLimitEnabled: [false],
      maximumInstancesLimit: [{
        value: null,
        disabled: !this.expenseConfiguration.isInstanceLimitEnabled
      }, [
        Validators.required,
        Validators.min(1),
        Validators.max(999999999)
      ]],
      instancesPeriodType: [{
        value: null,
        disabled: !this.expenseConfiguration.isInstanceLimitEnabled
      }, [
        Validators.required,
        Validators.min(1)
      ]],
      isExpiryMarked: [false],
      daysPassed: [{
        value: null,
        disabled: !this.expenseConfiguration.isExpiryMarked
      }, [
        Validators.required,
        Validators.min(1),
        Validators.max(365)
      ]],
      isCommentRequired: [false],
      maximumLimitComment: [{
        value: null,
        disabled: !this.expenseConfiguration.isCommentRequired
      }, [
        Validators.required,
        Validators.min(1),
        Validators.max(999999999)
      ]],
      isReceiptRequired: [false],
      maximumLimitReceipt: [{
        value: null,
        disabled: !this.expenseConfiguration.isReceiptRequired
      }, [
        Validators.required,
        Validators.min(1),
        Validators.max(999999999)
      ]],
      createdDate: [],
    });
  }
}
