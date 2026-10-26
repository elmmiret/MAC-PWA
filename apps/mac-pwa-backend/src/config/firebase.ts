var admin = require('firebase-admin');
var serviceAccount = require('../../firebase-service-account.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export const firebaseAdmin = admin;

