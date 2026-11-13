import { Prisma, TDocument, TSexe } from '@prisma/client';
import 'dotenv/config';
import { UsuariRepository, type UsuariWithPayments } from '../repositories/usuari.repository.js';
import { firebaseAdmin } from '../config/firebase.js';
import type {
    GoogleLoginDTO,
    MeUsuariResponseDTO,
    OperacioUsuariResponseDTO,
    RegisterUsuariDTO,
    SetFamiliarDTO,
    UpdatePerfilDTO,
    UsuariResponseDTO,
} from 'shared';
import type { IUsuariService } from '../interfaces/usuari.interface.js';

export class UsuariService implements IUsuariService {
    private repository: UsuariRepository;

    constructor() {
        this.repository = new UsuariRepository();
    }

    // Exposa només els camps permesos per l'API i evita retornar directament
    // el model Prisma, que pot contenir informació sensible o interna de la base de dades.
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

    private mapToMeUsuariResponseDTO(usuari: UsuariWithPayments): MeUsuariResponseDTO {
        return {
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
        };
    }

    // Normalitza les respostes de les operacions que no retornen un usuari complet,
    // com tancar sessió o eliminar un usuari.
    private mapToOperacioUsuariResponseDTO(message: string, usuariId?: string): OperacioUsuariResponseDTO {
        return {
            message,
            ...(usuariId === undefined ? {} : { usuariId }),
        };
    }

    // Converteix el DTO de pre-registre en l'input Prisma que pot persistir
    // el repositori, mantenint separats API i model de base de dades.
    private mapRegisterDTOToPrisma(dto: RegisterUsuariDTO): Prisma.UsuariCreateInput {
        return {
            firebaseUid: null,
            emailPrincipal: dto.emailPrincipal,
            nom: dto.nom ?? null,
            cognom1: dto.cognom1 ?? null,
            cognom2: dto.cognom2 ?? null,
        };
    }

    // Converteix el DTO parcial d'actualització en l'input Prisma equivalent
    // i adapta els enums compartits als enums generats per Prisma.
    private mapUpdateDTOToPrisma(dto: UpdatePerfilDTO): Prisma.UsuariUpdateInput {
        return {
            ...dto,
            ...(dto.sexe === undefined ? {} : { sexe: dto.sexe as TSexe | null }),
            ...(dto.tipusDocument === undefined ? {} : { tipusDocument: dto.tipusDocument as TDocument | null }),
            ...(dto.tipusDocumentTutor === undefined ? {} : { tipusDocumentTutor: dto.tipusDocumentTutor as TDocument | null }),
        };
    }

    async registrarUsuari(dto: RegisterUsuariDTO): Promise<UsuariResponseDTO> {
        const existingUser = await this.repository.findByEmail(dto.emailPrincipal);
        if (existingUser) {
            throw new Error('Ja existeix un usuari amb aquest correu electrònic.');
        }

        // Crea un pre-registre, Google assignarà el firebaseUid en el primer accés.
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

    async actualitzarUsuari(id: string, dto: UpdatePerfilDTO): Promise<UsuariResponseDTO> {
        const usuariExistent = await this.repository.findById(id);
        if (!usuariExistent) {
            throw new Error("L'usuari no existeix a la base de dades.");
        }

        const usuariActualitzat = await this.repository.updateById(
            id,
            this.mapUpdateDTOToPrisma(dto),
        );

        return this.mapToUsuariResponseDTO(usuariActualitzat);
    }

    async obtenirUsuariPerId(id: string): Promise<UsuariResponseDTO> {
        const usuariDB = await this.repository.findById(id);
        if (!usuariDB) {
            throw new Error("L'usuari no existeix.");
        }
        return this.mapToUsuariResponseDTO(usuariDB);
    }

    async obtenirUsuariPerFirebaseId(firebaseId: string): Promise<UsuariResponseDTO> {
        const usuariDB = await this.repository.findByFirebaseUid(firebaseId);
        if(!usuariDB) {
            throw new Error("L'usuair no existeix.");
        }
        return this.mapToUsuariResponseDTO(usuariDB);
    }

    async obtenirUsuariAutenticat(firebaseUid: string): Promise<MeUsuariResponseDTO> {
        const usuariDB = await this.repository.findByFirebaseUid(firebaseUid);
        if (!usuariDB) {
            throw new Error("L'usuari no existeix.");
        }
        return this.mapToMeUsuariResponseDTO(usuariDB);
    }

    async obtenirTotsElsUsuaris(): Promise<UsuariResponseDTO[]> {
        const adminUids = new Set<string>();
        let pageToken: string | undefined;

        do {
            const page = await firebaseAdmin.auth().listUsers(1000, pageToken);
            for (const firebaseUser of page.users) {
                if (firebaseUser.customClaims?.admin === true) {
                    adminUids.add(firebaseUser.uid);
                }
            }
            pageToken = page.pageToken;
        } while (pageToken);

        const usuaris = await this.repository.findAll();
        return usuaris
            .filter((usuari) => !usuari.firebaseUid || !adminUids.has(usuari.firebaseUid))
            .map((usuari) => this.mapToUsuariResponseDTO(usuari));
    }

    async tancarSessio(firebaseUid: string): Promise<OperacioUsuariResponseDTO> {
        await firebaseAdmin.auth().revokeRefreshTokens(firebaseUid);

        return this.mapToOperacioUsuariResponseDTO('Sessió tancada correctament.');
    }

    async setEntrenador(id: string, entrenador: boolean): Promise<UsuariResponseDTO> {
        return this.mapToUsuariResponseDTO(await this.repository.setEntrenador(id, entrenador));
    }

    async setFamiliar(familiarId: string, dto: SetFamiliarDTO): Promise<OperacioUsuariResponseDTO> {
        const usuariIds = [...new Set(dto.usuariIds ?? [])];
        if (usuariIds.length === 0) {
            throw new Error('Cal indicar almenys un usuari.');
        }

        await this.repository.setFamiliar(familiarId, usuariIds);
        return this.mapToOperacioUsuariResponseDTO(
            'Usuari familiar assignat correctament.',
            familiarId,
        );
    }

    async eliminarUsuari(targetId: string, actorIsAdmin: boolean): Promise<OperacioUsuariResponseDTO> {
        const target = await this.repository.findById(targetId);

        if (!actorIsAdmin) {
            throw new Error('Només els administradors poden eliminar usuaris.');
        }

        if (!target) {
            throw new Error('L\'usuari que es vol eliminar no existeix.');
        }

        if (target.firebaseUid) {
            await firebaseAdmin.auth().deleteUser(target.firebaseUid);
        }
        await this.repository.deleteById(target.id);

        return this.mapToOperacioUsuariResponseDTO(
            'Usuari eliminat correctament.',
            target.id,
        );
    }
}
