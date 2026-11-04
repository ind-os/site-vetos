#!/usr/bin/env python3
"""Vérifie une page Markdown du site Vetmint contre la charte de rédaction (docs/charte-redactionnelle.md).

Usage : python3 -I outils/verifier-page.py [options] src/content/pages/fr/payerne/tarifs.md [autre.md ...]

Une page française passe tous les contrôles. Une page allemande (dossier de/) passe les contrôles
de forme (en-tête, title, description, titres, volume, liens d'appel, texte commun) ; les règles
de style, propres au français, ne s'appliquent pas.

Options :
  --comparer DOSSIER  dossier des autres pages à comparer (défaut : les pages de la même langue)
  --seuil N           part de texte commun tolérée, en pour cent (défaut : 20)
  --sans-doublons     ne pas mesurer le texte commun (plus rapide)

Contrôles : volume du corps selon le type de page, title, description, H1 unique,
niveaux de titres, orthographe de « vétérinaire », liens obligatoires, mots et
tournures interdits, phrases longues, passages sans intertitre, fait laissé
« [à préciser » dans le texte et part de texte commune (groupes de six mots) avec chaque autre
page de la même langue.

Code de sortie : 0 si aucune erreur, 1 sinon. Les alertes ne comptent pas comme des erreurs.

Python 3 standard, sans dépendance.
"""
import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

ICI = Path(__file__).resolve().parent
PAGES = ICI.parent / "src" / "content" / "pages"
TAILLE_BARDEAU = 6

# Fourchettes de mots par type de page.
VOLUMES = {
  "accueil-clinique": (900, 1400),
  "services-clinique": (70, 400),
  "equipe": (500, 1500),
  "urgences": (700, 1200),
  "contact": (400, 900),
  "rendez-vous": (250, 600),
  "questions-frequentes": (600, 1000),
  "tarifs": (500, 1300),
  "abonnements": (600, 1300),
  "service-clinique": (600, 1100),
  "service": (1200, 2100),
  "accueil-groupe": (700, 1000),
  "cliniques": (400, 1300),
  "urgences-groupe": (800, 2000),
  "conseil": (600, 1600),
  "simple": (200, 1800),
  "service-index": (250, 600),
  "conseil-index": (200, 500),
  "conseil-categorie": (150, 500),
}
# Les types de page d'une clinique : le fichier est dans <langue>/<clinique>/.
TYPES_CLINIQUE = {"accueil-clinique", "services-clinique", "equipe", "urgences", "contact", "rendez-vous", "questions-frequentes", "tarifs", "abonnements", "service-clinique"}

CLINIQUES = {
  "bussigny": "Bussigny",
  "chauxdefonds": "La Chaux-de-Fonds",
  "domdidier": "Domdidier",
  "fribourg": "Fribourg Ouest",
  "lacdejoux": "Lac-de-Joux",
  "payerne": "Payerne",
  "saintblaise": "Saint-Blaise",
  "saintlegier": "Saint-Légier",
}

# Liens obligatoires des pages françaises, par type : (libellé, expression régulière sur le href).
# « {c} » est remplacé par l'identifiant de la clinique de la page.
LIENS_OBLIGATOIRES = {
  "services-clinique": [
    ("rendez-vous", r"^/{c}/rendez-vous/$"), ("tarifs", r"^/{c}/tarifs/$"), ("téléphone", r"^tel:"),
  ],
  "accueil-clinique": [
    ("rendez-vous", r"^/{c}/rendez-vous/$"), ("équipe", r"^/{c}/equipe/$"), ("contact", r"^/{c}/contact/$"),
    ("urgences", r"^/{c}/urgences/$"), ("tarifs", r"^/{c}/tarifs/$"), ("une page de service de la clinique", r"^/{c}/services/"),
    ("téléphone", r"^tel:"),
  ],
  "equipe": [("rendez-vous", r"^/{c}/rendez-vous/$"), ("emploi", r"^/emploi/$")],
  "urgences": [
    ("téléphone de la clinique", r"^tel:\+41"), ("numéro de garde ou second numéro", r"^tel:"), ("contact", r"^/{c}/contact/$"),
    ("tarifs", r"^/{c}/tarifs/$"),
  ],
  "contact": [("rendez-vous", r"^/{c}/rendez-vous/$"), ("urgences", r"^/{c}/urgences/$"), ("téléphone", r"^tel:"), ("e-mail", r"^mailto:")],
  "rendez-vous": [("téléphone", r"^tel:"), ("urgences", r"^/{c}/urgences/$"), ("contact", r"^/{c}/contact/$")],
  "questions-frequentes": [("rendez-vous", r"^/{c}/rendez-vous/$")],
  "tarifs": [("abonnements", r"^/{c}/abonnements/$"), ("une page de service de la clinique", r"^/{c}/services/"), ("rendez-vous", r"^/{c}/rendez-vous/$")],
  "abonnements": [("tarifs", r"^/{c}/tarifs/$"), ("rendez-vous", r"^/{c}/rendez-vous/$")],
  "service-clinique": [
    ("page commune du service", r"^/services/[a-z-]+/$"), ("rendez-vous", r"^/{c}/rendez-vous/$"), ("tarifs", r"^/{c}/tarifs/$"),
  ],
  "service": [("cliniques", r"^/cliniques/$"), ("tarifs", r"^/tarifs/$")],
  "accueil-groupe": [("cliniques", r"^/cliniques/$"), ("conseils", r"^/conseils/"), ("emploi", r"^/emploi/$")],
  "conseil": [("une page de service", r"^/services/"), ("rendez-vous ou cliniques", r"^(/[a-z]+/rendez-vous/|/cliniques/)$"), ("un autre conseil", r"^/conseils/")],
}

# Tournures interdites par les règles d'écriture : erreur.
INTERDITS = [
  ("tiret cadratin", r"—"),
  ("tiret demi-cadratin", r"–"),
  ("virgule avant « et »", r",\s+et\s"),
  ("« permet de »", r"\bpermet(?:tent|tant|tra|trait)?\s+(?:de|d')\b"),
  ("point d'exclamation", r"!"),
]
# Mots et tournures à éviter (charte, section 2.3) : alerte.
A_EVITER = [
  ("méta-texte", r"\b(?:ci-dessous|ci-dessus|voici|voilà|cliquez|n'hésitez pas|découvrez|retrouvez|sur cette page|en trois points)\b"),
  ("connecteur soutenu", r"\b(?:néanmoins|toutefois|en outre|par ailleurs|il convient|force est de|notons que)\b"),
  ("mot de nouveauté ou de temps relatif", r"\b(?:désormais|dorénavant|dès maintenant|nouveauté|au lieu de|contrairement à avant|cette année)\b"),
  ("adjectif de valeur", r"\b(?:optimal|optimale|idéal|idéale|performant|performante|moderne|flambant neuf|dernier cri|à la pointe|innovant|innovante|unique|exceptionnel|exceptionnelle|exclusif|exclusive|supérieur|supérieure|le meilleur|la meilleure|talentueux|éminent|réputé|formidable|dévoué|dévoués|dévouée|passionné|passionnés|passionnée|qualitatif|qualitatifs)\b"),
  ("mot de remplissage", r"\b(?:philosophie|prise en charge|prodiguer|prodigue|proprement dite|dans les meilleurs délais|sérénité|convivial|conviviale|chaleureux|chaleureuse|bienveillant|bienveillante)\b"),
  ("anglicisme", r"\b(?:monitoring|microchip|check-up|online|update|team)\b"),
  ("périphrase animale", r"\b(?:quatre pattes|protégés|boule de poils|loulou|minette|toutou)\b"),
  ("slogan", r"Soigner\. Écouter\. Prévenir|vent de fra[iî]cheur|Protéger (?:&|et) Soigner"),
  ("points de suspension", r"\.\.\.|…"),
]
SIGLES = {"NAC", "CHF", "FIV", "FELV", "ANIS", "AMICUS", "CFF", "GST", "SVS", "PCR", "VHD", "RHD", "SMS", "TWINT", "IRM", "AMV", "CFC", "CEAV", "TTC", "AVS", "AOC", "TPF", "TL", "MBC", "CGN", "TRN", "TPC", "TPN", "VMCV", "ISME", "ECBU", "CPV", "FPV", "CHUV", "HCC"}

MOTIF_VETERINAIRE = re.compile(r"\b(v[eéè]t[eéè]rr?in+aires?)\b", re.IGNORECASE)
MOTIF_MARQUE = re.compile(r"\bVetMint\b|\bVETMINT\b|\bvetMint\b")
MOTIF_PRECISER = re.compile(r"\[(?:à|a|À|A) préciser[^\]]*\]")
MOTIF_LIEN = re.compile(r"(?<!!)\[([^\]]*)\]\(([^)\"]+?)(?:\s+\"[^\"]*\")?\)")
MOTIF_IMAGE = re.compile(r"!\[([^\]]*)\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)")
MOTIF_TITRE = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")

VILLES = [
  r"\bla chaux[- ]de[- ]fonds\b", r"\bchaux[- ]de[- ]fonds\b", r"\bfribourg[- ]ouest\b", r"\bfribourg\b", r"\bgivisiez\b",
  r"\blac[- ]de[- ]joux\b", r"\bl ?'?abbaye\b", r"\b(?:saint|st)[- ]blaise\b", r"\b(?:saint|st)[- ]legier(?:[- ]la[- ]chiesaz)?\b",
  r"\bbussigny\b", r"\bdomdidier\b", r"\bpayerne\b",
]


class Rapport:
  """Accumule erreurs, alertes et informations d'une page."""

  def __init__(self, chemin):
    self.chemin = chemin
    self.erreurs = []
    self.alertes = []
    self.infos = []

  def erreur(self, texte):
    self.erreurs.append(texte)

  def alerte(self, texte):
    self.alertes.append(texte)

  def info(self, texte):
    self.infos.append(texte)

  def imprimer(self):
    print(f"\n=== {self.chemin}")
    for ligne in self.infos:
      print(f"  i  {ligne}")
    for ligne in self.alertes:
      print(f"  A  {ligne}")
    for ligne in self.erreurs:
      print(f"  E  {ligne}")
    etat = "ERREURS" if self.erreurs else "PASSE"
    detail = f"{len(self.erreurs)} erreur(s), {len(self.alertes)} alerte(s)"
    print(f"  => {etat} ({detail})")


def lire_frontmatter(texte):
  """Lit un en-tête YAML simple : clés scalaires et listes à un niveau. Retourne (dict, corps)."""
  if not texte.startswith("---"):
    return None, texte
  fin = texte.find("\n---", 3)
  if fin < 0:
    return None, texte
  bloc = texte[3:fin].strip("\n")
  corps = texte[fin + 4:].lstrip("\n")
  donnees = {}
  cle_courante = None
  for brute in bloc.split("\n"):
    ligne = brute.rstrip()
    if not ligne.strip() or ligne.strip().startswith("#"):
      continue
    if ligne.startswith((" ", "\t")) and ligne.strip().startswith("- ") and cle_courante:
      donnees.setdefault(cle_courante, [])
      if not isinstance(donnees[cle_courante], list):
        donnees[cle_courante] = []
      donnees[cle_courante].append(nettoyer_valeur(ligne.strip()[2:]))
      continue
    m = re.match(r"^([A-Za-z_][\w-]*)\s*:\s*(.*)$", ligne)
    if not m:
      continue
    cle_courante = m.group(1)
    valeur = nettoyer_valeur(m.group(2))
    donnees[cle_courante] = valeur if valeur != "" else None
  return donnees, corps


def nettoyer_valeur(valeur):
  """Enlève guillemets et commentaire de fin de ligne d'une valeur YAML."""
  valeur = valeur.strip()
  if valeur.startswith('"') and valeur.count('"') >= 2:
    return valeur[1:valeur.rindex('"')]
  if valeur.startswith("'") and valeur.count("'") >= 2:
    return valeur[1:valeur.rindex("'")]
  valeur = re.sub(r"\s+#.*$", "", valeur)
  return valeur.strip()


def enlever_commentaires(corps):
  return re.sub(r"<!--.*?-->", "", corps, flags=re.DOTALL)


def texte_visible(markdown):
  """Transforme du Markdown en texte lisible : titres gardés, images retirées, liens réduits à leur texte."""
  lignes = []
  dans_code = False
  for ligne in markdown.split("\n"):
    if ligne.strip().startswith("```"):
      dans_code = not dans_code
      continue
    if dans_code:
      continue
    if re.match(r"^\s*\|?\s*:?-{3,}", ligne) and "|" in ligne:
      continue
    ligne = MOTIF_IMAGE.sub("", ligne)
    ligne = MOTIF_LIEN.sub(r"\1", ligne)
    ligne = re.sub(r"<[^>]+>", "", ligne)
    ligne = MOTIF_TITRE.sub(r"\2", ligne)
    ligne = re.sub(r"^\s*(?:[-*+]|\d+[.)])\s+", "", ligne)
    ligne = re.sub(r"^\s*>\s?", "", ligne)
    ligne = ligne.replace("|", " ")
    ligne = re.sub(r"[*_`]+", "", ligne)
    lignes.append(ligne)
  return "\n".join(lignes)


def compter_mots(texte):
  return len([t for t in re.split(r"\s+", texte) if re.search(r"[\w]", t)])


def normaliser(texte):
  """Minuscules, sans accents, sans ponctuation, villes remplacées par « ville »."""
  texte = unicodedata.normalize("NFKD", texte).encode("ascii", "ignore").decode()
  texte = texte.lower().replace("’", "'")
  for motif in VILLES:
    texte = re.sub(motif, " ville ", texte)
  texte = re.sub(r"[^a-z0-9]+", " ", texte)
  return texte.split()


def bardeaux(mots, taille=TAILLE_BARDEAU):
  return {" ".join(mots[i:i + taille]) for i in range(max(0, len(mots) - taille + 1))}


def phrases(texte):
  """Découpe en phrases, ligne par ligne, en protégeant quelques abréviations."""
  resultat = []
  for ligne in texte.split("\n"):
    ligne = ligne.strip()
    if not ligne:
      continue
    protegee = re.sub(r"\b(Dr|Dre|M|Mme|etc|p|ex|av|rte|ch)\.", r"\1<pt>", ligne)
    protegee = re.sub(r"(\d)\.(\d)", r"\1<pt>\2", protegee)
    for morceau in re.split(r"(?<=[.?!])\s+", protegee):
      morceau = morceau.replace("<pt>", ".").strip()
      if morceau:
        resultat.append(morceau)
  return resultat


def hrefs_normalises(corps):
  """Liste des cibles des liens du corps."""
  return [m.group(2).strip() for m in MOTIF_LIEN.finditer(corps)]


def verifier(chemin, autres_pages, seuil, mesurer_doublons):
  rapport = Rapport(chemin)
  try:
    texte = chemin.read_text(encoding="utf-8")
  except OSError as e:
    rapport.erreur(f"lecture impossible : {e}")
    return rapport

  fm, corps = lire_frontmatter(texte)
  if fm is None:
    rapport.erreur("en-tête YAML absent (le fichier doit commencer par ---)")
    fm = {}
  # Une valeur qui contient « : » s'écrit entre guillemets, sinon le YAML est invalide
  entete = texte.split("\n---", 1)[0]
  for num, ligne in enumerate(entete.split("\n"), 1):
    m = re.match(r"^\s*(?:- |[A-Za-z_][\w-]*:\s+)(.*)$", ligne)
    if m and ": " in m.group(1) and not m.group(1).startswith(('"', "'")):
      rapport.erreur(f"en-tête, ligne {num} : une valeur qui contient « : » se met entre guillemets")
  corps = enlever_commentaires(corps)

  # Langue, d'après le dossier du fichier ou l'adresse
  allemand = "/de/" in chemin.as_posix() or (fm.get("url") or "").startswith("/de/")

  # Frontmatter
  type_page = fm.get("type")
  if type_page not in VOLUMES:
    rapport.erreur(f"type de page inconnu : {type_page!r} (attendu : {', '.join(VOLUMES)})")
  clinique = fm.get("clinique")
  est_clinique = type_page in TYPES_CLINIQUE
  if est_clinique and clinique not in CLINIQUES:
    rapport.erreur(f"champ clinique absent ou inconnu : {clinique!r} (attendu : {', '.join(CLINIQUES)})")
  if not est_clinique and clinique:
    rapport.alerte(f"champ clinique renseigné ({clinique}) sur une page commune")
  for champ in ("url", "title", "description", "recherche", "redige_le"):
    if not fm.get(champ):
      rapport.erreur(f"champ {champ} absent du frontmatter")

  title = fm.get("title") or ""
  description = fm.get("description") or ""
  h1 = fm.get("h1") or title

  # Title
  lt = len(title)
  if lt > 60:
    rapport.erreur(f"title de {lt} caractères (60 au plus) : {title}")
  elif lt and lt < 20:
    rapport.alerte(f"title très court ({lt} caractères)")
  else:
    rapport.info(f"title : {lt} caractères")
  if est_clinique and clinique in CLINIQUES and CLINIQUES[clinique].lower() not in title.lower():
    rapport.erreur(f"le title ne contient pas « {CLINIQUES[clinique]} »")
  if not est_clinique and type_page and "vetmint" not in title.lower():
    rapport.alerte("le title d'une page commune ne contient pas « Vetmint »")

  # Description
  ld = len(description)
  if ld and (ld < 140 or ld > 165):
    rapport.erreur(f"description de {ld} caractères (150 à 160 attendus, 140 à 165 tolérés)")
  elif ld and (ld < 150 or ld > 160):
    rapport.alerte(f"description de {ld} caractères (150 à 160 visés)")
  elif ld:
    rapport.info(f"description : {ld} caractères")

  # Titres du corps
  titres = []
  for num, ligne in enumerate(corps.split("\n"), 1):
    m = MOTIF_TITRE.match(ligne)
    if m:
      titres.append((len(m.group(1)), m.group(2), num))
  h1_corps = [t for t in titres if t[0] == 1]
  nb_h1 = (1 if h1 else 0) + len(h1_corps)
  if nb_h1 != 1:
    rapport.erreur(f"{nb_h1} H1 (un seul attendu : le H1 vient du frontmatter, le corps n'en contient pas)")
  else:
    rapport.info(f"H1 : {h1}")
  niveau_precedent = 1
  for niveau, texte_titre, num in titres:
    if niveau > niveau_precedent + 1:
      rapport.erreur(f"saut de niveau de titre ligne {num} : H{niveau_precedent} puis H{niveau} « {texte_titre} »")
    niveau_precedent = niveau

  # Texte visible et volume
  visible = texte_visible(corps)
  visible_sans_marqueurs = MOTIF_PRECISER.sub(" ", visible)
  mots = compter_mots(visible_sans_marqueurs)
  if type_page in VOLUMES:
    bas, haut = VOLUMES[type_page]
    if allemand:
      bas, haut = int(bas * 0.8), int(haut * 1.3)
    if mots < bas or mots > haut:
      rapport.erreur(f"{mots} mots dans le corps, fourchette du type {type_page} : {bas} à {haut}")
    else:
      rapport.info(f"{mots} mots dans le corps (fourchette {bas} à {haut})")

  # Passages sans intertitre
  segments = re.split(r"^#{1,6}\s+.*$", corps, flags=re.MULTILINE)
  plus_long = 0
  for segment in segments:
    n = compter_mots(MOTIF_PRECISER.sub(" ", texte_visible(segment)))
    plus_long = max(plus_long, n)
  if plus_long > 300:
    rapport.alerte(f"un passage sans intertitre fait {plus_long} mots (300 au plus, un intertitre toutes les 200 à 300 mots)")

  # Phrases
  corps_sans_titres = re.sub(r"^#{1,6}\s+.*$", "", corps, flags=re.MULTILINE)
  liste_phrases = phrases(MOTIF_PRECISER.sub(" ", texte_visible(corps_sans_titres)))
  if liste_phrases:
    longueurs = [compter_mots(p) for p in liste_phrases]
    moyenne = sum(longueurs) / len(longueurs)
    longues = [(n, p) for n, p in zip(longueurs, liste_phrases) if n > 30]
    rapport.info(f"{len(liste_phrases)} phrases, {moyenne:.1f} mots en moyenne")
    for n, p in longues[:8]:
      rapport.alerte(f"phrase de {n} mots : « {p[:90]}… »")
    if moyenne > 20:
      rapport.alerte(f"phrases de {moyenne:.1f} mots en moyenne (20 visés)")

  # Orthographe et marque, sur tout le fichier
  h1_distinct = h1 if h1 != title else ""
  tout = f"{title}\n{description}\n{h1_distinct}\n{corps}"
  if allemand:
    fautes = []
  else:
    fautes = sorted({m.group(1) for m in MOTIF_VETERINAIRE.finditer(tout) if m.group(1).lower() not in ("vétérinaire", "vétérinaires")})
  if fautes:
    rapport.erreur(f"orthographe de « vétérinaire » : {', '.join(fautes)}")
  marques = sorted(set(MOTIF_MARQUE.findall(tout)))
  if marques:
    rapport.erreur(f"la marque s'écrit « Vetmint » : {', '.join(marques)}")

  # Tournures interdites et mots à éviter (hors URL des liens et hors marqueurs)
  texte_regles = MOTIF_PRECISER.sub(" ", f"{title}\n{description}\n{h1_distinct}\n{texte_visible(corps)}")
  for libelle, motif in ([] if allemand else INTERDITS):
    occurrences = re.findall(motif, texte_regles)
    if occurrences:
      exemples = extraits(texte_regles, motif)
      rapport.erreur(f"{libelle} ({len(occurrences)}) : {exemples}")
  for libelle, motif in ([] if allemand else A_EVITER):
    occurrences = re.findall(motif, texte_regles, flags=re.IGNORECASE)
    if occurrences:
      rapport.alerte(f"{libelle} ({len(occurrences)}) : {extraits(texte_regles, motif, re.IGNORECASE)}")
  nouveau = re.findall(r"\bnouveau\b|\bnouvelle\b|\bnouveaux\b|\bnouvelles\b", texte_regles, flags=re.IGNORECASE)
  nouveau_nac = re.findall(r"nouveaux animaux de compagnie", texte_regles, flags=re.IGNORECASE)
  if not allemand and len(nouveau) > len(nouveau_nac):
    rapport.alerte(f"« nouveau » ({len(nouveau) - len(nouveau_nac)}) hors « nouveaux animaux de compagnie » : vérifier qu'il ne date pas la page")
  capitales = sorted({m for m in re.findall(r"\b[A-ZÉÈÀÂÎÔÛÇ]{3,}\b", texte_regles) if m not in SIGLES})
  if capitales and not allemand:
    rapport.alerte(f"mots en capitales (sigles exceptés) : {', '.join(capitales[:10])}")

  # Faits laissés en blanc
  for m in MOTIF_PRECISER.finditer(tout):
    rapport.erreur(f"fait laissé en blanc : {m.group(0)} ; demande-le à la personne ou retire la phrase")

  # Recherche visée
  recherche = (fm.get("recherche") or "").strip()
  if recherche and not allemand:
    mots_recherche = set(normaliser_sans_villes(recherche))
    mots_title = set(normaliser_sans_villes(title))
    mots_debut = set(normaliser_sans_villes(" ".join(visible.split()[:160])))
    manquants_title = sorted(mots_recherche - mots_title)
    manquants_debut = sorted(mots_recherche - mots_debut)
    if manquants_title:
      rapport.alerte(f"mots de la recherche visée absents du title : {', '.join(manquants_title)}")
    if manquants_debut:
      rapport.alerte(f"mots de la recherche visée absents des 160 premiers mots : {', '.join(manquants_debut)}")

  # Liens
  cibles = hrefs_normalises(corps)
  fiche = ICI.parent / "src" / "donnees" / "cliniques" / f"{clinique}.json"
  sans_urgences = bool(clinique) and fiche.exists() and json.loads(fiche.read_text(encoding="utf-8")).get("urgences") is False
  for libelle, motif in ([] if allemand else LIENS_OBLIGATOIRES.get(type_page, [])):
    if sans_urgences and "urgences" in motif:
      continue
    motif = motif.replace("{c}", clinique or "")
    if not any(re.search(motif, c) for c in cibles):
      rapport.erreur(f"lien obligatoire absent : {libelle} ({motif})")
  if type_page == "urgences" and len({c for c in cibles if c.startswith("tel:")}) < 2:
    rapport.erreur("une page Urgences a au moins deux liens tel: distincts (clinique et garde)")
  for c in cibles:
    if c.startswith("tel:") and not re.match(r"^tel:(\+41\d{9}|0900\d{6}|0800\d{6}|0848\d{6})$", c):
      rapport.erreur(f"lien tel: mal formé : {c} (attendu tel:+41XXXXXXXXX ou tel:0900XXXXXX)")
    if c.startswith("http://"):
      rapport.alerte(f"lien en http:// : {c}")
    if c.startswith("/") and not c.split("#")[0].endswith("/"):
      rapport.alerte(f"lien interne sans barre oblique finale : {c}")
    if allemand and c.startswith("/") and not c.startswith("/de/"):
      rapport.erreur(f"lien vers une page française dans une page allemande : {c} (docs/traduction.md donne l'adresse allemande)")
    if not allemand and c.startswith("/de/"):
      rapport.erreur(f"lien vers une page allemande dans une page française : {c}")
  rapport.info(f"{len(cibles)} liens, dont {len([c for c in cibles if c.startswith('tel:')])} tel: et {len([c for c in cibles if c.startswith('/')])} vers le site")

  # Images
  for m in MOTIF_IMAGE.finditer(corps):
    if not m.group(1).strip():
      rapport.erreur(f"image sans texte alternatif : {m.group(2)}")

  # Texte commun
  if mesurer_doublons:
    mots_page = normaliser(visible_sans_marqueurs)
    b_page = bardeaux(mots_page)
    if len(b_page) < 20:
      rapport.alerte("page trop courte pour mesurer le texte commun")
    else:
      resultats = []
      for nom, texte_autre in autres_pages.items():
        b_autre = bardeaux(normaliser(texte_autre))
        commun = b_page & b_autre
        resultats.append((len(commun) / len(b_page) * 100, nom, commun))
      resultats.sort(key=lambda r: -r[0])
      for part, nom, commun in resultats[:5]:
        if part <= 0:
          continue
        rapport.info(f"texte commun avec {nom} : {part:.1f} %")
      for part, nom, commun in resultats:
        if part > seuil:
          exemples = " | ".join(sorted(commun)[:3])
          rapport.erreur(f"{part:.1f} % de texte commun avec {nom} (seuil {seuil} %). Exemples : {exemples}")
  return rapport


def normaliser_sans_villes(texte):
  texte = unicodedata.normalize("NFKD", texte).encode("ascii", "ignore").decode().lower()
  return re.sub(r"[^a-z0-9]+", " ", texte).split()


def extraits(texte, motif, drapeaux=0):
  morceaux = []
  for m in list(re.finditer(motif, texte, flags=drapeaux))[:3]:
    debut = max(0, m.start() - 25)
    fin = min(len(texte), m.end() + 25)
    morceaux.append("…" + texte[debut:fin].replace("\n", " ") + "…")
  return " ; ".join(morceaux)


def main():
  analyseur = argparse.ArgumentParser(description="Vérifie une page Markdown du site Vetmint contre la charte.")
  analyseur.add_argument("pages", nargs="+", type=Path)
  analyseur.add_argument("--comparer", type=Path, default=None)
  analyseur.add_argument("--seuil", type=float, default=20.0)
  analyseur.add_argument("--sans-doublons", action="store_true")
  args = analyseur.parse_args()

  def autres_pages_de(page):
    """Les autres pages de la même langue, par leur chemin relatif."""
    dossier = args.comparer or PAGES / ("de" if "/de/" in page.resolve().as_posix() else "fr")
    autres = {}
    if not args.sans_doublons and dossier.is_dir():
      for f in sorted(dossier.rglob("*.md")):
        if f.resolve() == page.resolve():
          continue
        fm, corps = lire_frontmatter(f.read_text(encoding="utf-8"))
        autres[f.relative_to(dossier).as_posix()] = texte_visible(enlever_commentaires(corps))
    return autres

  code = 0
  for page in args.pages:
    autres = autres_pages_de(page)
    rapport = verifier(page.resolve(), autres, args.seuil, not args.sans_doublons)
    rapport.imprimer()
    if rapport.erreurs:
      code = 1
  sys.exit(code)


if __name__ == "__main__":
  main()
