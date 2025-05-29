// backend/src/serve.ts

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jsonServer from 'json-server';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config(); // Load .env variables first

const app: Express = express();

// Use Render's provided port or fallback to 4000 for local development
const PORT: number = Number(process.env.PORT) || 4000;
const API_PREFIX: string = process.env.API_PREFIX || '/api';

// Determine the base URL for the backend
let backendBaseUrl: string;
if (process.env.RENDER_EXTERNAL_HOSTNAME) {
    // For Render deployment, use the external hostname provided by Render
    backendBaseUrl = `https://${process.env.RENDER_EXTERNAL_HOSTNAME}`;
} else {
    // For local development
    backendBaseUrl = `http://localhost:${PORT}`;
}

const API_URL: string = `${backendBaseUrl}${API_PREFIX}`;

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

// Dynamically set CORS origin based on environment
let frontendOrigin: string | undefined;
if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_FRONTEND_URL) {
    // In production on Render, use the frontend's public URL
    frontendOrigin = process.env.NEXT_PUBLIC_FRONTEND_URL;
} else {
    // For local development
    frontendOrigin = 'http://localhost:3000'; // Frontend's local development port
}

app.use(cors({
    origin: frontendOrigin,
    credentials: true,
}));
app.use(express.json());
app.use(middlewares);
app.use(API_PREFIX, router);

app.get('/', (req: Request, res: Response) => {
    res.send(`✅ Backend rodando em: ${API_URL}`);
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: ${API_URL}`);
    if (frontendOrigin) {
        console.log(`CORS origin set to: ${frontendOrigin}`);
    }
});
