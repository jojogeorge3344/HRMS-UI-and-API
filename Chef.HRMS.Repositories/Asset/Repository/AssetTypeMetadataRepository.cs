﻿namespace Chef.HRMS.Repositories;

public class AssetTypeMetadataRepository : TenantRepository<AssetTypeMetadata>, IAssetTypeMetadataRepository
{
    public AssetTypeMetadataRepository(IHttpContextAccessor httpContextAccessor, ITenantConnectionFactory session) : base(httpContextAccessor, session)
    {
    }

    public async Task<IEnumerable<AssetTypeMetadata>> GetAssetTypeId(int assettypeid)
    {

        var sql = "SELECT * FROM hrms.assettypemetadata where assettypeid=@assettypeid";
        return await Connection.QueryAsync<AssetTypeMetadata>(sql, new { assettypeid });
    }

    public async Task<IEnumerable<AssetTypeMetadata>> GetAllAssetTypeMetadataList()
    {
        var sql = @"select assettypename,metadata from hrms.assettypemetadata 
                        inner join  hrms.assettype on hrms.assettype.id=hrms.assettypemetadata.assettypeid";

        return await Connection.QueryAsync<AssetTypeMetadata>(sql);
    }

    public async Task<int> InsertAsync(IEnumerable<AssetTypeMetadata> assetTypeMetadata)
    {
        var sql = new QueryBuilder<AssetTypeMetadata>().GenerateInsertQuery();
        return await Connection.ExecuteAsync(sql, assetTypeMetadata);
    }

    public async Task<int> DeleteAsset(int assetTypeId)
    {
        var sql = @"DELETE FROM hrms.assettypemetadata WHERE assettypeid = @assettypeid;";
        return await Connection.ExecuteAsync(sql, new { assetTypeId });
    }

    public async Task<int> DeleteMetadata(int id)
    {
        var sql = @"DELETE FROM hrms.assettypemetadata WHERE id = @id;";
        return await Connection.ExecuteAsync(sql, new { id });
    }
    public async Task<int> Update(IEnumerable<AssetTypeMetadata> assetTypeMetadata)
    {
        var sql = new QueryBuilder<AssetTypeMetadata>().GenerateUpdateQuery();
        sql = sql.Replace("RETURNING id", "");
        return await Connection.ExecuteAsync(sql, assetTypeMetadata);
    }

}