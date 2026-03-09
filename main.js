const API_BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';

let allIssues = [];
let currentFilter = 'all';

// ===== LOAD ALL ISSUES =====
async function loadIssues() {
  showSpinner();
  try {
    const res = await fetch(`${API_BASE}/issues`);
    const json = await res.json();
    allIssues = json.data;
    renderIssues(allIssues);
  } catch (err) {
    console.error('Error loading issues:', err);
  } finally {
    hideSpinner();
  }
}

// ===== FILTER =====
function filterIssues(type) {
  currentFilter = type;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`tab-${type}`).classList.add('active');

  if (type === 'all') {
    renderIssues(allIssues);
  } else {
    renderIssues(allIssues.filter(issue => issue.status === type));
  }
}

// ===== SEARCH =====
async function handleSearch() {
  const query = document.getElementById('searchInput').value.trim();
  if (!query) { renderIssues(allIssues); return; }

  showSpinner();
  try {
    const res = await fetch(`${API_BASE}/issues/search?q=${encodeURIComponent(query)}`);
    const json = await res.json();
    renderIssues(json.data);
  } catch (err) {
    console.error('Search error:', err);
  } finally {
    hideSpinner();
  }
}

// Enter key for search
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch();
});

// ===== RENDER ISSUES =====
function renderIssues(issues) {
  const grid = document.getElementById('issuesGrid');
  const countEl = document.getElementById('issueCount');

  countEl.textContent = `${issues.length} Issues`;

  if (!issues || issues.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>No issues found</h3>
        <p>Try a different search or filter.</p>
      </div>`;
    return;
  }

  grid.innerHTML = issues.map(issue => createCardHTML(issue)).join('');
}

// ===== CREATE CARD HTML =====
function createCardHTML(issue) {
  const statusIcon = issue.status === 'open'
    ? './assets/Open-Status.png'
    : './assets/Closed-Status.png';

  const labelsHTML = issue.labels.map(label => {
    return `<span class="label-tag ${getLabelClass(label)}">${label}</span>`;
  }).join('');

  const createdDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
    month: 'numeric', day: 'numeric', year: 'numeric'
  });

  const updatedDate = new Date(issue.updatedAt).toLocaleDateString('en-US', {
    month: 'numeric', day: 'numeric', year: 'numeric'
  });

  return `
    <div class="issue-card ${issue.status}" onclick="openModal(${issue.id})">
      <div class="card-top">
        <img src="${statusIcon}" alt="${issue.status}" class="card-status-icon" />
        <span class="priority-badge priority-${issue.priority}">${issue.priority.toUpperCase()}</span>
      </div>
      <h3 class="card-title">${issue.title}</h3>
      <p class="card-description">${issue.description}</p>
      <div class="card-labels">${labelsHTML}</div>
      <div class="card-footer">
        <div class="footer-top">
          <span>#${issue.id} by <span class="card-author">${issue.author}</span></span>
          <span>Created: ${createdDate}</span>
        </div>
        <div class="footer-bottom">
          <span>Assignee: <strong>${issue.assignee || 'Unassigned'}</strong></span>
          <span>Updated: ${updatedDate}</span>
        </div>
      </div>
    </div>`;
}

// ===== LABEL CLASS =====
function getLabelClass(label) {
  if (label.includes('bug')) return 'label-bug';
  if (label.includes('enhancement')) return 'label-enhancement';
  if (label.includes('documentation')) return 'label-documentation';
  if (label.includes('help')) return 'label-help';
  if (label.includes('good')) return 'label-good';
  return 'label-default';
}

// ===== OPEN MODAL =====
async function openModal(id) {
  try {
    const res = await fetch(`${API_BASE}/issue/${id}`);
    const json = await res.json();
    const issue = json.data;

    document.getElementById('modalTitle').textContent = issue.title;
    document.getElementById('modalDescription').textContent = issue.description;
    document.getElementById('modalAssignee').textContent = issue.assignee || 'Unassigned';
    document.getElementById('modalPriority').innerHTML =
      `<span class="priority-badge priority-${issue.priority}">${issue.priority.toUpperCase()}</span>`;

    const statusEl = document.getElementById('modalStatus');
    statusEl.textContent = issue.status.toUpperCase();
    statusEl.className = `modal-status-badge ${issue.status}`;

    const date = new Date(issue.createdAt).toLocaleDateString('en-US', {
      month: '2-digit', day: '2-digit', year: 'numeric'
    });
    document.getElementById('modalOpened').textContent = `Opened by ${issue.author} • ${date}`;

    const labelsHTML = issue.labels.map(label => {
      return `<span class="label-tag ${getLabelClass(label)}">${label}</span>`;
    }).join('');
    document.getElementById('modalLabels').innerHTML = labelsHTML;

    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';

  } catch (err) {
    console.error('Modal error:', err);
  }
}

// ===== CLOSE MODAL =====
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===== SPINNER =====
function showSpinner() {
  document.getElementById('spinner')?.classList.remove('hidden');
  document.getElementById('issuesGrid').innerHTML = '';
}

function hideSpinner() {
  document.getElementById('spinner')?.classList.add('hidden');
}

// ===== INIT =====
loadIssues();