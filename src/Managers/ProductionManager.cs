using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace Managers
{
    public class ProductionManager
    {
        private double productionMultiplier;
        private double warehouseEfficiency;
        private double factoryEfficiency;

        public double GetProductionMultiplier()
        {
            Debug.WriteLine("Getting Production Multiplier: " + productionMultiplier);
            return productionMultiplier;
        }

        public void SetProductionMultiplier(double multiplier)
        {
            if(multiplier < 0)
            {
                Debug.WriteLine("Attempted to set Production Multiplier to a negative value: " + multiplier);
                throw new ArgumentException("Multiplier cannot be negative.");
            }
            productionMultiplier = multiplier;
            Debug.WriteLine("Setting Production Multiplier to: " + productionMultiplier);
        }

        public double GetWarehouseEfficiency()
        {
            Debug.WriteLine("Getting Warehouse Efficiency: " + warehouseEfficiency);
            return warehouseEfficiency;
        }

        public void SetWarehouseEfficiency(double efficiency)
        {
            if(efficiency < 0 || efficiency > 1)
            {
                Debug.WriteLine("Attempted to set Warehouse Efficiency to an invalid value: " + efficiency);
                throw new ArgumentException("Efficiency must be between 0 and 1.");
            }
            warehouseEfficiency = efficiency;
            Debug.WriteLine("Setting Warehouse Efficiency to: " + warehouseEfficiency);
        }

        public double GetFactoryEfficiency()
        {
            Debug.WriteLine("Getting Factory Efficiency: " + factoryEfficiency);
            return factoryEfficiency;
        }

        public void SetFactoryEfficiency(double efficiency)
        {
            if(efficiency < 0 || efficiency > 1)
            {
                Debug.WriteLine("Attempted to set Factory Efficiency to an invalid value: " + efficiency);
                throw new ArgumentException("Efficiency must be between 0 and 1.");
            }
            factoryEfficiency = efficiency;
            Debug.WriteLine("Setting Factory Efficiency to: " + factoryEfficiency);
        }

        public double CalculateProductionOutput(double baseOutput)
        {
            double output = baseOutput * productionMultiplier * warehouseEfficiency * factoryEfficiency;
            Debug.WriteLine("Calculating Production Output: " + output);
            return output;
        }

        public double CalculateWarehouseStorage(double capacity)
        {
            double storage = capacity * warehouseEfficiency;
            Debug.WriteLine("Calculating Warehouse Storage: " + storage);
            return storage;
        }
    }
}