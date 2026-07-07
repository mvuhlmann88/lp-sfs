/* ============================================================
   PALMASNET — LP SÃO FRANCISCO DO SUL
   assets/js/main.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Config ────────────────────────────────────────────── */
  const WA_NUMBER = '554734442071';
  const WA_MESSAGE = encodeURIComponent(
    'Olá! Vim pela página de São Francisco do Sul e quero contratar a internet da Palmasnet. Pode me ajudar?'
  );
  const WA_BASE = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

  /* ── Webhook Make ───────────────────────────────────────── */
  var WEBHOOK_URL = 'https://hook.us2.make.com/fucn49frlfm2s8qll4kvr9op95dvzcez';

  /* ── Captura UTMs da URL ────────────────────────────────── */
  var urlParams   = new URLSearchParams(window.location.search);
  var utmSource   = urlParams.get('utm_source')   || '';
  var utmMedium   = urlParams.get('utm_medium')   || '';
  var utmCampaign = urlParams.get('utm_campaign') || '';
  var utmContent  = urlParams.get('utm_content')  || '';
  var utmTerm     = urlParams.get('utm_term')     || '';

  /* ── Plano clicado ──────────────────────────────────────── */
  var planoclicado = '';

  /* ── Popup lead ── */
  var overlay  = document.getElementById('lead-overlay');
  var form     = document.getElementById('lead-form');
  var success  = document.getElementById('lead-success');
  var submit   = document.getElementById('lead-submit');
  var closeBtn = document.getElementById('lead-close');

  /* ── Máscara telefone ── */
  document.getElementById('lead-tel').addEventListener('input', function () {
    var v = this.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else {
      v = v.replace(/^(\d*)/, '($1');
    }
    this.value = v;
  });

  function openPopup(plano) {
    planoclicado = plano || '';
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    form.reset();
    form.style.display = '';
    success.style.display = 'none';
    submit.disabled = true;
    planoclicado = '';
  }

  // Abre popup em todos os botões CTA — captura data-plano se existir
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var plano = this.getAttribute('data-plano') || '';
      openPopup(plano);
    });
  });

  // Fecha ao clicar fora ou no X
  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closePopup();
  });

  // Fecha com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  // Habilita botão quando nome e telefone estiverem preenchidos
  function checkFields() {
    var nome = document.getElementById('lead-nome').value.trim();
    var tel  = document.getElementById('lead-tel').value.trim();
    document.getElementById('lead-submit').disabled = !(nome && tel);
  }
  document.getElementById('lead-nome').addEventListener('input', checkFields);
  document.getElementById('lead-tel').addEventListener('input', checkFields);

  // Envio do formulário
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    ['lead-nome', 'lead-tel'].forEach(function (id) {
      var input = document.getElementById(id);
      if (!input.value.trim()) {
        input.classList.add('error');
        ok = false;
      } else {
        input.classList.remove('error');
      }
    });
    if (!ok) return;

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome:         document.getElementById('lead-nome').value.trim(),
        whatsapp:     document.getElementById('lead-tel').value.trim(),
        cidade:       'São Francisco do Sul',
        plano:        planoclicado,
        utm_source:   utmSource,
        utm_medium:   utmMedium,
        utm_campaign: utmCampaign,
        utm_content:  utmContent,
        utm_term:     utmTerm
      })
    });

    form.style.display = 'none';
    success.style.display = 'block';
  });

  /* ── Sticky header ──────────────────────────────────────── */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Scroll reveal ──────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { observer.observe(el); });
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }, 800);
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── Stagger reveal for grid children ────────────────────── */
  document.querySelectorAll('.plans-grid, .benefits-grid, .testimonials-grid').forEach(function (grid) {
    var children = grid.querySelectorAll('.reveal');
    children.forEach(function (child, i) {
      child.style.transitionDelay = (i * 0.1) + 's';
    });
  });

})();