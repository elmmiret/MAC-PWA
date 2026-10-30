import { firebaseAdmin } from '../src/config/firebase';

const uid = process.argv[2];

const main = async () => {
  if (!uid) {
    throw new Error('Usage: npm run set-admin-claim -- <firebaseUid>');
  }

  await firebaseAdmin.auth().setCustomUserClaims(uid, { admin: true });
  console.log(`Custom claim admin assignat a ${uid}.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
