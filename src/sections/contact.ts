/**
 * contact.ts — formulaire FormSubmit (contact@studionovalem.fr).
 * Amelioration progressive : le formulaire poste nativement vers FormSubmit
 * (fonctionne sans JS). Ici on ajoute un envoi AJAX + etats de retour.
 */
const ENDPOINT = "https://formsubmit.co/ajax/contact@studionovalem.fr";

export function initContact(): void {
  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  if (!form) return;

  const status = form.querySelector<HTMLElement>(".form__status");
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!submit) return;

    const setStatus = (msg: string, kind: "ok" | "err" | "load") => {
      if (!status) return;
      status.textContent = msg;
      status.dataset.kind = kind;
    };

    submit.disabled = true;
    submit.dataset.loading = "true";
    setStatus("Envoi en cours…", "load");

    try {
      const data = new FormData(form);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("Merci, message bien reçu. Réponse sous 48 h.", "ok");
    } catch {
      // repli : proposer le mail direct si l'AJAX echoue
      setStatus(
        "Envoi impossible pour le moment. Écrivez-moi à contact@studionovalem.fr.",
        "err"
      );
    } finally {
      submit.disabled = false;
      submit.dataset.loading = "false";
    }
  });
}
