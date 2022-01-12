﻿using Chef.Common.Services;
using Chef.HRMS.Models;
using Chef.HRMS.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chef.HRMS.Services
{
    public class AssetMyAssetService : AsyncService, IAssetMyAssetService
    {
        private readonly IAssetMyAssetRepository assetMyAssetRepository;

        public AssetMyAssetService(IAssetMyAssetRepository assetMyAssetRepository)
        {
            this.assetMyAssetRepository = assetMyAssetRepository;        
        }

        public async Task<int> DeleteAsync(int id)
        {
            return await assetMyAssetRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<AssetMyAsset>> GetAllAsync()
        {
            return await assetMyAssetRepository.GetAllAsync();
        }

        public async Task<IEnumerable<AssetMyAsset>> GetMyAssetById(int Id)
        {
            return await assetMyAssetRepository.GetMyAssetById(Id);
        }


        public async Task<AssetMyAsset> GetAsync(int id)
        {
            return await assetMyAssetRepository.GetAsync(id);
        }


        public async Task<int> UpdateAsync(AssetMyAsset assetmyasset)
        {
            return await assetMyAssetRepository.UpdateAsync(assetmyasset);
        }

        public async Task<IEnumerable<AssetMyAsset>> GetAllMyAssetList()
        {
            return await assetMyAssetRepository.GetAllMyAssetList();
        }

        public async Task<int> InsertAsync(IEnumerable<AssetMyAsset> assetmyasset)
        {
            return await assetMyAssetRepository.InsertAsync(assetmyasset);
        }

        public async Task<AssetMyAsset> InsertAsync(AssetMyAsset assetmyasset)
        {
            return await assetMyAssetRepository.InsertAsync(assetmyasset);
        }
    }
}
