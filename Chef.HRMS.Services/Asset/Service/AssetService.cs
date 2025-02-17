﻿using Chef.Common.Repositories;
using Chef.HRMS.Models;
using Chef.HRMS.Repositories;
using System;
using System.Linq;
//Queryable q;
namespace Chef.HRMS.Services;

public class AssetService : IAsyncService<Asset>, IAssetService
{
    private readonly IAssetRepository assetRepository;
    private readonly ITenantSimpleUnitOfWork simpleUnitOfWork;

    public AssetService(IAssetRepository assetRepository, ITenantSimpleUnitOfWork simpleUnitOfWork)
    {
        this.assetRepository = assetRepository;
        this.simpleUnitOfWork = simpleUnitOfWork;
    }

    public async Task<int> DeleteAsync(int id)
    {
        return await assetRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<Asset>> GetAllAsync()
    {
        return await assetRepository.GetAllAsync();
    }

    //public async Task<Asset> GetAssetById(int id)
    //{
    //    var asset = await assetRepository.GetAsync(id);
    //    var assetmetadatavalue = await assetRepository.GetMetadataValueAsync(id);
    //    if (asset != null) { asset.AssetMetadataValues = assetmetadatavalue.ToList(); }
    //    return asset;
    //    //return await assetRepository.GetAssetById(id);
    //}



    public async Task<Asset> GetAsync(int id)
    {
        return await assetRepository.GetAsync(id);
    }


    //public async Task<int> UpdateAsync(Asset asset)
    //{
    //    return await assetRepository.Update(asset);
    //}

    public async Task<IEnumerable<Asset>> GetAllAssetList()
    {
        return await assetRepository.GetAllAssetList();
    }
    //public async Task<int> InsertAsync(Asset asset)
    //{
    //   return await assetRepository.InsertAsync(asset);
    //}

    public async Task<int> InsertAsync(Asset asset)
    {
        int id = 0;
        try
        {
            simpleUnitOfWork.BeginTransaction();
            // asset.ValueId = asset.AssetName + '-' + asset.ValueId;
            id = await assetRepository.InsertAsync(asset);
            //result=await assetRepository.UpdateAsync(asset)
            if (asset.AssetMetadataValues != null)
            {
                asset.AssetMetadataValues.ForEach(c => c.AssetId = id);
                var res = await assetRepository.BulkInsertAsync(asset.AssetMetadataValues);
            }

            simpleUnitOfWork.Commit();
        }
        catch (Exception ex)
        {
            simpleUnitOfWork.Rollback();
            string msg = ex.Message;

            asset.Id = 0;
            throw;
        }


        return id;
    }

    public async Task<int> UpdateAsync(Asset asset)
    {
        try
        {
            simpleUnitOfWork.BeginTransaction();
            var result = await assetRepository.UpdateAsync(asset);
            if (asset.AssetMetadataValues != null)
            {
                //asset.AssetMetadataValues.ForEach(c => c.AssetId = result);
                List<AssetMetadataValue> Exist = asset.AssetMetadataValues.Where(x => x.Id > 0).ToList();
                var res = await assetRepository.BulkUpdateAsync(Exist);
                List<AssetMetadataValue> New = asset.AssetMetadataValues.Where(x => x.Id <= 0).ToList();
                res = await assetRepository.BulkInsertAsync(New);


            }
            simpleUnitOfWork.Commit();
        }
        catch
        {
            simpleUnitOfWork.Rollback();
            asset.Id = 0;
            throw;
        }
        return asset.Id;
    }

    public async Task<IEnumerable<AssetMetadataValue>> GetAllMetadataValue()
    {
        return await assetRepository.GetAllMetadataValue();
    }

    public async Task<Asset> GetAssetById(int id)
    {
        var asset = await assetRepository.GetAsync(id);
        var assetmetadatavalue = await assetRepository.GetMetadataValueAsync(id);
        if (asset != null) { asset.AssetMetadataValues = assetmetadatavalue.ToList(); }
        return asset;

    }

    public async Task<int> UpdateStatus(int id, int status)
    {
        return await assetRepository.UpdateStatus(id, status);
    }


}
