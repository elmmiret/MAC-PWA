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
                CreateQuotaConfigDTO: {
                    type: 'object',
                    required: ['nom', 'tipus', 'preuBase', 'categoriaId'],
                    properties: {
                        nom: { type: 'string' },
                        tipus: { type: 'string', enum: ['LLICENCIA', 'ACTIVITAT', 'COMPETICIO', 'SOCI'] },
                        preuBase: { type: 'number', format: 'float' },
                        categoriaId: { type: 'string' },
                    },
                },
                DeleteQuotaConfigsDTO: {
                    type: 'object',
                    required: ['ids'],
                    properties: {
                        ids: { type: 'array', items: { type: 'string' } },
                    },
                },
                UpdateQuotaConfigDTO: {
                    type: 'object',
                    properties: {
                        nom: { type: 'string' },
                        temporadesAplicada: {
                            type: 'array',
                            items: { type: 'string', pattern: '^\\d{4}-\\d{4}$' },
                        },
                    },
                },
                CreateCategoriaDTO: {
                    type: 'object',
                    required: ['tipus', 'anyNaixement', 'diesActivitat'],
                    properties: {
                        tipus: { type: 'string', enum: ['SUB_8', 'SUB_10', 'SUB_12', 'SUB_14', 'SUB_16', 'SUB_20', 'SUB_23', 'SENIOR', 'MASTER', 'G_A_S', 'INDIVIDUAL', 'NO_ATLETA'] },
                        anyNaixement: { type: 'array', items: { type: 'integer' } },
                        diesActivitat: { type: 'array', items: { type: 'string', enum: ['DILLUNS', 'DIMARTS', 'DIMECRES', 'DIJOUS', 'DIVENDRES'] } },
                        horaEntrada: { type: 'string', format: 'date-time', nullable: true },
                        horaSortida: { type: 'string', format: 'date-time', nullable: true },
                        detalls: { type: 'string', nullable: true },
                    },
                },
                UpdateCategoriaDTO: {
                    allOf: [{ $ref: '#/components/schemas/CreateCategoriaDTO' }],
                    required: [],
                },
                SetCategoriaDTO: {
                    type: 'object',
                    required: ['usuariIds'],
                    properties: {
                        usuariIds: { type: 'array', items: { type: 'string' }, minItems: 1 },
                    },
                },
                CategoriaResponseDTO: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        tipus: { type: 'string' },
                        anyNaixement: { type: 'array', items: { type: 'integer' } },
                        diesActivitat: { type: 'array', items: { type: 'string' } },
                        horaEntrada: { type: 'string', format: 'date-time', nullable: true },
                        horaSortida: { type: 'string', format: 'date-time', nullable: true },
                        detalls: { type: 'string', nullable: true },
                        usuaris: { type: 'array', items: { type: 'object' } },
                        rankings: { type: 'array', items: { type: 'object' } },
                        quotaConfigs: { type: 'array', items: { type: 'object' } },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'] // Ruta als fitxers on es troben les definicions de les rutes
};

export const swaggerSpec = swaggerJSDoc(options);
