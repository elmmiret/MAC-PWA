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
                UpdateUsuariDTO: {
                    type: 'object',
                    properties: {
                        emailPrincipal: { type: 'string' },
                        emailSecundari: { type: 'string', nullable: true },
                        telefonPrincipal: { type: 'string', nullable: true },
                        telefonSecundari: { type: 'string', nullable: true },
                        nom: { type: 'string', nullable: true },
                        cognom1: { type: 'string', nullable: true },
                        cognom2: { type: 'string', nullable: true },
                        sexe: { type: 'string', enum: ['M', 'F'], nullable: true },
                        dataNaixement: { type: 'string', format: 'date-time', nullable: true },
                        LocalitatNaixement: { type: 'string', nullable: true },
                        numeroLlicencia: { type: 'string', nullable: true },
                        adreca: { type: 'string', nullable: true },
                        codiPostal: { type: 'string', nullable: true },
                        poblacio: { type: 'string', nullable: true },
                        tipusDocument: { type: 'string', enum: ['DNI', 'NIF'], nullable: true },
                        numeroDocument: { type: 'string', nullable: true },
                        nomTutor: { type: 'string', nullable: true },
                        tipusDocumentTutor: { type: 'string', enum: ['DNI', 'NIF'], nullable: true },
                        numeroDocumentTutor: { type: 'string', nullable: true },
                        numAbPatronat: { type: 'integer', nullable: true },
                        dataInscripcio: { type: 'string', format: 'date-time', nullable: true },
                        dataBaixa: { type: 'string', format: 'date-time', nullable: true },
                        dataAltaProva: { type: 'string', format: 'date-time', nullable: true },
                        iban: { type: 'string', nullable: true },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'] // Ruta als fitxers on es troben les definicions de les rutes
};

export const swaggerSpec = swaggerJSDoc(options);
