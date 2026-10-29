import { createRequire } from 'module';
const require = createRequire(__filename);

const appModule = require('firebase-admin/app');
const authModule = require('firebase-admin/auth');

// Carregar les credencials
const serviceAccountModule = require('../../firebase-service-account.json');
const serviceAccount = serviceAccountModule.default || serviceAccountModule;

const firebaseApp = appModule.getApps().length
    ? appModule.getApp()
    : appModule.initializeApp({
        credential: appModule.cert(serviceAccount)
    });

// Mantiene una interfaz comun para los servicios y middlewares de la aplicacion.
export const firebaseAdmin = {
    auth: () => authModule.getAuth(firebaseApp)
};
