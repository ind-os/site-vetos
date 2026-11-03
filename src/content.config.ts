// Les deux collections du site, vérifiées à chaque construction :
// - « pages » : les textes, un fichier Markdown par page et par langue (docs/format-des-pages.md) ;
// - « cliniques » : la fiche de chaque clinique, un fichier JSON (docs/fiche-clinique.md).
// Un champ manquant ou mal écrit arrête la construction avec le nom du fichier et du champ.

import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TYPES_DE_PAGE } from './lib/types-de-page.ts';

/** Une date AAAA-MM-JJ, écrite telle quelle ou lue comme une date par le YAML. */
const date = z
  .union([z.string(), z.date()])
  .transform((valeur) => (valeur instanceof Date ? valeur.toISOString().slice(0, 10) : valeur));

const pages = defineCollection({
  // L'identifiant d'une page est son chemin sans l'extension : « fr/payerne/equipe ».
  loader: glob({ pattern: '**/*.md', base: './src/content/pages', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
  schema: z.object({
    type: z.enum(TYPES_DE_PAGE),
    clinique: z.string().optional(),
    url: z.string().regex(/^\/([a-z0-9-]+\/)*$/, 'une adresse en minuscules qui commence et finit par « / »'),
    title: z.string().max(70),
    description: z.string(),
    h1: z.string().optional(),
    /** Le nom court de la page, pour les pastilles, les menus et le fil d'Ariane : « Radiographie ». */
    nom: z.string().optional(),
    recherche: z.string(),
    redige_le: date,
    sources: z.array(z.string()).default([]),
    auteur: z.string().optional(),
    relecteur: z.string().optional(),
    relu_le: date.optional(),
    a_remplacer: z.array(z.string()).optional(),
    ordre: z.number().optional(),
    resume: z.string().optional(),
    especes: z.array(z.enum(['chien', 'chat', 'nac'])).optional(),
  }),
});

/** Un texte dans les deux langues. */
const texte = z.object({ fr: z.string(), de: z.string() });

/** Une plage d'ouverture « 08:00-12:00 ». */
const plage = z.string().regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'une plage au format 08:00-12:00');

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
    /** L'adresse du site actuel de la clinique, utilisée tant que ses pages ne sont pas en ligne. */
    site_actuel: z.url(),
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
    accroche: texte.optional(),
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
    /** Les fermetures annoncées : du premier au dernier jour fermé, AAAA-MM-JJ. */
    fermetures: z.array(z.object({ du: date, au: date, motif: texte.optional() })).default([]),
    /** L'annonce en haut de chaque page de la clinique, jusqu'à la date donnée. */
    bandeau: z.object({ texte, niveau: z.enum(['info', 'urgent']).default('info'), jusqu_au: date.optional() }).nullable().default(null),
    /** Le service de garde, hors des heures d'ouverture. */
    garde: z.object({ telephone, tarif: texte }),
    /** Le module de réservation, ouvert par le bouton « Prendre rendez-vous ». */
    rendez_vous: z.object({ outil: z.enum(['calendly', 'vetlink']), adresse: z.url() }),
    sources: z.array(z.string()).default([]),
    a_remplacer: z.array(z.string()).default([]),
  }),
});

export const collections = { pages, cliniques };
