using System.IdentityModel.Tokens.Jwt;
using System.Text.RegularExpressions;
using Microsoft.IdentityModel.Tokens;
using Neo4j.Driver;

namespace Controllers;
    [ApiController]
    [Route("[controller]")]
    public class LoginController:ControllerBase
    {
        private readonly IDriver _driver;
        private IConfiguration Config{ get; set; }
        public LoginController(IConfiguration config)
        {
            _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
            Config=config;
        }
        [HttpPost] 
        [Route("Login/{email}/{password}")]
        public async Task<IActionResult> Login(string email,string password)
        {

                    try{
                        Citalac? citaoc=null;
                        Admin? admin=null;          
                        using( var session = _driver.AsyncSession())
                        {
                            var result = await session.ExecuteReadAsync(async tx=>
                            {
                                var query = "Match (c:Citalac) WHERE c.Email=$email return c";
                                var parameters = new {email};
                                var cursor = await tx.RunAsync(query,parameters);
                                var records = await cursor.ToListAsync();
                                if (records.Count > 0)
                                {
                                    var record = records[0];
                                    var id = record["c"].As<INode>().Id; 
                                    var nodeProperties = record["c"].As<INode>().Properties; 
                                    var resultDictionary1 = new Dictionary<string, object>(nodeProperties)
                                    {
                                        { "id", id }
                                    };
                                    var neo4jDate = (Neo4j.Driver.LocalDate)nodeProperties["DatumRodjenja"];
                                    citaoc = new Citalac
                                    {
                                        ID = (int)id,
                                        Ime = (string)nodeProperties["Ime"],
                                        Prezime = (string)nodeProperties["Prezime"],
                                        KorisnickoIme = (string)nodeProperties["KorisnickoIme"],
                                        Email = (string)nodeProperties["Email"],
                                        Sifra = (string)nodeProperties["Sifra"],
                                        BrojTelefona = (string?)nodeProperties["BrojTelefona"],
                                        Slika = (string?)nodeProperties["Slika"],
                                    };
                                }
                                var query1 = "Match (a:Admin) WHERE a.Email=$email return a";
                                var parameters1 = new {email};
                                var cursor1 = await tx.RunAsync(query1,parameters1);
                                var records1 = await cursor1.ToListAsync(); 
                                if (records1.Count > 0)
                                {
                                    var record = records1[0];
                                    var id = record["a"].As<INode>().Id; 
                                    var nodeProperties = record["a"].As<INode>().Properties; 
                                    var resultDictionary1 = new Dictionary<string, object>(nodeProperties)
                                    {
                                        { "id", id }
                                    };
                                    var neo4jDate = (Neo4j.Driver.LocalDate)nodeProperties["DatumRodjenja"];
                                    admin = new Admin
                                    {
                                        ID = (int)id,
                                        Ime = (string)nodeProperties["Ime"],
                                        Prezime = (string)nodeProperties["Prezime"],
                                        KorisnickoIme = (string)nodeProperties["KorisnickoIme"],
                                        Email = (string)nodeProperties["Email"],
                                        Sifra = (string)nodeProperties["Sifra"],
                                        BrojTelefona = (string?)nodeProperties["BrojTelefona"],
                                        DatumRodjenja = new DateOnly(neo4jDate.Year, neo4jDate.Month, neo4jDate.Day),
                                        Slika = (string?)nodeProperties["Slika"],
                                    };
                                }
                                return (citaoc,admin);
                            });
                        
                            var (resultCitaoc,resultAdmin) = result;
                            
                            if(resultCitaoc!=null || resultAdmin!=null )
                            {
                                    if(resultCitaoc!=null)
                                    {
                                        var user=resultCitaoc;
                                        var res=resultCitaoc?.Sifra != null && BCrypt.Net.BCrypt.Verify(password,resultCitaoc.Sifra!);
                                        if(res)
                                        {
                                            var token=GenerateCitaoca(user!);
                                            CreateCookie(token);
                                            return Ok(new {
                                                id = user!.ID,
                                                korisnickoIme = user.KorisnickoIme,
                                                email = user.Email,
                                                role = "Citaoc"
                                            });
                                            
                                        }
                                        else 
                                        {
                                            return BadRequest("Pogresna sifra!");
                                        }
                                    }
                                    else if(resultAdmin!=null)
                                    {
                                        var user=resultAdmin;
                                        var res=resultAdmin?.Sifra != null && BCrypt.Net.BCrypt.Verify(password,resultAdmin.Sifra!);
                                        if(res)
                                        {
                                            var token=GenerateAdmin(user);
                                            CreateCookie(token);
                                            return Ok(new {
                                                id = user.ID,
                                                korisnickoIme = user.KorisnickoIme,
                                                email = user.Email,
                                                role = "Admin"
                                            });
                                        }
                                        else 
                                        {
                                            return BadRequest("Pogresna sifra!");
                                        }
                                    }
                                    else
                                    {
                                        return BadRequest("Pogresno korisnicko ime!");
                                    }
                            }
                            else
                            {
                                return BadRequest(result);

                            }
                        }
                    }
                    catch(Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
        }
        [HttpGet]
        [Route("Profile")]
        public IActionResult Profile()
        {
            var cookie="";
            if (Request.Cookies.TryGetValue("Token", out string? cookieValue))
            {
                cookie=cookieValue;
            }
            if(cookie!="")
            {
                var jwtHendler= new JwtSecurityTokenHandler();
                var jwtToken = jwtHendler.ReadJwtToken(cookie);
                
                var idClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "Id");
                var roleClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
                var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress");
                var userNameClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
                if (idClaim != null && roleClaim != null)
                {
                    var idValue = idClaim.Value;
                    var roleValue = roleClaim.Value;
                    var emailValue = emailClaim?.Value;
                    var userNameValue = userNameClaim?.Value;
                    var profileData = new { Id = idValue, Role = roleValue, Email = emailValue, korisnickoIme = userNameValue };
                    return Ok(profileData);
                }
                else
                {
                    return Ok(null);
                }   
            }

            return Ok(null);
        }

        [HttpPost] 
        [Route("LogOut")]
        public IActionResult Logout()
        {
            try
            {
                var token = HttpContext.Request.Headers["Authorization"]; 

                Response.Cookies.Delete("Token");
                return Ok("Uspesno ste izlogovani!");
                
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string GenerateCitaoca(Citalac c)
        {
            var securityKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config["Jwt:Key"]!));
            var creditendals=new SigningCredentials(securityKey,SecurityAlgorithms.HmacSha256);

            var claims=new List<Claim>
            {
                new (ClaimTypes.NameIdentifier,c.KorisnickoIme),
                new (ClaimTypes.Email,c.Email),
                new (ClaimTypes.Role,"Citaoc"),
                new("Id",c.ID.ToString())
            };

            var token=new JwtSecurityToken(Config["Jwt:Issuer"],Config["Jwt:Audience"],claims,expires:DateTime.Now.AddHours(1),signingCredentials:creditendals);

            var token2=new JwtSecurityTokenHandler().WriteToken(token);

            return token2;
        }

        private string GenerateAdmin(Admin a)
        {
            var securityKey=new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Config["Jwt:Key"]!));
            var creditendals=new SigningCredentials(securityKey,SecurityAlgorithms.HmacSha256);

            var claims=new[]
            {
                new("Id",a.ID.ToString()),
                new Claim(ClaimTypes.NameIdentifier,a.KorisnickoIme),
                new Claim(ClaimTypes.Email,a.Email),
                new Claim(ClaimTypes.Role,"Admin")
            };

            var token=new JwtSecurityToken(Config["Jwt:Issuer"],Config["Jwt:Audience"],claims,expires:DateTime.Now.AddHours(1),signingCredentials:creditendals);

            var token2=new JwtSecurityTokenHandler().WriteToken(token);


            return token2;
        }
         private bool Validate(string token)
        {
            JwtSecurityTokenHandler tokenHandler=new JwtSecurityTokenHandler();
            TokenValidationParameters parameters= new TokenValidationParameters()
            {
                ValidIssuer=Config["Jwt:Issuer"],
                ValidAudience=Config["Jwt:Audience"],
                IssuerSigningKey=new SymmetricSecurityKey
                    (Encoding.UTF8.GetBytes(Config["Jwt:RefreshKey"]!)),
                ValidateIssuer=true,
                ValidateAudience=true,
                ValidateLifetime=true,
                ValidateIssuerSigningKey=true,
                ClockSkew=TimeSpan.Zero
            };
            try
            {
                tokenHandler.ValidateToken(token,parameters,out SecurityToken validatedToken);
                return true;
            }
            catch(Exception)
            {
                return false;
            }
        }

        private  void CreateCookie(string val)
        {
            string key="Token";
            string value=val;
            CookieOptions co=new CookieOptions
            {
                Expires=DateTime.Now.AddHours(1)
            };
            HttpContext.Response.Cookies.Append(key,value,co);
        }

        private void ReadCookie()
        {
            string key="Token";
            var val=Request.Cookies[key];
        }

        private void RemoveCookie()
        {
                Response.Cookies.Delete("Token");
        }      
}