using System;
using System.Collections.Generic;

namespace Cities.Managers
{
    public class TaxManager
    {
        private Dictionary<string, decimal> taxRates;

        public TaxManager()
        {
            taxRates = new Dictionary<string, decimal>();
        }

        public void SetTaxRate(string region, decimal rate)
        {
            if (rate < 0)
            {
                throw new ArgumentException("Tax rate cannot be negative.");
            }
            taxRates[region] = rate;
        }

        public decimal GetTaxRate(string region)
        {
            if (taxRates.TryGetValue(region, out var rate))
            {
                return rate;
            }
            throw new KeyNotFoundException($"Tax rate for region '{region}' not found.");
        }

        public decimal CalculateTax(string region, decimal amount)
        {
            if (amount < 0)
            {
                throw new ArgumentException("Amount cannot be negative.");
            }

            var rate = GetTaxRate(region);
            return amount * rate;
        }

        public void RemoveTaxRate(string region)
        {
            if (!taxRates.Remove(region))
            {
                throw new KeyNotFoundException($"Tax rate for region '{region}' not found to remove.");
            }
        }
    }
}