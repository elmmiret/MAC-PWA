import { Prisma } from '@prisma/client';
import 'dotenv/config';
import { firebaseAdmin } from '../config/firebase.js';
import { UsuariRepository, type UsuariWithPayments } from '../repositories/usuari.repository.js';
import type { IAuthService } from '../interfaces/auth.interface.js';
import type {
    GoogleLoginDTO,
    OperacioUsuariResponseDTO,
    RegisterUsuariDTO,
    SetAdminDTO,
    UsuariResponseDTO,
} from 'shared';

export class AuthService implements IAuthService {
    private repository: UsuariRepository;

    constructor() {
        this.repository = new UsuariRepository();
    }

    private mapToUsuariResponseDTO(usuari: UsuariWithPayments): UsuariResponseDTO {
        return {
            id: usuari.id,
            firebaseUid: usuari.firebaseUid,
            entrenador: usuari.entrenador,
            usuariFamiliarId: usuari.usuariFamiliarId,
            emailPrincipal: usuari.emailPrincipal,
            imatgePerfil: usuari.imatgePerfil,
            emailSecundari: usuari.emailSecundari,
            telefonPrincipal: usuari.telefonPrincipal,
            telefonSecundari: usuari.telefonSecundari,
            nom: usuari.nom,
            cognom1: usuari.cognom1,
            cognom2: usuari.cognom2,
            sexe: usuari.sexe,
            dataNaixement: usuari.dataNaixement?.toISOString() ?? null,
            LocalitatNaixement: usuari.LocalitatNaixement,
            numeroLlicencia: usuari.numeroLlicencia,
            adreca: usuari.adreca,
            codiPostal: usuari.codiPostal,
            poblacio: usuari.poblacio,
            tipusDocument: usuari.tipusDocument,
            numeroDocument: usuari.numeroDocument,
            nomTutor: usuari.nomTutor,
            tipusDocumentTutor: usuari.tipusDocumentTutor,
            numeroDocumentTutor: usuari.numeroDocumentTutor,
            numAbPatronat: usuari.numAbPatronat,
            dataInscripcio: usuari.dataInscripcio?.toISOString() ?? null,
            dataBaixa: usuari.dataBaixa?.toISOString() ?? null,
            dataAltaProva: usuari.dataAltaProva?.toISOString() ?? null,
            iban: usuari.iban,
            categoriaId: usuari.categoriaId,
            pagamentIds: usuari.pagaments.map((pagament) => pagament.id),
            createdAt: usuari.createdAt.toISOString(),
            updatedAt: usuari.updatedAt.toISOString(),
        };
    }

    private mapToOperacioUsuariResponseDTO(message: string, usuariId?: string): OperacioUsuariResponseDTO {
        return {
            message,
            ...(usuariId === undefined ? {} : { usuariId }),
        };
    }

    private mapRegisterDTOToPrisma(dto: RegisterUsuariDTO): Prisma.UsuariCreateInput {
        return {
            firebaseUid: null,
            emailPrincipal: dto.emailPrincipal,
            nom: dto.nom ?? null,
            cognom1: dto.cognom1 ?? null,
            cognom2: dto.cognom2 ?? null,
        };
    }

    async registrarUsuari(dto: RegisterUsuariDTO): Promise<UsuariResponseDTO> {
        const existingUser = await this.repository.findByEmail(dto.emailPrincipal);
        if (existingUser) {
            throw new Error('Ja existeix un usuari amb aquest correu electrònic.');
        }

        const usuariDB = await this.repository.create(this.mapRegisterDTOToPrisma(dto));
        return this.mapToUsuariResponseDTO(usuariDB);
    }

    async iniciarSessioGoogle(dto: GoogleLoginDTO): Promise<UsuariResponseDTO> {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(dto.firebaseToken);
        const provider = decodedToken.firebase?.sign_in_provider;

        if (provider !== 'google.com') {
            throw new Error('El token no correspon a un inici de sessió amb Google.');
        }

        if (!decodedToken.email) {
            throw new Error('El token de Google no conté un correu electrònic vàlid.');
        }

        const existingByFirebaseUid = await this.repository.findByFirebaseUid(decodedToken.uid);
        if (existingByFirebaseUid) {
            return this.mapToUsuariResponseDTO(existingByFirebaseUid);
        }

        const preRegisteredUser = await this.repository.findByEmail(decodedToken.email);
        if (!preRegisteredUser) {
            throw new Error('Aquest correu no ha estat pre-registrat per un administrador.');
        }

        const usuariDB = await this.repository.updateFirebaseUid(
            preRegisteredUser.id,
            decodedToken.uid,
        );

        return this.mapToUsuariResponseDTO(usuariDB);
    }

    async tancarSessio(firebaseUid: string): Promise<OperacioUsuariResponseDTO> {
        await firebaseAdmin.auth().revokeRefreshTokens(firebaseUid);
        return this.mapToOperacioUsuariResponseDTO('Sessió tancada correctament.');
    }

    async setAdmin(dto: SetAdminDTO): Promise<void> {
        if (!dto.firebaseUid) {
            throw new Error('El firebaseUid és obligatori.');
        }

        await firebaseAdmin.auth().setCustomUserClaims(dto.firebaseUid, { admin: true });
    }
}
