﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chef.HRMS.Repositories
{
    public class LeavePrintBoldReportRepository: BaseRepository, ILeavePrintBoldReportRepository
    {
        public async Task<IEnumerable<LeaveRequestPrintBoldReport>> GetLeaveRequestDetailsAsync(int id)
        {
            string query = string.Format(@"SELECT 
                                         (Concat(e.firstname, ' ', e.lastname)) as EmployeeName,l.fromdate,l.todate,
                                         (Concat(e.firstname, ' ', e.lastname)) as RequestedBy, 
                                         l.createddate as RequestedOn,lc.description AS LeaveType,
                                         l.numberofdays,l.rejoindate,l.description
                                        FROM hrms.leave l
                                        LEFT JOIN hrms.HRMSEmployee e ON l.employeeid = e.id 
                                        LEFT JOIN hrms.leavecomponent lc ON  l.leavecomponentid=lc.id
                                        WHERE leave.id = {0}; "", id);");
            var result = await DatabaseSession.QueryAsync<LeaveRequestPrintBoldReport>(query);
            return result;
        }
    }
}