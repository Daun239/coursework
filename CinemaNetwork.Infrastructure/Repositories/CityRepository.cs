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
    public class CityRepository : Repository<City>, ICityRepository
    {
        private readonly CinemaNetworkContext _context;

        // Constructor to inject the DbContext
        public CityRepository(CinemaNetworkContext context) : base(context)
        {
            _context = context;
        }

        //     // Get all cities
        //     public async Task<List<City>> GetAllAsync()
        //     {
        //         return await _context.Cities.ToListAsync();
        //     }

        //     // Get a city by id
        //     public async Task<City?> GetByIdAsync(int id)
        //     {
        //         return await _context.Cities.FirstOrDefaultAsync(c => c.CityId == id);
        //     }

        //     // Create a new city
        //     public async Task<City> AddAsync(string cityName)
        //     {
        //         var city = new City
        //         {
        //             City1 = cityName
        //         };
        //         _context.Cities.Add(city);
        //         await _context.SaveChangesAsync();
        //         return city;
        //     }

        //     // Update an existing city
        //     public async Task<City?> UpdateAsync(int id, string cityName)
        //     {
        //         var city = await _context.Cities.FirstOrDefaultAsync(c => c.CityId == id);
        //         if (city == null)
        //         {
        //             return null; // If no city found, return null
        //         }

        //         // Update city properties
        //         city.City1 = cityName;

        //         await _context.SaveChangesAsync();
        //         return city;
        //     }

        //     // Delete a city by id
        //     public async Task<City?> DeleteAsync(int id)
        //     {
        //         var city = await _context.Cities.FirstOrDefaultAsync(c => c.CityId == id);
        //         if (city == null)
        //         {
        //             return null; // If city is not found, return null
        //         }

        //         _context.Cities.Remove(city);
        //         await _context.SaveChangesAsync();
        //         return city;
        //     }
        // }
    }
}
