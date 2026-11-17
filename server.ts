import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import {
  GEMINI_MODEL_ID,
  GeminiApiError,
  StudentProfileInputSchema,
  generateCareerRoadmapWithGemini,
} from './server/gemini.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      model: GEMINI_MODEL_ID,
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/generate-roadmap', async (req: Request, res: Response) => {
    const parsed = StudentProfileInputSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation failed. Please check all required profile fields.',
        code: 'VALIDATION_ERROR',
        details: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }

    try {
      const roadmap = await generateCareerRoadmapWithGemini(parsed.data);
      res.json(roadmap);
    } catch (err: unknown) {
      if (err instanceof GeminiApiError) {
        res.status(err.statusCode).json({
          error: err.message,
          code: err.code,
        });
        return;
      }

      const message = err instanceof Error ? err.message : 'Unexpected server error';
      res.status(500).json({
        error: message,
        code: 'INTERNAL_SERVER_ERROR',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const clientDistPath = path.resolve(__dirname, 'dist');
    app.use(express.static(clientDistPath));
    app.get('/{*path}', (_req: Request, res: Response) => {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
