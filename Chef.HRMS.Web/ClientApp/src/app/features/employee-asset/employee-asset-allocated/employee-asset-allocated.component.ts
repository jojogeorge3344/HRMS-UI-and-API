import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { AssetStatus } from 'src/app/models/common/types/assetstatus';
import { SplitByUpperCasePipe } from 'src/app/pipes/split-by-upper-case.pipe';
import { AssetEmployeewiseRequest } from '../assetemployeewiserequest.model';
import { EmployeAssetService } from '../employe-asset.service';
import { AssetEmployeeWise } from '../employee-asset.model';

@Component({
  selector: 'hrms-employee-asset-allocated',
  templateUrl: './employee-asset-allocated.component.html',
})
export class EmployeeAssetAllocatedComponent implements OnInit {
  empid:number;
  allocatedAssets;
  status=AssetStatus;

  constructor(private employeeAsset :EmployeAssetService,
              private activatedRoute: ActivatedRoute,
              private splitByUpperCase: SplitByUpperCasePipe) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log(params);
      this.empid = params.id;
    });
    this.getAllocatedAssetsById();
    }
  
    getAllocatedAssetsById() {
      console.log(this.empid);
      return this.employeeAsset.getAllocatedAssetsById(this.empid).subscribe((result) => {
          this.allocatedAssets = result;
          console.log(this.allocatedAssets);
        });
    }

}
