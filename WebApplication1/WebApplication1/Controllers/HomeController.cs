using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly IHubContext<NotificationHub> _notification;

        private readonly ILogger<HomeController> _logger;
        public List<Notificacao> notificacoes = new List<Notificacao>();

        public HomeController(ILogger<HomeController> logger, IHubContext<NotificationHub> notification)
        {
            _logger = logger;
            _notification = notification;
        }
        [HttpPost]
        public async Task<IActionResult> Post(Notificacao notificacao)
        {
            notificacoes.Add(notificacao);
            await _notification.Clients.All.SendAsync("ReceiveMessage", notificacoes);
            return Ok(notificacoes);
        }
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(notificacoes);
        }
    }
}
public class Notificacao
{
    public int id { get; set; }
    public string nome { get; set; }
    public string motivo { get; set; }
    public string situacao { get; set; }
    public DateTime data { get; set; }
}