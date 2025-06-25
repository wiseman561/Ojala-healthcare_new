using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Ojala.ApiGateway.Controllers;

[ApiController]
[Route("swagger")]
public class SwaggerController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public SwaggerController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpGet("")]
    public IActionResult GetSwaggerUI()
    {
        var html = $@"
<!DOCTYPE html>
<html>
<head>
    <title>Ojala API Gateway - Swagger UI</title>
    <link rel=""stylesheet"" type=""text/css"" href=""https://unpkg.com/swagger-ui-dist@3.25.0/swagger-ui.css"" />
    <style>
        .swagger-ui .topbar {{ display: none; }}
        .service-selector {{ margin: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }}
        .service-btn {{ margin: 5px; padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; }}
        .service-btn:hover {{ background: #0056b3; }}
    </style>
</head>
<body>
    <div class=""service-selector"">
        <h3>Select Service API Documentation:</h3>
        <button class=""service-btn"" onclick=""loadSwagger('api')"">Main API (Port 5000)</button>
        <button class=""service-btn"" onclick=""loadSwagger('identity')"">Identity API (Port 5001)</button>
        <button class=""service-btn"" onclick=""loadSwagger('healthscore')"">Health Score API (Port 8083)</button>
    </div>
    <div id=""swagger-ui""></div>

    <script src=""https://unpkg.com/swagger-ui-dist@3.25.0/swagger-ui-bundle.js""></script>
    <script>
        function loadSwagger(service) {{
            let url;
            switch(service) {{
                case 'api':
                    url = 'http://localhost:5000/swagger/v1/swagger.json';
                    break;
                case 'identity':
                    url = 'http://localhost:5001/swagger/v1/swagger.json';
                    break;
                case 'healthscore':
                    url = 'http://localhost:8083/swagger/v1/swagger.json';
                    break;
                default:
                    return;
            }}

            SwaggerUIBundle({{
                url: url,
                dom_id: '#swagger-ui',
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.presets.standalone
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: ""StandaloneLayout""
            }});
        }}

        // Load API docs by default
        loadSwagger('api');
    </script>
</body>
</html>";

        return Content(html, "text/html");
    }

    [HttpGet("services")]
    public IActionResult GetAvailableServices()
    {
        var services = new
        {
            services = new[]
            {
                new { name = "Main API", url = "http://localhost:5000/swagger/v1/swagger.json", port = 5000 },
                new { name = "Identity API", url = "http://localhost:5001/swagger/v1/swagger.json", port = 5001 },
                new { name = "Health Score API", url = "http://localhost:8083/swagger/v1/swagger.json", port = 8083 }
            }
        };

        return Ok(services);
    }
}
