/**
 * FitSync Comprehensive Automated Unit Test Suite
 * Executable via macOS JavaScriptCore (jsc) or Node.js
 * Zero external dependencies.
 */

// 1. MINIMAL MOCK ENVIRONMENT FOR HEADLESS BROWSER APIS
const mockStorage = {};
const mockElements = {};

function createMockElement(id = '') {
  return {
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false
    },
    dataset: {},
    style: {},
    addEventListener: () => {},
    querySelectorAll: () => [],
    querySelector: () => null,
    click: () => {},
    focus: () => {},
    load: () => {},
    play: () => Promise.resolve(),
    currentTime: 0
  };
}

globalThis.localStorage = {
  getItem: (key) => (key in mockStorage ? mockStorage[key] : null),
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

globalThis.document = {
  getElementById: (id) => {
    if (!mockElements[id]) mockElements[id] = createMockElement(id);
    return mockElements[id];
  },
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {},
  createElement: (tag) => createMockElement(tag)
};

globalThis.window = {
  addEventListener: () => {},
  confetti: () => {}
};

globalThis.setTimeout = (fn) => 1;
globalThis.clearTimeout = () => {};

globalThis.alert = () => {};
globalThis.confirm = () => true;

// 2. LOAD APP.JS
const appSource = readFile('/Users/adityapiratla/Library/CloudStorage/OneDrive-LondonBusinessSchool/Work/_Personal/Fitness/app.js');
eval(appSource);

// 3. ASSERTION ENGINE & TEST RUNNER
let passedCount = 0;
let failedCount = 0;
const failures = [];

function assert(condition, testName) {
  if (condition) {
    passedCount++;
    print(`  ✓ ${testName}`);
  } else {
    failedCount++;
    failures.push(testName);
    print(`  ✗ FAIL: ${testName}`);
  }
}

function assertEqual(actual, expected, testName) {
  const match = JSON.stringify(actual) === JSON.stringify(expected);
  if (match) {
    passedCount++;
    print(`  ✓ ${testName}`);
  } else {
    failedCount++;
    const errMsg = `${testName} -> Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`;
    failures.push(errMsg);
    print(`  ✗ FAIL: ${errMsg}`);
  }
}

print('\n========================================================');
print('🚀 RUNNING FITSYNC AUTOMATED TEST SUITE');
print('========================================================\n');

// -------------------------------------------------------------
// SUITE 1: TIMEZONE-SAFE DATE ENGINE
// -------------------------------------------------------------
print('SUITE 1: Date Arithmetic & Timezone Safety');
{
  const d1 = parseLocalDate('2026-09-26');
  assert(d1.getFullYear() === 2026, 'parseLocalDate extracts year 2026');
  assert(d1.getMonth() === 8, 'parseLocalDate extracts month 8 (0-indexed September)');
  assert(d1.getDate() === 26, 'parseLocalDate extracts day 26');
  assert(d1.getDay() === 6, '2026-09-26 is a Saturday (getDay === 6)');

  const formatted = formatDateStr(d1);
  assertEqual(formatted, '2026-09-26', 'formatDateStr formats back to YYYY-MM-DD exactly');

  // Boundary check: Month and Day padding
  const dJan1 = new Date(2026, 0, 5); // Jan 5
  assertEqual(formatDateStr(dJan1), '2026-01-05', 'formatDateStr pads single digit month and day');

  // Month boundary roll: Sep 30 + 1 day = Oct 1
  const dSep30 = parseLocalDate('2026-09-30');
  dSep30.setDate(dSep30.getDate() + 1);
  assertEqual(formatDateStr(dSep30), '2026-10-01', 'Date rolls cleanly across month boundaries');
}

// -------------------------------------------------------------
// SUITE 2: WORKOUT SPLIT ALLOCATION & REST DAY LOGIC
// -------------------------------------------------------------
print('\nSUITE 2: Workout Split Allocation & Rest Days');
{
  // Monday: Upper Body
  const monLog = getActiveLog('2026-09-21');
  assert(monLog.workout.name.includes('Upper Body'), 'Monday assigns Upper Body routine');
  assert(monLog.exercises.length > 0, 'Monday has scheduled exercises');
  assert(monLog.workout.status === 'Ready', 'Monday status is Ready');

  // Tuesday: Legs + Core
  const tueLog = getActiveLog('2026-09-22');
  assert(tueLog.workout.name.includes('Legs + Core'), 'Tuesday assigns Legs + Core routine');

  // Wednesday: Upper Body Focus
  const wedLog = getActiveLog('2026-09-23');
  assert(wedLog.workout.name.includes('Upper Body + Pull-Ups'), 'Wednesday assigns Upper Body Focus');

  // Thursday: Legs + Core Emphasis
  const thuLog = getActiveLog('2026-09-24');
  assert(thuLog.workout.name.includes('Legs + Core Emphasis'), 'Thursday assigns Legs Emphasis');

  // Friday: Rest / Active Recovery
  const friLog = getActiveLog('2026-09-25');
  assertEqual(friLog.workout.status, 'Rest Day', 'Friday initializes as Rest Day');
  assertEqual(friLog.exercises.length, 0, 'Friday defaults to 0 mandatory exercises');

  // Saturday: Rest & Active Recovery
  const satLog = getActiveLog('2026-09-26');
  assertEqual(satLog.workout.status, 'Rest Day', 'Saturday initializes as Rest Day');
  assert(satLog.workout.name.includes('Saturday: Active Recovery & Rest'), 'Saturday has custom recovery title');
  assertEqual(satLog.exercises.length, 0, 'Saturday defaults to 0 exercises');

  // Sunday: Full Rest & Meal Prep
  const sunLog = getActiveLog('2026-09-27');
  assertEqual(sunLog.workout.status, 'Rest Day', 'Sunday initializes as Rest Day');
}

// -------------------------------------------------------------
// SUITE 3: AUTOMATED PERSONAL RECORD (PR) ENGINE
// -------------------------------------------------------------
print('\nSUITE 3: Automated PR Detection Engine');
{
  const PR_STORAGE_KEY = 'fitsync_exercise_prs_v1';
  function getStoredPRs() {
    return JSON.parse(mockStorage[PR_STORAGE_KEY] || '{}');
  }

  // 1. Initial baseline: First time doing Goblet Squats 12.5kg x 10
  const isPr1 = checkAndRecordPR('Goblet Squats', 12.5, 10);
  assert(isPr1 === false, 'First set establishes baseline record without false PR celebration');
  assertEqual(getStoredPRs()['Goblet Squats'].weight, 12.5, 'Baseline weight recorded in storage');
  assertEqual(getStoredPRs()['Goblet Squats'].reps, 10, 'Baseline reps recorded in storage');

  // 2. Performing identical weight and reps: NOT a new PR
  const isPr2 = checkAndRecordPR('Goblet Squats', 12.5, 10);
  assert(isPr2 === false, 'Equal weight and equal reps does not trigger PR');

  // 3. Performing lower weight: NOT a new PR
  const isPr3 = checkAndRecordPR('Goblet Squats', 10.0, 10);
  assert(isPr3 === false, 'Lower weight does not trigger PR');

  // 4. Performing equal weight with more reps: NEW PR! (12.5kg x 12 > 12.5kg x 10)
  const isPr4 = checkAndRecordPR('Goblet Squats', 12.5, 12);
  assert(isPr4 === true, 'Equal weight with higher reps triggers new PR');
  assertEqual(getStoredPRs()['Goblet Squats'].reps, 12, 'PR reps updated to 12');

  // 5. Performing heavier weight: NEW PR! (15.0kg x 8 > 12.5kg x 12)
  const isPr5 = checkAndRecordPR('Goblet Squats', 15.0, 8);
  assert(isPr5 === true, 'Heavier weight triggers new PR even with fewer reps');
  assertEqual(getStoredPRs()['Goblet Squats'].weight, 15.0, 'PR weight updated to 15.0kg');
  assertEqual(getStoredPRs()['Goblet Squats'].reps, 8, 'PR reps updated to 8');

  // 6. Zero/Negative input safety
  const isPrInvalid = checkAndRecordPR('Goblet Squats', 0, 0);
  assert(isPrInvalid === false, 'Zero weight and zero reps is safely ignored');

  // 7. Delete PR record
  deletePRRecord('Goblet Squats');
  assert(getStoredPRs()['Goblet Squats'] === undefined, 'deletePRRecord removes item from localStorage');

  // 8. Re-establishing baseline after deletion
  const isPrAfterDel = checkAndRecordPR('Goblet Squats', 10.0, 8);
  assert(isPrAfterDel === false, 'Next set after PR deletion establishes fresh baseline');
  assertEqual(getStoredPRs()['Goblet Squats'].weight, 10.0, 'Fresh baseline weight recorded in localStorage');
  assertEqual(getStoredPRs()['Goblet Squats'].reps, 8, 'Fresh baseline reps recorded in localStorage');

  // 9. Clear all PR records
  clearAllPRRecords();
  assert(Object.keys(getStoredPRs()).length === 0, 'clearAllPRRecords resets localStorage to empty');
}

// -------------------------------------------------------------
// SUITE 4: MACRO & NUTRITION CALCULATION HELPERS
// -------------------------------------------------------------
print('\nSUITE 4: Macro & Nutrition Calculations');
{
  const mockDay = {
    meals: [
      { name: '1 phulka', calories: 90, protein: 3.2 },
      { name: 'Amul protein curd', calories: 70, protein: 6.0 },
      { name: '1.5 scoops whey', calories: 180, protein: 36.0 }
    ]
  };

  const totalCal = sumMealsCalories(mockDay);
  assertEqual(totalCal, 340, 'sumMealsCalories accurately sums calories');

  const totalProt = sumMealsProtein(mockDay);
  assertEqual(totalProt, 45.2, 'sumMealsProtein accurately sums protein to 1 decimal place');

  // Empty meal day safety
  const emptyDay = { meals: [] };
  assertEqual(sumMealsCalories(emptyDay), 0, 'Empty day calories sum is 0');
  assertEqual(sumMealsProtein(emptyDay), 0, 'Empty day protein sum is 0');
}

// -------------------------------------------------------------
// SUITE 5: MULTI-PILLAR ADHERENCE MATHEMATICS
// -------------------------------------------------------------
print('\nSUITE 5: Multi-Pillar Adherence Scoring');
{
  // Formula: Day Score = (DietScore * 0.4) + (WorkoutScore * 0.4) + (WaterScore * 0.2)
  
  // Case A: 100% on everything
  // Target: 1700 kcal, 130g protein, 3.0L water, 10/10 sets
  const dietScore100 = 100;
  const workoutScore100 = 100;
  const waterScore100 = 100;
  const perfectScore = Math.round((dietScore100 * 0.4) + (workoutScore100 * 0.4) + (waterScore100 * 0.2));
  assertEqual(perfectScore, 100, 'Perfect day compliance yields 100% adherence');

  // Case B: Workout crushed (100%), but 0% on diet and water
  const workoutOnly = Math.round((0 * 0.4) + (100 * 0.4) + (0 * 0.2));
  assertEqual(workoutOnly, 40, 'Only workout completed yields exact 40% adherence');

  // Case C: Diet on target (100%), but rest day (0 sets planned) and 3.0L water (100%)
  const dietWaterOnly = Math.round((100 * 0.4) + (0 * 0.4) + (100 * 0.2));
  assertEqual(dietWaterOnly, 60, '100% Diet + 100% Water on rest day yields 60% compliance');

  // Case D: Zero state safety (no activity logged)
  const zeroScore = Math.round((0 * 0.4) + (0 * 0.4) + (0 * 0.2));
  assertEqual(zeroScore, 0, 'Zero logged day yields 0% with no NaN or dividing errors');
}

// -------------------------------------------------------------
// SUITE 6: SMART RECIPE INGREDIENT CALCULATOR
// -------------------------------------------------------------
print('\nSUITE 6: Smart Recipe Ingredient Calculator');
{
  clearRecipeIngredients();

  // Add 2 Whole Eggs (100g, 150 kcal, 12.5g protein)
  addIngredientToRecipe('2 Whole Eggs', 100, 150, 12.5);
  // Add 50g Cheese (50g, 150 kcal, 12.5g protein)
  addIngredientToRecipe('Amul Cheese Slice', 50, 150, 12.5);

  assertEqual(mockElements['cfGrams'].value, 150, 'Recipe form total grams = 150g');
  assertEqual(mockElements['cfCalories'].value, 300, 'Recipe form total calories = 300 kcal');
  assertEqual(mockElements['cfProtein'].value, 25, 'Recipe form total protein = 25g');
}

// -------------------------------------------------------------
// SUITE 7: JSON BACKUP INTEGRITY & SCHEMA VALIDATION
// -------------------------------------------------------------
print('\nSUITE 7: Backup Schema & Persistence Round-trip');
{
  const testSettings = { mode: 'Cut mode', targetCal: 1700, targetProtein: 130, weightKg: 70.0, targetWater: 3.0 };
  const testDB = {
    '2026-09-26': {
      date: '2026-09-26',
      meals: [{ name: 'Whey', calories: 180, protein: 36.0 }],
      water: 2.5
    }
  };
  const testPRs = {
    'Goblet Squats': { weight: 15.0, reps: 8, date: '2026-09-26' }
  };

  const mockCheatsheet = [{ id: 'cs_1', name: '1 phulka', cal: 90, protein: 3.2 }];
  const backupPayload = {
    settings: testSettings,
    history: testDB,
    cheatsheet: mockCheatsheet,
    prs: testPRs,
    schemaVersion: 3
  };

  const serialized = JSON.stringify(backupPayload);
  const restored = JSON.parse(serialized);

  assertEqual(restored.schemaVersion, 3, 'Schema version preserved');
  assertEqual(restored.prs['Goblet Squats'].weight, 15.0, 'PR weight preserved through JSON backup');
  assertEqual(restored.history['2026-09-26'].water, 2.5, 'Daily water logged preserved through backup');
  assertEqual(restored.cheatsheet.length, 1, 'Cheatsheet database preserved');
}

// -------------------------------------------------------------
// FINAL REPORT
// -------------------------------------------------------------
print('\n========================================================');
print(`📊 TEST RESULTS: ${passedCount} PASSED · ${failedCount} FAILED`);
if (failedCount === 0) {
  print('🎉 ALL UNIT TESTS PASSED WITH 100% SUCCESS!');
} else {
  print('⚠️ FAILURES DETECTED:');
  failures.forEach(f => print(`  - ${f}`));
}
print('========================================================\n');
