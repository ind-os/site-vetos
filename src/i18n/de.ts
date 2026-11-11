// Les textes de l'interface en allemand, avec les mêmes clés que fr.ts : une clé absente d'un
// des deux fichiers arrête la construction. Orthographe suisse : « ss », jamais « ß ».

import type { Catalogue } from './index.ts';

export const de: Catalogue = {
  langue: {
    autreCourt: 'FR',
    autreAccessible: 'Cette page en français',
  },

  site: {
    nom: 'Vetmint',
    signature: 'Gute tierärztliche Versorgung',
    logo: 'Vetmint, gute tierärztliche Versorgung',
    accueilDuLieu: (lieu: string) => `Startseite der Praxis ${lieu}`,
    reseau: 'Das Vetmint-Netzwerk',
    descriptionDuReseau: 'Acht Tierarztpraxen in der Westschweiz',
  },

  navigation: {
    principale: 'Hauptnavigation',
    menu: 'Menü',
    allerAuContenu: 'Zum Inhalt',
    accueil: 'Startseite',
    filDAriane: 'Sie sind hier',
    cliniques: 'Unsere Praxen',
    services: 'Leistungen',
    urgences: 'Notfall',
    conseils: 'Gesundheitsratgeber',
    conseilsChiens: 'Hunde',
    conseilsChats: 'Katzen',
    conseilsNac: 'Heimtiere',
    emploi: 'Jobs',
    remettre: 'Praxisübergabe',
    aPropos: 'Die Vetmint-Gruppe',
    equipe: 'Team',
    tarifs: 'Preise',
    abonnements: 'Abonnemente',
    contact: 'Kontakt',
    questions: 'Häufige Fragen',
    rendezVous: 'Termin',
    confidentialite: 'Datenschutz',
    newsletter: 'Newsletter',
    mentionsLegales: 'Impressum',
  },

  rendezVous: {
    bouton: 'Termin vereinbaren',
    huitCliniques: 'In einer der acht Vetmint-Praxen.',
    fermer: 'Schliessen',
    nouvelOnglet: 'Der Kalender öffnet sich in einem neuen Tab.',
    chargement: 'Der Kalender wird geöffnet …',
  },

  telephone: {
    appeler: (numero: string) => `${numero} anrufen`,
    whatsapp: 'WhatsApp',
  },

  urgence: {
    garde: 'Notfallnummer',
  },

  horaires: {
    titre: 'Öffnungszeiten',
    ferme: 'geschlossen',
    et: 'und',
    a: 'bis',
    jours: {
      lundi: 'Montag',
      mardi: 'Dienstag',
      mercredi: 'Mittwoch',
      jeudi: 'Donnerstag',
      vendredi: 'Freitag',
      samedi: 'Samstag',
      dimanche: 'Sonntag',
    },
    ouvertJusqua: (heure: string) => `Jetzt geöffnet, bis ${heure} Uhr`,
    fermeOuvreA: (heure: string) => `Geschlossen, öffnet um ${heure} Uhr`,
    fermeOuvreDemain: (heure: string) => `Geschlossen, öffnet morgen um ${heure} Uhr`,
    fermeOuvreLe: (jour: string, heure: string) => `Geschlossen, öffnet am ${jour} um ${heure} Uhr`,
    fermeOuvreLeDate: (date: string, heure: string) => `Geschlossen, öffnet am ${date} um ${heure} Uhr`,
    fermeTout: 'Geschlossen',
    fermetures: 'Angekündigte Schliessungen',
    fermeDuAu: (du: string, au: string) => `Geschlossen vom ${du} bis ${au}`,
    fermeLe: (date: string) => `Geschlossen am ${date}`,
  },

  clinique: {
    surtitre: (lieu: string, canton: string) => `Tierarztpraxis · ${lieu} (${canton})`,
    venir: 'Anfahrt',
    nousJoindre: 'Kontakt',
    itineraire: 'Route',
    itineraireGoogle: 'Route mit Google Maps',
    itineraireOsm: 'Route mit OpenStreetMap',
    adresse: 'Adresse',
    services: 'Die Leistungen der Praxis',
    voirLaClinique: 'Zur Praxis',
    siteActuel: 'Website der Praxis',
    equipe: 'Das Team',
    touteLEquipe: 'Das ganze Team',
    langues: (liste: string) => `Sprachen: ${liste}`,
    especes: (liste: string) => `Behandelte Tiere: ${liste}`,
    autresCliniques: 'Die anderen Vetmint-Praxen',
    pagesDeLaClinique: 'Die Praxis',
  },

  especes: {
    chien: 'Hund',
    chat: 'Katze',
    nac: 'Kaninchen und Heimtiere',
    chiens: 'Hunde',
    chats: 'Katzen',
    nacs: 'Kaninchen und Heimtiere',
  },

  langues: {
    fr: 'Französisch',
    de: 'Deutsch',
    en: 'Englisch',
    it: 'Italienisch',
    pt: 'Portugiesisch',
    es: 'Spanisch',
  },

  services: {
    voir: 'Zur Leistung',
    dansQuellesCliniques: 'In welchen Praxen',
    pratiqueA: (lieu: string) => `Diese Leistung in ${lieu}`,
    pageGenerale: 'Alles über diese Leistung',
    autresServices: 'Weitere Leistungen der Praxis',
  },

  conseils: {
    tous: 'Alle Ratgeber',
    minutes: (n: number) => `${n} Min. Lesezeit`,
    aLireAussi: 'Ebenfalls lesenswert',
  },

  cliniques: {
    trouver: 'Praxis finden',
    pages: 'Die Seite jeder Praxis',
    carte: 'Karte der acht Vetmint-Praxen in der Westschweiz',
  },

  erreur: {
    titre: 'Diese Seite gibt es nicht',
    texte: 'Die Adresse hat sich vielleicht geändert. Hier die meistbesuchten Seiten.',
  },

  tableau: {
    nom: 'Tabelle',
  },
};
