# Novalem — site vitrine

Site statique, un seul fichier HTML. Aucune dépendance, aucun build.

## Déployer sur Vercel

1. Sur GitHub, crée un dépôt vide nommé `novalem-site`.
2. Glisse tous les fichiers de ce dossier dedans (bouton **Add file → Upload files**), puis **Commit**.
3. Sur vercel.com → **Add New → Project → Import** le dépôt.
4. Framework Preset : **Other**. Ne touche à rien d'autre. **Deploy**.
5. Tu obtiens une URL du type `novalem-site.vercel.app`. C'est ton aperçu.

Chaque fois que tu pousses sur GitHub, Vercel redéploie tout seul en ~20 secondes.

## Brancher le domaine (plus tard, quand il sera acheté)

Vercel → Project → Settings → Domains → ajoute le domaine.
Vercel te donne deux enregistrements à créer chez OVH (zone DNS) :

- un **A** pour la racine, vers l'IP indiquée par Vercel
- un **CNAME** pour `www`, vers `cname.vercel-dns.com`

**Ne touche pas aux enregistrements MX**, sinon les e-mails du domaine cessent de fonctionner.

Ensuite, remplace `VOTRE-DOMAINE.fr` dans `robots.txt` et `sitemap.xml`.

---

## À remplir avant de montrer le site

### 1. Coordonnées — un seul endroit

Ouvre `index.html`, cherche `var CONFIG` (vers la fin, dans le `<script>`) :

```js
var CONFIG = {
  telephone : '0690000000',       // s'affiche tel quel
  whatsapp  : '590690000000',     // international, SANS le +
  email     : 'contact@novalem.fr',
  siret     : '000 000 000 00000'
};
```

Ces quatre valeurs alimentent le bloc contact, le pied de page et le bouton
« Envoyer sur WhatsApp ». Rien d'autre à modifier ailleurs.

Pour le WhatsApp : indicatif Guadeloupe **590** + ton numéro sans le 0 initial.
Exemple : `0690 12 34 56` devient `590690123456`.

### 2. Ta photo

Section « Qui je suis ». Dépose ton portrait dans le dossier, puis remplace :

```html
<p class="portrait__vide">Photo<br>à insérer</p>
```

par :

```html
<img src="/louis.jpg" alt="Louis, fondateur de Novalem">
```

Format portrait, 800x1000 px environ, compressée en WebP ou JPEG sous 200 Ko.

### 3. Les captures des réalisations

Pour l'instant chaque réalisation affiche un bloc de couleur avec le nom
du client. Ça tient très bien tel quel. Quand tu auras les vraies captures,
remplace dans chaque carte :

```html
<div class="travail__vue" style="background:linear-gradient(...)"><span>IFC</span></div>
```

par :

```html
<div class="travail__vue"><img src="/apercu-ifc.jpg" alt="Site Ice Fruits Chocolate"></div>
```

Ajoute cette règle dans le `<style>` si tu passes aux images :

```css
.travail__vue img{width:100%;height:100%;object-fit:cover;object-position:top}
```

### 4. Les liens des réalisations

`Love Dog's` et `Focus Moto` pointent vers `#contact` en attendant leur mise
en ligne. Remplace par les vraies URL et change le texte
« Bientôt en ligne » en « nom-du-site.fr ».

### 5. Mentions légales

Le lien du pied de page ne mène nulle part. Crée un fichier
`mentions-legales.html` et pointe dessus. C'est une obligation légale
dès que le site est en ligne sur ton domaine.

---

## Si le nom de marque change

`Novalem` apparaît en clair dans `index.html`. Un rechercher/remplacer
suffit, plus le `<title>`, la description et le `favicon.svg`.

---

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | tout le site : structure, styles, scripts |
| `favicon.svg` | icône affichée dans l'onglet du navigateur |
| `vercel.json` | URLs propres et en-têtes de sécurité |
| `robots.txt` | autorise Google à indexer le site |
| `sitemap.xml` | liste des pages pour Google |
| `.gitignore` | fichiers à ne pas envoyer sur GitHub |
