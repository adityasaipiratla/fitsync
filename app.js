/**
 * FitSync Dashboard — Primary Core Logic
 * Local-First, Zero-Cost, Private Personal Health Tracker
 */

const STORAGE_KEY = 'fitsync_archive_v2';
const SETTINGS_KEY = 'fitsync_user_settings_v2';

// 22 Real Items & Combos from Calorie Cheatsheet.xlsx (Vegetarian Cut Focus)
const CHEATSHEET_DATABASE = [
  { name: '1 phulka', portion: '1 medium (~35g)', grams: 35, cal: 90, protein: 3.2, cat: 'curries' },
  { name: 'Amul protein curd', portion: '100 g', grams: 100, cal: 70, protein: 6.0, cat: 'dairy' },
  { name: 'Normal curd', portion: '100 g', grams: 100, cal: 65, protein: 4.0, cat: 'dairy' },
  { name: '1.5 scoops whey', portion: '1.5 scoops (45g)', grams: 45, cal: 180, protein: 36.0, cat: 'dairy' },
  { name: '1 scoop yeast protein', portion: '1 scoop (30g)', grams: 30, cal: 130, protein: 27.0, cat: 'dairy' },
  { name: 'Rajma curry', portion: '100 g', grams: 100, cal: 125, protein: 7.5, cat: 'curries' },
  { name: 'Soya / Chana curry', portion: '100 g', grams: 100, cal: 145, protein: 11.0, cat: 'curries' },
  { name: '2‑egg cheese omelette (50 g cheese)', portion: '2 eggs + 50g cheese', grams: 160, cal: 300, protein: 25.0, cat: 'dairy' },
  { name: '2 Whole Eggs', portion: '2 whole eggs', grams: 100, cal: 150, protein: 12.5, cat: 'dairy' },
  { name: 'Protein oats', portion: '100 g', grams: 100, cal: 360, protein: 26.0, cat: 'dairy' },
  { name: 'Makhana (Foxnuts)', portion: '50 g', grams: 50, cal: 180, protein: 4.0, cat: 'snacks' },
  { name: 'Mixed nuts', portion: '10 g', grams: 10, cal: 65, protein: 1.5, cat: 'snacks' },
  { name: 'Sprouts', portion: '100 g', grams: 100, cal: 35, protein: 3.0, cat: 'snacks' },
  { name: 'Pomegranates / Berries', portion: '100 g', grams: 100, cal: 80, protein: 1.0, cat: 'snacks' },
  { name: 'Buttermilk', portion: '100 ml', grams: 100, cal: 42, protein: 2.5, cat: 'dairy' },
  { name: 'Whole Milk', portion: '300 ml', grams: 300, cal: 185, protein: 10.0, cat: 'dairy' },
  { name: '1 Banana', portion: '1 medium', grams: 110, cal: 100, protein: 1.1, cat: 'snacks' },
  { name: 'Carrot', portion: '1 medium', grams: 80, cal: 30, protein: 0.5, cat: 'snacks' },
  { name: 'Corn Cob', portion: '1 medium', grams: 120, cal: 95, protein: 3.2, cat: 'snacks' },
  
  // Pre-made Meal Combos
  { name: 'Morning: Protein Curd + Oats + Berries', portion: 'Full Bowl (350g)', grams: 350, cal: 590, protein: 38.5, cat: 'meals' },
  { name: 'Lunch: 3 Phulkas + 350g Curry + Curd', portion: 'Full Meal (550g)', grams: 550, cal: 770, protein: 42.0, cat: 'meals' },
  { name: 'Lunch: 2 Phulkas + 260g Curry', portion: 'Light Lunch (330g)', grams: 330, cal: 544, protein: 29.4, cat: 'meals' },
  { name: 'Dinner: 2-Egg Omelette + Whey Shake', portion: 'High Protein Dinner', grams: 300, cal: 490, protein: 61.0, cat: 'meals' }
];

// 4-Day Workout Split Cards from Daily_Workout_Checklist_Cards.txt
const WORKOUT_SPLITS = [
  {
    key: 'monday',
    name: 'Upper Body + Core + Pull-Ups (60 min)',
    meta: '3 Rounds · Goblet Squats, RDLs, Pull-ups, Bicep Curls, Press, Plank Rows',
    exercises: [
      { id: 1, name: 'Goblet Squats', setsReps: '3x8-10', weight: '12.5kg', done: false },
      { id: 2, name: 'Romanian Deadlifts', setsReps: '3x8', weight: '12.5kg', done: false },
      { id: 3, name: 'Russian Twists', setsReps: '3x12/side', weight: '5kg', done: false },
      { id: 4, name: 'Pull-Ups', setsReps: '3x4-6', weight: 'BW', done: false },
      { id: 5, name: 'Bicep Curls', setsReps: '3x6-8', weight: '12.5kg', done: false },
      { id: 6, name: 'Shoulder Press', setsReps: '3x6-8', weight: '12.5kg', done: false },
      { id: 7, name: 'Overhead Tricep Ext', setsReps: '3x8/arm', weight: '12.5kg', done: false },
      { id: 8, name: 'Dumbbell Shrugs', setsReps: '3x10', weight: '12.5kg', done: false },
      { id: 9, name: 'Plank Rows', setsReps: '3x8/arm', weight: '5kg', done: false },
      { id: 10, name: 'Mewing & Chin Tucks', setsReps: '2x15', weight: 'Body', done: false }
    ]
  },
  {
    key: 'tuesday',
    name: 'Legs + Core (Light) (45 min)',
    meta: '3 Rounds · Goblet Squats, Walking Lunges, Calf Raises, Weighted Sit-ups',
    exercises: [
      { id: 1, name: 'Goblet Squats', setsReps: '3x8-10', weight: '12.5kg', done: false },
      { id: 2, name: 'Walking Lunges', setsReps: '3x10/leg', weight: 'BW', done: false },
      { id: 3, name: 'Calf Raises', setsReps: '3x15', weight: 'BW', done: false },
      { id: 4, name: 'Russian Twists', setsReps: '3x12/side', weight: '5kg', done: false },
      { id: 5, name: 'Weighted Sit-ups', setsReps: '3x10', weight: '10kg', done: false },
      { id: 6, name: 'Mewing & Chin Tucks', setsReps: '2x15', weight: 'Body', done: false }
    ]
  },
  {
    key: 'wednesday',
    name: 'Upper Body + Pull-Ups Focus (60 min)',
    meta: '3 Rounds · Bicep Curls, Shoulder Press, Assisted Pull-ups',
    exercises: [
      { id: 1, name: 'Goblet Squats', setsReps: '3x8-10', weight: '12.5kg', done: false },
      { id: 2, name: 'Romanian Deadlifts', setsReps: '3x8', weight: '12.5kg', done: false },
      { id: 3, name: 'Bicep Curls', setsReps: '3x6-8', weight: '12.5kg', done: false },
      { id: 4, name: 'Shoulder Press', setsReps: '3x6-8', weight: '12.5kg', done: false },
      { id: 5, name: 'Overhead Tricep Ext', setsReps: '3x8/arm', weight: '12.5kg', done: false },
      { id: 6, name: 'Pull-Ups (Assisted)', setsReps: '3x4-6', weight: 'BW', done: false },
      { id: 7, name: 'Dumbbell Shrugs', setsReps: '3x10', weight: '12.5kg', done: false },
      { id: 8, name: 'Plank Rows', setsReps: '3x8/arm', weight: '5kg', done: false }
    ]
  },
  {
    key: 'thursday',
    name: 'Legs + Core Emphasis (50 min)',
    meta: 'Quad & Hamstring Emphasis · Bulgarian Split Squats, Leg Curls, Planks',
    exercises: [
      { id: 1, name: 'Goblet Squats', setsReps: '3x8-10', weight: '12.5kg', done: false },
      { id: 2, name: 'Bulgarian Split Squats', setsReps: '3x8/leg', weight: 'BW', done: false },
      { id: 3, name: 'Romanian Deadlifts', setsReps: '3x8', weight: '12.5kg', done: false },
      { id: 4, name: 'Leg Curls', setsReps: '3x10', weight: '12.5kg', done: false },
      { id: 5, name: 'Calf Raises', setsReps: '3x15', weight: 'BW', done: false },
      { id: 6, name: 'Plank Holds', setsReps: '3x45sec', weight: 'BW', done: false },
      { id: 7, name: 'Russian Twists', setsReps: '3x12/side', weight: '5kg', done: false }
    ]
  }
];

// STATE VARIABLES
let currentDate = getTodayStr();
let currentTab = 'today';
let activeCatFilter = 'all';

let userSettings = {
  mode: 'Cut mode',
  targetCal: 1700,
  targetProtein: 130,
  weightKg: 70.0
};

let db = {}; // Stores daily logs keyed by YYYY-MM-DD

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

// GET OR INITIALIZE DAY LOG
function getActiveLog(dateStr = currentDate) {
  if (!db[dateStr]) {
    const dayOfWeek = new Date(dateStr + 'T00:00:00').getDay(); // 0 = Sun, 1 = Mon...
    let splitObj = WORKOUT_SPLITS[0]; // Default Monday
    if (dayOfWeek === 2) splitObj = WORKOUT_SPLITS[1]; // Tuesday
    if (dayOfWeek === 3) splitObj = WORKOUT_SPLITS[2]; // Wednesday
    if (dayOfWeek === 4) splitObj = WORKOUT_SPLITS[3]; // Thursday

    db[dateStr] = {
      date: dateStr,
      workout: {
        name: splitObj.name,
        meta: splitObj.meta,
        status: 'Ready'
      },
      exercises: JSON.parse(JSON.stringify(splitObj.exercises)),
      meals: [
        { id: 101, name: 'Amul protein curd', grams: 200, calories: 140, protein: 12, meta: 'High protein dairy staple' },
        { id: 102, name: '1.5 scoops whey', grams: 45, calories: 180, protein: 36, meta: 'Post workout shake' }
      ],
      recovery: { soreness: 3, mood: 'Good', joint: 'OK', notes: '45 min home session' }
    };
  }
  return db[dateStr];
}

function loadState() {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) userSettings = { ...userSettings, ...JSON.parse(savedSettings) };

    const savedDB = localStorage.getItem(STORAGE_KEY);
    if (savedDB) db = JSON.parse(savedDB);
  } catch (err) {
    console.warn('Could not load local state cleanly, using defaults.', err);
  }
}

function saveState() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(userSettings));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.warn('Could not save to localStorage.', err);
  }
  render();
}

// CALCULATION HELPERS
function sumMealsCalories(log = getActiveLog()) {
  return (log.meals || []).reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
}

function sumMealsProtein(log = getActiveLog()) {
  return (log.meals || []).reduce((sum, m) => sum + (Number(m.protein) || 0), 0);
}

// RENDERING FUNCTIONS
function renderDateHeader() {
  const d = new Date(currentDate + 'T00:00:00');
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d);
  const dateFormatted = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);

  document.getElementById('weekdayLabel').textContent = weekday;
  document.getElementById('dateLabel').textContent = dateFormatted;
  document.getElementById('modeChip').textContent = userSettings.mode || 'Cut mode';
}

function renderMetrics() {
  const log = getActiveLog();
  const totalCal = sumMealsCalories(log);
  const totalProtein = sumMealsProtein(log);
  const deltaCal = userSettings.targetCal - totalCal;
  const deltaProtein = userSettings.targetProtein - totalProtein;

  const calPct = Math.min(Math.round((totalCal / userSettings.targetCal) * 100), 100);
  const proteinPct = Math.min(Math.round((totalProtein / userSettings.targetProtein) * 100), 100);

  const metricsGrid = document.getElementById('metricsGrid');
  metricsGrid.innerHTML = `
    <div class="metric-card">
      <div>
        <div class="metric-label">Calories</div>
        <div class="metric-value">${totalCal.toLocaleString()} <span style="font-size: 0.9rem; color: var(--muted);">/ ${userSettings.targetCal.toLocaleString()}</span></div>
        <div class="metric-delta">${deltaCal >= 0 ? deltaCal + ' kcal remaining' : Math.abs(deltaCal) + ' kcal over'}</div>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${calPct}%;"></div>
      </div>
    </div>

    <div class="metric-card">
      <div>
        <div class="metric-label">Protein</div>
        <div class="metric-value">${totalProtein}g <span style="font-size: 0.9rem; color: var(--muted);">/ ${userSettings.targetProtein}g</span></div>
        <div class="metric-delta">${deltaProtein <= 0 ? '✓ Target achieved' : deltaProtein + 'g remaining'}</div>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill accent" style="width: ${proteinPct}%;"></div>
      </div>
    </div>

    <div class="metric-card">
      <div>
        <div class="metric-label">Body Weight</div>
        <div class="metric-value">${userSettings.weightKg} kg</div>
        <div class="metric-delta">Cut profile baseline</div>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: 100%; opacity: 0.3;"></div>
      </div>
    </div>
  `;
}

function renderWorkout() {
  const log = getActiveLog();
  const workout = log.workout || { name: 'Upper Body Circuit', meta: 'Home dumbbells', status: 'Ready' };
  
  document.getElementById('workoutMeta').textContent = workout.meta;
  document.getElementById('workoutStatus').innerHTML = `<span class="dot"></span> ${workout.status}`;

  const exContainer = document.getElementById('exerciseList');
  exContainer.innerHTML = (log.exercises || []).map(ex => `
    <div class="ex-item ${ex.done ? 'done' : ''}">
      <input type="checkbox" class="ex-checkbox" ${ex.done ? 'checked' : ''} data-id="${ex.id}" />
      <div class="ex-info">
        <div class="ex-name">${ex.name}</div>
      </div>
      <div class="ex-inputs">
        <input type="text" class="input-num ex-sets-input" value="${ex.setsReps || '3x10'}" data-id="${ex.id}" placeholder="SetsxReps" />
        <input type="text" class="input-num ex-weight-input" value="${ex.weight || 'BW'}" data-id="${ex.id}" placeholder="Weight" />
        <button class="btn-del ex-del-btn" data-id="${ex.id}">✕</button>
      </div>
    </div>
  `).join('');

  // Bind exercise event handlers
  exContainer.querySelectorAll('.ex-checkbox').forEach(cb => {
    cb.addEventListener('change', () => toggleEx(Number(cb.dataset.id)));
  });

  exContainer.querySelectorAll('.ex-sets-input').forEach(inp => {
    inp.addEventListener('change', () => updateEx(Number(inp.dataset.id), 'setsReps', inp.value));
  });

  exContainer.querySelectorAll('.ex-weight-input').forEach(inp => {
    inp.addEventListener('change', () => updateEx(Number(inp.dataset.id), 'weight', inp.value));
  });

  exContainer.querySelectorAll('.ex-del-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteEx(Number(btn.dataset.id)));
  });

  // Recovery Log fields
  const rec = log.recovery || {};
  document.getElementById('sorenessLog').value = rec.soreness || 3;
  document.getElementById('moodLog').value = rec.mood || 'Good';
  document.getElementById('jointLog').value = rec.joint || 'OK';
  document.getElementById('notesLog').value = rec.notes || '';
}

function renderMeals() {
  const log = getActiveLog();
  const mealContainer = document.getElementById('mealList');
  
  mealContainer.innerHTML = (log.meals || []).map(m => `
    <div class="meal-item">
      <div>
        <div class="meal-name">${m.name}</div>
        <div class="meal-meta">${m.grams ? m.grams + 'g portion · ' : ''}${m.meta || 'Logged meal'}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="meal-tag">${m.calories || 0} kcal · ${m.protein || 0}g protein</span>
        <button class="btn-del meal-del-btn" data-id="${m.id}">✕</button>
      </div>
    </div>
  `).join('');

  mealContainer.querySelectorAll('.meal-del-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteMeal(Number(btn.dataset.id)));
  });

  // Quick Staples Chips
  const staplesWrap = document.getElementById('quickStaplesWrap');
  const quickStaples = [
    '1 phulka',
    'Amul protein curd',
    '1.5 scoops whey',
    'Rajma curry',
    '2‑egg cheese omelette (50 g cheese)',
    'Makhana (Foxnuts)'
  ];

  staplesWrap.innerHTML = quickStaples.map(name => `
    <button class="preset-chip staple-btn" data-name="${name}">+ ${name}</button>
  `).join('');

  staplesWrap.querySelectorAll('.staple-btn').forEach(btn => {
    btn.addEventListener('click', () => addCheatsheetItemByName(btn.dataset.name));
  });
}

function renderSidebar() {
  const log = getActiveLog();
  const totalCal = sumMealsCalories(log);
  const totalProtein = sumMealsProtein(log);

  // Summary List
  const summary = document.getElementById('summaryList');
  summary.innerHTML = `
    <div class="summary-row"><span>Daily Target</span><strong>${userSettings.targetCal} kcal</strong></div>
    <div class="summary-row"><span>Total Calories</span><strong>${totalCal} kcal</strong></div>
    <div class="summary-row"><span>Protein Target</span><strong>${userSettings.targetProtein}g</strong></div>
    <div class="summary-row"><span>Total Protein</span><strong>${totalProtein}g</strong></div>
    <div class="summary-row"><span>Body Weight</span><strong>${userSettings.weightKg} kg</strong></div>
  `;

  // Week Chart
  const weekChart = document.getElementById('weekChart');
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dummyWeekly = [60, 75, 70, 85, 80, 90, 78];

  weekChart.innerHTML = dummyWeekly.map((val, idx) => `
    <div class="week-day">
      <div class="week-bar ${idx % 2 === 1 ? 'alt' : ''}" style="height: ${val}%"></div>
      <div class="week-label">${labels[idx]}</div>
    </div>
  `).join('');

  // Quick Templates in Sidebar
  const templateList = document.getElementById('templateList');
  const quickTemplates = [
    { name: 'Cut day', value: '1,700 kcal · 130g' },
    { name: 'High protein', value: '130g target' },
    { name: 'Upper Body', value: 'Monday split' },
    { name: 'Legs & Core', value: 'Tuesday split' }
  ];

  templateList.innerHTML = quickTemplates.map(t => `
    <div class="template-item sidebar-template-btn" data-name="${t.name}">
      <span>${t.name}</span>
      <span class="meal-tag">${t.value}</span>
    </div>
  `).join('');

  templateList.querySelectorAll('.sidebar-template-btn').forEach(btn => {
    btn.addEventListener('click', () => applyTemplateByName(btn.dataset.name));
  });
}

function renderCheatsheetDrawer() {
  const search = (document.getElementById('cheatSearchInput')?.value || '').toLowerCase();
  const grid = document.getElementById('cheatListGrid');
  if (!grid) return;

  const filtered = CHEATSHEET_DATABASE.filter((item, idx) => {
    item._idx = idx;
    const matchCat = (activeCatFilter === 'all' || item.cat === activeCatFilter);
    const matchSearch = item.name.toLowerCase().includes(search) || item.portion.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  grid.innerHTML = filtered.map(item => `
    <div class="cheat-card">
      <div>
        <strong style="font-size: 0.92rem;">${item.name}</strong>
        <div style="font-size: 0.76rem; color: var(--muted);">${item.portion} · ${item.cal} kcal · ${item.protein}g protein</div>
      </div>
      <button class="mini-button accent-btn add-cheat-btn" data-idx="${item._idx}">+ Add</button>
    </div>
  `).join('');

  grid.querySelectorAll('.add-cheat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addCheatsheetItem(Number(btn.dataset.idx), 1);
      closeModal('cheatsheetModal');
    });
  });
}

function renderWeeklyView() {
  const weeklyList = document.getElementById('weeklyMetrics');
  if (!weeklyList) return;

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mockScores = [70, 85, 80, 90, 75, 88, 82];

  weeklyList.innerHTML = mockScores.map((score, idx) => `
    <div class="summary-row">
      <span style="width: 50px; font-weight: 700;">${labels[idx]}</span>
      <div style="flex: 1; background: #edf3ff; height: 12px; border-radius: 6px; overflow: hidden; margin: 0 12px;">
        <div style="width: ${score}%; background: var(--primary); height: 100%;"></div>
      </div>
      <strong>${score}% adherence</strong>
    </div>
  `).join('');

  document.getElementById('weeklySummary').innerHTML = `
    <div class="summary-row"><span>7-Day Average Adherence</span><strong>81%</strong></div>
    <div class="summary-row"><span>Weekly Target Calories</span><strong>1,700 kcal avg</strong></div>
    <div class="summary-row"><span>Weekly Protein Target</span><strong>130g avg</strong></div>
  `;
}

function renderHistoryView() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;

  const keys = Object.keys(db).sort().reverse();
  if (keys.length === 0) {
    historyList.innerHTML = '<div class="card-subtext">No historical logs recorded yet.</div>';
    return;
  }

  historyList.innerHTML = keys.map(dateKey => {
    const entry = db[dateKey];
    const c = sumMealsCalories(entry);
    const p = sumMealsProtein(entry);
    return `
      <div class="card mb-12">
        <div class="card-row">
          <div>
            <strong class="card-title">${dateKey}</strong>
            <div class="card-subtext">${entry.workout?.name || 'Workout session'}</div>
          </div>
          <span class="meal-tag">${c} kcal · ${p}g protein</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderTemplatesView() {
  const templatesList = document.getElementById('templatesList');
  if (!templatesList) return;

  templatesList.innerHTML = WORKOUT_SPLITS.map((split, idx) => `
    <div class="template-card load-split-btn" data-idx="${idx}">
      <h3 style="font-size: 1rem; font-weight: 800; margin: 0 0 6px;">${split.name}</h3>
      <p style="font-size: 0.78rem; color: var(--muted); margin: 0 0 10px;">${split.meta}</p>
      <div class="mini-button accent-btn" style="width: max-content;">Load Split Routine</div>
    </div>
  `).join('');

  templatesList.querySelectorAll('.load-split-btn').forEach(card => {
    card.addEventListener('click', () => {
      const idx = Number(card.dataset.idx);
      applyWorkoutSplit(WORKOUT_SPLITS[idx]);
      setActiveTab('today');
    });
  });
}

function render() {
  renderDateHeader();
  renderMetrics();
  renderWorkout();
  renderMeals();
  renderSidebar();
  renderCheatsheetDrawer();
  renderWeeklyView();
  renderHistoryView();
  renderTemplatesView();
}

// ACTIONS & LOGIC
function toggleEx(id) {
  const log = getActiveLog();
  const ex = (log.exercises || []).find(e => e.id === id);
  if (ex) ex.done = !ex.done;
  saveState();
}

function updateEx(id, field, val) {
  const log = getActiveLog();
  const ex = (log.exercises || []).find(e => e.id === id);
  if (ex) ex[field] = val;
  saveState();
}

function deleteEx(id) {
  const log = getActiveLog();
  log.exercises = (log.exercises || []).filter(e => e.id !== id);
  saveState();
}

function openAddExerciseModal() {
  document.getElementById('customExName').value = '';
  document.getElementById('customExSetsReps').value = '3x10';
  document.getElementById('customExWeight').value = '12.5kg';
  openModal('exerciseModal');
}

function saveCustomExercise() {
  const name = document.getElementById('customExName').value.trim();
  const setsReps = document.getElementById('customExSetsReps').value.trim() || '3x10';
  const weight = document.getElementById('customExWeight').value.trim() || '12.5kg';

  if (!name) {
    alert('Please enter an exercise name.');
    return;
  }

  const log = getActiveLog();
  log.exercises.push({
    id: Date.now(),
    name,
    setsReps,
    weight,
    done: false
  });

  saveState();
  closeModal('exerciseModal');
}

function addCheatsheetItem(index, qty = 1) {
  const item = CHEATSHEET_DATABASE[index];
  if (!item) return;
  const log = getActiveLog();
  log.meals.push({
    id: Date.now(),
    name: item.name,
    grams: Math.round(item.grams * qty),
    calories: Math.round(item.cal * qty),
    protein: Math.round(item.protein * qty * 10) / 10,
    meta: `${item.portion}`
  });
  saveState();
}

function addCheatsheetItemByName(name) {
  const idx = CHEATSHEET_DATABASE.findIndex(i => i.name === name);
  if (idx !== -1) addCheatsheetItem(idx, 1);
}

function deleteMeal(id) {
  const log = getActiveLog();
  log.meals = (log.meals || []).filter(m => m.id !== id);
  saveState();
}

function saveRecoveryLog() {
  const log = getActiveLog();
  log.recovery = {
    soreness: Number(document.getElementById('sorenessLog').value) || 3,
    mood: document.getElementById('moodLog').value,
    joint: document.getElementById('jointLog').value,
    notes: document.getElementById('notesLog').value
  };
  saveState();
}

function applyWorkoutSplit(split) {
  const log = getActiveLog();
  log.workout = {
    name: split.name,
    meta: split.meta,
    status: 'Ready'
  };
  log.exercises = JSON.parse(JSON.stringify(split.exercises));
  saveState();
}

function applyTemplateByName(name) {
  if (name === 'Cut day') {
    userSettings.mode = 'Cut mode';
    userSettings.targetCal = 1700;
    userSettings.targetProtein = 130;
  }
  if (name === 'High protein') {
    userSettings.targetProtein = 130;
  }
  if (name === 'Upper Body') {
    applyWorkoutSplit(WORKOUT_SPLITS[0]);
  }
  if (name === 'Legs & Core') {
    applyWorkoutSplit(WORKOUT_SPLITS[1]);
  }
  saveState();
}

// TAB NAVIGATION
function setActiveTab(tabName) {
  currentTab = tabName;
  document.querySelectorAll('.nav-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  const visiblePanels = {
    today: ['todayView'],
    weekly: ['weeklyView'],
    history: ['historyView'],
    templates: ['templatesView']
  };

  document.querySelectorAll('.view-panel').forEach(panel => {
    const shouldShow = (visiblePanels[tabName] || []).includes(panel.id);
    panel.classList.toggle('hidden', !shouldShow);
  });

  const sidebar = document.getElementById('todaySidebar');
  if (sidebar) sidebar.classList.toggle('hidden', tabName !== 'today');
}

// MODAL CONTROLS
function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) {
    m.classList.add('show');
    m.setAttribute('aria-hidden', 'false');
  }
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) {
    m.classList.remove('show');
    m.setAttribute('aria-hidden', 'true');
  }
}

function openEntryModal(type = 'meal') {
  document.getElementById('entryType').value = type;
  document.getElementById('modalTitle').textContent = type === 'meal' ? 'Add Food Entry' : 'Add Workout Entry';
  
  // Render presets
  const presetGroup = document.getElementById('presetGroup');
  const presets = type === 'meal' 
    ? CHEATSHEET_DATABASE.slice(0, 6)
    : WORKOUT_SPLITS.map(s => ({ name: s.name, meta: s.meta }));

  presetGroup.innerHTML = presets.map((p, idx) => `
    <button class="preset-button entry-preset-btn" type="button" data-idx="${idx}">${p.name}</button>
  `).join('');

  presetGroup.querySelectorAll('.entry-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const item = presets[idx];
      document.getElementById('entryName').value = item.name;
      document.getElementById('entryMeta').value = item.meta || item.portion || '';
      if (type === 'meal') {
        document.getElementById('entryGrams').value = item.grams || 100;
        document.getElementById('entryCalories').value = item.cal || 150;
        document.getElementById('entryProtein').value = item.protein || 10;
      }
    });
  });

  openModal('entryModal');
}

function saveEntryModal() {
  const type = document.getElementById('entryType').value;
  const name = document.getElementById('entryName').value.trim();
  const grams = Number(document.getElementById('entryGrams').value || 0);
  const calories = Number(document.getElementById('entryCalories').value || 0);
  const protein = Number(document.getElementById('entryProtein').value || 0);
  const meta = document.getElementById('entryMeta').value.trim();

  if (!name) {
    alert('Please enter a name.');
    return;
  }

  const log = getActiveLog();
  if (type === 'meal') {
    log.meals.unshift({
      id: Date.now(),
      name,
      grams,
      calories,
      protein,
      meta: meta || 'Custom meal entry'
    });
  } else {
    log.workout = { name, meta: meta || 'Custom workout', status: 'Updated' };
  }

  saveState();
  closeModal('entryModal');
  // Reset form inputs
  document.getElementById('entryName').value = '';
  document.getElementById('entryGrams').value = '';
  document.getElementById('entryCalories').value = '';
  document.getElementById('entryProtein').value = '';
  document.getElementById('entryMeta').value = '';
}

// JSON BACKUP EXPORT & IMPORT
function exportDataJSON() {
  const payload = {
    settings: userSettings,
    history: db,
    exportDate: new Date().toISOString(),
    schemaVersion: 2
  };
  const str = JSON.stringify(payload, null, 2);
  const blob = new Blob([str], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fitsync_backup_${getTodayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importDataJSON(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (parsed.settings) userSettings = { ...userSettings, ...parsed.settings };
      if (parsed.history) db = { ...db, ...parsed.history };
      saveState();
      alert('Backup data successfully restored!');
      closeModal('settingsModal');
    } catch (err) {
      alert('Invalid backup JSON file.');
      console.error(err);
    }
  };
  reader.readAsText(file);
}

// EVENT BINDINGS
function bindEvents() {
  // Navigation
  document.querySelectorAll('.nav-pill').forEach(btn => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });

  // Date controls
  document.getElementById('prevDayBtn').addEventListener('click', () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    currentDate = d.toISOString().split('T')[0];
    render();
  });

  document.getElementById('nextDayBtn').addEventListener('click', () => {
    const d = new Date(currentDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    currentDate = d.toISOString().split('T')[0];
    render();
  });

  document.getElementById('todayBtn').addEventListener('click', () => {
    currentDate = getTodayStr();
    render();
  });

  // Actions
  document.getElementById('quickAddButton').addEventListener('click', () => openEntryModal('meal'));
  document.getElementById('addMealButton').addEventListener('click', () => openEntryModal('meal'));
  document.getElementById('addExerciseBtn').addEventListener('click', openAddExerciseModal);
  document.getElementById('selectSplitBtn').addEventListener('click', () => setActiveTab('templates'));

  // Custom Exercise Modal
  document.getElementById('saveExModalBtn').addEventListener('click', saveCustomExercise);
  document.getElementById('cancelExModalBtn').addEventListener('click', () => closeModal('exerciseModal'));

  // Recovery listeners
  ['sorenessLog', 'moodLog', 'jointLog', 'notesLog'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', saveRecoveryLog);
  });

  // Modals
  document.getElementById('openCheatsheetDrawerBtn').addEventListener('click', () => openModal('cheatsheetModal'));
  document.getElementById('closeCheatsheetModalBtn').addEventListener('click', () => closeModal('cheatsheetModal'));

  document.getElementById('cheatSearchInput')?.addEventListener('input', renderCheatsheetDrawer);

  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCatFilter = btn.dataset.cat;
      renderCheatsheetDrawer();
    });
  });

  // Settings & Backup
  document.getElementById('openSettingsButton').addEventListener('click', () => {
    document.getElementById('targetCalInput').value = userSettings.targetCal;
    document.getElementById('targetProteinInput').value = userSettings.targetProtein;
    document.getElementById('targetWeightInput').value = userSettings.weightKg;
    openModal('settingsModal');
  });

  document.getElementById('closeSettingsBtn').addEventListener('click', () => closeModal('settingsModal'));
  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    userSettings.targetCal = Number(document.getElementById('targetCalInput').value) || 1700;
    userSettings.targetProtein = Number(document.getElementById('targetProteinInput').value) || 130;
    userSettings.weightKg = Number(document.getElementById('targetWeightInput').value) || 70.0;
    saveState();
    closeModal('settingsModal');
  });

  document.getElementById('exportBackupBtn').addEventListener('click', exportDataJSON);
  document.getElementById('importBackupInput').addEventListener('change', importDataJSON);

  // Entry Modal
  document.getElementById('saveEntryButton').addEventListener('click', saveEntryModal);
  document.getElementById('cancelEntryButton').addEventListener('click', () => closeModal('entryModal'));
}

// INITIALIZATION
function init() {
  loadState();
  bindEvents();
  render();
}

// Run on page load
document.addEventListener('DOMContentLoaded', init);
