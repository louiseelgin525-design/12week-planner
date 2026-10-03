/**
 * 12-WEEK PLANNER • MOBILE WEB APPLICATION
 * Zero-backend, LocalStorage offline-first, Daisy tracker, SMART goals & Time budget
 */

(function() {
  'use strict';

  const STORAGE_KEY = '12WEEK_PLANNER_DATA_V2';

  // =========================================================================
  // DEFAULT DEMO DATASET (Matching reference video & notebook aesthetic)
  // =========================================================================
  const DEFAULT_STATE = {
    settings: {
      startDate: calculateDefaultStartDate(),
      mode: 'easy', // 'easy' (40m), 'optimal' (60m), 'hard' (84m)
      freeMinutes: 120,
      reservePercent: 30
    },
    currentDayOffset: 32, // Day 33 of 84 (Week 5)
    currentWeekNumber: 5,
    daisies: generateInitialDaisies(84, 60), // 60 completed days out of 84
    goals: [
      {
        id: 'g-1',
        title: 'Снизить вес до 68 кг и пробежать 10 км',
        category: 'Здоровье',
        unit: 'кг',
        startVal: 75.0,
        currentVal: 71.5,
        targetVal: 68.0,
        photo: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        actions: [
          '10 000 шагов ежедневно на свежем воздухе',
          '3 силовые тренировки в неделю',
          'Отказ от сладкого после 18:00'
        ],
        measurements: [75.0, 74.3, 73.5, 72.4, 71.5, null, null, null, null, null, null, null]
      },
      {
        id: 'g-2',
        title: 'Выйти на доход 500 тыс. ₽ и запустить продукт',
        category: 'Бизнес',
        unit: 'тыс. ₽',
        startVal: 150,
        currentVal: 340,
        targetVal: 500,
        photo: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80',
        actions: [
          'Утренний фокус-блок 90 минут без уведомлений',
          '5 созвонов с ключевыми клиентами в неделю',
          '1 качественный аналитический пост в четверг'
        ],
        measurements: [150, 180, 230, 290, 340, null, null, null, null, null, null, null]
      },
      {
        id: 'g-3',
        title: 'Уровень английского B2 и 30 уроков разговорной практики',
        category: 'Обучение',
        unit: 'уроков',
        startVal: 4,
        currentVal: 18,
        targetVal: 30,
        photo: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        actions: [
          '20 минут подкастов на английском каждое утро',
          '2 сессии с носителем в неделю',
          'Разбор 10 новых идиом'
        ],
        measurements: [4, 7, 11, 15, 18, null, null, null, null, null, null, null]
      },
      {
        id: 'g-4',
        title: 'Прочитать 6 глубоких книг и ежедневная медитация',
        category: 'Личное',
        unit: 'книг',
        startVal: 0,
        currentVal: 3,
        targetVal: 6,
        photo: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
        actions: [
          '15 минут осознанного дыхания после пробуждения',
          '30 минут чтения книги перед сном'
        ],
        measurements: [0, 1, 1, 2, 3, null, null, null, null, null, null, null]
      },
      {
        id: 'g-5',
        title: '12 качественных семейных свиданий и поездок',
        category: 'Личное',
        unit: 'встреч',
        startVal: 0,
        currentVal: 5,
        targetVal: 12,
        photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
        actions: [
          'Пятничный вечер без телефонов и рабочих чатов',
          'Выезд на природу каждое воскресенье'
        ],
        measurements: [0, 1, 2, 4, 5, null, null, null, null, null, null, null]
      }
    ],
    todayTasks: [
      { id: 't-1', title: 'Утренняя пробежка 4 км в лёгком темпе', mins: 20, goalId: 'g-1', done: true },
      { id: 't-2', title: 'Клиентский созвон по внедрению', mins: 15, goalId: 'g-2', done: true },
      { id: 't-3', title: 'Аудирование подкаста на английском', mins: 20, goalId: 'g-3', done: false }
    ],
    todayNote: 'Отличный утренний настрой! Пробежка зарядила энергией на весь день.',
    daysData: {
      32: {
        tasks: [
          { id: 't-1', title: 'Утренняя пробежка 4 км в лёгком темпе', mins: 20, goalId: 'g-1', done: true },
          { id: 't-2', title: 'Клиентский созвон по внедрению', mins: 15, goalId: 'g-2', done: true },
          { id: 't-3', title: 'Аудирование подкаста на английском', mins: 20, goalId: 'g-3', done: false }
        ],
        note: 'Отличный утренний настрой! Пробежка зарядила энергией на весь день.'
      },
      7: {
        tasks: [
          { id: 't-w2-1', title: 'Планирование спринта недели 2', mins: 15, goalId: 'g-2', done: true },
          { id: 't-w2-2', title: 'Разминка и растяжка 20 минут', mins: 20, goalId: 'g-1', done: true },
          { id: 't-w2-3', title: 'Повторение 30 слов на английском', mins: 15, goalId: 'g-3', done: true }
        ],
        note: 'Неделя 2 началась бодро! Закрыл все запланированные действия до обеда.'
      }
    },
    weekHistory: [
      { week: 1, pace: 80 },
      { week: 2, pace: 85 },
      { week: 3, pace: 94 }, // Best week
      { week: 4, pace: 78 },
      { week: 5, pace: 82 },
      { week: 6, pace: 0 },
      { week: 7, pace: 0 },
      { week: 8, pace: 0 },
      { week: 9, pace: 0 },
      { week: 10, pace: 0 },
      { week: 11, pace: 0 },
      { week: 12, pace: 0 }
    ],
    reflections: {
      5: {
        stars: 4,
        worked: 'Утренний блок до 10:00 без телефона работает феноменально. Энергия на максимуме, пробежки вошли в привычку.',
        failed: 'В четверг засиделся за сериалом после 23:30, из-за чего утро пятницы было слегка смазанным.',
        insights: 'Маленькие шаги каждый день бьют любые героические рывки. 20 минут ежедневно дают колоссальный результат.',
        focus: 'Ранний отбой строго в 23:00 и завершение структуры нового продукта к среде.'
      }
    },
    mental: {
      vision: 'Я живу в просторном светлом доме у воды. Просыпаюсь бодрым и полным сил. Мой проект приносит стабильный доход от 1 млн ₽ и помогает сотням людей. Я управляю своим расписанием, много путешествую с семьей и физически нахожусь в лучшей форме своей жизни.',
      why: 'Я хочу чувствовать абсолютную независимость и свободу выбора. Хочу, чтобы мои близкие были защищены, а я каждый вечер засыпал с чувством глубокой гордости за то, как прожил день.',
      refusals: [
        'Бессмысленный скроллинг соцсетей после 22:00',
        'Сладкое и фастфуд после 19:00',
        'Соглашаться на встречи из вежливости',
        'Токсичные разговоры и жалобы'
      ],
      sacrifices: 'Я осознанно жертвую сиюминутным комфортом дивана. Встаю в 6:45 даже когда хочется поспать ещё полчаса. Готов терпеть сопротивление и учиться новому каждый день.'
    }
  };

  function calculateDefaultStartDate() {
    // Current date minus 32 days so day 33 is today!
    const d = new Date();
    d.setDate(d.getDate() - 32);
    return d.toISOString().split('T')[0];
  }

  function generateInitialDaisies(total, completedCount) {
    const list = [];
    for (let i = 0; i < total; i++) {
      list.push({
        dayIndex: i + 1,
        completed: i < completedCount
      });
    }
    return list;
  }

  // =========================================================================
  // APP CONTROLLER
  // =========================================================================
  class PlannerApp {
    constructor() {
      this.state = this.loadState();
      this.syncCurrentDayFromDate();
      this.initDaysData();
      this.currentTab = 'dashboard';
      this.selectedWeek = this.state.currentWeekNumber || 5;
      this.selectedDayOffset = (this.state.currentDayOffset !== undefined) ? this.state.currentDayOffset : 32;
      this.tempPhotoBase64 = null;

      this.initElements();
      this.attachEvents();
      this.renderAll();
    }

    // Storage Management
    loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          // Merge with default state to ensure schema updates
          return Object.assign({}, DEFAULT_STATE, parsed);
        }
      } catch (e) {
        console.warn('LocalStorage error, loading default state:', e);
      }
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }

    saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        this.updateStorageIndicator();
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }

    syncCurrentDayFromDate() {
      if (!this.state.settings || !this.state.settings.startDate) return;
      try {
        const parts = this.state.settings.startDate.split('-').map(Number);
        const start = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
        const diffMs = today.getTime() - start.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 84) {
          this.state.currentDayOffset = diffDays;
          this.state.currentWeekNumber = Math.floor(diffDays / 7) + 1;
        }
      } catch (e) {
        console.warn('Error syncing date:', e);
      }
    }

    getDateForDayOffset(offset) {
      if (!this.state.settings || !this.state.settings.startDate) {
        return new Date();
      }
      const parts = this.state.settings.startDate.split('-').map(Number);
      const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
      d.setDate(d.getDate() + offset);
      return d;
    }

    initDaysData() {
      if (!this.state.daysData || typeof this.state.daysData !== 'object') {
        this.state.daysData = {};
      }

      // Self-healing: if goals are empty (user cleared data or started clean),
      // purge any orphaned demo tasks left over from previous bug
      if (!this.state.goals || this.state.goals.length === 0) {
        const demoTaskIds = new Set(['t-1', 't-2', 't-3', 't-w2-1', 't-w2-2', 't-w2-3']);
        const demoNotes = new Set([
          'Отличный утренний настрой! Пробежка зарядила энергией на весь день.',
          'Неделя 2 началась бодро! Закрыл все запланированные действия до обеда.'
        ]);

        let changed = false;
        Object.keys(this.state.daysData).forEach(dayKey => {
          const day = this.state.daysData[dayKey];
          if (day && Array.isArray(day.tasks)) {
            const initialCount = day.tasks.length;
            day.tasks = day.tasks.filter(t => !demoTaskIds.has(t.id));
            if (day.tasks.length !== initialCount) changed = true;
          }
          if (day && demoNotes.has(day.note)) {
            day.note = '';
            changed = true;
          }
          if (day && (!day.tasks || day.tasks.length === 0) && !day.note) {
            delete this.state.daysData[dayKey];
            changed = true;
          }
        });

        if (Array.isArray(this.state.todayTasks)) {
          const initialTodayCount = this.state.todayTasks.length;
          this.state.todayTasks = this.state.todayTasks.filter(t => !demoTaskIds.has(t.id));
          if (this.state.todayTasks.length !== initialTodayCount) changed = true;
        }
        if (demoNotes.has(this.state.todayNote)) {
          this.state.todayNote = '';
          changed = true;
        }

        if (changed) {
          this.saveState();
        }
      }

      // Legacy migration: ONLY if todayTasks has REAL user tasks and daysData for current day is absent
      const curOffset = (this.state.currentDayOffset !== undefined) ? this.state.currentDayOffset : 0;
      if (!this.state.daysData[curOffset] && Array.isArray(this.state.todayTasks) && this.state.todayTasks.length > 0) {
        this.state.daysData[curOffset] = {
          tasks: JSON.parse(JSON.stringify(this.state.todayTasks)),
          note: this.state.todayNote || ''
        };
      }
    }

    getDayData(offset) {
      this.initDaysData();
      if (!this.state.daysData[offset]) {
        this.state.daysData[offset] = {
          tasks: [],
          note: ''
        };
      }
      return this.state.daysData[offset];
    }

    getDayTasks(offset) {
      return this.getDayData(offset).tasks;
    }

    getDayNote(offset) {
      return this.getDayData(offset).note;
    }

    goToDay(dayOffset) {
      this.selectedDayOffset = Math.max(0, Math.min(83, dayOffset));
      this.selectedWeek = Math.floor(this.selectedDayOffset / 7) + 1;
      this.switchTab('today');
      this.renderCapsulesRibbon();
    }

    goToWeek(weekNum) {
      this.selectedWeek = Math.max(1, Math.min(12, weekNum));
      this.switchTab('week');
    }

    declension(number, titles) {
      const cases = [2, 0, 1, 1, 1, 2];
      return titles[
        number % 100 > 4 && number % 100 < 20
          ? 2
          : cases[number % 10 < 5 ? number % 10 : 5]
      ];
    }

    // Time budget calculations according to Section 4 & 5 of the original TZ:
    // 120 mins free, 30% reserve, mode Easy = 40 mins
    calculateTimeBudget(offset = (this.selectedDayOffset !== undefined ? this.selectedDayOffset : this.state.currentDayOffset)) {
      const free = parseInt(this.state.settings.freeMinutes, 10) || 120;
      const reserve = parseInt(this.state.settings.reservePercent, 10) || 30;
      const mode = this.state.settings.mode || 'easy';

      // Base net available time after reserve
      const netAvailable = free * (1 - reserve / 100); // 120 * 0.7 = 84 mins

      // Mode factor:
      // easy: 40 mins benchmark (40/84 = ~0.476)
      // optimal: 60 mins benchmark (60/84 = ~0.714)
      // hard: 84 mins (full net limit)
      let limit = 40;
      if (mode === 'easy') {
        limit = Math.round(netAvailable * (40 / 84)); // exactly 40 for 120m/30%
      } else if (mode === 'optimal') {
        limit = Math.round(netAvailable * (60 / 84)); // exactly 60 for 120m/30%
      } else {
        limit = Math.round(netAvailable); // 84
      }

      const tasks = this.getDayTasks(offset);
      const planned = tasks.reduce((sum, t) => sum + (parseInt(t.mins, 10) || 0), 0);
      const remaining = limit - planned;

      return {
        free,
        reserve,
        mode,
        limit,
        planned,
        remaining,
        isOverloaded: remaining < 0,
        percentUsed: limit > 0 ? Math.min(100, Math.round((planned / limit) * 100)) : 0
      };
    }

    // Element References
    initElements() {
      // Tabs & Navigation
      this.navTabs = document.querySelectorAll('.nav-tab');
      this.tabPanes = document.querySelectorAll('.tab-pane');
      this.ribbonContainer = document.getElementById('capsules-ribbon');
      this.ribbonScrollBox = document.getElementById('capsules-ribbon-container');
      this.btnRibbonLeft = document.getElementById('btn-ribbon-left');
      this.btnRibbonRight = document.getElementById('btn-ribbon-right');

      // Modals
      this.modalGoal = document.getElementById('modal-goal');
      this.modalTask = document.getElementById('modal-task');
      this.modalSettings = document.getElementById('modal-settings');

      // Forms
      this.goalPhotoInput = document.getElementById('goal-photo-input');
      this.goalPhotoPreview = document.getElementById('goal-photo-preview');
      this.fileImportInput = document.getElementById('file-import-input');

      // Confetti canvas
      this.canvas = document.getElementById('confetti-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    attachEvents() {
      // Bottom navigation tabs
      this.navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const tabId = tab.dataset.tab;
          if (tabId === 'today') {
            this.selectedDayOffset = this.state.currentDayOffset;
          }
          this.switchTab(tabId);
        });
      });

      // Ribbon scroll buttons & desktop controls
      if (this.btnRibbonLeft) {
        this.btnRibbonLeft.addEventListener('click', () => this.scrollRibbon(-150));
      }
      if (this.btnRibbonRight) {
        this.btnRibbonRight.addEventListener('click', () => this.scrollRibbon(150));
      }

      // Mouse wheel horizontal scroll on desktop
      if (this.ribbonScrollBox) {
        this.ribbonScrollBox.addEventListener('wheel', (e) => {
          if (e.deltaY !== 0) {
            e.preventDefault();
            this.ribbonScrollBox.scrollLeft += e.deltaY;
          }
        }, { passive: false });

        // Mouse drag-to-scroll on desktop
        let isDown = false;
        let startX, scrollLeft;
        this.ribbonScrollBox.addEventListener('mousedown', (e) => {
          isDown = true;
          this.ribbonScrollBox.classList.add('grabbing');
          startX = e.pageX - this.ribbonScrollBox.offsetLeft;
          scrollLeft = this.ribbonScrollBox.scrollLeft;
        });
        window.addEventListener('mouseup', () => {
          isDown = false;
          if (this.ribbonScrollBox) this.ribbonScrollBox.classList.remove('grabbing');
        });
        this.ribbonScrollBox.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - this.ribbonScrollBox.offsetLeft;
          const walk = (x - startX) * 1.5;
          this.ribbonScrollBox.scrollLeft = scrollLeft - walk;
        });
      }

      // Settings modal
      document.getElementById('btn-open-settings').addEventListener('click', () => this.openSettings());
      document.getElementById('btn-close-settings').addEventListener('click', () => this.closeSettings());
      document.getElementById('btn-save-settings').addEventListener('click', () => this.saveSettingsFromModal());

      // Backup & Restore
      document.getElementById('btn-export-json').addEventListener('click', () => this.exportBackup());
      document.getElementById('btn-import-trigger').addEventListener('click', () => this.fileImportInput.click());
      this.fileImportInput.addEventListener('change', (e) => this.handleFileImport(e));
      document.getElementById('btn-reset-demo').addEventListener('click', () => this.resetToDemo());
      document.getElementById('btn-clear-all').addEventListener('click', () => this.clearAllData());

      // Goals modal
      const btnAddGoal = document.getElementById('btn-add-goal');
      if (btnAddGoal) btnAddGoal.addEventListener('click', () => this.openGoalModal());
      document.getElementById('btn-close-goal-modal').addEventListener('click', () => this.closeGoalModal());
      document.getElementById('btn-cancel-goal').addEventListener('click', () => this.closeGoalModal());
      document.getElementById('btn-save-goal').addEventListener('click', () => this.saveGoalFromModal());

      // Goal photo upload
      document.getElementById('btn-select-photo').addEventListener('click', () => this.goalPhotoInput.click());
      this.goalPhotoPreview.addEventListener('click', () => this.goalPhotoInput.click());
      this.goalPhotoInput.addEventListener('change', (e) => this.handlePhotoSelection(e));
      document.getElementById('btn-remove-photo').addEventListener('click', () => this.removeGoalPhoto());

      // Task modal & actions
      document.getElementById('btn-add-today-task').addEventListener('click', () => this.openTaskModal());
      document.getElementById('btn-close-task-modal').addEventListener('click', () => this.closeTaskModal());
      document.getElementById('btn-cancel-task').addEventListener('click', () => this.closeTaskModal());
      document.getElementById('btn-save-task').addEventListener('click', () => this.saveTaskFromModal());

      // Task minute presets
      document.querySelectorAll('.preset-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById('task-form-mins').value = btn.dataset.mins;
        });
      });

      // Day selector buttons in Task modal (Apple outline style)
      document.querySelectorAll('#task-day-selector .day-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          btn.classList.toggle('active');
        });
      });

      // Quick presets for days
      const btnWeekdays = document.getElementById('btn-preset-weekdays');
      if (btnWeekdays) {
        btnWeekdays.addEventListener('click', () => {
          document.querySelectorAll('#task-day-selector .day-btn').forEach(btn => {
            const day = parseInt(btn.dataset.day, 10);
            if (day >= 0 && day <= 4) {
              btn.classList.add('active');
            } else {
              btn.classList.remove('active');
            }
          });
        });
      }

      const btnAll7 = document.getElementById('btn-preset-all7');
      if (btnAll7) {
        btnAll7.addEventListener('click', () => {
          document.querySelectorAll('#task-day-selector .day-btn').forEach(btn => {
            btn.classList.add('active');
          });
        });
      }

      // Copy Previous Week action
      const btnCopyPrev = document.getElementById('btn-copy-prev-week');
      if (btnCopyPrev) {
        btnCopyPrev.addEventListener('click', () => this.copyPreviousWeek());
      }

      // Today Note autosave
      const noteInput = document.getElementById('today-note-input');
      noteInput.addEventListener('input', () => {
        const offset = (this.selectedDayOffset !== undefined) ? this.selectedDayOffset : this.state.currentDayOffset;
        const dayData = this.getDayData(offset);
        dayData.note = noteInput.value;
        if (offset === this.state.currentDayOffset) {
          this.state.todayNote = noteInput.value;
        }
        this.saveState();
      });

      // Week Switcher
      document.getElementById('btn-week-prev').addEventListener('click', () => this.changeWeek(-1));
      document.getElementById('btn-week-next').addEventListener('click', () => this.changeWeek(1));

      // Star rating for week reflection
      document.querySelectorAll('#week-stars-rating .star').forEach(star => {
        star.addEventListener('click', () => {
          const val = parseInt(star.dataset.val, 10);
          this.setWeekRating(val);
        });
      });

      // Reflection autosave
      ['ref-worked', 'ref-failed', 'ref-insights', 'ref-focus'].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', () => this.saveCurrentWeekReflection());
      });

      // Mental Upgrade autosave
      ['mental-vision', 'mental-why', 'mental-sacrifices'].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('input', () => {
          const key = id.replace('mental-', '');
          this.state.mental[key] = el.value;
          this.saveState();
        });
      });

      // Mental Great Refusal Add
      document.getElementById('btn-add-refusal').addEventListener('click', () => this.addRefusal());
      document.getElementById('new-refusal-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.addRefusal();
      });

      // Day switcher arrows on Today tab
      document.getElementById('btn-prev-day').addEventListener('click', () => this.changeDay(-1));
      document.getElementById('btn-next-day').addEventListener('click', () => this.changeDay(1));
    }

    // =========================================================================
    // RENDERING
    // =========================================================================
    renderAll() {
      this.renderHeader();
      this.renderCapsulesRibbon();
      this.renderDashboard();
      this.renderGoals();
      this.renderToday();
      this.renderWeekView();
      this.renderMental();
      this.updateStorageIndicator();
    }

    renderHeader() {
      const badge = document.getElementById('header-sprint-badge');
      badge.textContent = `НЕДЕЛЯ ${this.state.currentWeekNumber} ИЗ 12 • ДЕНЬ ${this.state.currentDayOffset + 1}`;
    }

    scrollRibbon(delta) {
      if (this.ribbonScrollBox) {
        this.ribbonScrollBox.scrollBy({ left: delta, behavior: 'smooth' });
      }
    }

    renderCapsulesRibbon() {
      const ribbon = this.ribbonContainer;
      if (!ribbon) return;
      ribbon.innerHTML = '';

      for (let w = 1; w <= 12; w++) {
        const pill = document.createElement('button');
        pill.className = 'capsule-pill';
        pill.textContent = `Н${w}`;

        const isCurrentWeek = (w === this.state.currentWeekNumber);
        const isSelected = (w === this.selectedWeek);

        if (isCurrentWeek) {
          pill.classList.add('is-current-week');
          pill.title = `Неделя ${w} ★ (текущая активная неделя спринта)`;
        } else if (w < this.state.currentWeekNumber) {
          pill.classList.add('is-past-week');
          pill.title = `Неделя ${w} (завершена)`;
        } else {
          pill.title = `Неделя ${w} (впереди)`;
        }

        if (isSelected) {
          pill.classList.add('is-selected');
        }

        pill.addEventListener('click', () => {
          this.selectedWeek = w;
          this.switchTab('week');
          this.renderCapsulesRibbon();
        });

        ribbon.appendChild(pill);
      }

      // Auto-scroll so the selected (or current) week capsule is centered in view
      setTimeout(() => {
        const targetPill = ribbon.querySelector('.capsule-pill.is-selected') || ribbon.querySelector('.capsule-pill.is-current-week');
        if (targetPill && this.ribbonScrollBox) {
          const pillLeft = targetPill.offsetLeft;
          const pillWidth = targetPill.offsetWidth;
          const boxWidth = this.ribbonScrollBox.offsetWidth;
          this.ribbonScrollBox.scrollTo({
            left: Math.max(0, pillLeft - (boxWidth / 2) + (pillWidth / 2)),
            behavior: 'smooth'
          });
        }
      }, 80);
    }

    renderDashboard() {
      // 1. Sprint Hero
      const start = new Date(this.state.settings.startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 84);

      const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      const dateStr = `${start.getDate()} ${months[start.getMonth()]} — ${end.getDate()} ${months[end.getMonth()]}`;
      document.getElementById('dash-sprint-dates').textContent = dateStr;

      const modeNames = {
        easy: '🌿 Лёгкий (40м)',
        optimal: '⚡ Оптимальный (60м)',
        hard: '🔥 Интенсивный (84м)'
      };
      document.getElementById('dash-mode-tag').innerHTML = `<span class="pulse-dot"></span> ${modeNames[this.state.settings.mode] || '🌿 Лёгкий (40м)'}`;

      const daysLeft = Math.max(0, 84 - (this.state.currentDayOffset + 1));
      document.getElementById('dash-days-left').textContent = daysLeft;

      // Completed daisy count
      const doneDaisies = this.state.daisies.filter(d => d.completed).length;
      const pacePercent = Math.round((doneDaisies / (this.state.currentDayOffset + 1 || 1)) * 100);
      document.getElementById('dash-pace').textContent = `${Math.min(100, pacePercent)}%`;

      const sprintProgress = Math.round(((this.state.currentDayOffset + 1) / 84) * 100);
      document.getElementById('dash-sprint-progress').style.width = `${sprintProgress}%`;
      document.getElementById('dash-progress-label').textContent = `День ${this.state.currentDayOffset + 1} из 84 (${sprintProgress}% спринта)`;
      document.getElementById('dash-week-label').textContent = `Неделя ${this.state.currentWeekNumber}`;

      // 2. Today Primary Focus ("Что мне делать сегодня?")
      const todayFocusWrap = document.getElementById('dash-today-focus-card');
      const curOffset = (this.state.currentDayOffset !== undefined) ? this.state.currentDayOffset : 0;
      const curTasks = this.getDayTasks(curOffset);
      const doneCount = curTasks.filter(t => t.done).length;
      const tb = this.calculateTimeBudget(curOffset);

      if (todayFocusWrap) {
        if (curTasks.length === 0) {
          todayFocusWrap.innerHTML = `
            <div class="today-focus-empty">
              <div style="font-size:2rem; margin-bottom:6px;">⚡</div>
              <div class="today-focus-empty-text">
                На сегодня пока нет запланированных действий.<br>
                Запланируйте 1–3 ключевых дела, чтобы день стал победой!
              </div>
              <button class="btn-primary" onclick="app.openTaskModal()">+ Запланировать главное на сегодня</button>
            </div>
          `;
        } else {
          // Sort: main task first
          const sorted = [...curTasks].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
          
          let tasksHtml = '';
          sorted.forEach(t => {
            const goal = this.state.goals.find(g => g.id === t.goalId);
            const goalTag = goal ? `<span class="task-goal-tag">🎯 ${this.escapeHtml(goal.category)}</span>` : '';
            const isMain = !!t.isMain;

            tasksHtml += `
              <div class="task-item ${t.done ? 'done' : ''} ${isMain ? 'is-main' : ''}" style="margin-bottom:8px;">
                <div class="task-left">
                  <button class="task-check-btn" onclick="app.toggleTask('${t.id}')">
                    <span class="task-check-icon">✓</span>
                  </button>
                  <div class="task-details">
                    ${isMain ? '<span class="task-main-badge">⭐ ГЛАВНОЕ СЕГОДНЯ</span>' : ''}
                    <span class="task-title" style="${isMain ? 'font-weight:800; font-size:0.92rem;' : ''}">${this.escapeHtml(t.title)}</span>
                    <div class="task-meta">
                      <span class="task-mins-pill">⏱️ ${t.mins} мин</span>
                      ${goalTag}
                    </div>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:2px;">
                  <button class="task-star-btn ${isMain ? 'active' : ''}" onclick="app.toggleMainTask('${t.id}')" title="${isMain ? 'Главное дело дня' : 'Сделать главным'}">★</button>
                  <button class="task-delete-btn" onclick="app.deleteTask('${t.id}')" title="Удалить">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            `;
          });

          todayFocusWrap.innerHTML = `
            <div class="today-focus-head-row">
              <span class="today-focus-meta">
                ${curTasks.length} ${this.declension(curTasks.length, ['действие', 'действия', 'действий'])} • ${tb.planned} мин
              </span>
              <span class="badge-pill ${tb.isOverloaded ? 'bg-light-khaki text-danger' : 'bg-light-green'}">
                ${tb.isOverloaded ? 'Перегруз ⚠️' : 'Лимит дня: ' + tb.limit + 'м'}
              </span>
            </div>
            <div class="today-focus-list">
              ${tasksHtml}
            </div>
            <div class="today-focus-progress-row">
              <span>Прогресс: <b>${doneCount} из ${curTasks.length} выполнено</b></span>
              <button class="link-btn-sm" onclick="app.openTaskModal()">+ Добавить ещё</button>
            </div>
          `;
        }
      }

      // 3. Top Goals (Strictly 3 Goals Preview)
      const goalsWrap = document.getElementById('dash-top-goals');
      goalsWrap.innerHTML = '';
      this.state.goals.slice(0, 3).forEach(goal => {
        const item = document.createElement('div');
        item.className = 'dash-goal-card';
        
        const delta = (goal.currentVal - goal.startVal);
        const sign = delta > 0 ? '+' : '';
        const deltaStr = `${sign}${delta} ${goal.unit}`;
        const progress = this.calculateGoalProgress(goal);

        // Calculate Lead Measures (Действия недели и общий темп)
        const curWk = this.state.currentWeekNumber;
        const wkStart = (curWk - 1) * 7;
        let wkTasksTotal = 0;
        let wkTasksDone = 0;
        for (let d = 0; d < 7; d++) {
          const dayD = this.getDayData(wkStart + d);
          if (dayD && Array.isArray(dayD.tasks)) {
            const goalTasks = dayD.tasks.filter(t => t.goalId === goal.id);
            wkTasksTotal += goalTasks.length;
            wkTasksDone += goalTasks.filter(t => t.done).length;
          }
        }
        const weekTasksStr = wkTasksTotal > 0 ? `${wkTasksDone}/${wkTasksTotal}` : '—';

        let sprintGoalTasksTotal = 0;
        let sprintGoalTasksDone = 0;
        for (let o = 0; o <= this.state.currentDayOffset; o++) {
          const dayD = this.getDayData(o);
          if (dayD && Array.isArray(dayD.tasks)) {
            const goalTasks = dayD.tasks.filter(t => t.goalId === goal.id);
            sprintGoalTasksTotal += goalTasks.length;
            sprintGoalTasksDone += goalTasks.filter(t => t.done).length;
          }
        }
        const pacePercent = sprintGoalTasksTotal > 0 ? Math.round((sprintGoalTasksDone / sprintGoalTasksTotal) * 100) : (progress > 0 ? progress : 0);

        const photoUrl = goal.photo || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=400&q=80';

        item.innerHTML = `
          <div class="dash-goal-thumb-wrap">
            <img class="dash-goal-thumb" src="${photoUrl}" alt="${this.escapeHtml(goal.title)}">
          </div>
          <div class="dash-goal-content">
            <div class="dash-goal-top-row">
              <span class="goal-cat-tag">${this.escapeHtml(goal.category)}</span>
              <span class="m-delta-pill">${deltaStr}</span>
            </div>
            <h4 class="dash-goal-title">${this.escapeHtml(goal.title)}</h4>
            <div class="dash-goal-progress-wrap">
              <div class="progress-bar-bg" style="height: 6px;">
                <div class="progress-bar-fill" style="width: ${progress}%;"></div>
              </div>
              <div class="dash-goal-meta-row">
                <span>Сейчас: <b>${goal.currentVal} ${goal.unit}</b></span>
                <span class="highlight-text">${progress}%</span>
              </div>
            </div>
            <div class="dash-goal-lead-row">
              <span class="dash-goal-lead-pill">Действия недели: <b>${weekTasksStr}</b></span>
              <span class="dash-goal-lead-pill">Темп: <b>${pacePercent}%</b></span>
            </div>
          </div>
        `;
        item.addEventListener('click', () => this.jumpToGoal(goal.id));
        goalsWrap.appendChild(item);
      });

      // 4. Daisies 84 Grid (Flower blooming tracker with week indicators & inspector)
      document.getElementById('dash-daisy-count').textContent = `${doneDaisies} / 84`;
      const grid = document.getElementById('daisies-grid');
      grid.innerHTML = '';

      if (this.inspectedDaisyOffset === undefined) {
        this.inspectedDaisyOffset = this.state.currentDayOffset || 0;
      }

      const monthsShort = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

      for (let w = 1; w <= 12; w++) {
        // Week indicator button at left (click jumps directly to that week!)
        const wkBtn = document.createElement('button');
        wkBtn.type = 'button';
        wkBtn.className = `daisy-wk-label ${w === this.state.currentWeekNumber ? 'current' : ''}`;
        wkBtn.textContent = `Н${w}`;
        wkBtn.title = `Неделя ${w}: нажать, чтобы перейти к плану недели`;
        wkBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.goToWeek(w);
        });
        grid.appendChild(wkBtn);

        // 7 days of this week
        for (let d = 0; d < 7; d++) {
          const idx = (w - 1) * 7 + d;
          const daisy = (this.state.daisies && this.state.daisies[idx]) ? this.state.daisies[idx] : { dayIndex: idx + 1, completed: false };

          const cell = document.createElement('button');
          cell.type = 'button';
          cell.className = 'daisy-cell';
          cell.dataset.offset = idx;

          const isCurrent = (idx === this.state.currentDayOffset);
          const isSelected = (idx === this.inspectedDaisyOffset);

          if (isCurrent) cell.classList.add('current');
          if (isSelected) cell.classList.add('selected');

          if (daisy.completed) {
            cell.classList.add('completed');
            cell.innerHTML = this.getDaisySvg(true);
          } else if (idx < this.state.currentDayOffset) {
            // Missed past day
            cell.innerHTML = this.getDaisySvg(false);
          } else {
            // Future day
            cell.classList.add('upcoming');
            cell.innerHTML = this.getDaisySvg(false);
          }

          const curDate = this.getDateForDayOffset(idx);
          const dayDateStr = `${curDate.getDate()} ${monthsShort[curDate.getMonth()]}`;
          cell.title = `Неделя ${w} • День ${idx + 1} (${dayDateStr}) • ${daisy.completed ? 'Распустился 🌼' : 'Не закрыт'}`;

          cell.addEventListener('click', () => {
            if (this.inspectedDaisyOffset === idx) {
              // Second click on the same flower toggles it
              this.toggleDaisy(idx);
            } else {
              // First click selects and inspects it
              this.inspectedDaisyOffset = idx;
              this.updateDaisySelection();
              this.renderDaisyInspector();
            }
          });

          cell.addEventListener('mouseenter', () => {
            this.renderDaisyInspector(idx);
          });

          cell.addEventListener('mouseleave', () => {
            this.renderDaisyInspector(this.inspectedDaisyOffset);
          });

          grid.appendChild(cell);
        }
      }

      this.renderDaisyInspector();

      // 5. 12-Week Chart (Dynamically calculated from real weekly tasks or demo history)
      const chartWrap = document.getElementById('chart-bars');
      chartWrap.innerHTML = '';

      let bestWeekNum = null;
      let bestWeekPace = -1;
      let totalPaceSum = 0;
      let weeksWithDataCount = 0;

      for (let w = 1; w <= 12; w++) {
        const weekStartOffset = (w - 1) * 7;
        let weekTotalTasks = 0;
        let weekDoneTasks = 0;

        for (let d = 0; d < 7; d++) {
          const dData = this.getDayData(weekStartOffset + d);
          if (dData && Array.isArray(dData.tasks)) {
            weekTotalTasks += dData.tasks.length;
            weekDoneTasks += dData.tasks.filter(t => t.done).length;
          }
        }

        let pace = 0;
        if (weekTotalTasks > 0) {
          pace = Math.round((weekDoneTasks / weekTotalTasks) * 100);
          weeksWithDataCount++;
          totalPaceSum += pace;
        } else if (this.state.weekHistory && this.state.weekHistory[w - 1] && this.state.weekHistory[w - 1].pace > 0) {
          pace = this.state.weekHistory[w - 1].pace;
          weeksWithDataCount++;
          totalPaceSum += pace;
        }

        if (pace > 0 && pace > bestWeekPace) {
          bestWeekPace = pace;
          bestWeekNum = w;
        }

        const col = document.createElement('div');
        col.className = 'chart-col';
        const heightPct = pace > 0 ? Math.max(12, pace) : 4;
        const isActive = w === this.state.currentWeekNumber;

        col.innerHTML = `
          <div class="chart-bar ${isActive ? 'active-week' : ''}" style="height:${heightPct}%;" title="Неделя ${w}: ${pace}%"></div>
          <span class="chart-col-label">Н${w}</span>
        `;
        chartWrap.appendChild(col);
      }

      // Dynamically update Best Week & Average Pace badges
      const bestEl = document.getElementById('chart-best-week');
      const avgEl = document.getElementById('chart-avg-pace');
      if (bestEl) {
        bestEl.textContent = (bestWeekNum !== null) ? `Н${bestWeekNum} (${bestWeekPace}%)` : '—';
      }
      if (avgEl) {
        const avgPace = (weeksWithDataCount > 0) ? Math.round(totalPaceSum / weeksWithDataCount) : 0;
        avgEl.textContent = (weeksWithDataCount > 0) ? `${avgPace}%` : '0%';
      }
    }

    renderDaisyInspector(targetOffset = null) {
      const offset = (targetOffset !== null) ? targetOffset : (this.inspectedDaisyOffset !== undefined ? this.inspectedDaisyOffset : this.state.currentDayOffset);
      const inspector = document.getElementById('daisy-inspector');
      if (!inspector) return;

      const d = (this.state.daisies && this.state.daisies[offset]) ? this.state.daisies[offset] : { dayIndex: offset + 1, completed: false };
      const curDate = this.getDateForDayOffset(offset);
      const daysFullRu = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      const monthsRu = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
      const dayDateStr = `${daysFullRu[curDate.getDay()]}, ${curDate.getDate()} ${monthsRu[curDate.getMonth()]}`;
      const weekNum = Math.floor(offset / 7) + 1;
      const dayNum = offset + 1;

      const dayData = this.getDayData(offset);
      const taskCount = (dayData && Array.isArray(dayData.tasks)) ? dayData.tasks.length : 0;
      const doneTaskCount = (dayData && Array.isArray(dayData.tasks)) ? dayData.tasks.filter(t => t.done).length : 0;
      const totalMins = (dayData && Array.isArray(dayData.tasks)) ? dayData.tasks.reduce((sum, t) => sum + (parseInt(t.mins, 10) || 0), 0) : 0;
      const isToday = (offset === this.state.currentDayOffset);

      let taskInfo = '';
      if (taskCount > 0) {
        taskInfo = `• ${doneTaskCount}/${taskCount} ${this.declension(taskCount, ['действие', 'действия', 'действий'])} (${totalMins} мин)`;
      } else {
        taskInfo = `• Нет запланированных действий`;
      }

      let statusBadge = '';
      let statusIcon = '🌱';
      if (d.completed) {
        statusBadge = '<span class="daisy-insp-status-badge blooming">Цветёт 🌸</span>';
        statusIcon = '🌼';
      } else if (offset < this.state.currentDayOffset) {
        statusBadge = '<span class="daisy-insp-status-badge missed">Не закрыт</span>';
        statusIcon = '🌱';
      } else {
        statusBadge = '<span class="daisy-insp-status-badge upcoming">Впереди</span>';
        statusIcon = '🌱';
      }

      inspector.innerHTML = `
        <div class="daisy-insp-head">
          <div class="daisy-insp-title-row">
            <span class="daisy-insp-icon">${statusIcon}</span>
            <div>
              <div class="daisy-insp-title">
                ${isToday ? '⭐ Сегодня • ' : ''}День ${dayNum} (${dayDateStr})
              </div>
              <div class="daisy-insp-sub">Неделя ${weekNum} ${taskInfo}</div>
            </div>
          </div>
          ${statusBadge}
        </div>
        <div class="daisy-insp-actions">
          <button type="button" class="btn-sm btn-outline" onclick="app.toggleDaisy(${offset})">
            ${d.completed ? 'Сбросить цветение' : '🌸 Отметить цветущим'}
          </button>
          <button type="button" class="btn-sm btn-primary" onclick="app.goToDay(${offset})">
            Открыть день &rarr;
          </button>
        </div>
      `;
    }

    toggleDaisy(offset) {
      if (!this.state.daisies || !this.state.daisies[offset]) return;
      const d = this.state.daisies[offset];
      d.completed = !d.completed;
      this.inspectedDaisyOffset = offset;
      this.saveState();
      this.renderDashboard();
      if (d.completed) {
        this.launchConfetti();
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
    }

    updateDaisySelection() {
      const cells = document.querySelectorAll('#daisies-grid .daisy-cell');
      cells.forEach(c => {
        const offset = parseInt(c.dataset.offset, 10);
        if (offset === this.inspectedDaisyOffset) {
          c.classList.add('selected');
        } else {
          c.classList.remove('selected');
        }
      });
    }

    renderGoals() {
      const list = document.getElementById('goals-list');
      list.innerHTML = '';

      const addGoalBtn = document.getElementById('btn-add-goal');

      if (this.state.goals.length === 0) {
        if (addGoalBtn) addGoalBtn.style.display = 'none';
        list.innerHTML = `
          <div class="card" style="text-align:center; padding:36px 20px;">
            <div style="font-size:2.4rem; margin-bottom:10px;">🎯</div>
            <h3 style="font-size:1.05rem; font-weight:800; color:var(--olive-dark); margin-bottom:6px;">С чего начнём ваш 12-недельный спринт?</h3>
            <p style="font-size:0.82rem; font-weight:600; color:var(--text-muted); margin-bottom:18px; line-height:1.45; max-width:320px; margin-left:auto; margin-right:auto;">
              Выберите одну ключевую цель, которая даст максимальный прорыв и зарядит энергией на весь период.
            </p>
            <button class="btn-primary" onclick="app.openGoalModal()">+ Поставить первую цель</button>
          </div>
        `;
        return;
      }

      if (addGoalBtn) {
        addGoalBtn.style.display = 'inline-flex';
      }

      if (this.state.goals.length >= 4) {
        const hintBox = document.createElement('div');
        hintBox.className = 'goal-focus-hint-box';
        hintBox.style.marginBottom = '14px';
        hintBox.innerHTML = `
          <span style="font-size:1.15rem; line-height:1;">💡</span>
          <div>
            <b>Фокус спринта:</b> У вас создано ${this.state.goals.length} ${this.declension(this.state.goals.length, ['цель', 'цели', 'целей'])}. В методике 12-недельного года максимальный результат и прорыв дают <b>1–3 ключевые цели</b>.
          </div>
        `;
        list.appendChild(hintBox);
      }

      this.state.goals.forEach((goal, idx) => {
        const card = document.createElement('div');
        card.className = 'goal-card';
        card.id = 'goal-card-' + goal.id;

        const progress = this.calculateGoalProgress(goal);
        const delta = (goal.currentVal - goal.startVal);
        const sign = delta > 0 ? '+' : '';
        const deltaStr = `${sign}${delta} ${goal.unit}`;

        // Render photo frame
        let photoHtml = '';
        if (goal.photo) {
          photoHtml = `
            <div class="polaroid-frame">
              <img class="polaroid-img" src="${goal.photo}" alt="${this.escapeHtml(goal.title)}">
              <button class="polaroid-overlay-btn" onclick="app.editGoalPhoto('${goal.id}')">📷 Фото</button>
            </div>
          `;
        } else {
          photoHtml = `
            <div class="polaroid-frame" style="display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="app.editGoalPhoto('${goal.id}')">
              <span style="font-size:0.8rem; font-weight:800; color:var(--sage-muted);">+ Прикрепить фото цели</span>
            </div>
          `;
        }

        // Actions checklist
        const actionsHtml = (goal.actions || []).map(act => `
          <div class="goal-action-item">
            <span style="color:var(--olive-primary); font-weight:900;">•</span>
            <span>${this.escapeHtml(act)}</span>
          </div>
        `).join('');

        // 12 measurements cells
        const measureCells = (goal.measurements || []).map((val, wIdx) => `
          <div class="measure-cell ${wIdx + 1 === this.state.currentWeekNumber ? 'active' : ''}">
            <span class="measure-wk">Н${wIdx + 1}</span>
            <span class="measure-val">${val !== null ? val : '—'}</span>
          </div>
        `).join('');

        // Calculate Lead Measures (Действия недели и общий темп)
        const curWk = this.state.currentWeekNumber;
        const wkStart = (curWk - 1) * 7;
        let wkTasksTotal = 0;
        let wkTasksDone = 0;
        for (let d = 0; d < 7; d++) {
          const dayD = this.getDayData(wkStart + d);
          if (dayD && Array.isArray(dayD.tasks)) {
            const goalTasks = dayD.tasks.filter(t => t.goalId === goal.id);
            wkTasksTotal += goalTasks.length;
            wkTasksDone += goalTasks.filter(t => t.done).length;
          }
        }
        const weekTasksStr = wkTasksTotal > 0 ? `${wkTasksDone}/${wkTasksTotal}` : '—';

        let sprintGoalTasksTotal = 0;
        let sprintGoalTasksDone = 0;
        for (let o = 0; o <= this.state.currentDayOffset; o++) {
          const dayD = this.getDayData(o);
          if (dayD && Array.isArray(dayD.tasks)) {
            const goalTasks = dayD.tasks.filter(t => t.goalId === goal.id);
            sprintGoalTasksTotal += goalTasks.length;
            sprintGoalTasksDone += goalTasks.filter(t => t.done).length;
          }
        }
        const pacePercent = sprintGoalTasksTotal > 0 ? Math.round((sprintGoalTasksDone / sprintGoalTasksTotal) * 100) : (progress > 0 ? progress : 0);

        let forecastText = '';
        let forecastIcon = '📈';
        if (sprintGoalTasksTotal === 0 && progress === 0) {
          forecastIcon = '💡';
          forecastText = 'Пока нет запланированных действий. Добавьте регулярные шаги в расписание недели, чтобы начать движение к цели.';
        } else if (pacePercent >= 80) {
          forecastIcon = '🎯';
          const estWeek = Math.min(12, Math.max(curWk, Math.ceil(curWk + ((100 - progress) / Math.max(8, (progress / Math.max(1, curWk)))))));
          forecastText = `Отличный темп (${pacePercent}%)! При текущей дисциплине действий цель прогнозируется к достижению на Неделе ${estWeek}.`;
        } else if (pacePercent >= 65) {
          forecastIcon = '⚡';
          forecastText = `Стабильный темп (${pacePercent}%). Для гарантированного результата к 12-й неделе держите выполнение действий не ниже 80%.`;
        } else {
          forecastIcon = '⚠️';
          forecastText = `Темп действий (${pacePercent}%) ниже планового. Отставание в действиях напрямую сдерживает результат. Сфокусируйтесь на ключевых шагах!`;
        }

        card.innerHTML = `
          ${photoHtml}
          <div class="goal-card-top">
            <div>
              <span class="goal-cat-tag">${this.escapeHtml(goal.category)}</span>
              <h3 class="goal-card-title">${this.escapeHtml(goal.title)}</h3>
            </div>
          </div>

          <div class="goal-metric-strip">
            <div class="m-point">
              <span class="m-label">Старт</span>
              <span class="m-value">${goal.startVal} ${goal.unit}</span>
            </div>
            <span class="m-arrow">&rarr;</span>
            <div class="m-point">
              <span class="m-label">Сейчас</span>
              <span class="m-value" style="color:var(--olive-primary);">${goal.currentVal} ${goal.unit}</span>
            </div>
            <span class="m-arrow">&rarr;</span>
            <div class="m-point">
              <span class="m-label">Цель</span>
              <span class="m-value">${goal.targetVal} ${goal.unit}</span>
            </div>
            <div class="m-delta-pill">${deltaStr}</div>
          </div>

          <div class="progress-bar-bg" style="height:8px; margin: 8px 0 4px;">
            <div class="progress-bar-fill" style="width: ${progress}%;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.7rem; font-weight:800; color:var(--text-muted); margin-bottom:8px;">
            <span>Выполнено</span>
            <span>${progress}%</span>
          </div>

          <div class="goal-lead-lag-strip">
            <div class="lead-lag-item">
              <span class="lead-lag-label">Результат</span>
              <span class="lead-lag-val">${progress}%</span>
            </div>
            <div class="lead-lag-item">
              <span class="lead-lag-label">Действия недели</span>
              <span class="lead-lag-val">${weekTasksStr}</span>
            </div>
            <div class="lead-lag-item">
              <span class="lead-lag-label">Темп действий</span>
              <span class="lead-lag-val" style="color:${pacePercent >= 75 ? 'var(--olive-primary)' : (pacePercent >= 50 ? '#C2831F' : 'var(--terracotta)')};">${pacePercent}%</span>
            </div>
          </div>

          <div class="goal-forecast-badge">
            <span style="font-size:1.1rem; line-height:1;">${forecastIcon}</span>
            <div><b>Прогноз:</b> ${forecastText}</div>
          </div>

          <div class="goal-actions-section">
            <div class="goal-actions-title">Ключевые регулярные действия</div>
            ${actionsHtml}
          </div>

          <div class="goal-actions-section">
            <div class="goal-actions-title">12-недельный трек измерений</div>
            <div class="goal-measurements-row">
              ${measureCells}
            </div>
          </div>

          <div class="goal-card-actions">
            <button class="link-btn-sm" onclick="app.openGoalModal('${goal.id}')">Редактировать</button>
            <button class="link-btn-sm text-danger" onclick="app.deleteGoal('${goal.id}')">Удалить</button>
          </div>
        `;

        list.appendChild(card);
      });

      // Progressive Goal Add-Slot & Focus Celebration (Marketer & Designer UX)
      const count = this.state.goals.length;
      if (count === 1) {
        const slot = document.createElement('div');
        slot.className = 'goal-add-slot-card';
        slot.innerHTML = `
          <div class="add-slot-icon">+</div>
          <div class="add-slot-text">
            <div class="add-slot-title">Поставить вторую цель (2 из 3)</div>
            <div class="add-slot-sub">Например, из другой сферы: бизнес, финансы, карьера или обучение</div>
          </div>
        `;
        slot.addEventListener('click', () => this.openGoalModal());
        list.appendChild(slot);
      } else if (count === 2) {
        const slot = document.createElement('div');
        slot.className = 'goal-add-slot-card';
        slot.innerHTML = `
          <div class="add-slot-icon">+</div>
          <div class="add-slot-text">
            <div class="add-slot-title">Поставить третью цель (3 из 3)</div>
            <div class="add-slot-sub">Финальная цель для идеального трио и баланса спринта</div>
          </div>
        `;
        slot.addEventListener('click', () => this.openGoalModal());
        list.appendChild(slot);
      } else if (count === 3) {
        const comp = document.createElement('div');
        comp.className = 'goal-focus-complete-card';
        comp.innerHTML = `
          <div style="font-size:1.5rem; line-height:1;">✨</div>
          <div>
            <div class="focus-complete-title">Золотой стандарт фокуса: 3 цели укомплектованы!</div>
            <div class="focus-complete-sub">В методике 12 недель 1–3 цели дают лучший результат. Но если вам нужны ещё цели — добавляйте ниже:</div>
          </div>
        `;
        list.appendChild(comp);

        const slot = document.createElement('div');
        slot.className = 'goal-add-slot-card';
        slot.innerHTML = `
          <div class="add-slot-icon">+</div>
          <div class="add-slot-text">
            <div class="add-slot-title">Поставить 4-ю цель</div>
            <div class="add-slot-sub">Дополнительная цель в ваш 12-недельный спринт</div>
          </div>
        `;
        slot.addEventListener('click', () => this.openGoalModal());
        list.appendChild(slot);
      } else if (count >= 4) {
        const nextNum = count + 1;
        const slot = document.createElement('div');
        slot.className = 'goal-add-slot-card';
        slot.innerHTML = `
          <div class="add-slot-icon">+</div>
          <div class="add-slot-text">
            <div class="add-slot-title">Поставить ${nextNum}-ю цель</div>
            <div class="add-slot-sub">Дополнительная цель в ваш 12-недельный спринт</div>
          </div>
        `;
        slot.addEventListener('click', () => this.openGoalModal());
        list.appendChild(slot);
      }
    }

    renderToday() {
      const offset = (this.selectedDayOffset !== undefined) ? this.selectedDayOffset : this.state.currentDayOffset;
      const dayDate = this.getDateForDayOffset(offset);
      const weekNum = Math.floor(offset / 7) + 1;
      const dayNum = offset + 1;

      // Date title
      const daysRu = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
      const monthsRu = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
      const monthsShort = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      
      document.getElementById('today-display-date').textContent = `${daysRu[dayDate.getDay()]}, ${dayDate.getDate()} ${monthsRu[dayDate.getMonth()]}`;
      document.getElementById('today-display-sprint').textContent = `НЕДЕЛЯ ${weekNum} • ДЕНЬ ${dayNum}`;

      // Quick Return button if inspecting a day other than today
      const returnRow = document.getElementById('today-return-row');
      if (returnRow) {
        if (offset !== this.state.currentDayOffset) {
          returnRow.style.display = 'flex';
          const todayDate = this.getDateForDayOffset(this.state.currentDayOffset);
          const shortDaysRu = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
          const btn = document.getElementById('btn-return-today');
          if (btn) {
            btn.innerHTML = `&larr; Вернуться к Сегодня (${shortDaysRu[todayDate.getDay()]}, ${todayDate.getDate()} ${monthsShort[todayDate.getMonth()]} • День ${this.state.currentDayOffset + 1})`;
          }
        } else {
          returnRow.style.display = 'none';
        }
      }

      // Time Budget Calculations
      const tb = this.calculateTimeBudget(offset);
      const modeTitles = {
        easy: '🌿 Режим «Лёгкий» (40 мин/день)',
        optimal: '⚡ Режим «Оптимальный» (60 мин/день)',
        hard: '🔥 Режим «Интенсивный» (84 мин/день)'
      };

      document.getElementById('budget-mode-title').textContent = modeTitles[tb.mode] || '🌿 Режим «Лёгкий»';
      document.getElementById('b-val-budget').textContent = `${tb.limit} мин`;
      document.getElementById('b-val-planned').textContent = `${tb.planned} мин`;
      
      const leftValEl = document.getElementById('b-val-left');
      const leftLblEl = document.getElementById('b-lbl-left');
      const statusPill = document.getElementById('budget-status-pill');
      const meterFill = document.getElementById('budget-meter-fill');

      if (tb.isOverloaded) {
        leftValEl.textContent = `+${Math.abs(tb.remaining)} мин`;
        leftValEl.className = 'b-val text-danger';
        leftLblEl.textContent = 'превышение!';
        statusPill.textContent = 'Перегруз ⚠️';
        statusPill.style.background = 'var(--terracotta-light)';
        statusPill.style.color = 'var(--terracotta)';
        meterFill.style.background = 'var(--terracotta)';
        meterFill.style.width = '100%';
      } else {
        leftValEl.textContent = `${tb.remaining} мин`;
        leftValEl.className = 'b-val text-green';
        leftLblEl.textContent = 'остаток';
        statusPill.textContent = 'В норме ✓';
        statusPill.style.background = 'var(--olive-light)';
        statusPill.style.color = 'var(--olive-dark)';
        meterFill.style.background = 'var(--olive-primary)';
        meterFill.style.width = `${tb.percentUsed}%`;
      }

      document.getElementById('meter-percent-txt').textContent = `${tb.percentUsed}% лимита`;

      // Tasks List for this day
      const tasksWrap = document.getElementById('today-tasks-list');
      tasksWrap.innerHTML = '';

      const tasks = this.getDayTasks(offset);
      const doneCount = tasks.filter(t => t.done).length;
      document.getElementById('today-tasks-count').textContent = `${doneCount} / ${tasks.length} выполнено`;

      if (tasks.length === 0) {
        tasksWrap.innerHTML = `
          <div style="text-align:center; padding:20px; color:var(--text-muted); font-size:0.85rem; font-weight:700;">
            На этот день пока нет действий. Нажмите «+ Добавить действие», чтобы запланировать!
          </div>
        `;
      } else {
        // Sort: main task first
        const sorted = [...tasks].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
        sorted.forEach(task => {
          const item = document.createElement('div');
          const isMain = !!task.isMain;
          item.className = `task-item ${task.done ? 'done' : ''} ${isMain ? 'is-main' : ''}`;

          const goal = this.state.goals.find(g => g.id === task.goalId);
          const goalTag = goal ? `<span class="task-goal-tag">🎯 ${this.escapeHtml(goal.category)}</span>` : '';

          item.innerHTML = `
            <div class="task-left">
              <button class="task-check-btn" onclick="app.toggleTask('${task.id}')">
                <span class="task-check-icon">✓</span>
              </button>
              <div class="task-details">
                ${isMain ? '<span class="task-main-badge">⭐ ГЛАВНОЕ СЕГОДНЯ</span>' : ''}
                <span class="task-title" style="${isMain ? 'font-weight:800; font-size:0.92rem;' : ''}">${this.escapeHtml(task.title)}</span>
                <div class="task-meta">
                  <span class="task-mins-pill">⏱️ ${task.mins} мин</span>
                  ${goalTag}
                </div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:2px;">
              <button class="task-star-btn ${isMain ? 'active' : ''}" onclick="app.toggleMainTask('${task.id}')" title="${isMain ? 'Главное дело дня' : 'Сделать главным'}">★</button>
              <button class="task-delete-btn" onclick="app.deleteTask('${task.id}')" title="Удалить">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          `;

          tasksWrap.appendChild(item);
        });
      }

      // Today Note for this day
      document.getElementById('today-note-input').value = this.getDayNote(offset) || '';
    }

    renderWeekView() {
      const w = this.selectedWeek;
      const isCurrentWeek = (w === this.state.currentWeekNumber);
      document.getElementById('week-page-number').textContent = isCurrentWeek ? `${w} ★` : `${w}`;
      document.getElementById('week-current-pill').textContent = isCurrentWeek ? `Неделя ${w} ★` : `Неделя ${w}`;

      // Dates range of week
      const weekStart = this.getDateForDayOffset((w - 1) * 7);
      const weekEnd = this.getDateForDayOffset((w - 1) * 7 + 6);
      const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      document.getElementById('week-page-dates').textContent = `${weekStart.getDate()} ${months[weekStart.getMonth()]} — ${weekEnd.getDate()} ${months[weekEnd.getMonth()]}`;

      // Copy Previous Week Banner
      const copyBanner = document.getElementById('copy-prev-week-banner');
      if (copyBanner) {
        if (w > 1) {
          const prevWeekNum = w - 1;
          const prevWeekStart = (w - 2) * 7;
          let prevTasksCount = 0;
          for (let i = 0; i < 7; i++) {
            const dData = this.getDayData(prevWeekStart + i);
            if (dData && Array.isArray(dData.tasks)) {
              prevTasksCount += dData.tasks.length;
            }
          }
          if (prevTasksCount > 0) {
            copyBanner.style.display = 'flex';
            document.getElementById('copy-prev-week-title').textContent = `Скопировать план с Недели ${prevWeekNum}?`;
            document.getElementById('copy-prev-week-desc').textContent = `Перенести ${prevTasksCount} ${this.declension(prevTasksCount, ['действие', 'действия', 'действий'])} со сбросом галочек`;
          } else {
            copyBanner.style.display = 'none';
          }
        } else {
          copyBanner.style.display = 'none';
        }
      }

      // 7 Days Vertical
      const daysContainer = document.getElementById('week-seven-days-list');
      daysContainer.innerHTML = '';

      let weekTotalPlannedMins = 0;
      const dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
      for (let i = 0; i < 7; i++) {
        const dayOffset = (w - 1) * 7 + i;
        const curDate = this.getDateForDayOffset(dayOffset);

        const card = document.createElement('div');
        const isCurrentDay = (dayOffset === this.state.currentDayOffset);
        const isSelectedDay = (dayOffset === this.selectedDayOffset);
        card.className = `day-v-card ${isCurrentDay ? 'is-today' : ''} ${isSelectedDay ? 'is-selected' : ''}`;

        const dayData = this.getDayData(dayOffset);
        const count = dayData.tasks.length;
        const totalMins = dayData.tasks.reduce((sum, t) => sum + (parseInt(t.mins, 10) || 0), 0);
        weekTotalPlannedMins += totalMins;

        const tb = this.calculateTimeBudget(dayOffset);
        let badgeHtml = '';
        if (count === 0) {
          badgeHtml = `<span class="day-v-balance-badge" style="background:#ECE7DB; color:var(--text-muted);">0 мин</span>`;
        } else if (tb.isOverloaded) {
          badgeHtml = `<span class="day-v-balance-badge bg-light-khaki text-danger">${totalMins} мин ⚠️</span>`;
        } else {
          badgeHtml = `<span class="day-v-balance-badge bg-light-green">${totalMins} мин ✓</span>`;
        }

        const mainTask = dayData.tasks.find(t => t.isMain);
        let summaryText = 'Нажмите, чтобы запланировать';
        if (count > 0) {
          if (mainTask) {
            summaryText = `⭐ <b>${this.escapeHtml(mainTask.title)}</b> (${count} ${this.declension(count, ['действие', 'действия', 'действий'])})`;
          } else {
            summaryText = `${count} ${this.declension(count, ['действие', 'действия', 'действий'])} • ${totalMins} мин`;
          }
        }

        card.innerHTML = `
          <div class="day-v-left">
            <span class="day-v-name ${isCurrentDay ? 'tag-today' : ''}">${dayNames[i]}</span>
            <div>
              <span class="day-v-date">
                ${curDate.getDate()} ${months[curDate.getMonth()]}
                ${isCurrentDay ? '<span class="today-sub-tag">Сегодня</span>' : ''}
              </span>
              <div class="day-v-tasks-summary">${summaryText}</div>
            </div>
          </div>
          <div class="day-v-right">
            ${badgeHtml}
          </div>
        `;

        card.addEventListener('click', () => {
          this.goToDay(dayOffset);
        });

        daysContainer.appendChild(card);
      }

      const totalBalanceBadge = document.getElementById('week-total-balance');
      if (totalBalanceBadge) {
        totalBalanceBadge.textContent = `Время недели: ${weekTotalPlannedMins} мин`;
      }

      // Reflection for selected week
      const ref = this.state.reflections[w] || {
        stars: 0,
        worked: '',
        failed: '',
        insights: '',
        focus: ''
      };

      // Stars
      const stars = document.querySelectorAll('#week-stars-rating .star');
      stars.forEach(s => {
        const val = parseInt(s.dataset.val, 10);
        if (val <= ref.stars) {
          s.classList.add('filled');
        } else {
          s.classList.remove('filled');
        }
      });

      document.getElementById('ref-worked').value = ref.worked || '';
      document.getElementById('ref-failed').value = ref.failed || '';
      document.getElementById('ref-insights').value = ref.insights || '';
      document.getElementById('ref-focus').value = ref.focus || '';
    }

    renderMental() {
      const m = this.state.mental || {};
      document.getElementById('mental-vision').value = m.vision || '';
      document.getElementById('mental-why').value = m.why || '';
      document.getElementById('mental-sacrifices').value = m.sacrifices || '';

      const list = document.getElementById('mental-refusals-list');
      list.innerHTML = '';
      (m.refusals || []).forEach((refusal, idx) => {
        const pill = document.createElement('span');
        pill.className = 'refusal-pill';
        pill.innerHTML = `
          <span>${this.escapeHtml(refusal)}</span>
          <span class="refusal-remove" onclick="app.removeRefusal(${idx})">&times;</span>
        `;
        list.appendChild(pill);
      });
    }

    updateStorageIndicator() {
      try {
        const str = localStorage.getItem(STORAGE_KEY) || '';
        const kb = Math.round((str.length * 2) / 1024);
        const el = document.getElementById('storage-usage-info');
        if (el) el.textContent = `Память: ~${kb} КБ / 5 МБ`;
      } catch (e) {}
    }

    // =========================================================================
    // USER ACTIONS & HANDLERS
    // =========================================================================
    switchTab(tabId, skipScroll = false) {
      this.currentTab = tabId;
      this.navTabs.forEach(t => {
        if (t.dataset.tab === tabId) {
          t.classList.add('active');
        } else {
          t.classList.remove('active');
        }
      });

      this.tabPanes.forEach(p => {
        if (p.id === `pane-${tabId}`) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });

      if (!skipScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Refresh view upon tab entry
      if (tabId === 'dashboard') {
        this.selectedWeek = this.state.currentWeekNumber;
        this.renderDashboard();
      }
      if (tabId === 'goals') this.renderGoals();
      if (tabId === 'today') this.renderToday();
      if (tabId === 'week') this.renderWeekView();
      if (tabId === 'mental') this.renderMental();
      this.renderCapsulesRibbon();
    }

    jumpToGoal(goalId) {
      this.switchTab('goals', true);
      requestAnimationFrame(() => {
        setTimeout(() => {
          const targetCard = document.getElementById('goal-card-' + goalId);
          if (targetCard) {
            const headerOffset = 90;
            const elementPosition = targetCard.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'smooth'
            });

            targetCard.classList.remove('highlight-pulse');
            void targetCard.offsetWidth; // trigger reflow
            targetCard.classList.add('highlight-pulse');
            setTimeout(() => targetCard.classList.remove('highlight-pulse'), 2500);
          }
        }, 120);
      });
    }

    findDayOffsetByTaskId(taskId) {
      if (this.state.days) {
        for (const [offsetKey, dayData] of Object.entries(this.state.days)) {
          if (dayData && Array.isArray(dayData.tasks) && dayData.tasks.some(t => t.id === taskId)) {
            return parseInt(offsetKey, 10);
          }
        }
      }
      return (this.selectedDayOffset !== undefined) ? this.selectedDayOffset : this.state.currentDayOffset;
    }

    toggleTask(taskId) {
      const offset = this.findDayOffsetByTaskId(taskId);
      const dayData = this.getDayData(offset);
      const task = dayData.tasks.find(t => t.id === taskId);
      if (task) {
        task.done = !task.done;

        // Auto-bloom daisy if all tasks of the day are completed!
        if (this.state.daisies && this.state.daisies[offset]) {
          const allTasksDone = dayData.tasks.length > 0 && dayData.tasks.every(t => t.done);
          this.state.daisies[offset].completed = allTasksDone;
        }

        if (offset === this.state.currentDayOffset) {
          this.state.todayTasks = dayData.tasks;
        }
        this.saveState();
        this.renderToday();
        this.renderDashboard();

        if (task.done) {
          this.launchConfetti();
          if ('vibrate' in navigator) navigator.vibrate(40);
        }
      }
    }

    toggleMainTask(taskId) {
      const offset = this.findDayOffsetByTaskId(taskId);
      const dayData = this.getDayData(offset);
      const task = dayData.tasks.find(t => t.id === taskId);
      if (task) {
        const willBeMain = !task.isMain;
        if (willBeMain) {
          dayData.tasks.forEach(t => { t.isMain = false; });
          task.isMain = true;
          this.launchConfetti();
          if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
        } else {
          task.isMain = false;
        }

        if (offset === this.state.currentDayOffset) {
          this.state.todayTasks = dayData.tasks;
        }
        this.saveState();
        this.renderToday();
        this.renderDashboard();
      }
    }

    deleteTask(taskId) {
      const offset = this.findDayOffsetByTaskId(taskId);
      const dayData = this.getDayData(offset);
      dayData.tasks = dayData.tasks.filter(t => t.id !== taskId);

      if (this.state.daisies && this.state.daisies[offset]) {
        const allTasksDone = dayData.tasks.length > 0 && dayData.tasks.every(t => t.done);
        this.state.daisies[offset].completed = allTasksDone;
      }

      if (offset === this.state.currentDayOffset) {
        this.state.todayTasks = dayData.tasks;
      }
      this.saveState();
      this.renderToday();
      this.renderDashboard();
    }

    openTaskModal() {
      document.getElementById('task-form-title').value = '';
      document.getElementById('task-form-mins').value = '20';
      
      const isMainCheck = document.getElementById('task-form-ismain');
      if (isMainCheck) isMainCheck.checked = false;

      // Populate goal options
      const sel = document.getElementById('task-form-goal');
      sel.innerHTML = '<option value="">Без привязки к цели</option>';
      this.state.goals.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g.id;
        opt.textContent = `🎯 ${g.category}: ${g.title.slice(0, 30)}...`;
        sel.appendChild(opt);
      });

      // Reset day buttons: select only the day of the week being viewed
      const offset = (this.selectedDayOffset !== undefined) ? this.selectedDayOffset : this.state.currentDayOffset;
      const currentDayOfWeek = offset % 7; // 0=Mon, 1=Tue, ..., 6=Sun
      document.querySelectorAll('#task-day-selector .day-btn').forEach(btn => {
        const d = parseInt(btn.dataset.day, 10);
        if (d === currentDayOfWeek) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      this.modalTask.classList.add('open');
    }

    closeTaskModal() {
      this.modalTask.classList.remove('open');
    }

    saveTaskFromModal() {
      const title = document.getElementById('task-form-title').value.trim();
      const mins = parseInt(document.getElementById('task-form-mins').value, 10) || 20;
      const goalId = document.getElementById('task-form-goal').value;
      const isMain = document.getElementById('task-form-ismain') ? document.getElementById('task-form-ismain').checked : false;

      if (!title) {
        alert('Пожалуйста, введите название действия');
        return;
      }

      const offset = (this.selectedDayOffset !== undefined) ? this.selectedDayOffset : this.state.currentDayOffset;
      const currentDayOfWeek = offset % 7;
      const weekStartOffset = Math.floor(offset / 7) * 7;

      // Collect active days
      let activeDays = Array.from(document.querySelectorAll('#task-day-selector .day-btn.active'))
        .map(b => parseInt(b.dataset.day, 10));

      if (activeDays.length === 0) {
        activeDays = [currentDayOfWeek];
      }

      const ts = Date.now();
      activeDays.forEach((dayIdx, i) => {
        const targetOffset = weekStartOffset + dayIdx;
        const dayData = this.getDayData(targetOffset);
        if (isMain) {
          dayData.tasks.forEach(t => { t.isMain = false; });
        }
        dayData.tasks.push({
          id: 't-' + ts + '-' + i,
          title,
          mins,
          goalId,
          done: false,
          isMain: isMain
        });

        if (targetOffset === this.state.currentDayOffset) {
          this.state.todayTasks = dayData.tasks;
        }
      });

      this.saveState();
      this.closeTaskModal();
      this.renderToday();
      this.renderWeekView();
      this.renderDashboard();
    }

    copyPreviousWeek() {
      const w = this.selectedWeek;
      if (w <= 1) return;
      const prevWeekNum = w - 1;
      const prevWeekStart = (w - 2) * 7;
      const currWeekStart = (w - 1) * 7;

      let totalToCopy = 0;
      for (let i = 0; i < 7; i++) {
        const src = this.getDayData(prevWeekStart + i);
        if (src && Array.isArray(src.tasks)) totalToCopy += src.tasks.length;
      }

      if (totalToCopy === 0) {
        alert(`На Неделе ${prevWeekNum} нет запланированных действий для копирования.`);
        return;
      }

      const msg = `Скопировать план с Недели ${prevWeekNum} в Неделю ${w}?\n\nБудет перенесено ${totalToCopy} ${this.declension(totalToCopy, ['действие', 'действия', 'действий'])} со сбросом галочек (готовы к выполнению).`;
      if (confirm(msg)) {
        const ts = Date.now();
        for (let i = 0; i < 7; i++) {
          const src = this.getDayData(prevWeekStart + i);
          const tgt = this.getDayData(currWeekStart + i);
          if (src && Array.isArray(src.tasks) && src.tasks.length > 0) {
            const cloned = src.tasks.map((t, idx) => ({
              id: 't-' + ts + '-' + i + '-' + idx,
              title: t.title,
              mins: t.mins,
              goalId: t.goalId,
              done: false,
              isMain: !!t.isMain
            }));
            tgt.tasks = [...tgt.tasks, ...cloned];
            if ((currWeekStart + i) === this.state.currentDayOffset) {
              this.state.todayTasks = tgt.tasks;
            }
          }
        }
        this.saveState();
        this.renderAll();
        this.launchConfetti();
      }
    }

    // Goals CRUD
    openGoalModal(goalId = null) {
      this.tempPhotoBase64 = null;
      const preview = document.getElementById('goal-photo-preview');
      const removeBtn = document.getElementById('btn-remove-photo');

      const focusHint = document.getElementById('goal-modal-focus-hint');
      if (goalId) {
        const goal = this.state.goals.find(g => g.id === goalId);
        if (!goal) return;
        document.getElementById('goal-modal-title').textContent = '🎯 Редактировать цель';
        if (focusHint) focusHint.style.display = 'none';
        document.getElementById('goal-form-id').value = goal.id;
        document.getElementById('goal-form-title').value = goal.title;
        document.getElementById('goal-form-cat').value = goal.category;
        document.getElementById('goal-form-unit').value = goal.unit;
        document.getElementById('goal-form-start').value = goal.startVal;
        document.getElementById('goal-form-curr').value = goal.currentVal;
        document.getElementById('goal-form-target').value = goal.targetVal;
        document.getElementById('goal-form-actions').value = (goal.actions || []).join('\n');

        if (goal.photo) {
          preview.style.backgroundImage = `url("${goal.photo}")`;
          preview.innerHTML = '';
          removeBtn.style.display = 'inline-block';
          this.tempPhotoBase64 = goal.photo;
        } else {
          preview.style.backgroundImage = 'none';
          preview.innerHTML = '<span class="photo-placeholder-txt">📷 Нажмите, чтобы загрузить фото цели</span>';
          removeBtn.style.display = 'none';
        }
      } else {
        document.getElementById('goal-modal-title').textContent = '🎯 Новая цель спринта';
        if (focusHint) {
          focusHint.style.display = (this.state.goals.length >= 3) ? 'flex' : 'none';
        }
        document.getElementById('goal-form-id').value = '';
        document.getElementById('goal-form-title').value = '';
        document.getElementById('goal-form-cat').value = 'Здоровье';
        document.getElementById('goal-form-unit').value = 'кг';
        document.getElementById('goal-form-start').value = '';
        document.getElementById('goal-form-curr').value = '';
        document.getElementById('goal-form-target').value = '';
        document.getElementById('goal-form-actions').value = '';
        preview.style.backgroundImage = 'none';
        preview.innerHTML = '<span class="photo-placeholder-txt">📷 Нажмите, чтобы загрузить фото цели</span>';
        removeBtn.style.display = 'none';
      }

      this.modalGoal.classList.add('open');
    }

    closeGoalModal() {
      this.modalGoal.classList.remove('open');
    }

    handlePhotoSelection(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const img = new Image();
        img.onload = () => {
          // Compress / downscale image to keep LocalStorage small (< 70KB)
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);

          this.tempPhotoBase64 = compressed;
          const preview = document.getElementById('goal-photo-preview');
          preview.style.backgroundImage = `url("${compressed}")`;
          preview.innerHTML = '';
          document.getElementById('btn-remove-photo').style.display = 'inline-block';
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    }

    removeGoalPhoto() {
      this.tempPhotoBase64 = '';
      const preview = document.getElementById('goal-photo-preview');
      preview.style.backgroundImage = 'none';
      preview.innerHTML = '<span class="photo-placeholder-txt">📷 Нажмите, чтобы загрузить фото цели</span>';
      document.getElementById('btn-remove-photo').style.display = 'none';
      this.goalPhotoInput.value = '';
    }

    editGoalPhoto(goalId) {
      this.openGoalModal(goalId);
    }

    saveGoalFromModal() {
      const id = document.getElementById('goal-form-id').value;
      const title = document.getElementById('goal-form-title').value.trim();
      const category = document.getElementById('goal-form-cat').value;
      const unit = document.getElementById('goal-form-unit').value.trim() || 'ед.';
      const startVal = parseFloat(document.getElementById('goal-form-start').value) || 0;
      const currentVal = parseFloat(document.getElementById('goal-form-curr').value) || startVal;
      const targetVal = parseFloat(document.getElementById('goal-form-target').value) || 0;
      const actionsRaw = document.getElementById('goal-form-actions').value;
      const actions = actionsRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);

      if (!title) {
        alert('Пожалуйста, укажите название цели');
        return;
      }

      if (id) {
        // Edit existing
        const goal = this.state.goals.find(g => g.id === id);
        if (goal) {
          goal.title = title;
          goal.category = category;
          goal.unit = unit;
          goal.startVal = startVal;
          goal.currentVal = currentVal;
          goal.targetVal = targetVal;
          goal.actions = actions;
          if (this.tempPhotoBase64 !== null) {
            goal.photo = this.tempPhotoBase64;
          }
          // Update current week measurement
          if (!goal.measurements) goal.measurements = new Array(12).fill(null);
          goal.measurements[this.state.currentWeekNumber - 1] = currentVal;
        }
      } else {
        // Add new goal
        const newGoal = {
          id: 'g-' + Date.now(),
          title,
          category,
          unit,
          startVal,
          currentVal,
          targetVal,
          photo: this.tempPhotoBase64 || '',
          actions,
          measurements: new Array(12).fill(null)
        };
        newGoal.measurements[this.state.currentWeekNumber - 1] = currentVal;
        this.state.goals.push(newGoal);
      }

      this.saveState();
      this.closeGoalModal();
      this.renderGoals();
      this.renderDashboard();
    }

    deleteGoal(goalId) {
      if (confirm('Вы уверены, что хотите удалить эту цель?')) {
        this.state.goals = this.state.goals.filter(g => g.id !== goalId);
        this.saveState();
        this.renderGoals();
        this.renderDashboard();
      }
    }

    calculateGoalProgress(goal) {
      const span = goal.targetVal - goal.startVal;
      if (span === 0) return 100;
      const done = goal.currentVal - goal.startVal;
      let pct = Math.round((done / span) * 100);
      return Math.max(0, Math.min(100, pct));
    }

    // Week reflections & stars
    changeWeek(delta) {
      let nw = this.selectedWeek + delta;
      if (nw < 1) nw = 1;
      if (nw > 12) nw = 12;
      this.selectedWeek = nw;
      this.renderWeekView();
      this.renderCapsulesRibbon();
    }

    setWeekRating(stars) {
      const w = this.selectedWeek;
      if (!this.state.reflections[w]) this.state.reflections[w] = {};
      this.state.reflections[w].stars = stars;
      this.saveState();
      this.renderWeekView();
      if (stars >= 4) this.launchConfetti();
    }

    saveCurrentWeekReflection() {
      const w = this.selectedWeek;
      if (!this.state.reflections[w]) this.state.reflections[w] = {};
      this.state.reflections[w].worked = document.getElementById('ref-worked').value;
      this.state.reflections[w].failed = document.getElementById('ref-failed').value;
      this.state.reflections[w].insights = document.getElementById('ref-insights').value;
      this.state.reflections[w].focus = document.getElementById('ref-focus').value;
      this.saveState();
    }

    // Mental Refusals
    addRefusal() {
      const inp = document.getElementById('new-refusal-input');
      const val = inp.value.trim();
      if (val) {
        if (!this.state.mental.refusals) this.state.mental.refusals = [];
        this.state.mental.refusals.push(val);
        inp.value = '';
        this.saveState();
        this.renderMental();
      }
    }

    removeRefusal(idx) {
      if (this.state.mental.refusals) {
        this.state.mental.refusals.splice(idx, 1);
        this.saveState();
        this.renderMental();
      }
    }

    changeDay(delta) {
      let cur = (this.selectedDayOffset !== undefined) ? this.selectedDayOffset : this.state.currentDayOffset;
      let nextDay = cur + delta;
      if (nextDay < 0) nextDay = 0;
      if (nextDay >= 84) nextDay = 83;
      this.selectedDayOffset = nextDay;
      this.renderToday();
    }

    // Settings & Backups
    openSettings() {
      document.getElementById('set-start-date').value = this.state.settings.startDate;
      document.getElementById('set-mode').value = this.state.settings.mode;
      document.getElementById('set-free-minutes').value = this.state.settings.freeMinutes;
      document.getElementById('set-reserve-percent').value = this.state.settings.reservePercent;
      this.updateStorageIndicator();
      this.modalSettings.classList.add('open');
    }

    closeSettings() {
      this.modalSettings.classList.remove('open');
    }

    saveSettingsFromModal() {
      this.state.settings.startDate = document.getElementById('set-start-date').value;
      this.state.settings.mode = document.getElementById('set-mode').value;
      this.state.settings.freeMinutes = parseInt(document.getElementById('set-free-minutes').value, 10) || 120;
      this.state.settings.reservePercent = parseInt(document.getElementById('set-reserve-percent').value, 10) || 30;

      this.syncCurrentDayFromDate();
      this.selectedDayOffset = this.state.currentDayOffset;
      this.selectedWeek = this.state.currentWeekNumber;

      this.saveState();
      this.closeSettings();
      this.renderAll();
    }

    exportBackup() {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      const nowStr = new Date().toISOString().split('T')[0];
      downloadAnchor.setAttribute('download', `12week_backup_${nowStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }

    handleFileImport(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (parsed && parsed.goals && parsed.settings) {
            this.state = parsed;
            this.saveState();
            this.renderAll();
            this.closeSettings();
            alert('Резервная копия успешно восстановлена!');
          } else {
            alert('Ошибка: Файл не похож на корректный бэкап планера.');
          }
        } catch (err) {
          alert('Ошибка при чтении файла JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    }

    resetToDemo() {
      if (confirm('Вернуть демонстрационные данные? Все текущие записи будут заменены примером из блокнота.')) {
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        this.syncCurrentDayFromDate();
        if (this.state.currentDayOffset !== undefined && !this.state.daysData[this.state.currentDayOffset]) {
          this.state.daysData[this.state.currentDayOffset] = JSON.parse(JSON.stringify(DEFAULT_STATE.daysData[32]));
        }
        this.selectedDayOffset = this.state.currentDayOffset;
        this.selectedWeek = this.state.currentWeekNumber;
        this.saveState();
        this.closeSettings();
        this.renderAll();
        this.launchConfetti();
      }
    }

    clearAllData() {
      if (confirm('Вы уверены? Это очистит все цели, галочки и заметки, сделав планер полностью пустым для ваших личных записей.')) {
        this.state = {
          settings: {
            startDate: new Date().toISOString().split('T')[0],
            mode: 'easy',
            freeMinutes: 120,
            reservePercent: 30
          },
          currentDayOffset: 0,
          currentWeekNumber: 1,
          daisies: generateInitialDaisies(84, 0),
          goals: [],
          todayTasks: [],
          todayNote: '',
          daysData: {},
          weekHistory: Array.from({ length: 12 }, (_, i) => ({ week: i + 1, pace: 0 })),
          reflections: {},
          mental: {
            vision: '',
            why: '',
            refusals: [],
            sacrifices: ''
          }
        };
        this.selectedDayOffset = 0;
        this.selectedWeek = 1;
        this.saveState();
        this.closeSettings();
        this.renderAll();
      }
    }

    // Visual Daisy SVG Generator
    getDaisySvg(isBloomed) {
      if (isBloomed) {
        return `
          <svg class="daisy-svg" viewBox="0 0 32 32" width="22" height="22">
            <g fill="#FFFFFF" stroke="#8D977B" stroke-width="0.8">
              <ellipse cx="16" cy="7" rx="2.5" ry="4.5" />
              <ellipse cx="16" cy="25" rx="2.5" ry="4.5" />
              <ellipse cx="7" cy="16" rx="4.5" ry="2.5" />
              <ellipse cx="25" cy="16" rx="4.5" ry="2.5" />
              <ellipse cx="9.6" cy="9.6" rx="2.5" ry="4.5" transform="rotate(-45 9.6 9.6)" />
              <ellipse cx="22.4" cy="22.4" rx="2.5" ry="4.5" transform="rotate(-45 22.4 22.4)" />
              <ellipse cx="9.6" cy="22.4" rx="2.5" ry="4.5" transform="rotate(45 9.6 22.4)" />
              <ellipse cx="22.4" cy="9.6" rx="2.5" ry="4.5" transform="rotate(45 22.4 9.6)" />
            </g>
            <circle cx="16" cy="16" r="4.8" fill="#F5C038" stroke="#D39F18" stroke-width="0.7" />
          </svg>
        `;
      } else {
        return `
          <svg class="daisy-svg" viewBox="0 0 32 32" width="16" height="16">
            <circle cx="16" cy="16" r="3" fill="#C5C0B2" />
          </svg>
        `;
      }
    }

    // Celebration Confetti Effect
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    launchConfetti() {
      const colors = ['#F5C038', '#5C6647', '#D47B85', '#E8ECE2', '#DE7358'];
      const particles = [];
      const particleCount = 45;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          r: Math.random() * 5 + 3,
          d: Math.random() * particleCount,
          color: colors[Math.floor(Math.random() * colors.length)],
          tilt: Math.floor(Math.random() * 10) - 10,
          tiltAngleIncremental: Math.random() * 0.07 + 0.05,
          tiltAngle: 0,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.8) * 14 - 3,
          opacity: 1
        });
      }

      let animationFrame;
      const animate = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let activeCount = 0;

        particles.forEach(p => {
          p.tiltAngle += p.tiltAngleIncremental;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.opacity -= 0.016;

          if (p.opacity > 0) {
            activeCount++;
            this.ctx.beginPath();
            this.ctx.lineWidth = p.r;
            this.ctx.strokeStyle = p.color;
            this.ctx.globalAlpha = Math.max(0, p.opacity);
            this.ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            this.ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
          }
        });

        if (activeCount > 0) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          cancelAnimationFrame(animationFrame);
        }
      };

      animate();
    }

    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  }

  // Initialize App
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.app = new PlannerApp();
    });
  } else {
    window.app = new PlannerApp();
  }

})();
