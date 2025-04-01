using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class CountryRepository : Repository<Country>, ICountryRepository
    {
        private readonly CinemaNetworkContext _context;

        // Constructor to inject the DbContext
        public CountryRepository(CinemaNetworkContext context) : base(context)
        {
            _context = context;
        }

        // Get all countries
        public async Task<List<Country>> GetAllAsync()
        {
            return await _context.Countries.ToListAsync();
        }

        // Get a country by id
        public async Task<Country?> GetByIdAsync(int id)
        {
            return await _context.Countries.FirstOrDefaultAsync(c => c.CountryId == id);
        }

        // Create a new country
        public async Task<Country> AddAsync(string countryName)
        {
            var country = new Country
            {
                Country1 = countryName
            };
            _context.Countries.Add(country);
            await _context.SaveChangesAsync();
            return country;
        }

        // Update an existing country
        public async Task<Country?> UpdateAsync(int id, string countryName)
        {
            var country = await _context.Countries.FirstOrDefaultAsync(c => c.CountryId == id);
            if (country == null)
            {
                return null; // If no country found, return null
            }

            // Update country properties
            country.Country1 = countryName;

            await _context.SaveChangesAsync();
            return country;
        }

        // Delete a country by id
        public async Task<Country?> DeleteAsync(int id)
        {
            var country = await _context.Countries.FirstOrDefaultAsync(c => c.CountryId == id);
            if (country == null)
            {
                return null; // If country is not found, return null
            }

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();
            return country;
        }
    }
}
