// Die Texte der Oberfläche auf Deutsch. Gleicher Aufbau wie fr.ts : jeder Schlüssel aus fr.ts
// muss hier stehen, sonst meldet `pnpm verifier` den fehlenden Text.
// Schweizer Rechtschreibung : « ss » statt « ß ».

import type { Catalogue } from './index.ts';

export const de: Catalogue = {
  langue: {
    nom: 'Deutsch',
    autre: 'Français',
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
    fermer: 'Menü schliessen',
    allerAuContenu: 'Zum Inhalt',
    accueil: 'Startseite',
    filDAriane: 'Sie sind hier',
    cliniques: 'Unsere Praxen',
    services: 'Leistungen',
    urgences: 'Notfall',
    conseils: 'Gesundheitsratgeber',
    emploi: 'Jobs',
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
    boutonClinique: (lieu: string) => `Termin in ${lieu} vereinbaren`,
    choisirUneClinique: 'Praxis wählen',
    huitCliniques: 'In einer der acht Vetmint-Praxen.',
    chargement: 'Der Kalender wird geöffnet …',
    fermer: 'Schliessen',
    nouvelOnglet: 'Der Kalender öffnet sich in einem neuen Tab.',
    erreur: 'Der Kalender lässt sich nicht öffnen. Rufen Sie die Praxis an unter',
  },

  telephone: {
    appeler: (numero: string) => `${numero} anrufen`,
    whatsapp: 'WhatsApp',
    ecrire: 'E-Mail schreiben',
  },

  urgence: {
    titre: 'Notfall',
    horsHoraires: 'Notfall ausserhalb der Öffnungszeiten',
    ligneDeGarde: 'Notfall ausserhalb der Öffnungszeiten: Notfalldienst',
    garde: 'Notfalldienst',
    pendantLesHoraires: 'Während der Öffnungszeiten rufen Sie die Praxis an:',
    queFaire: 'Was tun im Notfall',
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
    parking: 'Parkplätze',
    transports: 'Öffentlicher Verkehr',
    accessibilite: 'Zugang',
    communes: 'Einzugsgebiet',
    services: 'Die Leistungen der Praxis',
    voirLaClinique: 'Zur Praxis',
    siteActuel: 'Website der Praxis',
    equipe: 'Das Team',
    touteLEquipe: 'Das ganze Team',
    langues: (liste: string) => `Sprachen: ${liste}`,
    especes: (liste: string) => `Behandelte Tiere: ${liste}`,
    raisonSociale: 'Firma',
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
    tous: 'Alle Leistungen',
    voir: 'Zur Leistung',
    dansQuellesCliniques: 'In welchen Praxen',
    pratiqueA: (lieu: string) => `Diese Leistung in ${lieu}`,
    pageGenerale: 'Alles über diese Leistung',
    autresServices: 'Weitere Leistungen der Praxis',
  },

  conseils: {
    tous: 'Alle Ratgeber',
    lire: 'Ratgeber lesen',
    minutes: (n: number) => `${n} Min. Lesezeit`,
    aLireAussi: 'Ebenfalls lesenswert',
  },

  cliniques: {
    trouver: 'Praxis finden',
    carte: 'Karte der acht Vetmint-Praxen in der Westschweiz',
    statut: 'Geöffnet',
  },

  questions: {
    titre: 'Häufige Fragen',
  },

  erreur: {
    titre: 'Diese Seite gibt es nicht',
    texte: 'Die Adresse hat sich vielleicht geändert. Hier die meistbesuchten Seiten.',
  },

  tableau: {
    nom: 'Tabelle',
    premiereLigne: 'erste Zeile',
  },
};
