using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;
using Neo4j.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;


namespace Controllers;
    [ApiController]
    [Route("[controller]")]
    public class KnjigaController:ControllerBase
    {
        private readonly IDriver _driver;
        public KnjigaController()
        {
            _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
        }
        [Route("AddKnjigu")]
        [HttpPost]
        public async Task<IActionResult> AddKnjigu([FromBody] Knjiga Knjiga)
        {
            try{
                if(Knjiga.BrojStrana<=0)
                    ModelState.AddModelError("BrojStrana","Broj strana mora da bude veci od 0");
                if(Knjiga.Naslov.Length<=0)
                    ModelState.AddModelError("Naslov","Knjiga mora da ima naslov");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx =>
                    {
                        var query = "CREATE (k:Knjiga {naslov: $naslov, brojStrana: $brojSTrana, slika: $slika, brojnoStanje: $brojnoStanje}) RETURN k";
                        var parameters = new { naslov = Knjiga.Naslov,  brojSTrana= Knjiga.BrojStrana, slika = Knjiga.Slika,brojnoStanje=Knjiga.BrojnoStanje };

                        var cursor =  await tx.RunAsync(query, parameters);
                        var resultatList = await cursor.ToListAsync();
                        if(resultatList.Count>0)
                        {
                            var record = resultatList[0];
                            var createdNodeId = record["k"].As<INode>().Id;
                            if (Knjiga.Zanr != null)
                            {
                                var relationQuery = "MATCH (k:Knjiga), (z:Zanr) WHERE ID(k) = $knjigaId AND z.Naziv = $naziv MERGE (k)-[:PRIPADA_ZANRU]->(z)";
                                var relationParameters = new { knjigaId = createdNodeId, naziv = Knjiga.Zanr.Naziv };
                                await tx.RunAsync(relationQuery, relationParameters);
                            }
                            if(Knjiga.Izdavac!= null)
                            {
                                var relationQuery = "MATCH (k:Knjiga), (i:Izdavac) WHERE ID(k) = $knjigaId AND i.Naziv = $naziv MERGE (k)-[:IZDATA_OD_STRANE]->(i)";
                                var relationParameters = new { knjigaId = createdNodeId, naziv = Knjiga.Izdavac.Naziv };
                                await tx.RunAsync(relationQuery, relationParameters);
                            }
                            if(Knjiga.Pisac!= null)
                            {
                                var relationQuery = "MATCH (k:Knjiga), (p:Pisac) WHERE ID(k) = $knjigaId AND p.Prezime = $prezime AND p.Ime=$ime MERGE (k)-[:NAPISANA_OD_STRANE]->(p)";
                                var relationParameters = new { knjigaId = createdNodeId, prezime = Knjiga.Pisac.Prezime,ime=Knjiga.Pisac.Ime };
                                await tx.RunAsync(relationQuery, relationParameters);
                            }
                        }
                        
                        return cursor;
                    });
                    if (result != null)
                    {
                        return Ok("Knjiga uspešno dodata u bazu.");
                    }
                    else
                    {
                        return BadRequest("Neuspešno dodavanje knjige u bazu.");
                    }
                }
            }
            catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
        [Route("UpdateKnjiga/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateKnjigu(int id,[FromBody]Knjiga Knjiga)
        {
            try{
                if(Knjiga.BrojStrana<=0)
                    ModelState.AddModelError("BrojStrana","Broj strana mora da bude veci od 0");
                if(Knjiga.Naslov.Length<=0)
                    ModelState.AddModelError("Naslov","Knjiga mora da ima naslov");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                    using(var session = _driver.AsyncSession())
                    {
                        var result = await session.ExecuteWriteAsync(async tx=>{
                            var query="Match (k:Knjiga) WHERE id(k)=$id SET c=$knjiga RETURN c";
                            var parameters=new{id, knjiga=Knjiga};
                            var cursor = await tx.RunAsync(query,parameters);
                            var record = cursor.ToListAsync();
                            return record;
                        });
                         if (result != null)
                        {
                            return Ok(result);
                        }
                        else
                        {
                            return BadRequest("Neuspešno brisanje citaoca.");
                        }
                        }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("UpdateKnjigaStanje/{id}/{kolicina}")]
        [HttpPut]
        public async Task<IActionResult> UpdateKnjigaStanje(int id,int kolicina)
        {
            try{
                    using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query="Match (k:Knjiga) WHERE id(k)=$id SET k.brojnoStanje=$kolicina RETURN k";
                        var parameters=new{id, kolicina};
                        var cursor = await tx.RunAsync(query,parameters);
                        var record = await cursor.ToListAsync();
                        return record;
                    });
                        if (result != null)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return BadRequest("Neuspešno brisanje citaoca.");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("UpdateKnjigaIznajmljivanje/{id}/{flag}")]
        [HttpPut]
        public async Task<IActionResult> UpdateKnjigaIznajmljivanje(int id,bool flag)
        {
            try{
                    using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query="";
                        if(flag==true)
                            query="Match (k:Knjiga) WHERE id(k)=$id SET k.brojnoStanje=k.brojnoStanje-1 RETURN k";
                        else
                            query="Match (k:Knjiga) WHERE id(k)=$id SET k.brojnoStanje=k.brojnoStanje+1 RETURN k";
                        var parameters=new{id};
                        var cursor = await tx.RunAsync(query,parameters);
                        var record = await cursor.ToListAsync();
                        return record;
                    });
                        if (result != null)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return BadRequest("Neuspešno menjanje knjige.");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("GetKnjigu/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetKnjigu(int id)
        {
            try{
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx => {
                        var query="MATCH (k:Knjiga)-[:NAPISANA_OD_STRANE]->(p:Pisac), (k)-[:PRIPADA_ZANRU]->(z:Zanr), (k)-[:IZDATA_OD_STRANE]->(i:Izdavac) WHERE id(k)=$id RETURN k, p, z, i";
                        var parameters=new{id};
                        var cursor = await tx.RunAsync(query,parameters);
                        var records = await cursor.ToListAsync();
                        if (records.Count > 0)
                        {   
                            var record = records[0];
                            var bookNode = record["k"].As<INode>();
                            var authorNode = record["p"].As<INode>();
                            var genreNode = record["z"].As<INode>();
                            var publisherNode = record["i"].As<INode>();

                            var bookProperties = bookNode.Properties;
                            var authorProperties = authorNode.Properties;
                            var genreProperties = genreNode.Properties;
                            var publisherProperties = publisherNode.Properties;
                            
                            var bookDictionary = new Dictionary<string, object>(bookProperties)
                            {
                                { "id", bookNode.Id },
                                { "pisac", authorProperties },
                                { "zanr", genreProperties },
                                { "izdavac", publisherProperties }
                            };

                            return bookDictionary;
                        }
                        else
                        {
                            return null; 
                        }
                    });
                    if(result != null)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return BadRequest("Greska pri pribavljanju Knjige");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("GetOnlyKnjigu/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetOnlyKnjigu(int id)
        {
            try{
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx => {
                        var query="MATCH (k:Knjiga) WHERE id(k)=$id RETURN k";
                        var parameters=new{id};
                        var cursor = await tx.RunAsync(query,parameters);
                        var records = await cursor.ToListAsync();
                        if (records.Count > 0)
                        {   
                            var record = records[0];
                            var bookNode = record["k"].As<INode>();
                            var bookProperties = bookNode.Properties;
                            var bookDictionary = new Dictionary<string, object>(bookProperties)
                            {
                                { "id", bookNode.Id },
                            };

                            return bookDictionary;
                        }
                        else
                        {
                            return null; 
                        }
                    });
                    if(result != null)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return BadRequest("Greska pri pribavljanju Knjige");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("DeleteKnjigu/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteKnjigu(int id)
        {
            try{
                using(var session =  _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "MATCH (k:Knjiga)-[r]-() WHERE id(k)=$id DELETE k, r";
                        var parameters=new{id};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result != null)
                    {
                        return Ok("Uspesno obrisana Knjiga");
                    }
                    else
                    {
                        return BadRequest("Doslo je do greske prilikom brisanja knjige");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("GetKnjige")]
        [HttpGet]
        public async Task<IActionResult> GetKnjige()
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = "MATCH (k:Knjiga)-[:NAPISANA_OD_STRANE]->(p:Pisac), (k)-[:PRIPADA_ZANRU]->(z:Zanr), (k)-[:IZDATA_OD_STRANE]->(i:Izdavac) RETURN k, p, z, i";                    var cursor = await tx.RunAsync(query);
                        var records = await cursor.ToListAsync();
                        var booksList = new List<Dictionary<string, object>>();

                        foreach (var record in records)
                        {
                            var bookNode = record["k"].As<INode>();
                            var authorNode = record["p"].As<INode>();
                            var genreNode = record["z"].As<INode>();
                            var publisherNode = record["i"].As<INode>();

                            var bookProperties = ConvertToDictionary(bookNode.Properties);
                            var authorProperties = ConvertToDictionary(authorNode.Properties);
                            var genreProperties = ConvertToDictionary(genreNode.Properties);
                            var publisherProperties = ConvertToDictionary(publisherNode.Properties);
                            Console.WriteLine(authorProperties["DatumRodjenja"]);
                            ConvertDateOnlyToString(authorProperties, "DatumRodjenja");
                            ConvertDateOnlyToString(authorProperties, "DatumSmrti");

                            var bookDictionary = new Dictionary<string, object>(bookProperties)
                            {
                                { "id", bookNode.Id },
                                { "pisac", authorProperties },
                                { "zanr", genreProperties },
                                { "izdavac", publisherProperties }
                            };

                            booksList.Add(bookDictionary);
                        }
                        return booksList;
                    });
                    var jsonSettings = new JsonSerializerSettings
                    {
                        DateFormatString = "yyyy-MM-dd",
                        Converters = { new IsoDateTimeConverter { DateTimeFormat = "yyyy-MM-dd" } }
                    };

                    if (result != null)
                    {
                        var jsonResult = JsonConvert.SerializeObject(result, jsonSettings);
                        return Ok(jsonResult);
                    }

                    else
                    {
                        return BadRequest("Error retrieving books");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private Dictionary<string, object> ConvertToDictionary(IReadOnlyDictionary<string, object> readOnlyDictionary)
        {
            return readOnlyDictionary.ToDictionary(entry => entry.Key, entry => entry.Value);
        }
        private void ConvertDateOnlyToString(Dictionary<string, object> properties, string propertyName)
        {            if (properties.ContainsKey(propertyName))
            {
                if (properties[propertyName] is DateOnly dateOnly)
                {
                    Console.WriteLine("kurac1");
                    properties[propertyName] = dateOnly.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
                }
                else if (properties[propertyName] is DateTime dateTime) // Dodato za DateTime proveru
                {
                    Console.WriteLine(properties[propertyName]);
                    properties[propertyName] = dateTime.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
                }
            }
        } 

    }
