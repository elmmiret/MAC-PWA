import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.ts';
import categoriaRoutes from './routes/categoria.routes.ts'

const app = express();
app.use(express.json());

// Ruta de la interfície de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Definició de les rutes de l'API
app.use('/api', categoriaRoutes);

app.listen(3000, () => {
    console.log('Servidor funcionant a http://localhost:3000');
    console.log('Documentació Swagger a http://localhost:3000/api-docs');
});