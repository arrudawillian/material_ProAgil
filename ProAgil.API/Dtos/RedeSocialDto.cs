using System.ComponentModel.DataAnnotations;

namespace ProAgil.API.Dtos
{
    public class RedeSocialDto
    {
        public int id { get; set; }
        [Required (ErrorMessage="O campo nome é obrigatório")]
        public string Nome { get; set; }
        [Required]
        public string URL { get; set; }
    }
}