﻿using Chef.Common.Repositories;
using Chef.HRMS.Models;
using Dapper;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chef.HRMS.Repositories
{
    public class OverTimePolicyConfigurationRepository : GenericRepository<OverTimePolicyConfiguration>, IOverTimePolicyConfigurationRepository
    {
        public OverTimePolicyConfigurationRepository(IHttpContextAccessor httpContextAccessor, ITenantConnectionFactory session) : base(httpContextAccessor, session)
        {
        }

        public async Task<IEnumerable<int>> GetAllAssignedOverTimePolicies()
        {
            var sql = @"SELECT DISTINCT overtimepolicyid 
                                    FROM hrms.overtimepolicyconfiguration
                                    ORDER  BY overtimepolicyid ASC";

                return await Connection.QueryAsync<int>(sql);
        }

        public async Task<OverTimePolicyConfiguration> GetByOverTimePolicyId(int overTimePolicyId)
        {
                var sql = @"SELECT * 
                            FROM   hrms.overtimepolicyconfiguration 
                            WHERE  overtimepolicyid = @overTimePolicyId";

                return await Connection.QueryFirstOrDefaultAsync<OverTimePolicyConfiguration>(sql, new { overTimePolicyId });
        }

        public async Task<OverTimePolicyConfiguration> GetOvertimeConfigurationById(int employeeId)
        {
                var sql = @"SELECT * 
                            FROM   hrms.overtimepolicyconfiguration A 
                                   INNER JOIN hrms.jobfiling B 
                                           ON A.overtimepolicyid = B.overtimepolicyid 
                            WHERE  B.employeeid = @employeeId";

                return await Connection.QueryFirstOrDefaultAsync<OverTimePolicyConfiguration>(sql, new { employeeId });
        }
        public async Task<IEnumerable<BenefitTypes>> GetNormalOverTime()
        {
            var sql = @"SELECT * FROM hrms.benefittypes
                        WHERE isarchived=false AND id =8";

            return await Connection.QueryAsync<BenefitTypes>(sql);
        }
        public async Task<IEnumerable<BenefitTypes>> GetHolidayOverTime()
        {
            var sql = @"SELECT * FROM hrms.benefittypes
                        WHERE isarchived=false AND id =9";

            return await Connection.QueryAsync<BenefitTypes>(sql);
        }
        public async Task<IEnumerable<BenefitTypes>> GetSpecialOvertime()
        {
            var sql = @"SELECT * FROM hrms.benefittypes
                        WHERE isarchived=false AND id =10";

            return await Connection.QueryAsync<BenefitTypes>(sql);
        }
    }
}
