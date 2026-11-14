import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/auth.routes.js';
import usuariRoutes from './routes/usuari.routes.js'
import categoriaRoutes from './routes/categoria.routes.js';
import quotaConfigRoutes from './routes/quotaConfig.routes.js';
import pagamentRoutes from './routes/pagament.routes.js';
import provaRoutes from './routes/prova.routes.js';
import rankingRoutes from './routes/ranking.routes.js';
import atletaRankingRoutes from './routes/atletaRanking.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de la interfície de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Definició de les rutes de l'API
app.use('/api/categories', categoriaRoutes);
app.use('/api/quotaConfigs', quotaConfigRoutes);
app.use('/api/pagaments', pagamentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuaris', usuariRoutes);
app.use('/api/provas', provaRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/atletaRankings', atletaRankingRoutes);


app.listen(3000, () => {
    console.log('Servidor funcionant a http://localhost:3000');
    console.log('Documentació Swagger a http://localhost:3000/api-docs');
});
