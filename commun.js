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


// Filet de sécurité : si une image optimisée (.webp) manque sur le serveur,
// on affiche l'image d'origine à la place.
var LGV_REPLI = {
    "images/produit-polo-a1.webp": "images/A1.png",
    "images/produit-polo-a2.webp": "images/A2.png",
    "images/about.webp": "images/About.jpg",
    "images/produit-casquette-2.webp": "images/CASQUET 2.png",
    "images/produit-casquette.webp": "images/CASQUET.png",
    "images/cem2-meckhe.webp": "images/CEM2.jpg",
    "images/mains-unies.webp": "images/JUA.jpg",
    "images/membres.webp": "images/Membres.png",
    "images/missions.webp": "images/Missions.png",
    "images/projet1.webp": "images/Projet1.png",
    "images/set-settal-illustration.webp": "images/SEttalii.png",
    "images/set-aka-settalii.webp": "images/Set aka settalii.png",
    "images/produit-carte-1.webp": "images/carte 1.jpg",
    "images/produit-carte-2.webp": "images/carte 2.jpg",
    "images/demonstration.webp": "images/demonstration-4891275_1280.jpg",
    "images/expression.webp": "images/expression-4513446_1280.jpg",
    "images/hero-image.webp": "images/hero-image.jpg",
    "images/march-for-science.webp": "images/march-for-science-2252980_1280.jpg",
    "images/illustration-plage.webp": "images/openart-image_RATO-nbk_1746137033339_raw.jpg",
    "images/planting.webp": "images/planting-1898946_1280.jpg",
    "images/volunteer.webp": "images/volunteer-7788809_1280.jpg",
    "images/nature.webp": "images/nature-3294632_1280.jpg",
    "images/logo-clean-school.webp": "images/Logo Clean'School sans fond blanc.png",
    "images/logo-lagenes.webp": "images/aev.png",
    "images/favicon.png": "images/aev.png"
};
function lgvRepli(img) {
    var src = img.getAttribute('src');
    if (img.dataset.repli || !LGV_REPLI[src]) return;
    img.dataset.repli = '1';
    img.removeAttribute('srcset');
    img.src = LGV_REPLI[src];
}
document.addEventListener('error', function (e) {
    if (e.target && e.target.tagName === 'IMG') lgvRepli(e.target);
}, true);
Array.prototype.forEach.call(document.images, function (img) {
    if (img.complete && img.naturalWidth === 0) lgvRepli(img);
});

// Même filet de sécurité pour les images de fond définies en CSS
(function () {
    var vus = {};
    Array.prototype.forEach.call(document.querySelectorAll('body *'), function (el) {
        var bg = getComputedStyle(el).backgroundImage;
        if (!bg || bg.indexOf('.webp') === -1) return;
        var m = bg.match(/images\/[^"')]+\.webp/);
        if (!m || !LGV_REPLI[m[0]]) return;
        var cle = m[0];
        (vus[cle] = vus[cle] || []).push({ el: el, bg: bg });
    });
    Object.keys(vus).forEach(function (cle) {
        var test = new Image();
        test.onerror = function () {
            vus[cle].forEach(function (o) {
                o.el.style.backgroundImage = o.bg.split(cle).join(LGV_REPLI[cle]);
            });
        };
        test.src = cle;
    });
})();
