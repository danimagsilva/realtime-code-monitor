# Real-Time Code Monitor — Activity Provider (Inven!RA)

**Autor:** Daniel Silva (N.º 58727)  
**Curso:** Mestrado em Engenharia Informática e Tecnologias Web (MEIW — UAb / UTAD)

## Estrutura do Projeto

```text
realtime-code-monitor-ap/
├── .gitignore
├── package.json
├── README.md
├── server.js                  # Servidor RESTful com os 5 URLs fixos da Inven!RA (Semana 1)
├── src/
│   └── sandboxFactory.js      # Implementação do Padrão Factory Method (Semanas 2 e 3)
├── test/
│   └── test_factory.js        # Testes unitários do padrão Factory Method
└── docs/
    └── uml/
        ├── factory_method_componentes.puml
        └── factory_method_sequencia.puml
```

## Como executar localmente no Windows

1. Abrir o **PowerShell** (ou terminal do VS Code) dentro da pasta `realtime-code-monitor-ap`.
2. Instalar as dependências:
   ```powershell
   npm install
   ```
3. Iniciar o servidor RESTful:
   ```powershell
   npm start
   ```
4. Testar o padrão de criação *Factory Method*:
   ```powershell
   npm run test:factory
   ```

## Como publicar no GitHub via GitHub Desktop e alojar na Cloud (Render)

1. Abrir o **GitHub Desktop** -> **File** -> **Add local repository...** -> selecionar a pasta `realtime-code-monitor-ap`.
2. Clicar em **create a repository** -> **Commit to main** -> **Publish repository**.
3. No [Render](https://render.com/), criar um **New Web Service** ligado a este repositório (`Build Command: npm install`, `Start Command: npm start`).
4. Utilizar o domínio HTTPS gerado pelo Render para registar os 5 endpoints fixos na **Inven!RA**:
   - `GET /config_url`
   - `GET /json_params_url`
   - `POST /user_url`
   - `GET /analytics_list_url`
   - `POST /analytics_url`
