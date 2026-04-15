// ==============================
// TABS
// ==============================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ==============================
// ONGLET 1 : INIT
// ==============================
window.onload = function () {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
  document.getElementById('ticket-date').value = today;

  loadBalances();
  loadHistorique();
  initToggleHistorique();
  initTicket();
};

// ==============================
// ONGLET 1 : BALANCES
// ==============================
function loadBalances() {
  fetch('/total')
    .then(r => r.json())
    .then(data => {
      let totalLola = 0, totalDavid = 0;
      data.forEach(item => {
        if (item._id === 'Lola') totalLola = item.totalSomme;
        if (item._id === 'David') totalDavid = item.totalSomme;
      });

      const lolaEl = document.getElementById('lola');
      const davidEl = document.getElementById('david');
      const lolaCard = document.getElementById('p-sommeDu-lola');
      const davidCard = document.getElementById('p-sommeDu-david');

      // reset styles
      lolaCard.style.borderColor = '';
      davidCard.style.borderColor = '';

      if (totalLola > totalDavid) {
        const diff = Math.round((totalLola - totalDavid) * 100) / 100;
        lolaEl.innerText = `Lola est zen !`;
        davidEl.innerText = `David doit : ${diff.toFixed(2)} €`;
        davidCard.style.borderColor = 'var(--danger)';
      } else if (totalDavid > totalLola) {
        const diff = Math.round((totalDavid - totalLola) * 100) / 100;
        davidEl.innerText = `David est zen !`;
        lolaEl.innerText = `Lola doit : ${diff.toFixed(2)} €`;
        lolaCard.style.borderColor = 'var(--danger)';
      } else {
        lolaEl.innerText = `Tout est égal !`;
        davidEl.innerText = `On est bien !!`;
      }
    })
    .catch(err => console.error('Erreur balances:', err));
}

// ==============================
// ONGLET 1 : HISTORIQUE
// ==============================
function loadHistorique() {
  // David's history → shows in historique-david container
  fetch('/historique/david')
    .then(r => r.json())
    .then(data => renderHistorique('historique-david', data))
    .catch(err => console.error(err));

  // Lola's history → shows in historique-lola container
  fetch('/historique/lola')
    .then(r => r.json())
    .then(data => renderHistorique('historique-lola', data))
    .catch(err => console.error(err));
}

function renderHistorique(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if (!data.length) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:1rem;text-align:center">Aucune entrée</p>';
    return;
  }
  data.forEach(entry => {
    const el = document.createElement('div');
    el.classList.add('historique-entry');
    el.innerHTML = `
      <p class="entry-date">${new Date(entry.date).toLocaleDateString('fr-FR')}</p>
      <p>${entry.description}</p>
      <p class="entry-somme">${parseFloat(entry.somme).toFixed(2)} €</p>
    `;
    container.appendChild(el);
  });
}

function initToggleHistorique() {
  const btn = document.getElementById('toggle-historique');
  const wrapper = document.getElementById('container-historique');
  btn.addEventListener('click', () => {
    const isOpen = wrapper.style.display === 'block';
    wrapper.style.display = isOpen ? 'none' : 'block';
    btn.classList.toggle('open', !isOpen);
    btn.textContent = isOpen ? '📋 Historique du mois' : '📋 Fermer l\'historique';
  });
}

// ==============================
// ONGLET 2 : TICKET
// ==============================
function initTicket() {
  const lines = []; // { label, price, split }

  const tbody = document.getElementById('ticket-body');
  const totalBrutEl = document.getElementById('total-brut');
  const totalFinalEl = document.getElementById('total-final');
  const addBtn = document.getElementById('add-line');
  const validateBtn = document.getElementById('validate-ticket');

  function recalc() {
    let brut = 0;
    let final = 0;
    lines.forEach(l => {
      brut += l.price;
      final += l.split ? l.price / 2 : l.price;
    });
    totalBrutEl.textContent = brut.toFixed(2) + ' €';
    totalFinalEl.textContent = final.toFixed(2) + ' €';
  }

  function renderTable() {
    // remove all rows except empty placeholder
    const existing = tbody.querySelectorAll('tr.line-row');
    existing.forEach(r => r.remove());

    const emptyRow = document.getElementById('ticket-empty');

    if (lines.length === 0) {
      emptyRow.style.display = '';
    } else {
      emptyRow.style.display = 'none';
      lines.forEach((line, idx) => {
        const tr = document.createElement('tr');
        tr.classList.add('line-row');
        tr.innerHTML = `
          <td>${line.label}</td>
          <td style="text-align:right">${line.price.toFixed(2)} €</td>
          <td style="text-align:center">${line.split ? '<span class="split-badge">÷2</span>' : '—'}</td>
          <td style="text-align:right">
            <button class="btn-delete" data-idx="${idx}">✕</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    recalc();

    // Bind delete buttons
    tbody.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        lines.splice(parseInt(btn.dataset.idx), 1);
        renderTable();
      });
    });
  }

  addBtn.addEventListener('click', () => {
    const labelInput = document.getElementById('line-label');
    const priceInput = document.getElementById('line-price');
    const splitInput = document.getElementById('line-split');

    const label = labelInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (!label || isNaN(price) || price <= 0) {
      priceInput.focus();
      priceInput.style.borderColor = 'var(--danger)';
      setTimeout(() => priceInput.style.borderColor = '', 1500);
      return;
    }

    lines.push({ label, price, split: splitInput.checked });
    labelInput.value = '';
    priceInput.value = '';
    splitInput.checked = false;
    labelInput.focus();
    renderTable();
  });

  // Allow Enter key on price field to add line
  document.getElementById('line-price').addEventListener('keydown', e => {
    if (e.key === 'Enter') addBtn.click();
  });
  document.getElementById('line-label').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('line-price').focus();
  });

  validateBtn.addEventListener('click', () => {
    const name = document.getElementById('ticket-name').value;
    const date = document.getElementById('ticket-date').value;
    const desc = document.getElementById('ticket-desc').value.trim();

    if (!name) {
      alert('Choisis qui a payé !');
      return;
    }
    if (!date) {
      alert('Choisis la date !');
      return;
    }
    if (lines.length === 0) {
      alert('Ajoute au moins une ligne !');
      return;
    }

    const somme = lines.reduce((acc, l) => acc + (l.split ? l.price / 2 : l.price), 0);
    const finalSomme = Math.round(somme * 100) / 100;

    const payload = new URLSearchParams({
      name,
      date,
      description: desc || 'Ticket de caisse',
      somme: finalSomme.toString()
    });

    fetch('/payement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
      redirect: 'follow'
    })
      .then(() => {
        // Reset ticket tab
        lines.length = 0;
        renderTable();
        document.getElementById('ticket-name').value = '';
        document.getElementById('ticket-desc').value = '';
        document.getElementById('ticket-date').value = new Date().toISOString().split('T')[0];

        // Switch to tab 1 and refresh balances
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelector('[data-tab="tab-paye"]').classList.add('active');
        document.getElementById('tab-paye').classList.add('active');

        loadBalances();
        loadHistorique();

        // alert(`✅ Enregistré : ${finalSomme.toFixed(2)} € pour ${name}`);
      })
      .catch(err => {
        console.error(err);
        alert('Erreur lors de l\'enregistrement');
      });
  });

  renderTable();
}
