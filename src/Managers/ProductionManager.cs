using System;
using System.Collections.Generic;

namespace Cities.Managers
{
    public class ProductionManager
    {
        // Dictionary to track resources and their quantities
        private Dictionary<string, int> resources;

        public ProductionManager()
        {
            InitializeResources();
        }

        // Method to initialize resources
        private void InitializeResources()
        {
            resources = new Dictionary<string, int>
            {
                { "Wood", 0 },
                { "Stone", 0 },
                { "Food", 0 },
                { "Gold", 0 }
            };
        }

        // Method to add resources
        public void AddResource(string type, int amount)
        {
            if (resources.ContainsKey(type))
            {
                resources[type] += amount;
            }
            else
            {
                Console.WriteLine($"Resource type '{type}' is not recognized.");
            }
        }

        // Method to remove resources
        public void RemoveResource(string type, int amount)
        {
            if (resources.ContainsKey(type) && resources[type] >= amount)
            {
                resources[type] -= amount;
            }
            else
            {
                Console.WriteLine($"Insufficient resources or unrecognized type '{type}'.");
            }
        }

        // Method to get the quantity of a resource
        public int GetResourceQuantity(string type)
        {
            return resources.ContainsKey(type) ? resources[type] : 0;
        }
    }
}