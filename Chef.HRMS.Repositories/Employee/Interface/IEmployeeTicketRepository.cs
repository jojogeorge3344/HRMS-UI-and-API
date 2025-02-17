﻿

namespace Chef.HRMS.Repositories;

public interface IEmployeeTicketRepository : IGenericRepository<EmployeeTicket>
{
    Task<IEnumerable<EmployeeTicket>> GetTicketDetailsByEmployeeId(int employeeId);
    Task<bool> IsTravelFromExist(string fromPlace);
}