// Les textes de l'interface en français : menus, boutons, titres des blocs, messages.
// C'est le catalogue de référence. Chaque texte ajouté ici s'ajoute aussi dans de.ts, sous la
// même clé : sinon la construction s'arrête et nomme la clé qui manque. Les textes des pages
// sont dans src/content/pages/.

/** Une rue précédée de sa préposition : « à la route du Châtelard 13 », « à l'avenue… », « au chemin… ». */
function aLaRue(rue: string): string {
  const premierMot = rue.split(/\s/)[0].toLowerCase();
  const minuscule = rue.charAt(0).toLowerCase() + rue.slice(1);
  if (['avenue', 'allée', 'impasse', 'esplanade'].includes(premierMot)) return `à l’${minuscule}`;
  if (['chemin', 'boulevard', 'quai', 'passage', 'sentier', 'faubourg'].includes(premierMot)) return `au ${minuscule}`;
  return `à la ${minuscule}`;
}

/** « de Payerne », « d'Avenches ». */
function deLaLocalite(localite: string): string {
  return /^[aeiouyàâéèêîôûh]/i.test(localite) ? `d’${localite}` : `de ${localite}`;
}

export const fr = {
  langue: {
    /** Le lien vers l'autre langue, dans l'en-tête. */
    autreCourt: 'DE',
    autreAccessible: 'Diese Seite auf Deutsch',
  },

  site: {
    nom: 'Vetmint',
    signature: 'Bons soins vétérinaires',
    logo: 'Vetmint, bons soins vétérinaires',
    accueilDuLieu: (lieu: string) => `Accueil du cabinet de ${lieu}`,
    reseau: 'Le réseau Vetmint',
    descriptionDuReseau: 'Huit cabinets vétérinaires en Suisse romande',
  },

  navigation: {
    principale: 'Navigation principale',
    menu: 'Menu',
    allerAuContenu: 'Aller au contenu',
    accueil: 'Accueil',
    filDAriane: 'Vous êtes ici',
    cliniques: 'Nos cabinets',
    services: 'Services',
    urgences: 'Urgences',
    conseils: 'Conseils santé',
    conseilsChiens: 'Chiens',
    conseilsChats: 'Chats',
    conseilsNac: 'NAC',
    emploi: 'Emploi',
    remettre: 'Remettre un cabinet',
    aPropos: 'Le groupe Vetmint',
    equipe: 'Équipe',
    tarifs: 'Tarifs',
    abonnements: 'Abonnements',
    contact: 'Contact',
    questions: 'Questions fréquentes',
    rendezVous: 'Rendez-vous',
    confidentialite: 'Confidentialité',
    mentionsLegales: 'Mentions légales',
  },

  rendezVous: {
    bouton: 'Prendre rendez-vous',
    huitCliniques: 'Dans l’un des huit cabinets Vetmint.',
    fermer: 'Fermer',
    nouvelOnglet: 'L’agenda s’ouvre dans un nouvel onglet.',
    chargement: 'Ouverture de l’agenda…',
  },

  telephone: {
    appeler: (numero: string) => `Appeler le ${numero}`,
    whatsapp: 'WhatsApp',
  },

  urgence: {
    garde: 'En cas d’urgence en dehors des horaires d’ouverture du cabinet, appelez le',
    services: 'Nos services d’urgence',
    gratuit: 'Numéro gratuit',
    horaires: 'Tous les jours, de 8 h à minuit',
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
    alternance: (plages: string, jour: string, avec: string) =>
      `${plages}, environ un ${jour} sur deux, en alternance avec le cabinet de ${avec}. Appelez avant de venir.`,
    appelerAvant: 'Aujourd’hui, appelez avant de venir',
  },

  clinique: {
    surtitre: (lieu: string, canton: string) => `Cabinet vétérinaire · ${lieu} (${canton})`,
    venir: 'Venir au cabinet',
    nousJoindre: 'Nous joindre',
    itineraire: 'Itinéraire',
    itineraireGoogle: 'Itinéraire avec Google Maps',
    itineraireOsm: 'Itinéraire avec OpenStreetMap',
    adresse: 'Adresse',
    services: 'Les soins du cabinet',
    voirLaClinique: 'Voir le cabinet',
    siteActuel: 'Site du cabinet',
    equipe: 'L’équipe',
    touteLEquipe: 'Toute l’équipe',
    langues: (liste: string) => `Langues\u00a0: ${liste}`,
    especes: (liste: string) => `Animaux reçus\u00a0: ${liste}`,
    autresCliniques: 'Les autres cabinets Vetmint',
    pagesDeLaClinique: 'Le cabinet',
  },

  especes: {
    chien: 'Chien',
    chat: 'Chat',
    nac: 'Lapin et NAC',
    chiens: 'chiens',
    chats: 'chats',
    nacs: 'NAC',
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
    voir: 'Voir le service',
    dansQuellesCliniques: 'Dans quels cabinets',
    pratiqueA: (lieu: string) => `Ce soin à ${lieu}`,
    pageGenerale: 'Tout savoir sur ce soin',
    autresServices: 'Les autres soins du cabinet',
    h1DansLeCabinet: (titreDuSoin: string, lieu: string) => `${titreDuSoin} à ${lieu}`,
    descriptionDansLeCabinet: (h1: string, lieu: string, telephone: string) =>
      `${h1} : tarifs du cabinet, rendez-vous et explication du soin. Vetmint ${lieu}, ${telephone}.`,
    rechercheDansLeCabinet: (nom: string, lieu: string) => `${nom.toLowerCase()} ${lieu}`,
    infosPratiques: (lieu: string) => `Infos pratiques à ${lieu}`,
    ouSeTrouve: (lieu: string) => `Où se trouve le cabinet Vetmint ${lieu}\u00a0?`,
    adresseDuCabinet: (rue: string, npa: string, localite: string) => `Le cabinet se trouve ${aLaRue(rue)}, ${npa} ${localite}.`,
    quiPratique: (enPhrase: string, lieu: string) => `Qui pratique ${enPhrase} à ${lieu}\u00a0?`,
    veterinairesDuCabinet: (noms: string, nombre: number) => `${nombre > 1 ? 'Les vétérinaires du cabinet' : 'Le vétérinaire du cabinet'}\u00a0: ${noms}.`,
    estProche: 'Le cabinet est-il proche de chez moi\u00a0?',
    clientsDuCabinet: (localite: string, communes: string) => `Ses clients viennent ${deLaLocalite(localite)} et des environs\u00a0: ${communes}.`,
    commentPrendreRendezVous: (enPhrase: string) => `Comment prendre rendez-vous pour ${enPhrase}\u00a0?`,
    rendezVousParTelephone: (telephone: string, whatsapp: string) =>
      `Appelez le ${telephone}${whatsapp ? `, écrivez sur WhatsApp au ${whatsapp}` : ''} ou réservez en ligne avec le bouton «\u00a0Prendre rendez-vous\u00a0».`,
    memeNumero: 'même numéro',
    prixA: (lieu: string) => `Le prix à ${lieu}`,
    prestation: 'Prestation',
    prix: 'Prix',
    prixSelonLesExamens: 'Le prix dépend des examens choisis : le vétérinaire vous l’annonce avant de commencer.',
    tousLesTarifs: 'Tous les tarifs du cabinet',
    enBref: 'Le soin en bref',
    toutLire: (enPhrase: string) => `Tout lire sur ${enPhrase}`,
    replier: 'Replier le texte',
    ouverture: 'Ouverture du texte…',
  },

  conseils: {
    tous: 'Tous les conseils',
    minutes: (n: number) => `${n} min de lecture`,
    aLireAussi: 'À lire aussi',
  },

  cliniques: {
    trouver: 'Trouver son cabinet',
    pages: 'La page de chaque cabinet',
    carte: 'Carte des huit cabinets Vetmint en Suisse romande',
  },

  erreur: {
    titre: 'Cette page n’existe pas',
    texte: 'L’adresse a peut-être changé. Voici les pages les plus demandées.',
  },

  tableau: {
    nom: 'Tableau',
  },
};
