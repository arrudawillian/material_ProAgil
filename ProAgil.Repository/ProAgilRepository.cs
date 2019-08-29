using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        private readonly ProAgilContext _context;

        public ProAgilRepository(ProAgilContext context)
        {
            this._context = context;
            this._context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        //GERAIS
        public void Add<T>(T entity) where T : class
        {
            this._context.Add(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            this._context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            this._context.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await this._context.SaveChangesAsync()) > 0;
        }

        //EVENTO
        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes = false)
        {
            IQueryable<Evento> query = this._context.Eventos
                .Include(_ => _.Lotes)
                .Include(_ => _.RedesSociais);

            if (includePalestrantes)
            {
                query = query
                    .Include(_ => _.PalestrantesEventos)
                    .ThenInclude(_ => _.Palestrante);
            };

            query = query.OrderBy(_ => _.Id);

            return await query.ToArrayAsync();
        }

        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = this._context.Eventos
                .Include(_ => _.Lotes)
                .Include(_ => _.RedesSociais);

            if (includePalestrantes)
            {
                query = query
                    .Include(_ => _.PalestrantesEventos)
                    .ThenInclude(_ => _.Palestrante);
            };

            query = query
                .OrderByDescending(_ => _.DataEvento)
                .Where(_ => _.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }

        public async Task<Evento> GetEventoAsyncById(int eventoId, bool includePalestrantes = false)
        {
            IQueryable<Evento> query = this._context.Eventos
                .Include(_ => _.Lotes)
                .Include(_ => _.RedesSociais);

            if (includePalestrantes)
            {
                query = query
                    .Include(_ => _.PalestrantesEventos)
                    .ThenInclude(_ => _.Palestrante);
            };

            query = query.OrderByDescending(_ => _.DataEvento)
                         .Where(_ => _.Id == eventoId);

            return await query.FirstOrDefaultAsync();
        }
        
        //PALESTRANTE
        public async Task<Palestrante> GetPalestranteAsyncById(int palestranteId, bool includeEventos = false)

        {
            IQueryable<Palestrante> query = this._context.Palestrantes
                .Include(_ => _.RedesSociais);

            if (includeEventos)
            {
                query = query
                    .Include(_ => _.PalestrantesEventos)
                    .ThenInclude(_ => _.Evento);
            };

            query = query
                .Where(_ => _.Id == palestranteId);

            return await query.FirstOrDefaultAsync();
        }
        
        public async Task<Palestrante[]> GetAllPalestranteAsyncByName(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = this._context.Palestrantes
                .Include(_ => _.RedesSociais);

            if (includeEventos)
            {
                query = query
                    .Include(_ => _.PalestrantesEventos)
                    .ThenInclude(_ => _.Evento);
            };

            query = query
                .OrderBy(_ => _.Nome)
                .Where(_ => _.Nome.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync();
        }
        
    }
}