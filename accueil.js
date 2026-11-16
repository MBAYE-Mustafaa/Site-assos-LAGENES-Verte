/* accueil.js — interactions de la page d'accueil */
(function () {
    var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. LAGENES se retourne en SENEGAL ---------- */
    var mot = document.getElementById('retourne');
    if (mot) {
        setTimeout(function () { mot.classList.add('est-retourne'); }, reduit ? 0 : 900);
        mot.addEventListener('click', function () {
            mot.classList.toggle('est-retourne');
        });
    }

    /* ---------- 2. Menu : se replie après un clic (mobile) ---------- */
    if (window.jQuery) {
        jQuery('.navbar-nav > li > a:not(.dropdown-toggle), .nav-don').on('click', function () {
            jQuery('.navbar-collapse').collapse('hide');
        });
    }

    /* ---------- 3. Don : la barrique qui se remplit ---------- */
    var PRIX_POUBELLE = 28000;          // 196 000 FCFA / 7 poubelles (bilan 2023-2024)
    var MAX_BARRIQUES = 6;
    var NUMERO = '+221762147078';

    var rangee = document.getElementById('rangeeBarriques');
    var texte = document.getElementById('texteBarriques');
    var libre = document.getElementById('montantLibre');
    var radios = document.querySelectorAll('input[name="montant"]');
    var confirmer = document.getElementById('confirmerDon');
    var copier = document.getElementById('copierNumero');
    if (!rangee) return;

    var compteur = 0;

    function fcfa(n) {
        return n.toLocaleString('fr-FR').replace(/ | /g, ' ') + ' FCFA';
    }

    function barrique(remplissage, petite) {
        // remplissage : 0 à 1
        var h = 150, w = 112;
        var forme = 'M14 10 Q8 75 14 140 L98 140 Q104 75 98 10 Z';
        var id = 'barrique-' + (compteur++);
        return '' +
            '<svg class="barrique' + (petite ? ' barrique--petite' : '') + '" viewBox="0 0 ' + w + ' ' + h + '">' +
            '<defs><clipPath id="' + id + '"><path d="' + forme + '"/></clipPath></defs>' +
            '<path class="barrique__fond" d="' + forme + '"/>' +
            '<g clip-path="url(#' + id + ')">' +
            '<rect class="barrique__remplissage" x="0" y="10" width="' + w + '" height="130" style="transform: scaleY(' + remplissage.toFixed(3) + ')"/>' +
            '</g>' +
            '<path class="barrique__bord" d="M14 10 Q8 75 14 140 L98 140 Q104 75 98 10 Z"/>' +
            '<path class="barrique__cerclage" d="M11 45 Q56 51 101 45 M11 105 Q56 111 101 105"/>' +
            '<g class="barrique__picto" transform="translate(56 76)">' +
            '<path d="M-9 -12 h18 l-2 24 h-14 z M-12 -16 h24 v3 h-24 z M-4 -19 h8 v3 h-8 z"/>' +
            '</g>' +
            '</svg>';
    }

    function montantChoisi() {
        var v = parseInt(libre.value, 10);
        if (v > 0) return v;
        var r = document.querySelector('input[name="montant"]:checked');
        return r ? parseInt(r.value, 10) : 0;
    }

    function maj() {
        var montant = montantChoisi();
        var pleines = Math.floor(montant / PRIX_POUBELLE);
        var reste = (montant % PRIX_POUBELLE) / PRIX_POUBELLE;

        // Dessin : barriques pleines + une barrique partielle
        var html = '';
        var nb = Math.min(pleines, MAX_BARRIQUES);
        var petite = pleines + (reste > 0 ? 1 : 0) > 3;
        for (var i = 0; i < nb; i++) html += barrique(1, petite);
        if (pleines < MAX_BARRIQUES && (reste > 0 || pleines === 0)) html += barrique(reste, petite);
        rangee.innerHTML = html;

        // Le remplissage s'anime à partir de zéro
        if (!reduit) {
            var rects = rangee.querySelectorAll('.barrique__remplissage');
            rects.forEach(function (r) {
                var cible = r.style.transform;
                r.style.transform = 'scaleY(0)';
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () { r.style.transform = cible; });
                });
            });
        }

        // Phrase
        var phrase;
        if (!montant) {
            phrase = 'Choisissez un montant.';
        } else if (pleines === 0) {
            phrase = '<strong>' + fcfa(montant) + '</strong>, c\'est ' + Math.max(1, Math.round(reste * 100)) + ' % d\'une poubelle pour une école.';
        } else {
            phrase = '<strong>' + fcfa(montant) + '</strong>, c\'est ' + (pleines > 1 ? pleines + ' poubelles pour nos écoles' : '1 poubelle complète pour une école');
            phrase += reste > 0 ? ', et ' + Math.round(reste * 100) + ' % de la suivante.' : '.';
        }
        texte.innerHTML = phrase;

        // Message WhatsApp prérempli
        var msg = 'Bonjour LAGENES Verte, je viens de faire un don' +
            (montant ? ' de ' + fcfa(montant) : '') + ' (message « DON LAGENES »).';
        confirmer.href = 'https://wa.me/221762147078?text=' + encodeURIComponent(msg);
        confirmer.querySelector('span').textContent = montant ? 'Confirmer mon don de ' + fcfa(montant) : 'Confirmer mon don';
    }

    radios.forEach(function (r) {
        r.addEventListener('change', function () { libre.value = ''; maj(); });
    });
    libre.addEventListener('input', function () {
        if (libre.value) radios.forEach(function (r) { r.checked = false; });
        maj();
    });

    copier.addEventListener('click', function () {
        var ok = function () {
            copier.textContent = 'Numéro copié';
            if (window.lgvToast) lgvToast('Numéro copié : collez-le dans Orange Money ou Wave');
            setTimeout(function () { copier.textContent = 'Copier le numéro'; }, 2500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(NUMERO).then(ok, function () { lgvToast('Numéro : +221 76 214 70 78'); });
        } else {
            lgvToast('Numéro : +221 76 214 70 78');
        }
    });

    maj();
})();
