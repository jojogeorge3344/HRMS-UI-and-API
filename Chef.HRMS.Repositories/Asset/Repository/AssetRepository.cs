﻿namespace Chef.HRMS.Repositories;

public class AssetRepository : GenericRepository<Asset>, IAssetRepository
{
    public AssetRepository(IHttpContextAccessor httpContextAccessor, ITenantConnectionFactory session) : base(httpContextAccessor, session)
    {

    }

    //public async Task<IEnumerable<Asset>> GetAssetById(int id)
    //{
    //    var sql = @"SELECT jt.id,
    //                        jt.assetname,
    //                        jt.assettypeid,
    //                        jt.assettypemetadataid,
    //                        jt.date,
    //                        jt.description,
    //                        jt.status,
    //                        js.value,
    //                        jt.isactive,
    //                        jt.createddate,
    //                        jt.modifieddate,
    //                        jt.createdby,
    //                        jt.modifiedby,
    //                        jt.isarchived
    //                        FROM hrms.asset AS jt
    //                        INNER JOIN hrms.assetmetadatavalue AS js
    //                        ON jt.id = js.assetid where jt.id=@id";
    //    return await Connection.QueryAsync<Asset>(sql, new { id });
    //}



    public async Task<int> BulkInsertAsync(List<AssetMetadataValue> assetMetadataValues)
    {
        int noOfRows;
        try
        {
            var sql = new QueryBuilder<AssetMetadataValue>().GenerateInsertQuery();
            noOfRows = Convert.ToInt32(await Connection.ExecuteAsync(sql, assetMetadataValues.AsEnumerable()));

        }
        catch (Exception ex)
        {
            string msg = ex.Message;
            noOfRows = 0;
        }
        return noOfRows;
    }



    public async Task<int> BulkUpdateAsync(List<AssetMetadataValue> assetMetadataValues)
    {
        int noOfRows;
        try
        {
            var sql = new QueryBuilder<AssetMetadataValue>().GenerateUpdateQuery();
            noOfRows = Convert.ToInt32(await Connection.ExecuteAsync(sql, assetMetadataValues.AsEnumerable()));

        }
        catch (Exception ex)
        {
            string msg = ex.Message;
            noOfRows = 0;
        }
        return noOfRows;
    }

    public async Task<IEnumerable<Asset>> GetAllAssetList()
    {

        var sql = @"SELECT DISTINCT jt.id, 
                                            jt.assetname,
                                            jt.assettypeid,
                                            jt.assettypemetadataid,
                                            jt.date,
                                            jt.description,
                                            jt.status,
                                            jt.isactive, 
                                            jt.createddate, 
                                            jt.modifieddate, 
                                            jt.createdby, 
                                            jt.modifiedby,
                                            jt.isarchived
                            FROM   hrms.asset AS jt 
                                   INNER JOIN hrms.assettype
                                           ON jt.assettypeid = hrms.assettype.id
                                   INNER JOIN hrms.assettypemetadata
                                           ON jt.assettypeid = hrms.assettypemetadata.assettypeid
                                           WHERE jt.isarchived=false order by jt.id desc ";   // Added "WHERE jt.isarchived=false"  by Nir


        return await Connection.QueryAsync<Asset>(sql);
    }

    public async Task<IEnumerable<AssetMetadataValue>> GetMetadataValueAsync(int id)
    {
        var sql = @"SELECT jt.id,
                                jt.assetname,
                                jt.assettypeid,
                                js.assettypemetadataid,
                                jt.date,
                                jt.description,
                                jt.status,
                                js.value,
                                js.id,
                                jt.isactive,
                                jt.createddate,
                                jt.modifieddate,
                                jt.createdby,
                                jt.modifiedby,
                                jt.isarchived
                                FROM hrms.assetmetadatavalue AS js
                                INNER JOIN hrms.asset AS jt
                                ON js.assetid = jt.id where js.assetid=@id";
        return await Connection.QueryAsync<AssetMetadataValue>(sql, new { id });
    }
    public async Task<IEnumerable<AssetMetadataValue>> GetAllMetadataValue()
    {
        var sql = "SELECT * FROM hrms.assetmetadatavalue";
        return await Connection.QueryAsync<AssetMetadataValue>(sql);
    }

    public async Task<int> UpdateStatus(int id, int status)
    {
        var sql = @"UPDATE hrms.asset
                        SET status=@status WHERE id=@id";
        return await Connection.ExecuteAsync(sql, new { id, status });
    }

    //public async Task<int> Update(int id)
    //{
    //    var sql = "UPDATE assetname,isactive,description FROM hrms.asset WHERE Id=@Id";
    //    return await Connection.QueryAsync<Asset>(sql, new { Id = Id });
    //}
}

