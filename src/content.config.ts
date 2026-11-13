// Les quatre collections du site, vérifiées à chaque construction :
// - « pages » : les textes, un fichier Markdown par page et par langue (docs/format-des-pages.md) ;
// - « cliniques » : la fiche de chaque clinique, un fichier JSON (docs/fiche-du-cabinet.md) ;
// - « tarifs » : la grille des prix de chaque cabinet, un fichier JSON (docs/grille-des-prix.md) ;
// - « campagnes » : les campagnes du réseau, un fichier JSON chacune (docs/campagnes.md).
// Un champ manquant ou mal écrit arrête la construction avec le nom du fichier et du champ,
// dans un message en français.

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { enMinutes, JOURS } from './lib/horaires.ts';
import { valeursDe, type Grille } from './lib/prix.ts';
import { TYPES_DE_PAGE } from './lib/types-de-page.ts';

z.config(z.locales.fr());

/** Vrai si « AAAA-MM-JJ » est un jour du calendrier : « 2026-02-30 » ne l'est pas. */
function estUnJour(texte: string): boolean {
  const [a, m, j] = texte.split('-').map(Number);
  const jour = new Date(Date.UTC(a, m - 1, j));
  return jour.getUTCFullYear() === a && jour.getUTCMonth() === m - 1 && jour.getUTCDate() === j;
}

/** Une date AAAA-MM-JJ, écrite telle quelle ou lue comme une date par le YAML. */
const date = z
  .union([z.string(), z.date()])
  .transform((valeur) => (valeur instanceof Date ? valeur.toISOString().slice(0, 10) : valeur))
  .pipe(
    z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'une date au format AAAA-MM-JJ, par exemple 2026-12-24')
      .refine(estUnJour, 'une date qui existe dans le calendrier'),
  );

const pages = defineCollection({
  // L'identifiant d'une page est son chemin sans l'extension : « fr/payerne/equipe ».
  loader: glob({ pattern: '**/*.md', base: './src/content/pages', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    type: z.enum(TYPES_DE_PAGE),
    clinique: z.string().optional(),
    url: z.string().regex(/^\/([a-z0-9-]+\/)*$/, 'une adresse en minuscules qui commence et finit par « / »'),
    title: z.string().max(60, 'un title de 60 caractères au plus'),
    description: z.string(),
    h1: z.string().optional(),
    /** Le nom court de la page, pour les pastilles, les menus et le fil d'Ariane : « Radiographie ». */
    nom: z.string().optional(),
    recherche: z.string(),
    redige_le: date,
    ordre: z.number().optional(),
    resume: z.string().optional(),
    especes: z.array(z.enum(['chien', 'chat', 'nac'])).optional(),
    /** Le nom du soin dans une phrase, avec son article : « la radiographie », « das Röntgen ». Page commune d'un service. */
    en_phrase: z.string().optional(),
    /**
     * Le soin dans « Comment prendre rendez-vous pour… ? », quand l'article de `en_phrase` ne
     * convient pas : « une prise de sang ». Sans lui, `en_phrase`. Page commune d'un service.
     */
    pour_un_rendez_vous: z.string().optional(),
    /**
     * La question « Qui pratique {en_phrase} à {Ville} ? » écrite autrement, en entier : « Quel
     * vétérinaire fait des visites à domicile ? ». {lieu} devient le lieu du cabinet. Page commune
     * d'un service.
     */
    question_qui_pratique: z.string().optional(),
    /**
     * La présentation du soin dans un cabinet, avec les mots que l'on cherche, valable pour chaque
     * cabinet : « Le cabinet {cabinet} propose des soins dentaires… ». {cabinet} devient « Vetmint
     * Payerne ». Page commune d'un service.
     */
    presentation_dans_le_cabinet: z.string().optional(),
  }),
});

/** Un texte dans les deux langues. */
const texte = z.object({ fr: z.string(), de: z.string() });

/** Une plage d'ouverture « 08:00-12:00 » : heures de 00 à 24, minutes de 00 à 59, début avant fin. */
const plage = z
  .string()
  .regex(/^([01]\d|2[0-4]):[0-5]\d-([01]\d|2[0-4]):[0-5]\d$/, 'une plage au format 08:00-12:00, heures de 00 à 24, minutes de 00 à 59')
  .refine((texte) => {
    const [debut, fin] = texte.split('-');
    return enMinutes(debut) < enMinutes(fin);
  }, 'une plage dont le début précède la fin, par exemple 08:00-12:00');

const telephone = z.object({
  /** Tel qu'il s'affiche : « 026 660 16 16 ». */
  affiche: z.string(),
  /** Tel qu'il se compose : « +41266601616 ». */
  international: z.string().regex(/^\+\d+$/),
});

const cliniques = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/donnees/cliniques' }),
  schema: z.object({
    /** L'identifiant, qui donne l'adresse : vetmint.ch/payerne/. */
    id: z.string(),
    /** Vrai quand les pages de la clinique sont écrites et publiées sur ce site. */
    en_ligne: z.boolean(),
    /** L'adresse où mènent les liens vers la clinique tant que ses pages ne sont pas en ligne. */
    adresse_hors_ligne: z.url(),
    nom: z.string(),
    /** Le nom de lieu affiché à côté du logo : « Fribourg Ouest ». */
    lieu: z.string(),
    canton: z.string(),
    raison_sociale: z.string().optional(),
    adresse: z.object({ rue: z.string(), npa: z.string(), localite: z.string() }),
    coordonnees: z.object({ lat: z.number(), lng: z.number() }),
    telephone,
    whatsapp: telephone.optional(),
    email: z.email(),
    /** Les espèces reçues. */
    especes: z.array(z.enum(['chien', 'chat', 'nac'])).default(['chien', 'chat']),
    /** Les services pratiqués sur place : le nom de leur fichier dans services/. */
    services: z.array(z.string()).default([]),
    /** Vrai si la clinique reçoit les urgences : elle a alors sa page urgences. */
    urgences: z.boolean().default(false),
    equipe: z
      .array(
        z.object({
          nom: z.string(),
          titre: z.string().nullable().optional(),
          fonction: texte,
          langues: z.array(z.enum(['fr', 'de', 'en', 'it', 'pt', 'es'])).default([]),
          domaines: z.array(texte).default([]),
        }),
      )
      .default([]),
    acces: z
      .object({ repere: texte.optional(), parking: texte.optional(), transports: texte.optional(), accessibilite: texte.optional() })
      .default({}),
    communes: z.array(z.string()).default([]),
    /** Les plages d'ouverture de chaque jour ; un jour absent ou vide est fermé. */
    horaires: z.object({
      lundi: z.array(plage).default([]),
      mardi: z.array(plage).default([]),
      mercredi: z.array(plage).default([]),
      jeudi: z.array(plage).default([]),
      vendredi: z.array(plage).default([]),
      samedi: z.array(plage).default([]),
      dimanche: z.array(plage).default([]),
    }),
    /** Un jour ouvert en alternance avec une autre clinique, environ une semaine sur deux. */
    alternance: z.object({ jour: z.enum(JOURS), plages: z.array(plage).min(1), avec: z.string() }).optional(),
    /** Les fermetures annoncées : du premier au dernier jour fermé, AAAA-MM-JJ. */
    fermetures: z
      .array(
        z
          .object({ du: date, au: date, motif: texte.optional() })
          .refine((f) => f.du <= f.au, { message: 'un dernier jour « au » égal ou postérieur au premier jour « du »', path: ['au'] }),
      )
      .default([]),
    /** L'annonce en haut de chaque page de la clinique, jusqu'à la date donnée. */
    bandeau: z.object({ texte, niveau: z.enum(['info', 'urgent']).default('info'), jusqu_au: date.optional() }).nullable().default(null),
    /** Le service de garde, hors des heures d'ouverture. */
    garde: z.object({
      telephone,
      tarif: texte,
      /** Un second service de garde de la région, nommé : « Vet'Urgence Neuchâtel ». */
      autre: z.object({ nom: z.string(), telephone, tarif: texte }).optional(),
    }),
    /** Le module de réservation, ouvert par le bouton « Prendre rendez-vous ». */
    rendez_vous: z.object({ outil: z.enum(['calendly', 'vetlink']), adresse: z.url() }),
  }),
});

/** Un montant : un nombre, une fourchette, ou un calcul sur d'autres clés de la grille. */
const montant = z.union([
  z.number().nonnegative(),
  z.object({ min: z.number().nonnegative(), max: z.number().nonnegative() }).refine((f) => f.min < f.max, 'une fourchette dont le minimum est plus petit que le maximum'),
  z.string().regex(/^[a-z0-9.-]+( [-+*\/] [a-z0-9.-]+)+$/, 'un calcul écrit avec des clés, des nombres et + - * /, entourés d\'espaces : « consultation + supplement »'),
]);

const tarifs = defineCollection({
  // L'identifiant d'une grille est celui de son cabinet : src/donnees/tarifs/payerne.json.
  loader: glob({ pattern: '*.json', base: './src/donnees/tarifs' }),
  schema: z
    .object({
      /** Le jour depuis lequel les prix s'appliquent. */
      valable_des: date,
      prix: z.array(
        z.object({
          cle: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'une clé en minuscules et tirets : « sterilisation-chatte »'),
          /** Le nom de la page commune du service : le prix s'affiche sur la page de ce service dans le cabinet. */
          service: z.string().optional(),
          libelle: texte,
          montant,
        }),
      ),
    })
    .superRefine((grille, ctx) => {
      try {
        valeursDe(grille as Grille);
      } catch (probleme) {
        ctx.addIssue({ code: 'custom', message: (probleme as Error).message });
      }
    }),
});

const campagnes = defineCollection({
  // L'identifiant d'une campagne est le nom de son fichier : src/donnees/campagnes/trimestre-dentaire.json.
  loader: glob({ pattern: '*.json', base: './src/donnees/campagnes' }),
  schema: z.object({
    /** L'interrupteur : false retire l'encart tout de suite, quelles que soient les dates. */
    active: z.boolean(),
    /** Le premier jour de la campagne. Sans date, elle commence dès qu'elle est active. */
    du: date.optional(),
    /** Le dernier jour de la campagne : l'encart disparaît le lendemain. */
    jusqu_au: date,
    titre: texte,
    texte,
    /**
     * Où mène le bouton. « contact » : « Pour plus d'informations, contactez votre cabinet », vers
     * la liste des cabinets ; dans un cabinet, vers sa page Contact. « service » : vers la page du
     * service, celle du cabinet dans un cabinet.
     */
    bouton: z.enum(['contact', 'service']).default('contact'),
    /** Le nom de la page commune du service, pour le bouton « service ». */
    service: z.string().optional(),
    /** Le sujet de la photo dans le catalogue : « service:dentisterie ». */
    photo: z.string().optional(),
    /** Les cabinets où l'encart s'affiche, par leur identifiant. Sans liste, tous. */
    cabinets: z.array(z.string()).optional(),
    /** L'encart s'affiche aussi sur l'accueil du site. Vrai par défaut. */
    accueil_du_site: z.boolean().default(true),
  }),
});

export const collections = { pages, cliniques, tarifs, campagnes };
