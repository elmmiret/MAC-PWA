import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Martorell Atlètic Club PWA API',
            version: '1.0.0',
            description: 'API REST per a la gestió del la PWA del Martorell Atlètic Club'
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local de desenvolupament'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Introdueix el token de Firebase.',
                },
            },
            schemas: {
                GoogleLoginDTO: {
                    type: 'object',
                    required: ['firebaseToken'],
                    properties: {
                        firebaseToken: {
                            type: 'string',
                            description: 'Firebase ID token obtingut després d\'iniciar sessió amb Google.',
                        },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'] // Ruta als fitxers on es troben les definicions de les rutes
};

export const swaggerSpec = swaggerJSDoc(options);
