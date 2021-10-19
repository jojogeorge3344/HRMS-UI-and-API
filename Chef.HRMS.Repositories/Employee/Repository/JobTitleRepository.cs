﻿using Chef.Common.Repositories;
using Chef.HRMS.Models;
using Dapper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Chef.HRMS.Repositories
{
    public class JobTitleRepository : GenericRepository<JobTitle>, IJobTitleRepository
    {
        public JobTitleRepository(DbSession session) : base(session)
        {
        }

        public async Task<IEnumerable<JobTitleView>> GetAllJobTitleList()
        {

                var sql = @"SELECT DISTINCT jt.id, 
                                            jt.name, 
                                            jt.description, 
                                            (SELECT Count(*) 
                                             FROM   jobdetails 
                                             WHERE  jobtitleid = jd.jobtitleid) AS NumberOfEmployees, 
                                            jt.createddate, 
                                            jt.modifieddate, 
                                            jt.createdby, 
                                            jt.modifiedby,
                                            jt.isarchived
                            FROM   jobtitle AS jt 
                                   LEFT JOIN jobdetails AS jd 
                                          ON jt.id = jd.jobtitleid ";

                return await Connection.QueryAsync<JobTitleView>(sql);
        }
    }
}