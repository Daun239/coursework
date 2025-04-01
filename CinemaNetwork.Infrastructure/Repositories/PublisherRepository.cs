using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Infrastructure.Data;
using CinemaNetwork.Infrastructure.Interfaces;
using CinemaNetwork.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace CinemaNetwork.Infrastructure.Repositories
{
    public class PublisherRepository : IPublisherRepository
    {
        private readonly CinemaNetworkContext _context;

        public PublisherRepository(CinemaNetworkContext context)
        {
            _context = context;
        }

        // Get all publishers
        public async Task<List<Publisher>> GetAllAsync()
        {
            return await _context.Publishers.ToListAsync();
        }

        // Get a publisher by ID
        public async Task<Publisher?> GetByIdAsync(int id)
        {
            return await _context.Publishers.FirstOrDefaultAsync(p => p.PublisherId == id);
        }

        // Create a new publisher
        public async Task<Publisher> CreateAsync(string publisher)
        {
            var newPublisher = new Publisher
            {
                Publisher1 = publisher
            };

            _context.Publishers.Add(newPublisher);
            await _context.SaveChangesAsync();
            return newPublisher;
        }

        // Update an existing publisher
        public async Task<Publisher?> UpdateAsync(int id, string publisher)
        {
            var existingPublisher = await _context.Publishers.FirstOrDefaultAsync(p => p.PublisherId == id);
            if (existingPublisher == null)
            {
                return null; // Return null if not found
            }

            // Update the publisher's name
            existingPublisher.Publisher1 = publisher;

            await _context.SaveChangesAsync();
            return existingPublisher;
        }

        // Delete a publisher by ID
        public async Task<Publisher?> DeleteAsync(int id)
        {
            var publisher = await _context.Publishers.FirstOrDefaultAsync(p => p.PublisherId == id);
            if (publisher == null)
            {
                return null; // Return null if not found
            }

            _context.Publishers.Remove(publisher);
            await _context.SaveChangesAsync();
            return publisher;
        }
    }
}
