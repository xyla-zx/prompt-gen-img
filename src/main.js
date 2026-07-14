import './style.css';
import { marked } from 'marked';
import { ROLES, TEMPLATES, VISUAL_PRESETS } from './templates.js';
import { compilePrompt, calculateScores, optimizePrompt } from './promptEngine.js';
import { serializeState, deserializeState, downloadFile, formatJsonState } from './utils.js';

// Setup marked options for safe rendering
marked.setOptions({
  breaks: true,
  gfm: true
});

// App State
let appState = {
  projectName: '',
  projectGoal: '',
  audience: '',
  difficulty: 'Intermediate',
  roleId: 'ba',
  customRole: '',
  background: '',
  objective: '',
  target: '',
  stakeholders: '',
  constraints: '',
  rawData: '',
  analysisFrameworks: [],
  outputFormat: 'presentation',
  layout: '16_9',
  stylePreset: 'modern',
  density: 'balanced',
  colorTheme: 'blue',
  iconStyle: 'flat',
  whitespace: 'medium'
};

let blockOrder = ['role', 'context', 'data', 'analysis', 'output', 'visual'];
let activeStep = 1;
let activeTab = 'wizard'; // wizard, blocks, optimizer, library
let previewMode = 'formatted'; // formatted, raw

// DOM Elements Cache
const DOM = {
  // Navigation & Reset
  quickTemplateSelect: document.getElementById('quick-template-select'),
  btnResetApp: document.getElementById('btn-reset-app'),

  // Tabs
  tabBtnWizard: document.getElementById('tab-btn-wizard'),
  tabBtnBlocks: document.getElementById('tab-btn-blocks'),
  tabBtnOptimizer: document.getElementById('tab-btn-optimizer'),
  tabBtnLibrary: document.getElementById('tab-btn-library'),
  tabContentWizard: document.getElementById('tab-content-wizard'),
  tabContentBlocks: document.getElementById('tab-content-blocks'),
  tabContentOptimizer: document.getElementById('tab-content-optimizer'),
  tabContentLibrary: document.getElementById('tab-content-library'),
  leftPaneScroll: document.getElementById('left-pane-scroll'),

  // Wizard Navigation
  btnPrevStep: document.getElementById('btn-prev-step'),
  btnNextStep: document.getElementById('btn-next-step'),
  wizardSteps: document.querySelectorAll('.wizard-step'),

  // Inputs Step 1
  inputProjName: document.getElementById('input-proj-name'),
  inputProjGoal: document.getElementById('input-proj-goal'),
  inputProjAudience: document.getElementById('input-proj-audience'),
  inputProjDifficulty: document.getElementById('input-proj-difficulty'),

  // Inputs Step 2
  roleCardsContainer: document.getElementById('role-cards-container'),
  customRoleInputBox: document.getElementById('custom-role-input-box'),
  inputCustomRole: document.getElementById('input-custom-role'),

  // Inputs Step 3
  inputCtxBg: document.getElementById('input-ctx-bg'),
  inputCtxObjective: document.getElementById('input-ctx-objective'),
  inputCtxTarget: document.getElementById('input-ctx-target'),
  inputCtxStakeholders: document.getElementById('input-ctx-stakeholders'),
  inputCtxConstraints: document.getElementById('input-ctx-constraints'),

  // Inputs Step 4
  dragDropZone: document.getElementById('drag-drop-zone'),
  fileUploader: document.getElementById('file-uploader'),
  inputRawData: document.getElementById('input-raw-data'),
  charCounter: document.getElementById('char-counter'),

  // Inputs Step 5
  analysisCheckboxContainer: document.getElementById('analysis-checkbox-container'),

  // Inputs Step 6
  outputCardsContainer: document.getElementById('output-cards-container'),

  // Inputs Step 7
  visualLayoutContainer: document.getElementById('visual-layout-container'),
  visualStyleContainer: document.getElementById('visual-style-container'),
  visualColorContainer: document.getElementById('visual-color-container'),
  visualDensityContainer: document.getElementById('visual-density-container'),
  visualIconContainer: document.getElementById('visual-icon-container'),
  visualSpaceContainer: document.getElementById('visual-space-container'),

  // Inputs Step 8 & Gauges
  checklistResultsContainer: document.getElementById('checklist-results-container'),
  gaugeQualityCircle: document.getElementById('gauge-quality-circle'),
  gaugeQualityText: document.getElementById('gauge-quality-text'),
  labelQualityRating: document.getElementById('label-quality-rating'),

  gaugeImageCircle: document.getElementById('gauge-image-circle'),
  gaugeImageText: document.getElementById('gauge-image-text'),
  labelImageRating: document.getElementById('label-image-rating'),

  // Preview
  btnPreviewFormatted: document.getElementById('btn-preview-formatted'),
  btnPreviewRaw: document.getElementById('btn-preview-raw'),
  previewFormattedBox: document.getElementById('preview-formatted-box'),
  previewRawBox: document.getElementById('preview-raw-box'),

  // Actions
  btnCopyPrompt: document.getElementById('btn-copy-prompt'),
  btnDownloadMd: document.getElementById('btn-download-md'),
  btnDownloadJson: document.getElementById('btn-download-json'),
  btnShareLink: document.getElementById('btn-share-link'),

  // Blocks
  blocksList: document.getElementById('blocks-list'),
  btnResetBlocks: document.getElementById('btn-reset-blocks'),

  // Optimizer
  optimizerInput: document.getElementById('optimizer-input'),
  btnOptimizePrompt: document.getElementById('btn-optimize-prompt'),
  optimizerResultsPanel: document.getElementById('optimizer-results-panel'),
  optBeforeScore: document.getElementById('opt-before-score'),
  optAfterScore: document.getElementById('opt-after-score'),
  optExplanationList: document.getElementById('opt-explanation-list'),
  btnApplyOptimized: document.getElementById('btn-apply-optimized'),

  // Library
  libraryTemplatesGrid: document.getElementById('library-templates-grid')
};

// State optimization placeholder
let tempOptimizedState = null;

// Initialize Application
function init() {
  // 1. Check for URL share state
  const hash = window.location.hash.substring(1);
  const loadedShare = deserializeState(hash);

  if (loadedShare) {
    appState = loadedShare.state;
    blockOrder = loadedShare.blockOrder;
    // Clear hash to keep URL tidy
    history.replaceState("", document.title, window.location.pathname);
  } else {
    // Load from LocalStorage
    const localData = localStorage.getItem('ai_prompt_architect_state');
    const localOrder = localStorage.getItem('ai_prompt_architect_blocks');
    if (localData) {
      try {
        appState = JSON.parse(localData);
      } catch (e) {
        console.warn('Failed to parse local storage state');
      }
    }
    if (localOrder) {
      try {
        blockOrder = JSON.parse(localOrder);
      } catch (e) {
        console.warn('Failed to parse local storage blocks');
      }
    }
  }

  // 2. Render Static components
  renderRoleCards();
  renderAnalysisCheckboxes();
  renderOutputCards();
  renderVisualPresets();
  renderLibraryTemplates();
  renderQuickTemplateSelect();
  renderBlocks();

  // 3. Bind UI Inputs with Current State
  syncStateToInputs();

  // 4. Bind Listeners
  bindEvents();

  // 5. Run Initial update
  updateUI();
}

// -------------------------------------------------------------
// UI RENDERING HELPERS
// -------------------------------------------------------------

function renderRoleCards() {
  DOM.roleCardsContainer.innerHTML = ROLES.map(role => `
    <div class="glass-card rounded-2xl p-4 border border-cyber-border cursor-pointer transition flex items-start gap-3 hover:bg-blue-500/5 select-none role-card" data-role-id="${role.id}">
      <span class="text-2xl">${role.emoji}</span>
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
          ${role.name}
          <span class="role-badge text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20 hidden">เลือกแล้ว</span>
        </h3>
        <p class="text-xs text-cyber-muted">${role.description}</p>
      </div>
    </div>
  `).join('') + `
    <div class="glass-card rounded-2xl p-4 border border-cyber-border cursor-pointer transition flex items-start gap-3 hover:bg-blue-500/5 select-none role-card" data-role-id="custom">
      <span class="text-2xl">⚙️</span>
      <div class="space-y-1">
        <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
          Custom Role
          <span class="role-badge text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20 hidden">เลือกแล้ว</span>
        </h3>
        <p class="text-xs text-cyber-muted">เขียนสวมบทบาทและความเชี่ยวชาญส่วนตัวของคุณเอง</p>
      </div>
    </div>
  `;
}

function renderAnalysisCheckboxes() {
  const frameworks = [
    { id: 'swot', name: 'SWOT Analysis', emoji: '⚔️', desc: 'จุดแข็ง จุดอ่อน โอกาส อุปสรรค' },
    { id: '5w1h', name: '5W1H Framework', emoji: '🧐', desc: 'ใคร อะไร ที่ไหน เมื่อไหร่ ทำไม อย่างไร' },
    { id: 'ipo', name: 'IPO Model', emoji: '🔄', desc: 'Input → Process → Output' },
    { id: 'timeline', name: 'Timeline / Phases', emoji: '📅', desc: 'แผนงานกำหนดช่วงเวลาและลำดับขั้น' },
    { id: 'priority', name: 'Priority Matrix', emoji: '🎯', desc: 'ลำดับความเร่งด่วนตามแรงกระทบ' },
    { id: 'risk', name: 'Risk & Mitigation', emoji: '⚠️', desc: 'ระบุจุดเสี่ยงและวิธีตั้งรับป้องกัน' },
    { id: 'gap', name: 'Gap Analysis', emoji: '🕳️', desc: 'ช่องว่างสถานะปัจจุบัน vs ปลายทาง' },
    { id: 'roadmap', name: 'Strategic Roadmap', emoji: '🗺️', desc: 'แผนภาพระยะสั้น กลาง ยาว' },
    { id: 'user_journey', name: 'User Journey', emoji: '🚶', desc: 'ลำดับขั้นตอนอารมณ์และจุดสะดุดผู้ใช้' },
    { id: 'agile', name: 'Agile Delivery', emoji: '⚡', desc: 'ซอยงานเป็นสปริ้นท์พร้อมส่งมอบ' }
  ];

  DOM.analysisCheckboxContainer.innerHTML = frameworks.map(fw => `
    <label class="glass-card rounded-2xl p-4 border border-cyber-border cursor-pointer transition flex items-start gap-3 hover:bg-purple-500/5 select-none">
      <input type="checkbox" value="${fw.id}" class="mt-1 rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-purple-500/30 w-4 h-4 cursor-pointer analysis-checkbox">
      <div class="space-y-0.5">
        <span class="text-xs font-bold text-white flex items-center gap-1">${fw.emoji} ${fw.name}</span>
        <p class="text-xs text-cyber-muted">${fw.desc}</p>
      </div>
    </label>
  `).join('');
}

function renderOutputCards() {
  const outputs = [
    { id: 'presentation', name: 'Slide Presentation', emoji: '📊', desc: 'สไลด์ประกอบการนำเสนอ' },
    { id: 'report', name: 'Detailed Report', emoji: '📄', desc: 'รายงานวิเคราะห์เชิงลึก' },
    { id: 'infographic', name: 'Infographic Spec', emoji: '🎨', desc: 'ภาพกราฟิกข้อมูลเชิงภาพ' },
    { id: 'mindmap', name: 'Mindmap Outline', emoji: '🧠', desc: 'กิ่งสมองสรุปหัวข้อประเด็น' },
    { id: 'flowchart', name: 'Flowchart Workflow', emoji: '🔱', desc: 'แผนผังกระบวนการและเงื่อนไข' },
    { id: 'powerpoint', name: 'PowerPoint Outline', emoji: '📉', desc: 'โครงสร้างสไลด์แยกหน้าชัดเจน' },
    { id: 'markdown', name: 'Clean Markdown', emoji: '📝', desc: 'เอกสารหัวข้อ Markdown สะอาด' },
    { id: 'summary', name: 'Executive Summary', emoji: '💡', desc: 'สรุปผู้บริหารแบบสั้นกระชับ' }
  ];

  DOM.outputCardsContainer.innerHTML = outputs.map(out => `
    <div class="glass-card rounded-xl p-3 border border-cyber-border cursor-pointer text-center hover:bg-pink-500/5 transition select-none output-card" data-output-id="${out.id}">
      <span class="text-xl block mb-1">${out.emoji}</span>
      <h3 class="text-xs font-bold text-white mb-0.5 flex items-center justify-center gap-1">
        ${out.name}
        <span class="out-badge w-1.5 h-1.5 rounded-full bg-pink-500 hidden"></span>
      </h3>
      <p class="text-xs text-cyber-muted line-clamp-1">${out.desc}</p>
    </div>
  `).join('');
}

function renderVisualPresets() {
  // Layouts
  DOM.visualLayoutContainer.innerHTML = VISUAL_PRESETS.layouts.map(item => `
    <div class="glass-card rounded-xl p-3 border border-cyber-border cursor-pointer hover:bg-cyan-500/5 transition text-center select-none visual-option" data-type="layout" data-value="${item.id}" data-tooltip="${item.desc}">
      <span class="text-xs font-bold text-white block">${item.name}</span>
    </div>
  `).join('');

  // Styles
  DOM.visualStyleContainer.innerHTML = VISUAL_PRESETS.styles.map(item => `
    <div class="glass-card rounded-xl p-3 border border-cyber-border cursor-pointer hover:bg-cyan-500/5 transition text-center select-none visual-option" data-type="stylePreset" data-value="${item.id}" data-tooltip="${item.desc}">
      <span class="text-xs font-bold text-white block">${item.name}</span>
    </div>
  `).join('');

  // Colors
  DOM.visualColorContainer.innerHTML = VISUAL_PRESETS.colors.map(item => `
    <div class="glass-card rounded-xl p-3 border border-cyber-border cursor-pointer hover:bg-cyan-500/5 transition flex items-center justify-center gap-1.5 select-none visual-option" data-type="colorTheme" data-value="${item.id}" data-tooltip="${item.desc}">
      <span class="w-2.5 h-2.5 rounded-full" style="background: ${item.hex}"></span>
      <span class="text-xs font-bold text-white">${item.name.split(' ')[0]}</span>
    </div>
  `).join('');

  // Densities
  DOM.visualDensityContainer.innerHTML = VISUAL_PRESETS.densities.map(item => `
    <div class="glass-card rounded-xl p-3 border border-cyber-border cursor-pointer hover:bg-cyan-500/5 transition text-center select-none visual-option" data-type="density" data-value="${item.id}" data-tooltip="${item.desc}">
      <span class="text-xs font-bold text-white block">${item.name.split(' ')[0]}</span>
    </div>
  `).join('');

  // Icons
  DOM.visualIconContainer.innerHTML = VISUAL_PRESETS.icons.map(item => `
    <div class="glass-card rounded-xl p-3 border border-cyber-border cursor-pointer hover:bg-cyan-500/5 transition text-center select-none visual-option" data-type="iconStyle" data-value="${item.id}" data-tooltip="${item.desc}">
      <span class="text-xs font-bold text-white block">${item.name.split(' ')[0]}</span>
    </div>
  `).join('');

  // Spaces
  DOM.visualSpaceContainer.innerHTML = VISUAL_PRESETS.whitespaces.map(item => `
    <div class="glass-card rounded-xl p-3 border border-cyber-border cursor-pointer hover:bg-cyan-500/5 transition text-center select-none visual-option" data-type="whitespace" data-value="${item.id}" data-tooltip="${item.desc}">
      <span class="text-xs font-bold text-white block">${item.name.split(' ')[0]}</span>
    </div>
  `).join('');
}

function renderLibraryTemplates() {
  DOM.libraryTemplatesGrid.innerHTML = TEMPLATES.map(temp => `
    <div class="glass-card rounded-2xl p-5 border border-cyber-border flex flex-col justify-between hover:border-amber-500/30 transition">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">${temp.category}</span>
          <span class="text-2xl">${temp.emoji}</span>
        </div>
        <h3 class="text-md font-bold text-white">${temp.name}</h3>
        <p class="text-xs text-cyber-muted leading-relaxed">${temp.description}</p>
      </div>
      <button class="mt-4 w-full py-2 bg-amber-600/10 hover:bg-amber-600 hover:text-white text-amber-400 text-xs font-semibold rounded-xl border border-amber-500/20 transition load-template-btn" data-template-id="${temp.id}">
        โหลดแม่แบบข้อมูลนี้
      </button>
    </div>
  `).join('');
}

function renderQuickTemplateSelect() {
  DOM.quickTemplateSelect.innerHTML = `
    <option value="">-- เลือกเทมเพลตด่วน --</option>
    ${TEMPLATES.map(t => `<option value="${t.id}">${t.emoji} ${t.name.split(' (')[0]}</option>`).join('')}
  `;
}

// -------------------------------------------------------------
// BLOCKS TAB DRAG AND DROP
// -------------------------------------------------------------

function renderBlocks() {
  const blockData = {
    role: { name: 'Role (บทบาท)', color: 'cyber-role', icon: '👤', desc: 'กำหนดความเป็นผู้เชี่ยวชาญในการให้วิจารณญาณ' },
    context: { name: 'Context (บริบท)', color: 'cyber-context', icon: '🌐', desc: 'ภูมิหลังและข้อจำกัดของโปรเจกต์' },
    data: { name: 'Raw Data (ข้อมูลดิบ)', color: 'cyber-data', icon: '📂', desc: 'ข้อมูลประกอบสถิติการใช้งานจริง' },
    analysis: { name: 'Analysis (การวิเคราะห์)', color: 'cyber-analysis', icon: '🧠', desc: 'กรอบแนวคิด SWOT/5W1H/IPO' },
    output: { name: 'Structure (โครงสร้างผลผลิต)', color: 'cyber-output', icon: '📋', desc: 'สัดส่วนและรูปแบบการจัดรายงาน' },
    visual: { name: 'Visual Spec (สเปกภาพ)', color: 'cyber-visual', icon: '🖼️', desc: 'การจัดวางภาพส่งต่อให้ Image AI' }
  };

  DOM.blocksList.innerHTML = blockOrder.map((blockId, index) => {
    const b = blockData[blockId];
    if (!b) return '';
    return `
      <div class="glass-card block-${blockId} rounded-2xl p-4 border border-cyber-border cursor-grab active:cursor-grabbing flex items-center justify-between transition-all duration-200 select-none block-draggable" draggable="true" data-block-id="${blockId}">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center font-bold text-sm text-gray-400 border border-cyber-border">${index + 1}</div>
          <span class="text-xl">${b.icon}</span>
          <div class="text-left">
            <h3 class="text-sm font-bold text-white">${b.name}</h3>
            <p class="text-xs text-cyber-muted">${b.desc}</p>
          </div>
        </div>
        
        <!-- Reorder handles -->
        <div class="flex items-center gap-2">
          <!-- Mini indicator tag -->
          <span class="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-${b.color}/20 text-${b.color} border border-${b.color}/30">${blockId}</span>
          <!-- Reorder handle graphic -->
          <svg class="w-5 h-5 text-cyber-muted cursor-grab" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16"></path>
          </svg>
        </div>
      </div>
    `;
  }).join('');

  // Drag and Drop Logic
  let draggedBlockId = null;
  const draggables = DOM.blocksList.querySelectorAll('.block-draggable');

  draggables.forEach(elem => {
    elem.addEventListener('dragstart', (e) => {
      draggedBlockId = elem.getAttribute('data-block-id');
      elem.classList.add('sortable-ghost');
      e.dataTransfer.effectAllowed = 'move';
    });

    elem.addEventListener('dragend', () => {
      elem.classList.remove('sortable-ghost');
      draggedBlockId = null;
    });

    elem.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    elem.addEventListener('drop', (e) => {
      e.preventDefault();
      const targetBlockId = elem.getAttribute('data-block-id');
      if (draggedBlockId && draggedBlockId !== targetBlockId) {
        const draggedIndex = blockOrder.indexOf(draggedBlockId);
        const targetIndex = blockOrder.indexOf(targetBlockId);

        // Remove and splice back at new position
        blockOrder.splice(draggedIndex, 1);
        blockOrder.splice(targetIndex, 0, draggedBlockId);

        // Save & Render
        localStorage.setItem('ai_prompt_architect_blocks', JSON.stringify(blockOrder));
        renderBlocks();
        updateUI();
      }
    });
  });
}

// -------------------------------------------------------------
// EVENT BINDINGS & SYNCHRONIZATIONS
// -------------------------------------------------------------

function syncStateToInputs() {
  // Step 1: Project Profile
  DOM.inputProjName.value = appState.projectName || '';
  DOM.inputProjGoal.value = appState.projectGoal || '';
  DOM.inputProjAudience.value = appState.audience || '';
  DOM.inputProjDifficulty.value = appState.difficulty || 'Intermediate';

  // Step 2: Role
  selectRoleCard(appState.roleId);
  DOM.inputCustomRole.value = appState.customRole || '';

  // Step 3: Context
  DOM.inputCtxBg.value = appState.background || '';
  DOM.inputCtxObjective.value = appState.objective || '';
  DOM.inputCtxTarget.value = appState.target || '';
  DOM.inputCtxStakeholders.value = appState.stakeholders || '';
  DOM.inputCtxConstraints.value = appState.constraints || '';

  // Step 4: Raw Data
  DOM.inputRawData.value = appState.rawData || '';
  updateCharCounter();

  // Step 5: Analysis Checkboxes
  const checkBoxes = DOM.analysisCheckboxContainer.querySelectorAll('.analysis-checkbox');
  checkBoxes.forEach(box => {
    box.checked = (appState.analysisFrameworks || []).includes(box.value);
  });

  // Step 6: Output Formats
  selectOutputCard(appState.outputFormat);

  // Step 7: Visual presets
  selectVisualOption('layout', appState.layout);
  selectVisualOption('stylePreset', appState.stylePreset);
  selectVisualOption('colorTheme', appState.colorTheme);
  selectVisualOption('density', appState.density);
  selectVisualOption('iconStyle', appState.iconStyle);
  selectVisualOption('whitespace', appState.whitespace);

}

function bindEvents() {
  // Wizard Navigation
  DOM.btnPrevStep.addEventListener('click', () => switchStep(activeStep - 1));
  DOM.btnNextStep.addEventListener('click', () => switchStep(activeStep + 1));

  DOM.wizardSteps.forEach(elem => {
    elem.addEventListener('click', () => {
      const target = parseInt(elem.getAttribute('data-step'), 10);
      switchStep(target);
    });
  });

  // Tab controls
  DOM.tabBtnWizard.addEventListener('click', () => switchTab('wizard'));
  DOM.tabBtnBlocks.addEventListener('click', () => switchTab('blocks'));
  DOM.tabBtnOptimizer.addEventListener('click', () => switchTab('optimizer'));
  DOM.tabBtnLibrary.addEventListener('click', () => switchTab('library'));

  // Reset Buttons
  DOM.btnResetApp.addEventListener('click', () => {
    if (confirm('คุณต้องการรีเซ็ตล้างข้อมูลในฟอร์มทั้งหมดเป็นค่าว่างใช่หรือไม่?')) {
      resetState();
    }
  });

  DOM.btnResetBlocks.addEventListener('click', () => {
    blockOrder = ['role', 'context', 'data', 'analysis', 'output', 'visual'];
    localStorage.setItem('ai_prompt_architect_blocks', JSON.stringify(blockOrder));
    renderBlocks();
    updateUI();
  });

  // Quick select template from navbar
  DOM.quickTemplateSelect.addEventListener('change', (e) => {
    const tempId = e.target.value;
    if (tempId) {
      loadTemplate(tempId);
    }
  });

  // Step 1: Project listeners
  const inputFields = [
    { el: DOM.inputProjName, prop: 'projectName' },
    { el: DOM.inputProjGoal, prop: 'projectGoal' },
    { el: DOM.inputProjAudience, prop: 'audience' },
    { el: DOM.inputProjDifficulty, prop: 'difficulty' }
  ];
  inputFields.forEach(f => {
    f.el.addEventListener('input', () => {
      appState[f.prop] = f.el.value;
      updateUI();
    });
  });

  // Step 2: Role Click Card listeners
  DOM.roleCardsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.role-card');
    if (card) {
      const rId = card.getAttribute('data-role-id');
      appState.roleId = rId;
      selectRoleCard(rId);
      updateUI();
    }
  });
  DOM.inputCustomRole.addEventListener('input', () => {
    appState.customRole = DOM.inputCustomRole.value;
    updateUI();
  });

  // Step 3: Context listeners
  const ctxFields = [
    { el: DOM.inputCtxBg, prop: 'background' },
    { el: DOM.inputCtxObjective, prop: 'objective' },
    { el: DOM.inputCtxTarget, prop: 'target' },
    { el: DOM.inputCtxStakeholders, prop: 'stakeholders' },
    { el: DOM.inputCtxConstraints, prop: 'constraints' }
  ];
  ctxFields.forEach(f => {
    f.el.addEventListener('input', () => {
      appState[f.prop] = f.el.value;
      updateUI();
    });
  });

  // Step 4: Raw Data & drag drop
  DOM.inputRawData.addEventListener('input', () => {
    appState.rawData = DOM.inputRawData.value;
    updateCharCounter();
    updateUI();
  });

  // Drag and Drop Zone
  DOM.dragDropZone.addEventListener('click', () => DOM.fileUploader.click());
  DOM.dragDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    DOM.dragDropZone.classList.add('border-cyber-role', 'bg-blue-500/5');
  });
  DOM.dragDropZone.addEventListener('dragleave', () => {
    DOM.dragDropZone.classList.remove('border-cyber-role', 'bg-blue-500/5');
  });
  DOM.dragDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    DOM.dragDropZone.classList.remove('border-cyber-role', 'bg-blue-500/5');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleTextFile(files[0]);
    }
  });
  DOM.fileUploader.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleTextFile(files[0]);
    }
  });

  // Step 5: Checkboxes
  DOM.analysisCheckboxContainer.addEventListener('change', () => {
    const checked = [];
    const boxes = DOM.analysisCheckboxContainer.querySelectorAll('.analysis-checkbox');
    boxes.forEach(box => {
      if (box.checked) checked.push(box.value);
    });
    appState.analysisFrameworks = checked;
    updateUI();
  });

  // Step 6: Output selection
  DOM.outputCardsContainer.addEventListener('click', (e) => {
    const card = e.target.closest('.output-card');
    if (card) {
      const outId = card.getAttribute('data-output-id');
      appState.outputFormat = outId;
      selectOutputCard(outId);
      updateUI();
    }
  });

  // Step 7: Visual preset selectors
  const visualContainers = [
    DOM.visualLayoutContainer,
    DOM.visualStyleContainer,
    DOM.visualColorContainer,
    DOM.visualDensityContainer,
    DOM.visualIconContainer,
    DOM.visualSpaceContainer
  ];
  visualContainers.forEach(container => {
    container.addEventListener('click', (e) => {
      const opt = e.target.closest('.visual-option');
      if (opt) {
        const type = opt.getAttribute('data-type');
        const val = opt.getAttribute('data-value');
        appState[type] = val;
        selectVisualOption(type, val);
        updateUI();
      }
    });
  });

  // Preview Formatted/Raw toggle
  DOM.btnPreviewFormatted.addEventListener('click', () => switchPreviewMode('formatted'));
  DOM.btnPreviewRaw.addEventListener('click', () => switchPreviewMode('raw'));

  // Export buttons
  DOM.btnCopyPrompt.addEventListener('click', () => {
    const text = compilePrompt(appState, blockOrder);
    navigator.clipboard.writeText(text)
      .then(() => alert('คัดลอก Prompt ลง Clipboard สำเร็จแล้ว!'))
      .catch(err => console.error('Copy failed:', err));
  });

  DOM.btnDownloadMd.addEventListener('click', () => {
    const promptText = compilePrompt(appState, blockOrder);
    const fileName = `${appState.projectName ? appState.projectName.replace(/\s+/g, '_') : 'upa_prompt'}.md`;
    downloadFile(promptText, fileName, 'text/markdown');
  });

  DOM.btnDownloadJson.addEventListener('click', () => {
    const jsonText = formatJsonState(appState, blockOrder);
    const fileName = `${appState.projectName ? appState.projectName.replace(/\s+/g, '_') : 'upa_prompt'}.json`;
    downloadFile(jsonText, fileName, 'application/json');
  });

  DOM.btnShareLink.addEventListener('click', () => {
    const hashStr = serializeState(appState, blockOrder);
    const shareUrl = `${window.location.origin}${window.location.pathname}#${hashStr}`;

    // Copy URL to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert('ลิงก์แชร์พร้อมโหลดค่ากลับมาถูกคัดลอกลง Clipboard แล้ว! คุณส่งให้คนอื่นเปิดได้ทันที'))
      .catch(err => console.error('Sharing link copy failed:', err));
  });

  // Library load buttons
  DOM.libraryTemplatesGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.load-template-btn');
    if (btn) {
      const tempId = btn.getAttribute('data-template-id');
      loadTemplate(tempId);
    }
  });

  // Optimizer optimize button
  DOM.btnOptimizePrompt.addEventListener('click', () => {
    const rawVal = DOM.optimizerInput.value;
    const res = optimizePrompt(rawVal);
    if (res.success) {
      tempOptimizedState = res.optimizedState;

      DOM.optBeforeScore.textContent = `${res.beforeScore}/100`;
      DOM.optAfterScore.textContent = `${res.afterScore}/100`;

      DOM.optExplanationList.innerHTML = res.explanation.map(exp => `
        <li class="flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <strong class="text-white">${exp.element}:</strong> ${exp.text}
        </li>
      `).join('');

      DOM.optimizerResultsPanel.classList.remove('hidden');

      // Auto-preview optimized prompt
      DOM.previewFormattedBox.innerHTML = marked.parse(res.optimizedText);
      DOM.previewRawBox.value = res.optimizedText;

      // Render meters temporarily
      renderMeter(DOM.gaugeQualityCircle, DOM.gaugeQualityText, DOM.labelQualityRating, res.afterScore, false);
      renderMeter(DOM.gaugeImageCircle, DOM.gaugeImageText, DOM.labelImageRating, 80, true);
    }
  });

  DOM.btnApplyOptimized.addEventListener('click', () => {
    if (tempOptimizedState) {
      appState = { ...tempOptimizedState };
      syncStateToInputs();
      updateUI();
      switchTab('wizard');
      switchStep(8); // Go straight to review step
      alert('โหลดโครงสร้างที่ปรับแต่งเข้าสู่บอร์ดสเปกเรียบร้อยแล้ว!');
    }
  });
}

// -------------------------------------------------------------
// EVENT ACTIONS & CONTROLLERS
// -------------------------------------------------------------

function selectRoleCard(roleId) {
  const cards = DOM.roleCardsContainer.querySelectorAll('.role-card');
  cards.forEach(c => {
    const id = c.getAttribute('data-role-id');
    const badge = c.querySelector('.role-badge');
    if (id === roleId) {
      c.classList.add('active-role');
      badge.classList.remove('hidden');
    } else {
      c.classList.remove('active-role');
      badge.classList.add('hidden');
    }
  });

  if (roleId === 'custom') {
    DOM.customRoleInputBox.classList.remove('hidden');
  } else {
    DOM.customRoleInputBox.classList.add('hidden');
  }
}

function selectOutputCard(outputId) {
  const cards = DOM.outputCardsContainer.querySelectorAll('.output-card');
  cards.forEach(c => {
    const id = c.getAttribute('data-output-id');
    const badge = c.querySelector('.out-badge');
    if (id === outputId) {
      c.classList.add('active-output');
      badge.classList.remove('hidden');
    } else {
      c.classList.remove('active-output');
      badge.classList.add('hidden');
    }
  });
}

function selectVisualOption(type, value) {
  let container;
  if (type === 'layout') container = DOM.visualLayoutContainer;
  else if (type === 'stylePreset') container = DOM.visualStyleContainer;
  else if (type === 'colorTheme') container = DOM.visualColorContainer;
  else if (type === 'density') container = DOM.visualDensityContainer;
  else if (type === 'iconStyle') container = DOM.visualIconContainer;
  else if (type === 'whitespace') container = DOM.visualSpaceContainer;

  if (container) {
    const opts = container.querySelectorAll('.visual-option');
    opts.forEach(opt => {
      const val = opt.getAttribute('data-value');
      if (val === value) {
        opt.classList.add('active-visual');
      } else {
        opt.classList.remove('active-visual');
      }
    });
  }
}

function switchStep(step) {
  if (step < 1 || step > 8) return;

  // Update step visual classes on the stepper
  DOM.wizardSteps.forEach(elem => {
    const s = parseInt(elem.getAttribute('data-step'), 10);
    const circle = elem.querySelector('div');
    const label = elem.querySelector('span');

    if (s === step) {
      elem.classList.add('active');
      circle.className = 'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-all border border-blue-400';
      label.className = 'text-xs mt-2 font-semibold text-white';
    } else if (s < step) {
      circle.className = 'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-blue-950 text-blue-300 border border-blue-500/40';
      label.className = 'text-xs mt-2 font-semibold text-blue-400';
    } else {
      circle.className = 'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gray-800 text-cyber-muted border border-transparent';
      label.className = 'text-xs mt-2 font-semibold text-cyber-muted';
    }
  });

  // Toggle step panels
  for (let i = 1; i <= 8; i++) {
    const panel = document.getElementById(`step-panel-${i}`);
    if (i === step) {
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  }

  // Handle line steps indicators color
  for (let i = 1; i <= 7; i++) {
    const line = document.getElementById(`line-step-${i}`);
    if (i < step) {
      line.classList.remove('bg-gray-800');
      line.classList.add('bg-blue-600/40');
    } else {
      line.classList.remove('bg-blue-600/40');
      line.classList.add('bg-gray-800');
    }
  }

  activeStep = step;
  DOM.btnPrevStep.disabled = activeStep === 1;
  DOM.btnNextStep.innerHTML = activeStep === 8
    ? 'เสร็จสมบูรณ์'
    : 'ถัดไป <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>';

  DOM.leftPaneScroll.scrollTop = 0;
}

function switchTab(tab) {
  const tabs = [
    { btn: DOM.tabBtnWizard, box: DOM.tabContentWizard, name: 'wizard' },
    { btn: DOM.tabBtnBlocks, box: DOM.tabContentBlocks, name: 'blocks' },
    { btn: DOM.tabBtnOptimizer, box: DOM.tabContentOptimizer, name: 'optimizer' },
    { btn: DOM.tabBtnLibrary, box: DOM.tabContentLibrary, name: 'library' },
  ];

  tabs.forEach(t => {
    if (t.name === tab) {
      t.btn.className = 'tab-btn active px-4 py-2 text-sm font-semibold rounded-lg text-white bg-blue-600/20 border border-blue-500/30 flex items-center gap-2 whitespace-nowrap transition';
      t.box.classList.remove('hidden');
      t.box.classList.add('block');
    } else {
      t.btn.className = 'tab-btn px-4 py-2 text-sm font-semibold rounded-lg text-cyber-muted hover:text-white hover:bg-white/5 flex items-center gap-2 whitespace-nowrap transition';
      t.box.classList.remove('block');
      t.box.classList.add('hidden');
    }
  });

  activeTab = tab;
  updateUI();
}

function switchPreviewMode(mode) {
  if (mode === 'formatted') {
    DOM.btnPreviewFormatted.className = 'px-3 py-1 rounded bg-gray-800 text-white font-semibold transition border border-cyber-border';
    DOM.btnPreviewRaw.className = 'px-3 py-1 rounded text-cyber-muted hover:text-white transition';
    DOM.previewFormattedBox.classList.remove('hidden');
    DOM.previewRawBox.classList.add('hidden');
  } else {
    DOM.btnPreviewRaw.className = 'px-3 py-1 rounded bg-gray-800 text-white font-semibold transition border border-cyber-border';
    DOM.btnPreviewFormatted.className = 'px-3 py-1 rounded text-cyber-muted hover:text-white transition';
    DOM.previewFormattedBox.classList.add('hidden');
    DOM.previewRawBox.classList.remove('hidden');
  }
  previewMode = mode;
}

function updateCharCounter() {
  const chars = DOM.inputRawData.value.length;
  DOM.charCounter.textContent = `${chars.toLocaleString()} อักษร`;
}

function handleTextFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    DOM.inputRawData.value = text;
    appState.rawData = text;
    updateCharCounter();
    updateUI();
  };
  reader.readAsText(file);
}

function loadTemplate(templateId) {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (template) {
    appState = { ...template.data };
    syncStateToInputs();
    updateUI();

    // Auto sync selector if not matched
    DOM.quickTemplateSelect.value = templateId;

    // Switch to step 1 for review
    switchStep(1);
    switchTab('wizard');
    alert(`โหลดแม่แบบ "${template.name}" ลงในกระดานออกแบบแล้ว!`);
  }
}

function resetState() {
  appState = {
    projectName: '',
    projectGoal: '',
    audience: '',
    difficulty: 'Intermediate',
    roleId: 'ba',
    customRole: '',
    background: '',
    objective: '',
    target: '',
    stakeholders: '',
    constraints: '',
    rawData: '',
    analysisFrameworks: [],
    outputFormat: 'presentation',
    layout: '16_9',
    stylePreset: 'modern',
    density: 'balanced',
    colorTheme: 'blue',
    iconStyle: 'flat',
    whitespace: 'medium'
  };

  DOM.quickTemplateSelect.value = '';
  tempOptimizedState = null;
  DOM.optimizerInput.value = '';
  DOM.optimizerResultsPanel.classList.add('hidden');

  syncStateToInputs();
  updateUI();
  switchStep(1);
}

// -------------------------------------------------------------
// CORE METRICS & UI REFRESH
// -------------------------------------------------------------

function renderMeter(circleElement, textElement, labelElement, value, isImageReady = false) {
  // SVG Circumference = 2 * PI * r = 2 * 3.14159 * 16 = ~100.5
  const circumference = 100.5;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  circleElement.style.strokeDashoffset = offset;
  textElement.textContent = isImageReady ? `${value}%` : value;

  // Set Label text depending on score range
  if (isImageReady) {
    if (value >= 80) {
      labelElement.textContent = 'พร้อมมาก';
      labelElement.className = 'text-xs font-bold text-cyan-400';
    } else if (value >= 50) {
      labelElement.textContent = 'พร้อมพอดี';
      labelElement.className = 'text-xs font-bold text-yellow-400';
    } else {
      labelElement.textContent = 'ข้อมูลขาด';
      labelElement.className = 'text-xs font-bold text-red-400';
    }
  } else {
    if (value >= 85) {
      labelElement.textContent = 'ยอดเยี่ยม';
      labelElement.className = 'text-xs font-bold text-emerald-400';
    } else if (value >= 60) {
      labelElement.textContent = 'ปานกลาง';
      labelElement.className = 'text-xs font-bold text-yellow-400';
    } else {
      labelElement.textContent = 'ต้องปรับแก้';
      labelElement.className = 'text-xs font-bold text-red-400';
    }
  }
}

function renderChecklist(feedback) {
  if (feedback.length === 0) {
    DOM.checklistResultsContainer.innerHTML = `
      <div class="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
        <span class="text-lg">🎉</span> Prompt ของคุณสมบูรณ์ครบถ้วนตามหลักการของ UPA พร้อมคัดลอกไปสั่งการได้ทันที
      </div>
    `;
    return;
  }

  DOM.checklistResultsContainer.innerHTML = feedback.map(item => {
    let icon = 'ℹ️';
    let bg = 'bg-blue-500/10 border-blue-500/20 text-blue-300';
    if (item.status === 'warning') {
      icon = '⚠️';
      bg = 'bg-amber-500/10 border-amber-500/20 text-amber-300';
    } else if (item.status === 'error') {
      icon = '❌';
      bg = 'bg-red-500/10 border-red-500/20 text-red-300';
    }
    return `
      <div class="p-3 rounded-xl border flex items-start gap-2.5 text-xs ${bg}">
        <span class="text-sm">${icon}</span>
        <div>
          <strong class="block capitalize font-bold text-white mb-0.5">${item.category}:</strong>
          <span class="leading-relaxed">${item.text}</span>
        </div>
      </div>
    `;
  }).join('');
}

function updateUI() {
  // 1. Calculate Scores and feedbacks
  const analysisScores = calculateScores(appState);

  // Apply visual scores to dashboard
  renderMeter(DOM.gaugeQualityCircle, DOM.gaugeQualityText, DOM.labelQualityRating, analysisScores.score, false);
  renderMeter(DOM.gaugeImageCircle, DOM.gaugeImageText, DOM.labelImageRating, analysisScores.imageReadiness, true);

  // Render checkmarks inside step 8
  renderChecklist(analysisScores.feedback);

  // 2. Compile Prompt and output markup
  const prompt = compilePrompt(appState, blockOrder);
  DOM.previewRawBox.value = prompt;

  // Highlight blocks in Markdown text via simple HTML tags mapping
  const htmlOutput = marked.parse(prompt);
  DOM.previewFormattedBox.innerHTML = htmlOutput;

  // 3. Save to localStorage
  localStorage.setItem('ai_prompt_architect_state', JSON.stringify(appState));
}

// Start application
window.addEventListener('DOMContentLoaded', init);