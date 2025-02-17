﻿namespace Chef.HRMS.Repositories;

public class AssetRaiseRequestRepository : GenericRepository<AssetRaiseRequest>, IAssetRaiseRequestRepository
{
    public AssetRaiseRequestRepository(IHttpContextAccessor httpContextAccessor, ITenantConnectionFactory session) : base(httpContextAccessor, session)
    {

    }
    public async Task<int> InsertAsync(IEnumerable<AssetRaiseRequest> assetRaiseRequest)
    {
        var sql = new QueryBuilder<AssetRaiseRequest>().GenerateInsertQuery();
        sql = sql.Replace("RETURNING id", "");

        return await Connection.ExecuteAsync(sql, assetRaiseRequest);
    }
    public async Task<IEnumerable<AssetRaiseRequest>> GetAllRaiseRequestList(int empid)
    {

        var sql = @"select at.id,
                               at.assettypeid, 
                               at.requestno,
                               at.requesteddate,
                               at.requestfor,
                               at.nameofteammemberid,
                               concat (firstname,' ',lastname) as nameofteammember,
                               at.requesttype,
                               at.description,
                               at.status,at.empid,
                               at.reason
                               from hrms.assetraiserequest as at 
                               inner join   
                               hrms.HRMSEmployee as em on 
                               at.nameofteammemberid=em.id
                               where empid=@empid order by at.id desc";

        return await Connection.QueryAsync<AssetRaiseRequest>(sql, new { empid });
    }

    public async Task<IEnumerable<AssetRaiseRequest>> Get(int id)
    {

        var sql = "SELECT * FROM  hrms.assetraiserequest WHERE id = @id";

        return await Connection.QueryAsync<AssetRaiseRequest>(sql, new { id });
    }

    public async Task<IEnumerable<AssetEmployeeViewModel>> GetEmployeeDetails()
    {
        var sql = @"select concat(firstname,'-',jd.employeenumber) as employeecode,
                        firstname,
                        jd.employeenumber,
                        jd.employeeid as empid,
                        jd.department 
                        from hrms.jobdetails as jd 
                        inner join hrms.HRMSEmployee
                        on jd.employeeid = hrms.HRMSEmployee.id";
        return await Connection.QueryAsync<AssetEmployeeViewModel>(sql, new { });
    }

    public async Task<int> UpdateRevoke(int id)
    {
        var sql = "update hrms.assetraiserequest set status=6 where id=@id";
        return await Connection.ExecuteAsync(sql, new { id });
    }




    //public async Task<IEnumerable<AssetRaiseRequest>> GetEmployeeDepartmentDetails(int id)
    //{
    //    var sql = @"select concat(firstname,'-',jd.employeenumber) as nameofteammember, 
    //                        jd.employeeid as empid , 
    //                        jd.employeenumber,
    //                        firstname,
    //                        jd.department 
    //                        from hrms.jobdetails as jd inner join hrms.employee 
    //                        on jd.employeeid=hrms.employee.id where jd.employeeid=@id";
    //    return await Connection.QueryAsync<AssetRaiseRequest>(sql, new { id });
    //}
    public async Task<string> GenerateNewDocumentNumberAsync(string code)
    {
        int freeNumber = 1;
        string docNumber = string.Empty;
        string fmt = "00000";

        string sql = @"SELECT * FROM hrms.employeenumberseries where prefix = @code;";
        EmployeeNumberSeries generalNumberingSchema = await Connection.QueryFirstOrDefaultAsync<EmployeeNumberSeries>(sql, new { code });
        if (generalNumberingSchema == null)
        {
            docNumber = code + "-" + freeNumber.ToString(fmt);

            ++freeNumber;
            sql = @"INSERT INTO hrms.employeenumberseries( NextNumber, prefix,Name)
	                                VALUES (@freeNumber,@Code,@code);";
            await Connection.ExecuteAsync(sql, new { freeNumber, code });
        }
        else
        {
            docNumber = code + "-" + generalNumberingSchema.NextNumber.ToString(fmt);

            generalNumberingSchema.NextNumber = generalNumberingSchema.NextNumber + 1;

            sql = @"UPDATE hrms.employeenumberseries 
                                    SET    NextNumber = @freeNumber 
                                    WHERE  id = @id ;";
            await Connection.ExecuteAsync(sql, new { freeNumber = generalNumberingSchema.NextNumber, id = generalNumberingSchema.Id });
        }
        return docNumber;
    }

}
