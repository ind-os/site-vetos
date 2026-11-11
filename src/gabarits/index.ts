// Le gabarit de chaque type de page (docs/plan-des-pages.md). Le type est le champ `type` de l'en-tête
// d'une page Markdown. Pour changer la mise en page d'un type, on modifie son gabarit ; pour
// ajouter un type, on l'ajoute ici et dans src/lib/types-de-page.ts. Chaque gabarit reçoit le
// contexte de la page (src/lib/contexte.ts) dans sa prop `contexte`.

import type { TypeDePage } from '../lib/types-de-page.ts';
import AccueilClinique from './AccueilClinique.astro';
import AccueilGroupe from './AccueilGroupe.astro';
import Cliniques from './Cliniques.astro';
import Conseil from './Conseil.astro';
import ConseilIndex from './ConseilIndex.astro';
import Contact from './Contact.astro';
import Emploi from './Emploi.astro';
import Equipe from './Equipe.astro';
import QuestionsFrequentes from './QuestionsFrequentes.astro';
import RendezVous from './RendezVous.astro';
import Service from './Service.astro';
import ServiceClinique from './ServiceClinique.astro';
import ServicesClinique from './ServicesClinique.astro';
import Simple from './Simple.astro';
import Urgences from './Urgences.astro';
import UrgencesGroupe from './UrgencesGroupe.astro';

export const GABARITS: Record<TypeDePage, typeof Simple> = {
  'accueil-groupe': AccueilGroupe,
  cliniques: Cliniques,
  'service-index': Simple,
  service: Service,
  'urgences-groupe': UrgencesGroupe,
  'conseil-index': ConseilIndex,
  'conseil-categorie': ConseilIndex,
  conseil: Conseil,
  simple: Simple,
  emploi: Emploi,
  'accueil-clinique': AccueilClinique,
  'services-clinique': ServicesClinique,
  equipe: Equipe,
  contact: Contact,
  tarifs: Simple,
  'rendez-vous': RendezVous,
  'questions-frequentes': QuestionsFrequentes,
  abonnements: Simple,
  urgences: Urgences,
  'service-clinique': ServiceClinique,
};
