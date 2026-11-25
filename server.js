const express = require('express');
const cors = require('cors');

// Routers modulares da Inven!RA (Semana 1)
const userUrlRouter = require('./user-url');
const analyticsUrlRouter = require('./analytics-url');

// Padrão de Criação Factory Method (Semanas 2 e 3)
const { SandboxOrchestrator } = require('./src/sandboxFactory');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;
const sandboxOrchestrator = new SandboxOrchestrator();

// Página inicial de verificação de estado (Health Check para Render / Cloud)
app.get('/', (req, res) => {
  const host = req.get('host');
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const baseUrl = `${protocol}://${host}`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <title>Real-Time Code Monitor AP — Estado do Serviço</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 840px; margin: 30px auto; padding: 20px; background: #f8fafc; color: #0f172a; }
        .card { background: #ffffff; border: 1px solid #cbd5e1; border-top: 4px solid #0284c7; border-radius: 6px; padding: 20px; margin-bottom: 18px; }
        h1, h2 { margin-top: 0; }
        h1 { font-size: 1.4rem; }
        h2 { font-size: 1.1rem; color: #0369a1; }
        code { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 0.92rem; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
        th { background: #1e293b; color: #ffffff; }
        a { color: #0284c7; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Activity Provider: Real-Time Code Monitor</h1>
        <p>Servidor RESTful operacional para integração com a plataforma <strong>Inven!RA</strong> e implementação do padrão <strong>Factory Method</strong> (MEIW — Daniel Silva, N.º 58727).</p>
        <table>
          <thead>
            <tr>
              <th>Serviço Inven!RA (5 URLs Fixos)</th>
              <th>Método</th>
              <th>URL Público</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Configuração (<code>config_url</code>)</td>
              <td><code>GET</code></td>
              <td><a href="${baseUrl}/config_url" target="_blank">${baseUrl}/config_url</a></td>
            </tr>
            <tr>
              <td>Parâmetros (<code>json_params_url</code>)</td>
              <td><code>GET</code></td>
              <td><a href="${baseUrl}/json_params_url" target="_blank">${baseUrl}/json_params_url</a></td>
            </tr>
            <tr>
              <td>Deploy / Instanciação (<code>user_url</code>)</td>
              <td><code>POST</code></td>
              <td><a href="${baseUrl}/user_url" target="_blank">${baseUrl}/user_url</a> <small>(ou <a href="${baseUrl}/user-url" target="_blank">/user-url</a>)</small></td>
            </tr>
            <tr>
              <td>Analytics Disponíveis (<code>analytics_list_url</code>)</td>
              <td><code>GET</code></td>
              <td><a href="${baseUrl}/analytics_list_url" target="_blank">${baseUrl}/analytics_list_url</a></td>
            </tr>
            <tr>
              <td>Pedido de Analytics (<code>analytics_url</code>)</td>
              <td><code>POST</code></td>
              <td><a href="${baseUrl}/analytics_url" target="_blank">${baseUrl}/analytics_url</a> <small>(ou <a href="${baseUrl}/analytics-url" target="_blank">/analytics-url</a>)</small></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <h2>Demonstração do Padrão de Criação: Factory Method (<code>SandboxRunnerFactory</code>)</h2>
        <p>Testar a instanciação polimórfica de executores de código por linguagem:</p>
        <ul>
          <li><a href="${baseUrl}/sandbox/simular?linguagem=python" target="_blank">${baseUrl}/sandbox/simular?linguagem=python</a> (<code>PythonSandboxRunner</code>)</li>
          <li><a href="${baseUrl}/sandbox/simular?linguagem=javascript" target="_blank">${baseUrl}/sandbox/simular?linguagem=javascript</a> (<code>NodeSandboxRunner</code>)</li>
          <li><a href="${baseUrl}/sandbox/simular?linguagem=c" target="_blank">${baseUrl}/sandbox/simular?linguagem=c</a> (<code>CSandboxRunner</code>)</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

// 1. Configuração (config_url) - Interface HTML de Autoria para o Professor
app.get('/config_url', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <title>Configuração — Real-Time Code Monitor</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 18px; background: #f8fafc; color: #0f172a; }
        .box { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 18px; }
        h2 { margin-top: 0; color: #0369a1; font-size: 1.2rem; }
        label { display: block; margin-top: 12px; font-weight: bold; font-size: 0.92rem; }
        input, select { width: 100%; box-sizing: border-box; padding: 8px; margin-top: 4px; border: 1px solid #cbd5e1; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="box">
        <h2>Configuração do Desafio — Real-Time Code Monitor</h2>
        <form id="configForm">
          <label for="tempo_limite_minutos">Tempo Limite (minutos):</label>
          <input type="number" id="tempo_limite_minutos" name="tempo_limite_minutos" value="30" min="5" max="180" required />

          <label for="linguagem_programacao">Linguagem de Programação:</label>
          <select id="linguagem_programacao" name="linguagem_programacao">
            <option value="python">Python 3.11</option>
            <option value="javascript">JavaScript (Node.js 20)</option>
            <option value="c">C (GCC)</option>
          </select>

          <label for="ficheiro_esqueleto_url">URL do Código-Esqueleto:</label>
          <input type="url" id="ficheiro_esqueleto_url" name="ficheiro_esqueleto_url" value="https://ap-realtime.pt/exemplos/esqueleto.py" required />

          <label for="bateria_testes_unitarios_url">URL da Bateria de Testes Unitários:</label>
          <input type="url" id="bateria_testes_unitarios_url" name="bateria_testes_unitarios_url" value="https://ap-realtime.pt/exemplos/testes.py" required />
        </form>
      </div>
    </body>
    </html>
  `);
});

// 2. Parâmetros (json_params_url)
app.get('/json_params_url', (req, res) => {
  res.status(200).json([
    { name: 'tempo_limite_minutos', type: 'integer' },
    { name: 'linguagem_programacao', type: 'text/plain' },
    { name: 'ficheiro_esqueleto_url', type: 'URL' },
    { name: 'bateria_testes_unitarios_url', type: 'URL' }
  ]);
});

// 3. Deploy / Instanciação (user_url)
app.use(['/user-url', '/user_url'], userUrlRouter);

// 4. Analytics Disponíveis (analytics_list_url)
app.get('/analytics_list_url', (req, res) => {
  res.status(200).json({
    qualAnalytics: [
      { name: 'Historico de Erros de Sintaxe e Compilacao', type: 'text/plain' },
      { name: 'Consola de Execucao e Relatorio de Testes', type: 'URL' }
    ],
    quantAnalytics: [
      { name: 'Acesso ao IDE Web', type: 'boolean' },
      { name: 'Download do Codigo-Base', type: 'boolean' },
      { name: 'Tempo em Inatividade - Idle (segundos)', type: 'integer' },
      { name: 'Percentagem de Codigo Colado - Paste (%)', type: 'integer' },
      { name: 'Numero de Submissoes de Codigo', type: 'integer' },
      { name: 'Taxa de Sucesso nos Testes Unitarios (%)', type: 'integer' }
    ]
  });
});

// 5. Pedido de Analytics (analytics_url)
app.use(['/analytics-url', '/analytics_url'], analyticsUrlRouter);

// Endpoint interno de validação do Padrão Factory Method (SandboxOrchestrator)
app.all('/sandbox/simular', async (req, res) => {
  try {
    const linguagem = req.body.linguagem || req.query.linguagem || 'python';
    const codigoFonte = req.body.codigoFonte || 'def soma(a, b): return a + b';
    const testesUrl = req.body.testesUrl || 'https://ap-realtime.pt/exemplos/testes.py';

    const resultado = await sandboxOrchestrator.executarCodigo(linguagem, codigoFonte, testesUrl);
    return res.status(200).json({
      padraoCriacao: 'Factory Method (SandboxRunnerFactory)',
      linguagemSolicitada: linguagem,
      resultado
    });
  } catch (err) {
    return res.status(400).json({ erro: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Real-Time Code Monitor AP (REST Gateway + Factory Method) a correr na porta ${PORT}`);
});
