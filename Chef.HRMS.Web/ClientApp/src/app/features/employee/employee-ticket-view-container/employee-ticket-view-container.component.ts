import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterDisplayService } from 'src/app/core/services/toaster-service.service';
import { ConfirmModalComponent } from '@shared/dialogs/confirm-modal/confirm-modal.component';
import { EmployeeTicketGroup } from '../employee-ticket-details/employee-ticket-model';
import { EmployeeTicketService } from '../employee-ticket-details/employee-ticket-service';
import { TicketBase } from '../employee-ticket-details/employee-ticket.enum';
import { NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'hrms-employee-ticket-view-container',
  templateUrl: './employee-ticket-view-container.component.html',
  styleUrls: ['./employee-ticket-view-container.component.scss'],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class EmployeeTicketViewContainerComponent implements OnInit {

  
  employeeTicketDetails: EmployeeTicketGroup[] = [];
  ticketBaseKeys: number[];
  ticketBaseOf = TicketBase;
  findEmployeeId: number;

  constructor(
    public modalService: NgbModal,
    private toastr: ToasterDisplayService,
    private employeeTicketService:EmployeeTicketService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getEmployeeTicketSlablist()
    this.ticketBaseKeys = Object.keys(this.ticketBaseOf).filter(Number).map(Number);
    this.route.params.subscribe((params: any) => {
      this.findEmployeeId = parseInt(params.id, 10);
    });
  }

  getEmployeeTicketSlablist() {
    this.employeeTicketService.getAll().subscribe(result => {
      this.employeeTicketDetails = result;
      this.employeeTicketDetails=this.employeeTicketDetails.filter(x=>x.employeeId==this.findEmployeeId)
      this.employeeTicketDetails=this.employeeTicketDetails.sort((a, b) => a.travelFrom.toLowerCase().localeCompare(b.travelFrom.toLowerCase()));
    },
    error => {
      console.error(error);
      this.toastr.showErrorMessage('Unable to fetch the Ticket List Details');
    });
  }


}















