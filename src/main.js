import './style.css'
import mammoth from 'mammoth'
import confetti from 'canvas-confetti'
import anime from 'animejs'

// Application State
const state = {
  view: 'home', // 'home', 'faculty', 'student-join', 'student-quiz', 'result', 'link-gate'
  quiz: {
    title: 'Untitled Quiz',
    questions: [],
    timerMin: 10,
    facultyName: 'Professor',
    pin: '1234'
  },
  studentSession: {
    name: '',
    registerNo: '',
    startTime: null,
    answers: [],
    score: 0,
    timeRemaining: 0,
    fullscreenTried: false,
    violations: []
  }
}

// Storage keys
const VIOLATION_STORAGE_KEY = 'quizmaster_violations'
const RESULTS_STORAGE_KEY   = 'quizmaster_results'

// Global State cache for server logs to keep synchronous rendering
state.serverLogs = { results: [], violations: [] }

async function fetchFromServer() {
  try {
    const [rRes, vRes, sRes] = await Promise.all([
      fetch('/api/results'),
      fetch('/api/violations'),
      fetch('/api/status')
    ]);
    if (sRes.ok) {
      const status = await sRes.json();
      updateDBStatus(status.supabaseConnected);
    }
    if (rRes.ok) state.serverLogs.results = await rRes.json();
    if (vRes.ok) state.serverLogs.violations = await vRes.json();
  } catch (e) {
    console.warn("API Error", e);
    updateDBStatus(false);
  }
}

function updateDBStatus(connected) {
  const pill = document.getElementById('db-status-pill');
  if (!pill) return;
  if (connected) {
    pill.innerHTML = '<i class="fas fa-check-circle" style="color: var(--success);"></i> DB Connected';
    pill.style.borderColor = 'var(--success)';
  } else {
    pill.innerHTML = '<i class="fas fa-exclamation-triangle" style="color: var(--text-dim);"></i> Local Mode (No DB)';
    pill.style.borderColor = 'var(--glass-border)';
  }
}

function getResultsLog() {
  return state.serverLogs.results;
}

async function saveResult(entry) {
  state.serverLogs.results.push(entry);
  try {
    await fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
  } catch (e) { console.error("Error saving result", e) }
}

function getViolationLog() {
  return state.serverLogs.violations;
}

async function logViolation(type, detail) {
  const entry = {
    student: state.studentSession.name || 'Unknown',
    quiz: state.quiz.title,
    type,
    detail,
    time: new Date().toLocaleTimeString(),
    timestamp: Date.now()
  }

  // Store in session state
  state.studentSession.violations.push(entry)
  state.serverLogs.violations.push(entry)

  // Update violation counter badge if it exists
  const badge = document.getElementById('violation-badge')
  if (badge) {
    badge.textContent = state.studentSession.violations.length
    badge.style.display = 'inline-flex'
  }

  // Show animated violation banner
  showViolationBanner(type, detail)

  // Persist to backend server API
  try {
    await fetch('/api/violations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });
  } catch (e) { console.error("Error saving violation", e) }
}



function showViolationBanner(type, detail) {
  // Remove existing banner
  const existing = document.getElementById('violation-banner')
  if (existing) existing.remove()

  const icons = {
    'Screenshot Attempt': '📸',
    'Tab Switch': '🔄',
    'Split Screen': '⚡',
    'Window Blur': '👁️'
  }

  const banner = document.createElement('div')
  banner.id = 'violation-banner'
  banner.innerHTML = `
    <div class="violation-icon">${icons[type] || '⚠️'}</div>
    <div class="violation-body">
      <div class="violation-title">Security Violation: ${type}</div>
      <div class="violation-detail">${detail}</div>
      <div class="violation-note">⚠️ This incident has been reported to your teacher.</div>
    </div>
  `
  document.body.appendChild(banner)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    banner.classList.add('slide-out')
    setTimeout(() => banner.remove(), 400)
  }, 5000)
}

// UI Elements
const app = document.querySelector('#app')

// Router
function render() {
  app.innerHTML = ''
  
  // Background blobs
  const b1 = document.createElement('div')
  b1.className = 'blob'
  b1.style.top = '-10%'
  b1.style.left = '-10%'
  const b2 = document.createElement('div')
  b2.className = 'blob'
  b2.style.bottom = '-10%'
  b2.style.right = '-10%'
  b2.style.background = 'linear-gradient(135deg, #ec4899, #6366f1)'
  app.appendChild(b1)
  app.appendChild(b2)

  switch (state.view) {
    case 'home':
      renderHome()
      break
    case 'faculty':
      renderFaculty()
      break
    case 'student-join':
      renderStudentJoin()
      break
    case 'student-quiz':
      renderStudentQuiz()
      break
    case 'result':
      renderResult()
      break
    case 'link-gate':
      renderLinkGate()
      break
  }
}

function renderLinkGate() {
  const container = document.createElement('div')
  container.className = 'container fade-in'
  container.style.maxWidth = '600px'
  
  container.innerHTML = `
    <div class="glass-card" style="text-align: center;">
      <h2 style="margin-bottom: 1rem;"><i class="fas fa-link" style="color: var(--primary);"></i> Quiz Link Detected</h2>
      <p class="subtitle" style="margin-bottom: 2.5rem;">${state.quiz.title || 'Untitled Quiz'}</p>
      
      <div class="role-selector" style="grid-template-columns: 1fr; gap: 1.5rem;">
        <div class="role-btn" id="gate-student-btn" style="padding: 2rem;">
          <i class="fas fa-user-graduate" style="font-size: 2.5rem;"></i>
          <div>
            <h3>I am a Student</h3>
            <p>I want to join and take this exam.</p>
          </div>
        </div>
        
        <div class="role-btn" id="gate-faculty-btn" style="padding: 2rem; border-color: rgba(99, 102, 241, 0.2);">
          <i class="fas fa-chalkboard-teacher" style="font-size: 2.5rem; color: var(--text-dim);"></i>
          <div>
            <h3>I am the Teacher</h3>
            <p>I want to view settings and student reports.</p>
          </div>
        </div>
      </div>
      
      <button class="btn btn-outline" style="margin-top: 2rem; width: 100%;" id="gate-home-btn">
        <i class="fas fa-arrow-left"></i> Back to Main Menu
      </button>
    </div>
  `
  app.appendChild(container)

  document.getElementById('gate-student-btn').onclick = () => {
    state.view = 'student-join'
    render()
  }

  document.getElementById('gate-faculty-btn').onclick = () => {
    showPinModal(() => {
       state.view = 'faculty'
       render()
    })
  }

  document.getElementById('gate-home-btn').onclick = () => {
     window.location.hash = ''
     state.view = 'home'
     render()
  }
}

function showPinModal(onSuccess) {
  const modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = `
    <div class="modal-content glass-card fade-in" style="max-width: 400px;">
      <h2 style="margin-bottom: 1rem;"><i class="fas fa-lock" style="color: var(--secondary);"></i> Teacher Login</h2>
      <p style="color: var(--text-dim); margin-bottom: 2rem;">Please enter the 4-digit access PIN for this quiz.</p>
      
      <div class="form-group">
        <input type="password" id="entry-pin" placeholder="••••" maxlength="4" style="text-align: center; font-size: 2rem; letter-spacing: 0.5em; padding: 1rem;">
        <div id="pin-error" style="color: var(--error); font-size: 0.85rem; margin-top: 1rem; display: none;">Invalid PIN. Please try again.</div>
      </div>
      
      <div style="display: flex; gap: 1rem; margin-top: 1rem;">
        <button class="btn btn-outline" style="flex: 1;" id="pin-cancel">Cancel</button>
        <button class="btn btn-primary" style="flex: 1;" id="pin-submit">Verify</button>
      </div>
    </div>
  `
  document.body.appendChild(modal)
  
  const input = document.getElementById('entry-pin')
  input.focus()
  
  const verify = () => {
    if (input.value === state.quiz.pin) {
      modal.remove()
      onSuccess()
    } else {
      const err = document.getElementById('pin-error')
      err.style.display = 'block'
      input.value = ''
      input.classList.add('shake')
      setTimeout(() => input.classList.remove('shake'), 500)
    }
  }

  document.getElementById('pin-submit').onclick = verify
  document.getElementById('pin-cancel').onclick = () => modal.remove()
  input.onkeydown = (e) => { if (e.key === 'Enter') verify() }
}

// Views
function renderHome() {
  const container = document.createElement('div')
  container.className = 'container fade-in'
  container.innerHTML = `
    <div class="glass-card">
      <h1>Quiz Master Elite</h1>
      <p class="subtitle">The secure, modern solution for academic excellence.</p>
      
      <div class="role-selector">
        <div class="role-btn" id="faculty-btn">
          <i class="fas fa-chalkboard-teacher"></i>
          <h3>Faculty</h3>
          <p>Create quizzes from Word docs or manually. Set timers and monitor results.</p>
        </div>
        <div class="role-btn" id="student-btn">
          <i class="fas fa-user-graduate"></i>
          <h3>Student</h3>
          <p>Join a quiz using a link. Professional environment with secure proctoring.</p>
        </div>
      </div>
    </div>
  `
  app.appendChild(container)
  
  document.getElementById('faculty-btn').onclick = () => {
    state.view = 'faculty'
    render()
  }
  document.getElementById('student-btn').onclick = () => {
    // If there's a hash, we auto-join. Otherwise, ask for link.
    if (window.location.hash.includes('quiz=')) {
      loadQuizFromHash()
      state.view = 'student-join'
    } else {
      alert("Please use the quiz link provided by your faculty.")
    }
    render()
  }
}

function renderFaculty() {
  const container = document.createElement('div')
  container.className = 'container fade-in'
  container.style.maxWidth = '960px'

  // Build violation log HTML
  const violations = getViolationLog()
  const violationRows = violations.length === 0
    ? `<tr><td colspan="5" style="text-align:center; color:var(--text-dim); padding:1.5rem;">No violations recorded yet.</td></tr>`
    : violations.slice().reverse().map(v => `
        <tr>
          <td><span class="vtype-badge vtype-${v.type.replace(/\s/g,'-').toLowerCase()}">${v.type}</span></td>
          <td style="font-weight:600;">${v.student}</td>
          <td style="color:var(--text-dim);font-size:0.85rem;">${v.quiz}</td>
          <td style="color:var(--text-dim);font-size:0.85rem;">${v.detail}</td>
          <td style="color:var(--text-dim);font-size:0.8rem;white-space:nowrap;">${v.time}</td>
        </tr>`
      ).join('')

  // Build student results HTML
  const results = getResultsLog()
  const resultsRows = buildResultRows(results)

  container.innerHTML = `
    <div class="glass-card" style="margin-bottom:2rem;">
      <div style="display:flex; justify-content: space-between; align-items:center; margin-bottom: 2rem;">
         <h2><i class="fas fa-cog"></i> Quiz Configuration 
           <span id="db-status-pill" class="result-stat-pill" style="font-size: 0.7rem; vertical-align: middle; margin-left: 0.5rem; opacity: 0.8;">
             <i class="fas fa-database"></i> Checking Connection...
           </span>
         </h2>
         <button class="btn btn-outline" id="back-home"><i class="fas fa-home"></i> Home</button>
      </div>

      <div class="form-group">
        <label>Quiz Title</label>
        <input type="text" id="quiz-title" value="${state.quiz.title}" placeholder="Mid-term Examination 2024">
      </div>

      <div class="form-group">
        <label>Time Limit (Minutes)</label>
        <input type="number" id="quiz-timer" value="${state.quiz.timerMin}" min="1">
      </div>

      <div class="form-group">
        <label>Teacher Access PIN (4-Digits)</label>
        <input type="password" id="quiz-pin" value="${state.quiz.pin}" placeholder="e.g. 1234" maxlength="4" style="letter-spacing: 0.5em; font-weight: 700;">
        <small style="color: var(--text-dim); display: block; margin-top: 0.5rem;">This PIN is required to view results via the quiz link.</small>
      </div>

      <div style="margin: 2rem 0; border-top: 1px solid var(--glass-border); padding-top: 2rem;">
        <h3><i class="fas fa-file-word"></i> Quick Import</h3>
        <p style="color: var(--text-dim); font-size: 0.9rem; margin-bottom: 1rem;">
          Upload a Word file. Questions should be in standard text, and <strong>correct answers should be marked in red color</strong>.
        </p>
        <div style="display: flex; gap: 1rem; align-items: center;">
          <input type="file" id="word-upload" accept=".docx" style="display: none;">
          <button class="btn btn-outline" onclick="document.getElementById('word-upload').click()">
            <i class="fas fa-upload"></i> Upload .docx
          </button>
          <span id="file-name" style="color: var(--primary);">No file selected</span>
        </div>
      </div>

      <div id="questions-area">
        <h3>Questions (<span id="q-count">${state.quiz.questions.length}</span>)</h3>
        <div id="questions-list" style="margin-top: 1rem;"></div>
        <button class="btn btn-outline" id="add-question-btn" style="width: 100%; margin-top: 1rem;">
          <i class="fas fa-plus"></i> Add Question Manually
        </button>
      </div>

      <div style="margin-top: 3rem; text-align: center;">
        <button class="btn btn-primary" id="generate-link-btn" style="padding: 1.2rem 3rem; font-size: 1.2rem;">
          <i class="fas fa-magic"></i> Finalize & Generate Link
        </button>
      </div>
    </div>

    <!-- Violation Monitor Panel -->
    <div class="glass-card violation-monitor">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <h2 style="margin:0;"><i class="fas fa-shield-alt" style="color:var(--error);"></i> Violation Monitor
          ${violations.length > 0 ? `<span class="vcount-pill">${violations.length}</span>` : ''}
        </h2>
        <button class="btn btn-outline" id="clear-violations-btn" style="font-size:0.85rem; padding:0.5rem 1rem; color:var(--error);">
          <i class="fas fa-trash"></i> Clear Log
        </button>
      </div>
      <p style="color:var(--text-dim); font-size:0.85rem; margin-bottom:1.5rem;">
        All proctoring incidents from student sessions are listed below in real time.
      </p>
      <div class="violation-table-wrap">
        <table class="violation-table">
          <thead>
            <tr>
              <th>Type</th><th>Student</th><th>Quiz</th><th>Detail</th><th>Time</th>
            </tr>
          </thead>
          <tbody id="violations-tbody">${violationRows}</tbody>
        </table>
      </div>
    </div>

    <!-- Student Results Report Panel -->
    <div class="glass-card results-panel" style="margin-top:2rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <h2 style="margin:0;">
          <i class="fas fa-chart-bar" style="color:var(--primary);"></i> Student Results Report
          ${results.length > 0 ? `<span class="vcount-pill" style="background:var(--primary);">${results.length}</span>` : ''}
        </h2>
        <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
          <button class="btn btn-outline" id="export-csv-btn" style="font-size:0.85rem; padding:0.5rem 1rem; color:var(--success);">
            <i class="fas fa-download"></i> Export CSV
          </button>
          <button class="btn btn-outline" id="clear-results-btn" style="font-size:0.85rem; padding:0.5rem 1rem; color:var(--error);">
            <i class="fas fa-trash"></i> Clear Results
          </button>
        </div>
      </div>
      <p style="color:var(--text-dim); font-size:0.85rem; margin-bottom:1.5rem;">
        Every student submission is saved here automatically. Data refreshes every 5 seconds.
      </p>
      <div class="violation-table-wrap">
        <table class="violation-table">
          <thead>
            <tr>
              <th>#</th><th>Reg. No</th><th>Student Name</th><th>Quiz</th>
              <th>Score</th><th>%</th><th>Grade</th><th>Time Taken</th><th>Violations</th><th>Submitted At</th>
            </tr>
          </thead>
          <tbody id="results-tbody">${resultsRows}</tbody>
        </table>
      </div>
    </div>
  `
  app.appendChild(container)

  // Handlers
  document.getElementById('back-home').onclick = () => { state.view = 'home'; render(); }
  document.getElementById('add-question-btn').onclick = addManualQuestion
  document.getElementById('generate-link-btn').onclick = finalizeQuiz
  document.getElementById('clear-violations-btn').onclick = async () => {
    state.serverLogs.violations = [];
    renderFaculty();
    await fetch('/api/violations', { method: 'DELETE' });
  }
  document.getElementById('clear-results-btn').onclick = async () => {
    if (confirm('Clear all student results? This cannot be undone.')) {
      state.serverLogs.results = [];
      renderFaculty();
      await fetch('/api/results', { method: 'DELETE' });
    }
  }
  document.getElementById('export-csv-btn').onclick = () => exportResultsCSV()

  const fileInput = document.getElementById('word-upload')
  fileInput.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      document.getElementById('file-name').textContent = file.name
      processWordFile(file)
    }
  }

  // Sync title and timer
  document.getElementById('quiz-title').oninput = (e) => state.quiz.title = e.target.value
  document.getElementById('quiz-timer').oninput = (e) => state.quiz.timerMin = parseInt(e.target.value) || 1
  document.getElementById('quiz-pin').oninput = (e) => state.quiz.pin = e.target.value.replace(/\D/g,'')

  renderQuestions()

  // Initial fetch for the tables
  fetchFromServer().then(() => {
    if (state.view === 'faculty') renderFaculty()
  })

  // Auto-refresh both tables every 5s
  const _vRefresh = setInterval(async () => {
    if (state.view !== 'faculty') { clearInterval(_vRefresh); return }

    await fetchFromServer();

    // Violations
    const vbody = document.getElementById('violations-tbody')
    if (vbody) {
      const latest = getViolationLog()
      vbody.innerHTML = latest.length === 0
        ? `<tr><td colspan="5" style="text-align:center; color:var(--text-dim); padding:1.5rem;">No violations recorded yet.</td></tr>`
        : latest.slice().reverse().map(v => `
            <tr>
              <td><span class="vtype-badge vtype-${v.type.replace(/\s/g,'-').toLowerCase()}">${v.type}</span></td>
              <td style="font-weight:600;">${v.student}</td>
              <td style="color:var(--text-dim);font-size:0.85rem;">${v.quiz}</td>
              <td style="color:var(--text-dim);font-size:0.85rem;">${v.detail}</td>
              <td style="color:var(--text-dim);font-size:0.8rem;white-space:nowrap;">${v.time}</td>
            </tr>`).join('')
    }

    // Results
    const rbody = document.getElementById('results-tbody')
    if (rbody) {
      rbody.innerHTML = buildResultRows(getResultsLog())
    }
  }, 5000)
}

// ── Result table builder ────────────────────────────────────────────────────
function buildResultRows(results) {
  if (results.length === 0) {
    return `<tr><td colspan="10" style="text-align:center; color:var(--text-dim); padding:2rem;">
      No student submissions yet. Results will appear here after students complete the quiz.
    </td></tr>`
  }
  const gradeColors = {
    'O': '#22c55e', 'A+': '#22c55e', 'A': '#86efac',
    'B+': '#f59e0b', 'B': '#fbbf24', 'F': '#ef4444'
  }
  return results.slice().reverse().map((r, i) => {
    const gc   = gradeColors[r.grade] || '#94a3b8'
    const vBadge = r.violations > 0
      ? `<span style="color:#ef4444;font-weight:700;">${r.violations} ⚠</span>`
      : `<span style="color:#22c55e;">0</span>`
    return `
      <tr>
        <td style="color:var(--text-dim);font-size:0.85rem;">${results.length - i}</td>
        <td style="font-weight:700;letter-spacing:0.05em;">${r.registerNo || '—'}</td>
        <td style="font-weight:600;">${r.name}</td>
        <td style="color:var(--text-dim);font-size:0.85rem;max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.quiz}</td>
        <td style="font-weight:700;">${r.score}/${r.total}</td>
        <td style="font-weight:600;">${r.percentage}%</td>
        <td>
          <span style="background:${gc}22;color:${gc};border:1px solid ${gc}55;padding:2px 10px;border-radius:20px;font-weight:700;font-size:0.8rem;">
            ${r.grade}
          </span>
        </td>
        <td style="color:var(--text-dim);font-size:0.85rem;">${r.timeTaken}</td>
        <td>${vBadge}</td>
        <td style="color:var(--text-dim);font-size:0.78rem;white-space:nowrap;">${r.submittedAt}</td>
      </tr>`
  }).join('')
}

// ── CSV export ──────────────────────────────────────────────────────────────
window.exportResultsCSV = function() {
  const results = getResultsLog()
  if (results.length === 0) { alert('No results to export yet.'); return }
  const headers = ['Rank','Register No','Student Name','Quiz','Score','Total','Percentage','Grade','Time Taken','Violations','Submitted At']
  const rows = results.slice().reverse().map((r, i) =>
    [results.length - i, r.registerNo, r.name, `"${r.quiz}"`, r.score, r.total, r.percentage, r.grade, r.timeTaken, r.violations, `"${r.submittedAt}"`].join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `quiz_results_${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function renderQuestions() {
  const list = document.getElementById('questions-list')
  if (!list) return
  list.innerHTML = ''
  
  state.quiz.questions.forEach((q, idx) => {
    const qDiv = document.createElement('div')
    qDiv.className = 'question-item'
    qDiv.innerHTML = `
      <div style="display:flex; justify-content: space-between; margin-bottom: 1rem;">
        <strong>Question ${idx + 1}</strong>
        <button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.8rem; color: var(--error);" onclick="removeQuestion(${idx})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <input type="text" value="${q.text}" oninput="updateQuestion(${idx}, 'text', this.value)" placeholder="Enter question...">
      <div class="options-grid">
        ${q.options.map((opt, oIdx) => `
          <div class="option-input">
            <input type="radio" name="correct-${idx}" ${q.answer === oIdx ? 'checked' : ''} onchange="updateQuestion(${idx}, 'answer', ${oIdx})">
            <input type="text" value="${opt}" oninput="updateOption(${idx}, ${oIdx}, this.value)" placeholder="Option ${oIdx + 1}">
          </div>
        `).join('')}
      </div>
    `
    list.appendChild(qDiv)
  })
  document.getElementById('q-count').textContent = state.quiz.questions.length
}

window.removeQuestion = (idx) => {
  state.quiz.questions.splice(idx, 1)
  renderQuestions()
}

window.updateQuestion = (idx, key, val) => {
  state.quiz.questions[idx][key] = val
}

window.updateOption = (qIdx, oIdx, val) => {
  state.quiz.questions[qIdx].options[oIdx] = val
}

function addManualQuestion() {
  state.quiz.questions.push({
    text: '',
    options: ['', '', '', ''],
    answer: 0
  })
  renderQuestions()
}

async function processWordFile(file) {
  const reader = new FileReader()
  reader.onload = async (e) => {
    const arrayBuffer = e.target.result
    
    // Mammoth extraction with a custom transformation to detect "red" text
    // NOTE: Standard Mammoth makes it hard to get color. 
    // We will use standard conversion and look for specific indicators if possible.
    // However, Mammoth focuses on structure. 
    // A better way is to use Mammoth.convertToHtml and use a style map.
    // If the user's word file uses highlighters or specific styles, it's easier.
    
    try {
      const options = {
        styleMap: [
          "r[style-name='Red'] => span.red",
          "r[color='FF0000'] => span.red",
          "r[color='red'] => span.red"
        ]
      }
      const result = await mammoth.convertToHtml({ arrayBuffer }, options)
      const html = result.value
      
      // Heuristic: Questions are often paragraphs, and the one with red text is the answer.
      // This is a bit complex to parse perfectly without a strict format.
      // Let's assume: Each paragraph is a question or an option.
      // If a paragraph contains a red span, that's the answer.
      // We will group by 5s (1 Q + 4 Options)
      
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = html
      const paras = Array.from(tempDiv.querySelectorAll('p'))
      
      const questions = []
      for (let i = 0; i < paras.length; i += 5) {
        const qText = paras[i]?.textContent || 'New Question'
        const opts = [
            paras[i+1]?.textContent || 'Option 1',
            paras[i+2]?.textContent || 'Option 2',
            paras[i+3]?.textContent || 'Option 3',
            paras[i+4]?.textContent || 'Option 4'
        ]
        
        // Find which option had red color
        let ansIdx = 0
        for(let j=1; j<=4; j++) {
           if(paras[i+j]?.querySelector('.red') || paras[i+j]?.style?.color === 'red') {
               ansIdx = j-1
           }
        }
        
        questions.push({ text: qText, options: opts, answer: ansIdx })
      }
      
      state.quiz.questions = [...state.quiz.questions, ...questions]
      renderQuestions()
      alert(`Imported ${questions.length} questions successfully!`)
      
    } catch (err) {
      console.error(err)
      alert("Error parsing Word file. Please ensure it is a valid .docx")
    }
  }
  reader.readAsArrayBuffer(file)
}

function finalizeQuiz() {
  if (state.quiz.questions.length === 0) {
    alert("Please add at least one question.")
    return
  }
  
  const data = btoa(unescape(encodeURIComponent(JSON.stringify(state.quiz))))
  const link = `${window.location.origin}${window.location.pathname}#quiz=${data}`
  
  const modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = `
    <div class="modal-content glass-card fade-in">
      <h2><i class="fas fa-check-circle" style="color: var(--success);"></i> Quiz Ready!</h2>
      <p style="margin: 1rem 0;">Share this link with your students. It contains all quiz data.</p>
      <div class="share-section">
        <div class="share-link" id="final-link">${link}</div>
        <button class="btn btn-primary" id="copy-btn"><i class="fas fa-copy"></i> Copy Link</button>
      </div>
      <button class="btn btn-outline" style="margin-top: 1rem;" id="close-modal">Close</button>
    </div>
  `
  document.body.appendChild(modal)
  
  document.getElementById('copy-btn').onclick = () => {
    navigator.clipboard.writeText(link)
    document.getElementById('copy-btn').innerHTML = '<i class="fas fa-check"></i> Copied!'
  }
  document.getElementById('close-modal').onclick = () => modal.remove()
}

// Student Logic
function loadQuizFromHash() {
  try {
    const hashData = window.location.hash.split('quiz=')[1]
    const jsonData = decodeURIComponent(escape(atob(hashData)))
    state.quiz = JSON.parse(jsonData)
  } catch (e) {
    alert("Invalid Quiz Link!")
    window.location.hash = ''
    state.view = 'home'
    render()
  }
}

function renderStudentJoin() {
  const container = document.createElement('div')
  container.className = 'container fade-in'
  container.style.maxWidth = '500px'
  
  container.innerHTML = `
    <div class="glass-card">
      <h2 style="text-align: center; margin-bottom: 2rem;">Join Quiz</h2>
      <div class="form-group">
        <label>Your Full Name</label>
        <input type="text" id="student-name" placeholder="e.g. Jeeva Kumar">
      </div>
      <div class="form-group">
        <label>Register Number</label>
        <input type="text" id="student-regno" placeholder="e.g. 22CSE001" style="letter-spacing:0.05em;">
      </div>
      <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
        <h4 style="margin-bottom: 0.5rem;">${state.quiz.title}</h4>
        <p style="font-size: 0.9rem; color: var(--text-dim);">
          <i class="fas fa-clock"></i> Duration: ${state.quiz.timerMin} mins<br>
          <i class="fas fa-list"></i> Questions: ${state.quiz.questions.length}
        </p>
      </div>
      <div style="background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid var(--error); margin-bottom: 2rem; font-size: 0.8rem;">
         <i class="fas fa-exclamation-triangle"></i> <strong>Proctoring Active:</strong><br>
         - Switching tabs/windows will be logged.<br>
         - Screen captures are restricted.<br>
         - Fullscreen is required.
      </div>
      <button class="btn btn-primary" id="start-quiz-btn" style="width: 100%;">
        <i class="fas fa-play-circle"></i> Start Quiz Now
      </button>
    </div>
  `
  app.appendChild(container)
  
  document.getElementById('start-quiz-btn').onclick = () => {
    const name   = document.getElementById('student-name').value.trim()
    const regno  = document.getElementById('student-regno').value.trim()
    if (!name)   return alert('Please enter your full name.')
    if (!regno)  return alert('Please enter your register number.')
    state.studentSession.name       = name
    state.studentSession.registerNo = regno
    state.view = 'student-quiz'
    startQuiz()
  }
}

function startQuiz() {
  state.studentSession.startTime = Date.now()
  state.studentSession.timeRemaining = state.quiz.timerMin * 60
  state.studentSession.answers = new Array(state.quiz.questions.length).fill(-1)
  
  // Enter fullscreen
  try {
    document.documentElement.requestFullscreen()
  } catch(e) {}
  
  render()
  
  // Security
  setupSecurity()
  
  // Timer interval
  const timerInt = setInterval(() => {
    if (state.view !== 'student-quiz') {
      clearInterval(timerInt)
      return
    }
    
    state.studentSession.timeRemaining--
    const timerElem = document.getElementById('quiz-timer-display')
    if (timerElem) {
      const m = Math.floor(state.studentSession.timeRemaining / 60)
      const s = state.studentSession.timeRemaining % 60
      timerElem.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    
    if (state.studentSession.timeRemaining <= 0) {
      clearInterval(timerInt)
      submitQuiz()
    }
  }, 1000)
}

function setupSecurity() {
  // ─── Prevent right-click ───────────────────────────────────────────────
  window.oncontextmenu = (e) => e.preventDefault()

  // ─── Screenshot detection via PrintScreen / Ctrl+P ────────────────────
  const _handleKeyDown = (e) => {
    const blocked = [
      e.key === 'PrintScreen',
      e.ctrlKey && e.shiftKey && e.key === 'S', // Win Snip
      e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5'), // macOS
      e.ctrlKey && e.key === 'p', // Print
      e.key === 'F12' // DevTools
    ]
    if (blocked.some(Boolean)) {
      e.preventDefault()
      e.stopPropagation()
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key === 'S') || (e.metaKey && e.shiftKey)) {
        logViolation('Screenshot Attempt', `Key combination detected: ${e.key}`)
      }
      return false
    }
  }
  window.addEventListener('keydown', _handleKeyDown, true)
  window.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      // Overwrite clipboard with blank to thwart screenshot
      try {
        navigator.clipboard.writeText('').catch(() => {})
      } catch (_) {}
      logViolation('Screenshot Attempt', 'PrintScreen key released — clipboard cleared')
    }
  }, true)

  // ─── Tab / window switch detection ────────────────────────────────────
  let _lastVisibleTime = Date.now()
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      _lastVisibleTime = Date.now()
      logViolation('Tab Switch', 'Student navigated away from the exam tab')
      // Blur the quiz content so screenshot of background is useless
      const container = document.querySelector('.container')
      if (container) container.style.filter = 'blur(20px)'
    } else {
      const container = document.querySelector('.container')
      if (container) container.style.filter = ''
      const awayFor = Math.round((Date.now() - _lastVisibleTime) / 1000)
      if (awayFor > 1) {
        logViolation('Tab Switch', `Student was away for ${awayFor} second(s)`)
      }
    }
  })

  // ─── Window blur (alt-tab, Snipping Tool, etc.) ────────────────────────
  let _blurTimer = null
  window.addEventListener('blur', () => {
    _blurTimer = setTimeout(() => {
      logViolation('Window Blur', 'Focus left exam window — possible screenshot tool or alt-tab')
      const container = document.querySelector('.container')
      if (container) container.style.filter = 'blur(20px)'
    }, 300) // small grace period for legitimate focus events
  })
  window.addEventListener('focus', () => {
    clearTimeout(_blurTimer)
    const container = document.querySelector('.container')
    if (container) container.style.filter = ''
  })

  // ─── Split-screen detection via window resize ──────────────────────────
  const _origW = window.screen.width
  const _origH = window.screen.height
  let _splitAlerted = false
  const _resizeObserver = setInterval(() => {
    if (state.view !== 'student-quiz') { clearInterval(_resizeObserver); return }
    const wRatio = window.innerWidth / window.screen.width
    const hRatio = window.innerHeight / window.screen.height
    // Flag when screen real-estate drops below ~60% (split-screen)
    if ((wRatio < 0.6 || hRatio < 0.6) && !_splitAlerted) {
      _splitAlerted = true
      logViolation('Split Screen', `Window shrank to ${Math.round(wRatio*100)}% width × ${Math.round(hRatio*100)}% height`)
    } else if (wRatio >= 0.6 && hRatio >= 0.6) {
      _splitAlerted = false // reset so next split is also logged
    }
  }, 1000)

  // ─── Fullscreen exit detection ─────────────────────────────────────────
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && state.view === 'student-quiz') {
      logViolation('Fullscreen Exit', 'Student exited fullscreen mode during the exam')
      // Try to re-enter fullscreen
      setTimeout(() => {
        try { document.documentElement.requestFullscreen() } catch(_) {}
      }, 500)
    }
  })
}

let currentQIdx = 0

function renderStudentQuiz() {
  const container = document.createElement('div')
  container.className = 'container fade-in'
  container.style.maxWidth = '800px'
  
  const q = state.quiz.questions[currentQIdx]
  const progress = ((currentQIdx + 1) / state.quiz.questions.length) * 100
  
  container.innerHTML = `
    <div class="no-screenshot"></div>
    <div class="quiz-header">
       <div>
         <h4 style="color: var(--text-dim);">${state.quiz.title}</h4>
         <h3>Question ${currentQIdx + 1} of ${state.quiz.questions.length}</h3>
       </div>
       <div style="display:flex; gap:1rem; align-items:center;">
         <div class="violation-counter" title="Violations detected">
           <i class="fas fa-shield-alt"></i>
           <span id="violation-badge" style="display:${state.studentSession.violations.length > 0 ? 'inline-flex' : 'none'}">${state.studentSession.violations.length}</span>
         </div>
         <div class="timer" id="quiz-timer-display">00:00</div>
       </div>
    </div>
    
    <div class="progress-bar">
      <div class="progress-fill" style="width: ${progress}%"></div>
    </div>

    <div class="glass-card question-card">
      <div class="question-text">${q.text}</div>
      <div class="options-list">
        ${q.options.map((opt, idx) => `
          <button class="option-btn ${state.studentSession.answers[currentQIdx] === idx ? 'selected' : ''}" onclick="selectAnswer(${idx})">
            ${String.fromCharCode(65 + idx)}. ${opt}
          </button>
        `).join('')}
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
      <button class="btn btn-outline" onclick="prevQuestion()" ${currentQIdx === 0 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i> Previous
      </button>
      ${currentQIdx === state.quiz.questions.length - 1 ? 
        `<button class="btn btn-primary" onclick="submitQuiz()">Submit Quiz <i class="fas fa-paper-plane"></i></button>` :
        `<button class="btn btn-primary" onclick="nextQuestion()">Next <i class="fas fa-chevron-right"></i></button>`
      }
    </div>
    
    <div class="watermark">Student: ${state.studentSession.name} | Violations: ${state.studentSession.violations.length} | Verified Session</div>
  `
  app.appendChild(container)
}

window.selectAnswer = (idx) => {
  state.studentSession.answers[currentQIdx] = idx
  render()
}

window.nextQuestion = () => {
  if (currentQIdx < state.quiz.questions.length - 1) {
    currentQIdx++
    render()
  }
}

window.prevQuestion = () => {
  if (currentQIdx > 0) {
    currentQIdx--
    render()
  }
}

window.submitQuiz = () => {
  // Exit fullscreen
  try {
     if (document.fullscreenElement) document.exitFullscreen()
  } catch(e) {}
  
  // Calculate score
  let score = 0
  state.quiz.questions.forEach((q, idx) => {
    if (state.studentSession.answers[idx] === q.answer) score++
  })
  
  state.studentSession.score = score

  // ── Save result to localStorage for teacher report ────────────────────
  const total      = state.quiz.questions.length
  const pct        = total > 0 ? Math.round((score / total) * 100) : 0
  const grade      = pct >= 90 ? 'O' : pct >= 80 ? 'A+' : pct >= 70 ? 'A' :
                     pct >= 60 ? 'B+' : pct >= 50 ? 'B' : 'F'
  const timeTaken  = state.quiz.timerMin * 60 - state.studentSession.timeRemaining
  const mm         = Math.floor(timeTaken / 60).toString().padStart(2,'0')
  const ss         = (timeTaken % 60).toString().padStart(2,'0')

  saveResult({
    quiz:        state.quiz.title,
    name:        state.studentSession.name,
    registerNo:  state.studentSession.registerNo,
    score,
    total,
    percentage:  pct,
    grade,
    timeTaken:   `${mm}:${ss}`,
    violations:  state.studentSession.violations.length,
    submittedAt: new Date().toLocaleString()
  })

  state.view = 'result'
  render()
  
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#ec4899', '#22c55e']
  })
}

function renderResult() {
  const container = document.createElement('div')
  container.className = 'container fade-in'
  container.style.maxWidth = '600px'
  
  const percentage = (state.studentSession.score / state.quiz.questions.length) * 100
  
  const grade = percentage >= 90 ? 'O' : percentage >= 80 ? 'A+' : percentage >= 70 ? 'A' :
                percentage >= 60 ? 'B+' : percentage >= 50 ? 'B' : 'F'
  const gradeColor = percentage >= 80 ? 'var(--success)' : percentage >= 50 ? '#f59e0b' : 'var(--error)'

  container.innerHTML = `
    <div class="glass-card fade-in" style="text-align: center;">
      <h2>Exam Completed</h2>
      <p class="subtitle" style="margin-bottom: 2rem;">Well done, ${state.studentSession.name}!</p>

      <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; margin-bottom:2rem;">
        <div class="result-stat-pill">
          <i class="fas fa-id-card" style="color:var(--primary);"></i>
          <span>${state.studentSession.registerNo}</span>
        </div>
        <div class="result-stat-pill">
          <i class="fas fa-check-circle" style="color:var(--success);"></i>
          <span>${state.studentSession.score} / ${state.quiz.questions.length} Correct</span>
        </div>
        <div class="result-stat-pill">
          <i class="fas fa-shield-alt" style="color:var(--error);"></i>
          <span>${state.studentSession.violations.length} Violations</span>
        </div>
      </div>
      
      <div class="score-circle">
        ${state.studentSession.score}/${state.quiz.questions.length}
      </div>
      
      <h3 style="margin-bottom: 1rem;">${percentage.toFixed(1)}%</h3>
      <div style="display:inline-block; background:${gradeColor}22; color:${gradeColor}; border:1px solid ${gradeColor}55; padding:4px 20px; border-radius:20px; font-weight:700; font-size:1.3rem; margin-bottom:2rem;">Grade: ${grade}</div>
      
      <div style="background: rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem; text-align: left;">
        <h4>Feedback</h4>
        <p style="color: var(--text-dim); font-size: 0.9rem; margin-top: 0.5rem;">
          ${percentage >= 80 ? '🏆 Excellent work! You have shown great mastery.' : 
             percentage >= 50 ? '👍 Good effort. Keep practicing to reach the top!' : 
             '📚 Needs improvement. Review the course material again.'}
        </p>
      </div>

      <button class="btn btn-primary" onclick="window.location.hash=''; window.location.reload();">
        <i class="fas fa-redo"></i> Back to Home
      </button>
    </div>
  `
  app.appendChild(container)
}

// Initialize
// Initialize
function init() {
  if (window.location.hash.includes('quiz=')) {
     loadQuizFromHash()
     state.view = 'link-gate'
  }
  render()
}

window.addEventListener('hashchange', () => {
  if (window.location.hash.includes('quiz=')) {
     loadQuizFromHash()
     if (state.view === 'home' || state.view === 'link-gate') {
       state.view = 'link-gate'
       render()
     }
  } else if (state.view === 'link-gate') {
    state.view = 'home'
    render()
  }
})

init()
