using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaNetwork.Application.Dtos.Client;
using CinemaNetwork.Infrastructure.Models;

namespace CinemaNetwork.Application.Mappers
{
    public static class ClientMapper
    {
        public static Client toClientFromDto(this ClientDto clientDto) {
            return new Client {
                Name = clientDto.Name,
                Surname = clientDto.Surname,
                Email = clientDto.Email,
                CellNumber = clientDto.CellNumber,
            };
        }
        public static ClientDto toDtoFromClient(this Client client) {
            return new ClientDto {
                Name = client.Name,
                Surname = client.Surname,
                Email = client.Email,
                CellNumber = client.CellNumber,
            };
        }
    }
}