﻿using Chef.Common.Repositories;
using Chef.HRMS.Models;
using Dapper;
using System.Threading.Tasks;

namespace Chef.HRMS.Repositories
{
    public class JobFilingRepository : GenericRepository<JobFiling>, IJobFilingRepository
    {
        public JobFilingRepository(DbSession session) : base(session)
        {
        }

        public async Task<int> GetWeekendPolicyById(int employeeId)
        {

                string sql = @"SELECT weekoff FROM jobfiling where employeeid=@employeeid";

                return await Connection.QueryFirstOrDefaultAsync<int>(sql, new { employeeId });
        }
    }
}