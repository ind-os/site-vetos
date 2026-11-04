// Les textes de l'interface en français : menus, boutons, titres des blocs, messages.
// C'est le catalogue de référence. Chaque texte ajouté ici s'ajoute aussi dans de.ts, sinon
// `pnpm verifier` signale le texte manquant. Les textes des pages sont dans src/content/pages/.

export const fr = {
  langue: {
    nom: 'Français',
    /** Le lien vers l'autre langue, dans l'en-tête. */
    autre: 'Deutsch',
    autreCourt: 'DE',
    autreAccessible: 'Diese Seite auf Deutsch',
  },

  site: {
    nom: 'Vetmint',
    signature: 'Bons soins vétérinaires',
    logo: 'Vetmint, bons soins vétérinaires',
    accueilDuLieu: (lieu: string) => `Accueil de la clinique de ${lieu}`,
    reseau: 'Le réseau Vetmint',
    descriptionDuReseau: 'Huit cliniques vétérinaires en Suisse romande',
  },

  navigation: {
    principale: 'Navigation principale',
    menu: 'Menu',
    fermer: 'Fermer le menu',
    allerAuContenu: 'Aller au contenu',
    accueil: 'Accueil',
    filDAriane: 'Vous êtes ici',
    cliniques: 'Nos cliniques',
    services: 'Services',
    urgences: 'Urgences',
    conseils: 'Conseils santé',
    emploi: 'Emploi',
    aPropos: 'Le groupe Vetmint',
    equipe: 'Équipe',
    tarifs: 'Tarifs',
    abonnements: 'Abonnements',
    contact: 'Contact',
    questions: 'Questions fréquentes',
    rendezVous: 'Rendez-vous',
    confidentialite: 'Confidentialité',
    newsletter: 'Lettre d’information',
    mentionsLegales: 'Mentions légales',
  },

  rendezVous: {
    bouton: 'Prendre rendez-vous',
    boutonClinique: (lieu: string) => `Prendre rendez-vous à ${lieu}`,
    choisirUneClinique: 'Choisir une clinique',
    huitCliniques: 'Dans l’une des huit cliniques Vetmint.',
    chargement: 'Ouverture de l’agenda…',
    fermer: 'Fermer',
    nouvelOnglet: 'L’agenda s’ouvre dans un nouvel onglet.',
    erreur: 'L’agenda ne s’ouvre pas. Appelez la clinique au',
  },

  telephone: {
    appeler: (numero: string) => `Appeler le ${numero}`,
    whatsapp: 'WhatsApp',
    ecrire: 'Écrire un e-mail',
  },

  urgence: {
    titre: 'Urgence',
    horsHoraires: 'Urgence en dehors des horaires',
    ligneDeGarde: 'Urgence en dehors des horaires\u00a0: service de garde',
    garde: 'Service de garde',
    pendantLesHoraires: 'Pendant les heures d’ouverture, appelez la clinique\u00a0:',
    queFaire: 'Que faire en cas d’urgence',
  },

  horaires: {
    titre: 'Horaires',
    ferme: 'fermé',
    et: 'et',
    a: 'à',
    jours: {
      lundi: 'Lundi',
      mardi: 'Mardi',
      mercredi: 'Mercredi',
      jeudi: 'Jeudi',
      vendredi: 'Vendredi',
      samedi: 'Samedi',
      dimanche: 'Dimanche',
    },
    ouvertJusqua: (heure: string) => `Ouvert maintenant, jusqu’à ${heure}`,
    fermeOuvreA: (heure: string) => `Fermé, ouvre à ${heure}`,
    fermeOuvreDemain: (heure: string) => `Fermé, ouvre demain à ${heure}`,
    fermeOuvreLe: (jour: string, heure: string) => `Fermé, ouvre ${jour} à ${heure}`,
    fermeOuvreLeDate: (date: string, heure: string) => `Fermé, ouvre le ${date} à ${heure}`,
    fermeTout: 'Fermé',
    fermetures: 'Fermetures annoncées',
    fermeDuAu: (du: string, au: string) => `Fermé du ${du} au ${au}`,
    fermeLe: (date: string) => `Fermé le ${date}`,
  },

  clinique: {
    surtitre: (lieu: string, canton: string) => `Clinique vétérinaire · ${lieu} (${canton})`,
    venir: 'Venir à la clinique',
    nousJoindre: 'Nous joindre',
    itineraire: 'Itinéraire',
    itineraireGoogle: 'Itinéraire avec Google Maps',
    itineraireOsm: 'Itinéraire avec OpenStreetMap',
    adresse: 'Adresse',
    parking: 'Parking',
    transports: 'Transports publics',
    accessibilite: 'Accès',
    communes: 'Communes desservies',
    services: 'Les soins de la clinique',
    voirLaClinique: 'Voir la clinique',
    siteActuel: 'Site de la clinique',
    equipe: 'L’équipe',
    touteLEquipe: 'Toute l’équipe',
    langues: (liste: string) => `Langues\u00a0: ${liste}`,
    especes: (liste: string) => `Animaux reçus\u00a0: ${liste}`,
    raisonSociale: 'Raison sociale',
    autresCliniques: 'Les autres cliniques Vetmint',
    pagesDeLaClinique: 'La clinique',
  },

  especes: {
    chien: 'Chien',
    chat: 'Chat',
    nac: 'Lapin et NAC',
    chiens: 'chiens',
    chats: 'chats',
    nacs: 'lapins et NAC',
  },

  langues: {
    fr: 'français',
    de: 'allemand',
    en: 'anglais',
    it: 'italien',
    pt: 'portugais',
    es: 'espagnol',
  },

  services: {
    tous: 'Tous les services',
    voir: 'Voir le service',
    dansQuellesCliniques: 'Dans quelles cliniques',
    pratiqueA: (lieu: string) => `Ce soin à ${lieu}`,
    pageGenerale: 'Tout savoir sur ce soin',
    autresServices: 'Les autres soins de la clinique',
  },

  conseils: {
    tous: 'Tous les conseils',
    lire: 'Lire le conseil',
    minutes: (n: number) => `${n} min de lecture`,
    aLireAussi: 'À lire aussi',
  },

  cliniques: {
    trouver: 'Trouver sa clinique',
    carte: 'Carte des huit cliniques Vetmint en Suisse romande',
    statut: 'Ouverture',
  },

  questions: {
    titre: 'Questions fréquentes',
  },

  erreur: {
    titre: 'Cette page n’existe pas',
    texte: 'L’adresse a peut-être changé. Voici les pages les plus demandées.',
  },

  tableau: {
    nom: 'Tableau',
    premiereLigne: 'première ligne',
  },
};
