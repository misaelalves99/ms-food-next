import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jsonServer from 'json-server';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const app: Express = express();

const PORT: number = Number(process.env.PORT) || 4000;
const API_PREFIX: string = process.env.API_PREFIX || '/api';
const API_URL: string = `http://localhost:${PORT}${API_PREFIX}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.resolve(__dirname, 'db.json');
const routesFile = path.resolve(__dirname, 'routes.json');

// Cria routes.json se não existir
if (!fs.existsSync(routesFile)) {
  const routesConfig = {
    "/api/*": "/$1"
  };
  fs.writeFileSync(routesFile, JSON.stringify(routesConfig, null, 2));
  console.log('✅ routes.json criado com sucesso!');
}

console.log('📂 Carregando banco de dados de:', dbFile);

const router = jsonServer.router(dbFile);
const middlewares = jsonServer.defaults();

app.use(cors({
  origin: 'http://localhost:3000', // Porta do frontend
  credentials: true, // Se estiver usando cookies ou auth
}));
app.use(express.json());
app.use(middlewares);
app.use(API_PREFIX, router);

app.get('/', (req: Request, res: Response) => {
  res.send(`✅ Backend rodando em: ${API_URL}`);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em: ${API_URL}`);
});
