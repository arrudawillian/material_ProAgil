using System.Linq;
using AutoMapper;
using ProAgil.API.Dtos;
using ProAgil.Domain;

namespace ProAgil.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDto>()
            .ForMember(dest => dest.Palestrantes, opt =>
            {
                opt.MapFrom(src => src.PalestrantesEventos.Select(_ => _.Palestrante).ToList());
            }).ReverseMap();

            CreateMap<Palestrante, PalestranteDto>()
            .ForMember(dest => dest.Eventos, opt =>
            {
                opt.MapFrom(src => src.PalestrantesEventos.Select(_ => _.Evento).ToList());
            }).ReverseMap();
            
            CreateMap<Lote, LoteDto>().ReverseMap();
            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
        }
    }
}