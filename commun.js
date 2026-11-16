/* commun.js — petites fonctions partagées par toutes les pages */

// Affiche un court message de confirmation en bas de l'écran
function lgvToast(message) {
    var toast = document.querySelector('.lgv-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'lgv-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
        toast.classList.remove('is-visible');
    }, 2600);
}

// Année du copyright toujours à jour
document.querySelectorAll('.copyright').forEach(function (el) {
    el.innerHTML = el.innerHTML.replace(/©\s*20\d\d|&copy;\s*20\d\d/, '© ' + new Date().getFullYear());
});
