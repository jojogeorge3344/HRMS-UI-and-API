import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hrms-employee-settings-container',
  templateUrl: './employee-settings-container.component.html'
})
export class EmployeeSettingsContainerComponent implements OnInit {

  tabs = [
    { title: 'Job Title', fragment: 'employee-job-title' },
    { title: 'Employee Defaults', fragment: 'employee-defaults' },
    { title: 'Employee Numbers', fragment: 'employee-numbers' }
  ];
  activeId: string;

  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.activeId = this.route.children[0].snapshot.url[0].path;
  }

}
