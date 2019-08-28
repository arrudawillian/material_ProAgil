using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        [Required (ErrorMessage="O campo {0} é obrigatório.")]
        [StringLength(100, MinimumLength=3)]
        public string Local { get; set; }
        public string DataEvento { get; set; }
        public string Tema { get; set; }
        [Range(2,1000, ErrorMessage="Preencha de 2 a 1000")]
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }
        public string Telefone { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}