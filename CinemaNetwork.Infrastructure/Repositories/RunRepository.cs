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
    public class RunRepository : IRunRepository
    {
        private readonly CinemaNetworkContext _context;

        public RunRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Create a new Run
        public async Task<Run> CreateAsync(Run updateRunDto)
        {
            // Map the UpdateRunDto to Run entity using the Mapper
            var run = updateRunDto;

            await _context.Runs.AddAsync(run);
            await _context.SaveChangesAsync();

            // Return the created Run entity
            return run;
        }

        // Delete a Run by its ID
        public async Task<Run?> DeleteAsync(int id)
        {
            var run = await _context.Runs.FirstOrDefaultAsync(r => r.RunId == id);
            if (run == null)
            {
                return null; // Return null if no Run is found
            }

            _context.Runs.Remove(run);
            await _context.SaveChangesAsync();

            // Return the deleted Run entity
            return run;
        }

        // Get all Runs
        public async Task<List<Run>> GetAllAsync()
        {
            var runs = await _context.Runs.Include(r => r.Movie).ToListAsync();

            // Return the list of Run entities
            return runs;
        }

        // Get a specific Run by its ID
        public async Task<Run?> GetByIdAsync(int id)
        {
            var run = await _context.Runs.Include(r => r.Movie).FirstOrDefaultAsync(r => r.RunId == id);
            if (run == null)
            {
                return null; // Return null if Run is not found
            }

            // Return the Run entity
            return run;
        }

        // Update a Run by its ID
        public async Task<Run?> UpdateAsync(int id, Run updateRunDto)
        {
            var run = await _context.Runs.FirstOrDefaultAsync(r => r.RunId == id);
            if (run == null)
            {
                return null; // Return null if no Run is found
            }

            // Map the UpdateRunDto to the existing Run entity
            run = updateRunDto;

            // Ensure the ID stays the same
            run.RunId = id;
            run.UpdateDateTime = DateTime.Now;

            await _context.SaveChangesAsync();

            // Return the updated Run entity
            return run;
        }
    }
}
