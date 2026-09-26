/**
 * FitSync Dashboard — Unified Primary Logic
 * Local-First, Zero-Cost, Private Personal Health Tracker
 */

const STORAGE_KEY = 'fitsync_archive_v2';
const SETTINGS_KEY = 'fitsync_user_settings_v2';
const CUSTOM_CHEATSHEET_KEY = 'fitsync_custom_cheatsheet_v2';
const ONBOARDED_KEY = 'fitsync_onboarded_v2';
const BACKUP_DATE_KEY = 'fitsync_last_backup_date';
const BACKUP_DISMISSED_KEY = 'fitsync_backup_dismissed_until';

// 22 Real Items & Combos from Calorie Cheatsheet.xlsx (Vegetarian Cut Focus)
const CHEATSHEET_DATABASE = [
  { id: 'cs_1', name: '1 phulka', portion: '1 medium (35g)', grams: 35, cal: 90, protein: 3.2, cat: 'curries' },
  { id: 'cs_2', name: 'Amul protein curd', portion: '100g base', grams: 100, cal: 70, protein: 6.0, cat: 'dairy' },
  { id: 'cs_3', name: 'Normal curd', portion: '100g base', grams: 100, cal: 65, protein: 4.0, cat: 'dairy' },
  { id: 'cs_4', name: '1.5 scoops whey', portion: '1.5 scoops (45g)', grams: 45, cal: 180, protein: 36.0, cat: 'dairy' },
  { id: 'cs_5', name: '1 scoop yeast protein', portion: '1 scoop (30g)', grams: 30, cal: 130, protein: 27.0, cat: 'dairy' },
  { id: 'cs_6', name: 'Rajma curry', portion: '100g base', grams: 100, cal: 125, protein: 7.5, cat: 'curries' },
  { id: 'cs_7', name: 'Soya / Chana curry', portion: '100g base', grams: 100, cal: 145, protein: 11.0, cat: 'curries' },
  { id: 'cs_8', name: '2‑egg cheese omelette', portion: '2 eggs + 50g cheese', grams: 160, cal: 300, protein: 25.0, cat: 'dairy' },
  { id: 'cs_9', name: '2 Whole Eggs', portion: '2 whole eggs', grams: 100, cal: 150, protein: 12.5, cat: 'dairy' },
  { id: 'cs_10', name: 'Protein oats', portion: '100g base', grams: 100, cal: 360, protein: 26.0, cat: 'dairy' },
  { id: 'cs_11', name: 'Makhana (Foxnuts)', portion: '50g base', grams: 50, cal: 180, protein: 4.0, cat: 'snacks' },
  { id: 'cs_12', name: 'Mixed nuts', portion: '10g base', grams: 10, cal: 65, protein: 1.5, cat: 'snacks' },
  { id: 'cs_13', name: 'Sprouts', portion: '100g base', grams: 100, cal: 35, protein: 3.0, cat: 'snacks' },
  { id: 'cs_14', name: 'Pomegranates / Berries', portion: '100g base', grams: 100, cal: 80, protein: 1.0, cat: 'snacks' },
  { id: 'cs_15', name: 'Buttermilk', portion: '100ml base', grams: 100, cal: 42, protein: 2.5, cat: 'dairy' },
  { id: 'cs_16', name: 'Whole Milk', portion: '300ml glass', grams: 300, cal: 185, protein: 10.0, cat: 'dairy' },
  { id: 'cs_17', name: '1 Banana', portion: '1 medium', grams: 110, cal: 100, protein: 1.1, cat: 'snacks' },
  { id: 'cs_18', name: 'Carrot', portion: '1 medium', grams: 80, cal: 30, protein: 0.5, cat: 'snacks' },
  { id: 'cs_19', name: 'Corn Cob', portion: '1 medium', grams: 120, cal: 95, protein: 3.2, cat: 'snacks' },
  { id: 'cs_20', name: 'Morning: Curd + Oats + Berries', portion: 'Full Bowl (350g)', grams: 350, cal: 590, protein: 38.5, cat: 'meals' },
  { id: 'cs_21', name: 'Lunch: 3 Phulkas + Rajma + Curd', portion: 'Full Meal (550g)', grams: 550, cal: 770, protein: 42.0, cat: 'meals' },
  { id: 'cs_22', name: 'Dinner: 2-Egg Omelette + Whey', portion: 'High Protein Dinner', grams: 300, cal: 490, protein: 61.0, cat: 'meals' }
];

// 4-Day Workout Split Cards from Daily_Workout_Checklist_Cards.txt
const WORKOUT_SPLITS = [
  {
    key: 'monday',
    name: 'Upper Body + Core + Pull-Ups (60 min)',
    meta: '3 Rounds · Goblet Squats, RDLs, Pull-ups, Bicep Curls, Press, Plank Rows',
    exercises: [
      { id: 1, name: 'Goblet Squats', setsReps: '3x10', weight: '12.5kg' },
      { id: 2, name: 'Romanian Deadlifts', setsReps: '3x8', weight: '12.5kg' },
      { id: 3, name: 'Russian Twists', setsReps: '3x12', weight: '5kg' },
      { id: 4, name: 'Pull-Ups', setsReps: '3x6', weight: 'BW' },
      { id: 5, name: 'Bicep Curls', setsReps: '3x8', weight: '12.5kg' },
      { id: 6, name: 'Shoulder Press', setsReps: '3x8', weight: '12.5kg' },
      { id: 7, name: 'Overhead Tricep Ext', setsReps: '3x8', weight: '12.5kg' },
      { id: 8, name: 'Dumbbell Shrugs', setsReps: '3x10', weight: '12.5kg' },
      { id: 9, name: 'Plank Rows', setsReps: '3x8', weight: '5kg' },
      { id: 10, name: 'Mewing & Chin Tucks', setsReps: '2x15', weight: 'BW' }
    ]
  },
  {
    key: 'tuesday',
    name: 'Legs + Core (Light) (45 min)',
    meta: '3 Rounds · Goblet Squats, Walking Lunges, Calf Raises, Weighted Sit-ups',
    exercises: [
      { id: 1, name: 'Goblet Squats', setsReps: '3x10', weight: '12.5kg' },
      { id: 2, name: 'Walking Lunges', setsReps: '3x10', weight: 'BW' },
      { id: 3, name: 'Calf Raises', setsReps: '3x15', weight: 'BW' },
      { id: 4, name: 'Russian Twists', setsReps: '3x12', weight: '5kg' },
      { id: 5, name: 'Weighted Sit-ups', setsReps: '3x10', weight: '10kg' },
      { id: 6, name: 'Mewing & Chin Tucks', setsReps: '2x15', weight: 'BW' }
    ]
  },
  {
    key: 'wednesday',
    name: 'Upper Body + Pull-Ups Focus (60 min)',
    meta: '3 Rounds · Bicep Curls, Shoulder Press, Assisted Pull-ups',
    exercises: [
      { id: 1, name: 'Goblet Squats', setsReps: '3x10', weight: '12.5kg' },
      { id: 2, name: 'Romanian Deadlifts', setsReps: '3x8', weight: '12.5kg' },
      { id: 3, name: 'Bicep Curls', setsReps: '3x8', weight: '12.5kg' },
      { id: 4, name: 'Shoulder Press', setsReps: '3x8', weight: '12.5kg' },
      { id: 5, name: 'Overhead Tricep Ext', setsReps: '3x8', weight: '12.5kg' },
      { id: 6, name: 'Pull-Ups (Assisted)', setsReps: '3x6', weight: 'BW' },
      { id: 7, name: 'Dumbbell Shrugs', setsReps: '3x10', weight: '12.5kg' },
      { id: 8, name: 'Plank Rows', setsReps: '3x8', weight: '5kg' }
    ]
  },
  {
    key: 'thursday',
    name: 'Legs + Core Emphasis (50 min)',
    meta: 'Quad & Hamstring Emphasis · Bulgarian Split Squats, Leg Curls, Planks',
    exercises: [
      { id: 1, name: 'Goblet Squats', setsReps: '3x10', weight: '12.5kg' },
      { id: 2, name: 'Bulgarian Split Squats', setsReps: '3x8', weight: 'BW' },
      { id: 3, name: 'Romanian Deadlifts', setsReps: '3x8', weight: '12.5kg' },
      { id: 4, name: 'Leg Curls', setsReps: '3x10', weight: '12.5kg' },
      { id: 5, name: 'Calf Raises', setsReps: '3x15', weight: 'BW' },
      { id: 6, name: 'Plank Holds', setsReps: '3x45', weight: 'BW' },
      { id: 7, name: 'Russian Twists', setsReps: '3x12', weight: '5kg' }
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
  weightKg: 70.0,
  targetWater: 3.0,
  defaultRestSec: 90,
  soundStyle: 'gentle',
  preferredStaples: [
    '1 phulka',
    'Amul protein curd',
    '1.5 scoops whey',
    'Rajma curry',
    '2‑egg cheese omelette',
    'Makhana (Foxnuts)'
  ]
};

let db = {}; // Stores daily logs keyed by YYYY-MM-DD
let customCheatsheet = []; // User-added custom foods

function getTodayStr() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// HELPER: NORMALIZE EXERCISE INTO SET-BY-SET STRUCTURE
function normalizeExerciseSets(ex) {
  if (Array.isArray(ex.sets) && ex.sets.length > 0) {
    return ex;
  }
  let numSets = 3;
  let repCount = 10;
  if (ex.setsReps) {
    const match = String(ex.setsReps).match(/(\d+)\s*x\s*(\d+)/i);
    if (match) {
      numSets = parseInt(match[1], 10) || 3;
      repCount = parseInt(match[2], 10) || 10;
    }
  }
  const weightNum = parseFloat(ex.weight) || (ex.weight === 'BW' ? 0 : 12.5);
  ex.sets = [];
  for (let i = 1; i <= numSets; i++) {
    ex.sets.push({
      setNum: i,
      weight: weightNum,
      reps: repCount,
      done: false
    });
  }
  ex.done = false;
  return ex;
}

// GET OR INITIALIZE DAY LOG (CLEAN ZERO / NULL FOR UNLOGGED DAYS)
function getActiveLog(dateStr = currentDate) {
  if (!db[dateStr]) {
    const dayOfWeek = new Date(dateStr + 'T00:00:00').getDay(); // 0 = Sun, 1 = Mon...
    let splitObj = WORKOUT_SPLITS[0]; // Default Monday
    if (dayOfWeek === 2) splitObj = WORKOUT_SPLITS[1]; // Tuesday
    if (dayOfWeek === 3) splitObj = WORKOUT_SPLITS[2]; // Wednesday
    if (dayOfWeek === 4) splitObj = WORKOUT_SPLITS[3]; // Thursday

    const initialExercises = JSON.parse(JSON.stringify(splitObj.exercises)).map(ex => {
      ex.done = false;
      return normalizeExerciseSets(ex);
    });

    db[dateStr] = {
      date: dateStr,
      workout: {
        name: splitObj.name,
        meta: splitObj.meta,
        status: 'Ready'
      },
      exercises: initialExercises,
      meals: [], // Zero / null default for clean slate
      water: 0.0, // Zero default water
      recovery: { soreness: '', mood: '', joint: '', notes: '' }
    };
  } else {
    // Normalize existing log if necessary
    if (db[dateStr].exercises) {
      db[dateStr].exercises.forEach(ex => normalizeExerciseSets(ex));
    }
    if (typeof db[dateStr].water === 'undefined') {
      db[dateStr].water = 0.0;
    }
    if (!Array.isArray(db[dateStr].meals)) {
      db[dateStr].meals = [];
    }
    if (!db[dateStr].recovery) {
      db[dateStr].recovery = { soreness: '', mood: '', joint: '', notes: '' };
    }
  }
  return db[dateStr];
}

function loadState() {
  try {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) userSettings = { ...userSettings, ...JSON.parse(savedSettings) };

    const savedDB = localStorage.getItem(STORAGE_KEY);
    if (savedDB) db = JSON.parse(savedDB);

    const savedCustomFoods = localStorage.getItem(CUSTOM_CHEATSHEET_KEY);
    if (savedCustomFoods) customCheatsheet = JSON.parse(savedCustomFoods);
  } catch (err) {
    console.warn('Could not load local state cleanly, using defaults.', err);
  }
}

function saveState() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(userSettings));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    localStorage.setItem(CUSTOM_CHEATSHEET_KEY, JSON.stringify(customCheatsheet));
  } catch (err) {
    console.warn('Could not save to localStorage.', err);
  }
  render();
}

// AUDIO ENGINE (PRELOADED HTML5 AUDIO WITH USER UNLOCK)
function playAudio(elementId) {
  if (userSettings.soundStyle === 'silent') return;
  const audio = document.getElementById(elementId);
  if (!audio) return;
  audio.currentTime = 0;
  audio.play().catch(() => {
    audio.load();
    audio.play().catch(e => console.warn('Audio play prevented:', e));
  });
}

function unlockAllAudio() {
  ['sndRest', 'sndWorkout', 'sndApplause'].forEach(id => {
    const a = document.getElementById(id);
    if (a) a.load();
  });
}

window.addEventListener('click', unlockAllAudio, { once: true });
window.addEventListener('touchstart', unlockAllAudio, { once: true });

// TOAST ALERT NOTIFICATION
function showToast(icon, title, sub) {
  const toast = document.getElementById('prToast');
  if (!toast) return;
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastSub').textContent = sub;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, 3800);
}

// REST COUNTDOWN TIMER
let restInterval = null;
let restRemaining = 90;

function startRestTimer(seconds = (userSettings.defaultRestSec || 90)) {
  unlockAllAudio();
  clearInterval(restInterval);
  restRemaining = seconds;
  updateRestDisplay();

  const bar = document.getElementById('floatingRestBar');
  if (bar) bar.classList.remove('hidden');

  restInterval = setInterval(() => {
    restRemaining--;
    updateRestDisplay();

    if (restRemaining <= 0) {
      clearInterval(restInterval);
      playAudio('sndRest');
      showToast('🌱', 'Rest Complete — Ready for Next Set!', 'Take a breath and crush your reps.');
      if (bar) bar.classList.add('hidden');
    }
  }, 1000);
}

function stopRestTimer() {
  clearInterval(restInterval);
  restRemaining = 0;
  const bar = document.getElementById('floatingRestBar');
  if (bar) bar.classList.add('hidden');
}

function addRestSeconds(sec = 30) {
  restRemaining += sec;
  updateRestDisplay();
}

function updateRestDisplay() {
  const m = Math.floor(restRemaining / 60);
  const s = restRemaining % 60;
  const display = document.getElementById('restTimerDisplay');
  if (display) {
    display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}

// CELEBRATIONS: PR & WORKOUT COMPLETE
function triggerPRCelebration(exName = 'Workout PR', detail = 'Personal best logged') {
  unlockAllAudio();
  if (window.confetti) {
    window.confetti({ particleCount: 100, spread: 60, origin: { x: 0.15, y: 0.7 } });
    window.confetti({ particleCount: 100, spread: 60, origin: { x: 0.85, y: 0.7 } });
    setTimeout(() => {
      window.confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    }, 250);
  }
  playAudio('sndApplause');
  showToast('👏', `NEW PERSONAL RECORD: ${exName}!`, detail);
}

function triggerWorkoutCelebration() {
  unlockAllAudio();
  if (window.confetti) {
    window.confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }
  playAudio('sndWorkout');
  showToast('💪', 'Workout Routine Completed!', 'Great session today. Log your hydration and recovery notes.');
}

// CALCULATION HELPERS
function sumMealsCalories(log = getActiveLog()) {
  return (log.meals || []).reduce((sum, m) => sum + (Number(m.calories) || 0), 0);
}

function sumMealsProtein(log = getActiveLog()) {
  return Math.round((log.meals || []).reduce((sum, m) => sum + (Number(m.protein) || 0), 0) * 10) / 10;
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
  const deltaProtein = Math.round((userSettings.targetProtein - totalProtein) * 10) / 10;

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
        <div class="progress-bar-fill" style="width: 100%; opacity: 0.25;"></div>
      </div>
    </div>
  `;
}

// HYDRATION WIDGET RENDERING
function renderWaterWidget() {
  const log = getActiveLog();
  const currentWater = Number(log.water) || 0.0;
  const targetWater = Number(userSettings.targetWater) || 3.0;
  const pct = Math.min(Math.round((currentWater / targetWater) * 100), 100);

  const fill = document.getElementById('waterFill');
  if (fill) fill.style.height = `${pct}%`;

  const litresText = document.getElementById('waterLitresText');
  if (litresText) litresText.textContent = `${currentWater.toFixed(1)} L`;

  const targetText = document.getElementById('waterTargetText');
  if (targetText) targetText.textContent = `Target: ${targetWater.toFixed(1)} L`;

  const meta = document.getElementById('waterMeta');
  if (meta) meta.textContent = `Target: ${targetWater.toFixed(1)} Litres · ${pct}% achieved`;

  const statusPill = document.getElementById('waterStatusPill');
  if (statusPill) {
    statusPill.innerHTML = `<span class="dot"></span> ${currentWater.toFixed(1)} / ${targetWater.toFixed(1)} L`;
  }
}

// SET-BY-SET EXERCISE LIST RENDERING
function renderWorkout() {
  const log = getActiveLog();
  const workout = log.workout || { name: 'Upper Body Circuit', meta: 'Home dumbbells', status: 'Ready' };
  
  document.getElementById('workoutMeta').textContent = workout.meta;
  document.getElementById('workoutStatus').innerHTML = `<span class="dot"></span> ${workout.status}`;

  const exContainer = document.getElementById('exerciseList');
  if (!exContainer) return;

  if (!log.exercises || log.exercises.length === 0) {
    exContainer.innerHTML = '<div class="card-subtext" style="padding: 12px 0;">No exercises added for this day. Click "+ Add Exercise" or "Switch Split".</div>';
    return;
  }

  exContainer.innerHTML = log.exercises.map(ex => {
    const isExCompleted = ex.sets && ex.sets.length > 0 && ex.sets.every(s => s.done);
    return `
      <div class="exercise-card-set ${isExCompleted ? 'completed' : ''}" data-exid="${ex.id}">
        <div class="ex-header">
          <div class="ex-title-wrap">
            <span class="ex-title">${ex.name}</span>
            <span class="ex-target-pill">${ex.sets.length} Sets · ${ex.sets[0]?.weight || 0}kg</span>
          </div>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button class="btn-del ex-del-btn" data-exid="${ex.id}" title="Remove Exercise">✕</button>
          </div>
        </div>

        <div class="sets-wrap">
          ${ex.sets.map(s => `
            <div class="set-row ${s.done ? 'done-row' : ''}">
              <span class="set-label">SET ${s.setNum}</span>
              
              <div class="stepper-pill">
                <button class="step-btn step-w-down" data-exid="${ex.id}" data-setnum="${s.setNum}">-</button>
                <span class="step-val">${s.weight} kg</span>
                <button class="step-btn step-w-up" data-exid="${ex.id}" data-setnum="${s.setNum}">+</button>
              </div>

              <div class="stepper-pill">
                <button class="step-btn step-r-down" data-exid="${ex.id}" data-setnum="${s.setNum}">-</button>
                <span class="step-val">${s.reps} reps</span>
                <button class="step-btn step-r-up" data-exid="${ex.id}" data-setnum="${s.setNum}">+</button>
              </div>

              <input type="checkbox" class="set-check" ${s.done ? 'checked' : ''} data-exid="${ex.id}" data-setnum="${s.setNum}" />
              
              <button class="btn-del-set" data-exid="${ex.id}" data-setnum="${s.setNum}" title="Delete set">✕</button>
            </div>
          `).join('')}
        </div>

        <div class="ex-footer-actions">
          <button class="mini-button btn-add-set" data-exid="${ex.id}">+ Add Set</button>
          <span style="font-size: 0.74rem; color: var(--muted);">${isExCompleted ? '✓ Completed' : 'Check box to finish set & start rest'}</span>
        </div>
      </div>
    `;
  }).join('');

  // Bind Exercise Stepper & Checkbox Events
  exContainer.querySelectorAll('.step-w-down').forEach(btn => {
    btn.addEventListener('click', () => adjustSetWeight(Number(btn.dataset.exid), Number(btn.dataset.setnum), -2.5));
  });
  exContainer.querySelectorAll('.step-w-up').forEach(btn => {
    btn.addEventListener('click', () => adjustSetWeight(Number(btn.dataset.exid), Number(btn.dataset.setnum), 2.5));
  });
  exContainer.querySelectorAll('.step-r-down').forEach(btn => {
    btn.addEventListener('click', () => adjustSetReps(Number(btn.dataset.exid), Number(btn.dataset.setnum), -1));
  });
  exContainer.querySelectorAll('.step-r-up').forEach(btn => {
    btn.addEventListener('click', () => adjustSetReps(Number(btn.dataset.exid), Number(btn.dataset.setnum), 1));
  });
  exContainer.querySelectorAll('.set-check').forEach(cb => {
    cb.addEventListener('change', () => toggleSetDone(Number(cb.dataset.exid), Number(cb.dataset.setnum)));
  });
  exContainer.querySelectorAll('.btn-del-set').forEach(btn => {
    btn.addEventListener('click', () => deleteSet(Number(btn.dataset.exid), Number(btn.dataset.setnum)));
  });
  exContainer.querySelectorAll('.btn-add-set').forEach(btn => {
    btn.addEventListener('click', () => addSetToExercise(Number(btn.dataset.exid)));
  });
  exContainer.querySelectorAll('.ex-del-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteEx(Number(btn.dataset.exid)));
  });

  // Recovery Log fields
  const rec = log.recovery || {};
  document.getElementById('sorenessLog').value = rec.soreness || '';
  document.getElementById('moodLog').value = rec.mood || '';
  document.getElementById('jointLog').value = rec.joint || '';
  document.getElementById('notesLog').value = rec.notes || '';
}

// MEALS LIST & QUICK STAPLES RENDERING
function renderMeals() {
  const log = getActiveLog();
  const mealContainer = document.getElementById('mealList');
  
  if (!log.meals || log.meals.length === 0) {
    mealContainer.innerHTML = '<div class="card-subtext" style="padding: 12px 0;">No meals logged yet today. Use the Quick Add Staples chips or Cheatsheet Drawer!</div>';
  } else {
    mealContainer.innerHTML = log.meals.map(m => `
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
  }

  // Quick Staples Chips
  const staplesWrap = document.getElementById('quickStaplesWrap');
  const staplesToDisplay = (userSettings.preferredStaples && userSettings.preferredStaples.length > 0)
    ? userSettings.preferredStaples
    : ['1 phulka', 'Amul protein curd', '1.5 scoops whey', 'Rajma curry', '2‑egg cheese omelette'];

  staplesWrap.innerHTML = staplesToDisplay.map(name => `
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
  const currentWater = Number(log.water) || 0.0;

  // Summary List
  const summary = document.getElementById('summaryList');
  summary.innerHTML = `
    <div class="summary-row"><span>Calories</span><strong>${totalCal} / ${userSettings.targetCal} kcal</strong></div>
    <div class="summary-row"><span>Protein</span><strong>${totalProtein} / ${userSettings.targetProtein}g</strong></div>
    <div class="summary-row"><span>Water Intake</span><strong>${currentWater.toFixed(1)} / ${userSettings.targetWater || 3.0} L</strong></div>
    <div class="summary-row"><span>Body Weight</span><strong>${userSettings.weightKg} kg</strong></div>
    <div class="summary-row"><span>Workout Split</span><strong>${log.workout?.name?.split('(')[0] || 'Rest'}</strong></div>
  `;

  // Dynamic Past 7 Days Adherence Week Chart
  const weekChart = document.getElementById('weekChart');
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const now = new Date(currentDate + 'T00:00:00');
  const dayOfWeek = (now.getDay() + 6) % 7; // 0=Mon, 6=Sun
  
  // Get Monday of current week
  const monday = new Date(now);
  monday.setDate(monday.getDate() - dayOfWeek);

  const weekScores = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    const dateKey = d.toISOString().split('T')[0];
    const dayLog = db[dateKey];
    if (dayLog && (dayLog.meals?.length > 0 || dayLog.exercises?.some(e => e.done))) {
      const cal = sumMealsCalories(dayLog);
      const prot = sumMealsProtein(dayLog);
      const calScore = Math.min(100, Math.round((cal / userSettings.targetCal) * 100));
      const protScore = Math.min(100, Math.round((prot / userSettings.targetProtein) * 100));
      weekScores.push(Math.round((calScore + protScore) / 2));
    } else {
      weekScores.push(dateKey === currentDate ? 10 : 0);
    }
  }

  weekChart.innerHTML = weekScores.map((score, idx) => `
    <div class="week-day" title="${labels[idx]}: ${score}% adherence">
      <div class="week-bar ${idx % 2 === 1 ? 'alt' : ''}" style="height: ${Math.max(12, score)}%"></div>
      <div class="week-label">${labels[idx]}</div>
    </div>
  `).join('');

  // Quick Split Switcher in Sidebar
  const templateList = document.getElementById('templateList');
  templateList.innerHTML = WORKOUT_SPLITS.map((split, idx) => `
    <div class="template-item sidebar-split-btn" data-idx="${idx}">
      <span style="font-weight: 700;">${split.name.split('(')[0]}</span>
      <span class="meal-tag">${split.exercises.length} Ex</span>
    </div>
  `).join('');

  templateList.querySelectorAll('.sidebar-split-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      applyWorkoutSplit(WORKOUT_SPLITS[idx]);
      showToast('🔄', 'Workout Split Loaded!', WORKOUT_SPLITS[idx].name);
    });
  });
}

// CHEATSHEET DRAWER WITH MULTIPLIERS & CUSTOM FOODS
function getAllCheatsheetItems() {
  return [...CHEATSHEET_DATABASE, ...customCheatsheet];
}

function renderCheatsheetDrawer() {
  const search = (document.getElementById('cheatSearchInput')?.value || '').toLowerCase();
  const grid = document.getElementById('cheatListGrid');
  if (!grid) return;

  const allItems = getAllCheatsheetItems();
  const filtered = allItems.filter(item => {
    const isCustom = !!item.isCustom;
    let matchCat = false;
    if (activeCatFilter === 'all') matchCat = true;
    else if (activeCatFilter === 'custom') matchCat = isCustom;
    else matchCat = item.cat === activeCatFilter;

    const matchSearch = item.name.toLowerCase().includes(search) || (item.portion || '').toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="card-subtext" style="padding: 16px; text-align: center;">No items found. Tap "➕ Add Food" to create your own!</div>';
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <div class="cheat-card" data-id="${item.id}">
      <div>
        <strong style="font-size: 0.92rem;">
          ${item.name}
          ${item.isCustom ? '<span class="badge-custom">Custom</span>' : ''}
        </strong>
        <div style="font-size: 0.76rem; color: var(--muted); margin-top: 2px;">
          ${item.portion} · ${item.cal} kcal · ${item.protein}g protein
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <div class="multiplier-row">
          <button class="mult-btn" data-mult="0.5">0.5x</button>
          <button class="mult-btn active" data-mult="1">1x</button>
          <button class="mult-btn" data-mult="2">2x</button>
          <button class="mult-btn" data-mult="3">3x</button>
        </div>
        <button class="mini-button accent-btn add-cheat-mult-btn" data-id="${item.id}">+ Add</button>
        ${item.isCustom ? `<button class="btn-del delete-custom-food-btn" data-id="${item.id}" title="Delete Custom Food">✕</button>` : ''}
      </div>
    </div>
  `).join('');

  // Handle Multiplier pill selection
  grid.querySelectorAll('.mult-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.multiplier-row');
      parent.querySelectorAll('.mult-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Handle Add with active multiplier
  grid.querySelectorAll('.add-cheat-mult-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.cheat-card');
      const activeMultBtn = card.querySelector('.mult-btn.active');
      const mult = activeMultBtn ? parseFloat(activeMultBtn.dataset.mult) : 1;
      addCheatsheetItemById(btn.dataset.id, mult);
      closeModal('cheatsheetModal');
    });
  });

  // Delete Custom Food
  grid.querySelectorAll('.delete-custom-food-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Delete this custom food from cheatsheet?')) {
        deleteCustomFood(btn.dataset.id);
      }
    });
  });
}

// REAL DYNAMIC 7-DAY ADHERENCE VIEW
function renderWeeklyView() {
  const weeklyList = document.getElementById('weeklyMetrics');
  if (!weeklyList) return;

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date(currentDate + 'T00:00:00');
  const dayOfWeek = (now.getDay() + 6) % 7; // 0=Mon, 6=Sun
  
  const monday = new Date(now);
  monday.setDate(monday.getDate() - dayOfWeek);

  let totalAdherenceSum = 0;
  let loggedDaysCount = 0;
  let totalCaloriesWeek = 0;
  let totalProteinWeek = 0;

  const rowsHtml = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    const dateKey = d.toISOString().split('T')[0];
    const dayLog = db[dateKey];

    let score = 0;
    if (dayLog) {
      const c = sumMealsCalories(dayLog);
      const p = sumMealsProtein(dayLog);
      const calScore = Math.min(100, Math.round((c / userSettings.targetCal) * 100));
      const protScore = Math.min(100, Math.round((p / userSettings.targetProtein) * 100));
      score = Math.round((calScore + protScore) / 2);
      if (c > 0 || p > 0) {
        loggedDaysCount++;
        totalCaloriesWeek += c;
        totalProteinWeek += p;
        totalAdherenceSum += score;
      }
    }

    rowsHtml.push(`
      <div class="summary-row">
        <span style="width: 50px; font-weight: 700;">${labels[i]}</span>
        <div style="flex: 1; background: #edf3ff; height: 12px; border-radius: 6px; overflow: hidden; margin: 0 12px;">
          <div style="width: ${score}%; background: var(--primary); height: 100%;"></div>
        </div>
        <strong>${score}% adherence</strong>
      </div>
    `);
  }

  weeklyList.innerHTML = rowsHtml.join('');

  const avgAdherence = loggedDaysCount > 0 ? Math.round(totalAdherenceSum / loggedDaysCount) : 0;
  const avgCal = loggedDaysCount > 0 ? Math.round(totalCaloriesWeek / loggedDaysCount) : 0;
  const avgProtein = loggedDaysCount > 0 ? Math.round((totalProteinWeek / loggedDaysCount) * 10) / 10 : 0;

  document.getElementById('weeklySummary').innerHTML = `
    <div class="summary-row"><span>7-Day Logged Days</span><strong>${loggedDaysCount} / 7 days</strong></div>
    <div class="summary-row"><span>Average Adherence</span><strong>${avgAdherence}%</strong></div>
    <div class="summary-row"><span>Average Daily Calories</span><strong>${avgCal} / ${userSettings.targetCal} kcal</strong></div>
    <div class="summary-row"><span>Average Daily Protein</span><strong>${avgProtein} / ${userSettings.targetProtein}g</strong></div>
  `;
}

function renderHistoryView() {
  const historyList = document.getElementById('historyList');
  if (!historyList) return;

  const keys = Object.keys(db).sort().reverse();
  if (keys.length === 0) {
    historyList.innerHTML = '<div class="card-subtext" style="padding: 16px;">No historical logs recorded yet. Complete today to start your archive!</div>';
    return;
  }

  historyList.innerHTML = keys.map(dateKey => {
    const entry = db[dateKey];
    const c = sumMealsCalories(entry);
    const p = sumMealsProtein(entry);
    const water = entry.water ? entry.water.toFixed(1) + 'L' : '0.0L';
    const completedSets = (entry.exercises || []).reduce((acc, ex) => acc + (ex.sets?.filter(s => s.done).length || 0), 0);
    return `
      <div class="card mb-12">
        <div class="card-row flex-between">
          <div>
            <strong class="card-title">${dateKey}</strong>
            <div class="card-subtext">${entry.workout?.name || 'Workout session'} · ${completedSets} sets done · ${water} water</div>
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
      showToast('🏋️', 'Loaded Split Routine', WORKOUT_SPLITS[idx].name);
    });
  });
}

function checkBackupReminder() {
  const banner = document.getElementById('backupBanner');
  if (!banner) return;

  const dismissedUntil = localStorage.getItem(BACKUP_DISMISSED_KEY);
  if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
    banner.classList.add('hidden');
    return;
  }

  const lastBackupStr = localStorage.getItem(BACKUP_DATE_KEY);
  if (!lastBackupStr) {
    banner.classList.remove('hidden');
    return;
  }

  const lastDate = new Date(lastBackupStr);
  const diffDays = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays >= 14) {
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

function render() {
  renderDateHeader();
  renderMetrics();
  renderWaterWidget();
  renderWorkout();
  renderMeals();
  renderSidebar();
  renderCheatsheetDrawer();
  renderWeeklyView();
  renderHistoryView();
  renderTemplatesView();
  checkBackupReminder();
}

// EXERCISE SET ACTIONS
function adjustSetWeight(exId, setNum, delta) {
  const log = getActiveLog();
  const ex = (log.exercises || []).find(e => e.id === exId);
  if (!ex) return;
  const setObj = ex.sets.find(s => s.setNum === setNum);
  if (!setObj) return;

  setObj.weight = Math.max(0, Math.round((setObj.weight + delta) * 10) / 10);
  saveState();
}

function adjustSetReps(exId, setNum, delta) {
  const log = getActiveLog();
  const ex = (log.exercises || []).find(e => e.id === exId);
  if (!ex) return;
  const setObj = ex.sets.find(s => s.setNum === setNum);
  if (!setObj) return;

  setObj.reps = Math.max(1, setObj.reps + delta);
  saveState();
}

function toggleSetDone(exId, setNum) {
  const log = getActiveLog();
  const ex = (log.exercises || []).find(e => e.id === exId);
  if (!ex) return;
  const setObj = ex.sets.find(s => s.setNum === setNum);
  if (!setObj) return;

  setObj.done = !setObj.done;
  ex.done = ex.sets.every(s => s.done);

  if (setObj.done) {
    const allWorkoutDone = log.exercises.length > 0 && log.exercises.every(e => e.done);
    if (allWorkoutDone) {
      log.workout.status = 'Completed';
      triggerWorkoutCelebration();
    } else {
      showToast('⚡', `Set ${setNum} Crushed!`, `${ex.name} — starting rest timer.`);
      startRestTimer(userSettings.defaultRestSec || 90);
    }
  }

  saveState();
}

function deleteSet(exId, setNum) {
  const log = getActiveLog();
  const ex = (log.exercises || []).find(e => e.id === exId);
  if (!ex || ex.sets.length <= 1) return;

  ex.sets = ex.sets.filter(s => s.setNum !== setNum);
  // Re-index remaining sets
  ex.sets.forEach((s, idx) => s.setNum = idx + 1);
  ex.done = ex.sets.every(s => s.done);
  saveState();
}

function addSetToExercise(exId) {
  const log = getActiveLog();
  const ex = (log.exercises || []).find(e => e.id === exId);
  if (!ex) return;

  const lastSet = ex.sets[ex.sets.length - 1];
  const newSetNum = ex.sets.length + 1;
  ex.sets.push({
    setNum: newSetNum,
    weight: lastSet ? lastSet.weight : 12.5,
    reps: lastSet ? lastSet.reps : 10,
    done: false
  });
  ex.done = false;
  saveState();
}

function deleteEx(id) {
  const log = getActiveLog();
  log.exercises = (log.exercises || []).filter(e => e.id !== id);
  saveState();
}

function openAddExerciseModal() {
  document.getElementById('customExName').value = '';
  document.getElementById('customExSets').value = '3';
  document.getElementById('customExWeight').value = '12.5';
  document.getElementById('customExReps').value = '10';
  openModal('exerciseModal');
}

function saveCustomExercise() {
  const name = document.getElementById('customExName').value.trim();
  const numSets = parseInt(document.getElementById('customExSets').value, 10) || 3;
  const weight = parseFloat(document.getElementById('customExWeight').value) || 0;
  const reps = parseInt(document.getElementById('customExReps').value, 10) || 10;

  if (!name) {
    alert('Please enter an exercise name.');
    return;
  }

  const newSets = [];
  for (let i = 1; i <= numSets; i++) {
    newSets.push({ setNum: i, weight, reps, done: false });
  }

  const log = getActiveLog();
  log.exercises.push({
    id: Date.now(),
    name,
    setsReps: `${numSets}x${reps}`,
    weight: `${weight}kg`,
    sets: newSets,
    done: false
  });

  saveState();
  closeModal('exerciseModal');
  showToast('💪', 'Exercise Added!', name);
}

// HYDRATION ACTIONS
function setWaterAmount(litres) {
  const log = getActiveLog();
  log.water = Math.max(0, Math.min(6.0, Math.round(litres * 10) / 10));
  saveState();
}

function addWater(amount) {
  const log = getActiveLog();
  const current = Number(log.water) || 0;
  setWaterAmount(current + amount);
}

function resetWater() {
  setWaterAmount(0.0);
}

function initWaterSlider() {
  const slider = document.getElementById('waterSlider');
  if (!slider) return;

  let isDragging = false;
  function handleMove(e) {
    const rect = slider.getBoundingClientRect();
    const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
    const offsetY = clientY - rect.top;
    const clampedY = Math.max(0, Math.min(rect.height, offsetY));
    const invertedPct = 1 - (clampedY / rect.height);
    const target = userSettings.targetWater || 3.0;
    const newWater = Math.round((invertedPct * target) * 10) / 10;
    setWaterAmount(newWater);
  }

  slider.addEventListener('mousedown', (e) => { isDragging = true; handleMove(e); });
  window.addEventListener('mousemove', (e) => { if (isDragging) handleMove(e); });
  window.addEventListener('mouseup', () => { isDragging = false; });

  slider.addEventListener('touchstart', (e) => { isDragging = true; handleMove(e); }, { passive: false });
  window.addEventListener('touchmove', (e) => { if (isDragging) { e.preventDefault(); handleMove(e); } }, { passive: false });
  window.addEventListener('touchend', () => { isDragging = false; });
}

// CHEATSHEET & MEAL LOGGING ACTIONS
function addCheatsheetItemById(id, mult = 1) {
  const allItems = getAllCheatsheetItems();
  const item = allItems.find(i => i.id === id);
  if (!item) return;

  const log = getActiveLog();
  const scaledGrams = Math.round(item.grams * mult);
  const scaledCal = Math.round(item.cal * mult);
  const scaledProtein = Math.round(item.protein * mult * 10) / 10;

  log.meals.unshift({
    id: Date.now(),
    name: `${mult !== 1 ? mult + 'x ' : ''}${item.name}`,
    grams: scaledGrams,
    calories: scaledCal,
    protein: scaledProtein,
    meta: `${item.portion} (x${mult})`
  });

  saveState();
  showToast('🥗', 'Meal Added!', `${item.name} (${scaledCal} kcal, ${scaledProtein}g protein)`);
}

function addCheatsheetItemByName(name, mult = 1) {
  const allItems = getAllCheatsheetItems();
  const item = allItems.find(i => i.name.toLowerCase() === name.toLowerCase());
  if (item) {
    addCheatsheetItemById(item.id, mult);
  } else {
    // Fallback search
    const partial = allItems.find(i => i.name.toLowerCase().includes(name.toLowerCase()));
    if (partial) addCheatsheetItemById(partial.id, mult);
  }
}

function deleteMeal(id) {
  const log = getActiveLog();
  log.meals = (log.meals || []).filter(m => m.id !== id);
  saveState();
}

function saveCustomFood() {
  const name = document.getElementById('cfName').value.trim();
  const cat = document.getElementById('cfCategory').value;
  const portion = document.getElementById('cfPortion').value.trim() || '100g base';
  const grams = Number(document.getElementById('cfGrams').value) || 100;
  const cal = Number(document.getElementById('cfCalories').value) || 0;
  const protein = Number(document.getElementById('cfProtein').value) || 0;
  const editId = document.getElementById('cfEditId').value;

  if (!name) {
    alert('Please enter a food name.');
    return;
  }

  if (editId) {
    const existing = customCheatsheet.find(f => f.id === editId);
    if (existing) {
      existing.name = name;
      existing.cat = cat;
      existing.portion = portion;
      existing.grams = grams;
      existing.cal = cal;
      existing.protein = protein;
    }
  } else {
    customCheatsheet.push({
      id: 'cust_' + Date.now(),
      name,
      cat,
      portion,
      grams,
      cal,
      protein,
      isCustom: true
    });
  }

  saveState();
  closeModal('customFoodModal');
  showToast('📖', 'Cheatsheet Updated!', name);
}

function deleteCustomFood(id) {
  customCheatsheet = customCheatsheet.filter(f => f.id !== id);
  saveState();
}

function saveRecoveryLog() {
  const log = getActiveLog();
  log.recovery = {
    soreness: document.getElementById('sorenessLog').value,
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
  log.exercises = JSON.parse(JSON.stringify(split.exercises)).map(ex => {
    ex.done = false;
    return normalizeExerciseSets(ex);
  });
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
  
  const presetGroup = document.getElementById('presetGroup');
  const presets = type === 'meal' 
    ? getAllCheatsheetItems().slice(0, 6)
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
  showToast('🥗', 'Food Entry Saved!', name);

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
    customCheatsheet: customCheatsheet,
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

  localStorage.setItem(BACKUP_DATE_KEY, new Date().toISOString());
  const banner = document.getElementById('backupBanner');
  if (banner) banner.classList.add('hidden');
  showToast('📥', 'Data Exported Successfully!', 'Your backup JSON was downloaded.');
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
      if (parsed.customCheatsheet) customCheatsheet = parsed.customCheatsheet;
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

// 4-STEP ONBOARDING WIZARD
function setupOnboardingWizard() {
  const wizStaplesPicker = document.getElementById('wizStaplesPicker');
  if (wizStaplesPicker) {
    const defaultChips = [
      '1 phulka',
      'Amul protein curd',
      '1.5 scoops whey',
      'Rajma curry',
      '2‑egg cheese omelette',
      'Soya / Chana curry',
      'Makhana (Foxnuts)',
      'Protein oats'
    ];
    wizStaplesPicker.innerHTML = defaultChips.map(s => {
      const isSelected = (userSettings.preferredStaples || []).includes(s);
      return `<div class="staple-chip-select ${isSelected ? 'selected' : ''}" data-name="${s}">${isSelected ? '✓ ' : ''}${s}</div>`;
    }).join('');

    wizStaplesPicker.querySelectorAll('.staple-chip-select').forEach(el => {
      el.addEventListener('click', () => {
        el.classList.toggle('selected');
        const name = el.dataset.name;
        el.textContent = el.classList.contains('selected') ? `✓ ${name}` : name;
      });
    });
  }

  const wizSplitsList = document.getElementById('wizSplitsList');
  if (wizSplitsList) {
    wizSplitsList.innerHTML = WORKOUT_SPLITS.map(split => `
      <div class="split-preset-row">
        <div>
          <strong style="font-size: 0.92rem;">${split.name}</strong>
          <div style="font-size: 0.76rem; color: var(--muted);">${split.meta}</div>
        </div>
        <span class="status-chip" style="font-size: 0.72rem;">Included</span>
      </div>
    `).join('');
  }
}

function goToWizardStep(step) {
  [1, 2, 3, 4].forEach(i => {
    const pane = document.getElementById(`wizStep${i}`);
    const dot = document.getElementById(`wizDot${i}`);
    if (pane) pane.classList.toggle('hidden', i !== step);
    if (dot) dot.classList.toggle('active', i <= step);
  });
}

function launchOnboardingWizard() {
  document.getElementById('wizWeightInput').value = userSettings.weightKg;
  document.getElementById('wizCalInput').value = userSettings.targetCal;
  document.getElementById('wizProteinInput').value = userSettings.targetProtein;
  document.getElementById('wizWaterInput').value = String(userSettings.targetWater || 3.0);
  document.getElementById('wizRestInput').value = String(userSettings.defaultRestSec || 90);
  document.getElementById('wizAudioInput').value = userSettings.soundStyle || 'gentle';
  goToWizardStep(1);
  setupOnboardingWizard();
  openModal('onboardingModal');
}

function completeOnboardingWizard() {
  userSettings.weightKg = parseFloat(document.getElementById('wizWeightInput').value) || 70.0;
  userSettings.targetCal = parseInt(document.getElementById('wizCalInput').value, 10) || 1700;
  userSettings.targetProtein = parseInt(document.getElementById('wizProteinInput').value, 10) || 130;
  userSettings.targetWater = parseFloat(document.getElementById('wizWaterInput').value) || 3.0;
  userSettings.defaultRestSec = parseInt(document.getElementById('wizRestInput').value, 10) || 90;
  userSettings.soundStyle = document.getElementById('wizAudioInput').value || 'gentle';

  const selectedChips = [];
  document.querySelectorAll('#wizStaplesPicker .staple-chip-select.selected').forEach(el => {
    selectedChips.push(el.dataset.name);
  });
  if (selectedChips.length > 0) {
    userSettings.preferredStaples = selectedChips;
  }

  localStorage.setItem(ONBOARDED_KEY, 'true');
  saveState();
  closeModal('onboardingModal');
  triggerPRCelebration('Welcome to FitSync', 'Your personal dashboard is primed and ready.');
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

  // Water Quick Buttons
  document.getElementById('addWater250Btn')?.addEventListener('click', () => addWater(0.25));
  document.getElementById('addWater500Btn')?.addEventListener('click', () => addWater(0.50));
  document.getElementById('addWater750Btn')?.addEventListener('click', () => addWater(0.75));
  document.getElementById('resetWaterBtn')?.addEventListener('click', resetWater);

  // Floating Rest Timer Buttons
  document.getElementById('startManualRestBtn')?.addEventListener('click', () => startRestTimer(userSettings.defaultRestSec || 90));
  document.getElementById('triggerPRCelebrationBtn')?.addEventListener('click', () => triggerPRCelebration('Manual PR Celebration', 'Tested golden celebration cannons!'));
  document.getElementById('restAdd30Btn')?.addEventListener('click', () => addRestSeconds(30));
  document.getElementById('restTest3sBtn')?.addEventListener('click', () => startRestTimer(3));
  document.getElementById('restDoneBtn')?.addEventListener('click', () => {
    stopRestTimer();
    playAudio('sndRest');
    showToast('🌱', 'Rest Complete — Ready for Next Set!', 'Crush your next set!');
  });
  document.getElementById('restCancelBtn')?.addEventListener('click', stopRestTimer);

  // Actions
  document.getElementById('quickAddButton').addEventListener('click', () => openEntryModal('meal'));
  document.getElementById('addMealButton').addEventListener('click', () => openEntryModal('meal'));
  document.getElementById('addExerciseBtn').addEventListener('click', openAddExerciseModal);
  document.getElementById('selectSplitBtn').addEventListener('click', () => setActiveTab('templates'));

  // Custom Exercise Modal
  document.getElementById('saveExModalBtn').addEventListener('click', saveCustomExercise);
  document.getElementById('cancelExModalBtn').addEventListener('click', () => closeModal('exerciseModal'));

  // Custom Food Cheatsheet Modal
  document.getElementById('openAddCustomFoodModalBtn')?.addEventListener('click', () => {
    document.getElementById('customFoodModalTitle').textContent = 'Add Custom Food to Cheatsheet';
    document.getElementById('cfEditId').value = '';
    document.getElementById('cfName').value = '';
    document.getElementById('cfPortion').value = '100g base';
    document.getElementById('cfGrams').value = '100';
    document.getElementById('cfCalories').value = '';
    document.getElementById('cfProtein').value = '';
    openModal('customFoodModal');
  });
  document.getElementById('saveCustomFoodBtn')?.addEventListener('click', saveCustomFood);
  document.getElementById('cancelCustomFoodBtn')?.addEventListener('click', () => closeModal('customFoodModal'));

  // Recovery listeners
  ['sorenessLog', 'moodLog', 'jointLog', 'notesLog'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', saveRecoveryLog);
  });

  // Cheatsheet Drawer Modal
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

  // Settings & Backup Modal
  document.getElementById('openSettingsButton').addEventListener('click', () => {
    document.getElementById('targetCalInput').value = userSettings.targetCal;
    document.getElementById('targetProteinInput').value = userSettings.targetProtein;
    document.getElementById('targetWeightInput').value = userSettings.weightKg;
    document.getElementById('targetWaterInput').value = userSettings.targetWater || 3.0;
    document.getElementById('defaultRestSecInput').value = userSettings.defaultRestSec || 90;
    openModal('settingsModal');
  });

  document.getElementById('closeSettingsBtn').addEventListener('click', () => closeModal('settingsModal'));
  document.getElementById('saveSettingsBtn').addEventListener('click', () => {
    userSettings.targetCal = Number(document.getElementById('targetCalInput').value) || 1700;
    userSettings.targetProtein = Number(document.getElementById('targetProteinInput').value) || 130;
    userSettings.weightKg = Number(document.getElementById('targetWeightInput').value) || 70.0;
    userSettings.targetWater = Number(document.getElementById('targetWaterInput').value) || 3.0;
    userSettings.defaultRestSec = Number(document.getElementById('defaultRestSecInput').value) || 90;
    saveState();
    closeModal('settingsModal');
    showToast('⚙️', 'Settings Saved', 'Target macros and water updated.');
  });

  document.getElementById('exportBackupBtn').addEventListener('click', exportDataJSON);
  document.getElementById('importBackupInput').addEventListener('change', importDataJSON);

  // Backup Banner Handlers
  document.getElementById('bannerExportBtn')?.addEventListener('click', exportDataJSON);
  document.getElementById('bannerDismissBtn')?.addEventListener('click', () => {
    // Dismiss for 7 days
    const nextWeek = Date.now() + (7 * 24 * 60 * 60 * 1000);
    localStorage.setItem(BACKUP_DISMISSED_KEY, String(nextWeek));
    document.getElementById('backupBanner')?.classList.add('hidden');
  });

  // Onboarding Wizard Controls
  document.getElementById('runWizardTopbarBtn')?.addEventListener('click', launchOnboardingWizard);
  document.getElementById('rerunWizardBtn')?.addEventListener('click', () => {
    closeModal('settingsModal');
    launchOnboardingWizard();
  });
  document.getElementById('closeOnboardingBtn')?.addEventListener('click', () => closeModal('onboardingModal'));
  document.getElementById('wizNext1Btn')?.addEventListener('click', () => goToWizardStep(2));
  document.getElementById('wizBack2Btn')?.addEventListener('click', () => goToWizardStep(1));
  document.getElementById('wizNext2Btn')?.addEventListener('click', () => goToWizardStep(3));
  document.getElementById('wizBack3Btn')?.addEventListener('click', () => goToWizardStep(2));
  document.getElementById('wizNext3Btn')?.addEventListener('click', () => goToWizardStep(4));
  document.getElementById('wizBack4Btn')?.addEventListener('click', () => goToWizardStep(3));
  document.getElementById('wizCompleteBtn')?.addEventListener('click', completeOnboardingWizard);

  // Entry Modal
  document.getElementById('saveEntryButton').addEventListener('click', saveEntryModal);
  document.getElementById('cancelEntryButton').addEventListener('click', () => closeModal('entryModal'));

  // Initialize interactive liquid water slider
  initWaterSlider();
}

// INITIALIZATION
function init() {
  loadState();
  bindEvents();
  render();

  // If first time visit, automatically launch the onboarding wizard
  if (!localStorage.getItem(ONBOARDED_KEY)) {
    setTimeout(launchOnboardingWizard, 600);
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', init);
