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

function getIconSvg(id, colorClass = 'text-current') {
  const icons = {
    // Roles
    ba: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
    pm: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 0M12 11.25v7.5M8.25 15.75H15.75M12 2.25L4.5 5.25v6.75A7.5 7.5 0 0012 19.5a7.5 7.5 0 007.5-7.5V5.25L12 2.25z"></path></svg>',
    ux: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122l9.37-9.37a2.121 2.121 0 113 3l-9.37 9.37a2.121 2.121 0 01-3 0l-3-3a2.121 2.121 0 010-3zM5.778 12.373a4.242 4.242 0 10-6 6 4.242 4.242 0 006-6z"></path></svg>',
    data: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>',
    researcher: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>',
    marketing: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>',
    teacher: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>',
    programmer: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M12 3v1.5M15.75 3v1.5M8.25 19.5V21M12 19.5V21M15.75 19.5V21M3 8.25h1.5M3 12h1.5M3 15.75h1.5M19.5 8.25H21M19.5 12H21M19.5 15.75H21m-15-9h10.5a1.5 1.5 0 011.5 1.5v10.5a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5V7.5A1.5 1.5 0 016 6z"></path></svg>',
    custom: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',

    // Frameworks
    swot: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"></path></svg>',
    '5w1h': '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"></path></svg>',
    ipo: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.547 9.547 4.5 10.768 4.5 12s.047 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.209.138-2.43.138-3.662z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M9 10.5l3 3 3-3"></path></svg>',
    timeline: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"></path></svg>',
    priority: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18M3 12h18M12 12m-9 0a9 9 0 1118 0 9 9 0 01-18 0z"></path></svg>',
    risk: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"></path></svg>',
    gap: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-9L21 12m0 0l-4.5 4.5M21 12H7.5"></path></svg>',
    roadmap: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6.75h6m-6 4.5h6m-6 4.5h6M3 5.25a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 5.25v13.5A2.25 2.25 0 0118.75 21H5.25A2.25 2.25 0 013 18.75V5.25z"></path></svg>',
    user_journey: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 11-6 0 3 3 0 016 0zM1.5 20.25a8.25 8.25 0 0116.5 0M22.5 15a3 3 0 11-6 0 3 3 0 016 0zM13.5 20.25a6 6 0 0112 0"></path></svg>',
    agile: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"></path></svg>',

    // Outputs
    presentation: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0h-10.5m10.5 0h1.5m-1.5 0l-4.5-3.75M9 16.5v.75m0 0l-4.5 3.75"></path></svg>',
    report: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg>',
    infographic: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M4.098 19.902a3.75 3.75 0 015.304 0l6.401-6.402m-11.708 0A3.75 3.75 0 013 14.598l6.402-6.402m0 0l6.402-6.402M9.402 8.196a3.75 3.75 0 015.304 0l6.401 6.402m-11.708 0a3.75 3.75 0 015.304 0l6.401 6.402m-6.401-6.402l6.401 6.402"></path></svg>',
    mindmap: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925-3.546 5.974 5.974 0 00-2.133-1A3.75 3.75 0 003.75 12a3.75 3.75 0 006.747 1.768A3.765 3.765 0 0012 18z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 01-.495-7.467 5.99 5.99 0 011.925-3.546 5.974 5.974 0 012.133-1A3.75 3.75 0 0120.25 12a3.75 3.75 0 01-6.747 1.768A3.765 3.765 0 0112 18z"></path></svg>',
    flowchart: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0-15l-4.5 4.5M12 4.5l4.5 4.5M4.5 12h15m-15 0l4.5-4.5M4.5 12l4.5 4.5"></path></svg>',
    powerpoint: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"></path></svg>',
    markdown: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"></path></svg>',
    summary: '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>',

    // Templates categories / default
    'universal-blueprint-starter': '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>',
    'smart-meeting-nameplate': '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128c.332-.183.582-.495.645-.869L9.594 3.94zM15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
    'hr-attendance-blueprint': '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path></svg>',
    'hr-attendance': '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"></path></svg>',
    'market-entry': '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 0M12 11.25v7.5M8.25 15.75H15.75M12 2.25L4.5 5.25v6.75A7.5 7.5 0 0012 19.5a7.5 7.5 0 007.5-7.5V5.25L12 2.25z"></path></svg>',
    'lesson-plan-ai': '<svg class="w-6 h-6 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>',

    // Blocks
    role: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg>',
    context: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253"></path></svg>',
    data: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"></path></svg>',
    analysis: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v3.75m-3-3.75h6m-3-3.75v3.75m0 0H9m3 0h3"></path></svg>',
    output: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m-6 3.75l3 3m0 0l3-3m-3 3V1.5"></path></svg>',
    visual: '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122l9.37-9.37a2.121 2.121 0 113 3l-9.37 9.37a2.121 2.121 0 01-3 0l-3-3a2.121 2.121 0 010-3zM5.778 12.373a4.242 4.242 0 10-6 6 4.242 4.242 0 006-6z"></path></svg>'
  };

  return icons[id] || '<svg class="w-5 h-5 ' + colorClass + '" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2v20M2 12h20"></path></svg>';
}

function renderRoleCards() {
  DOM.roleCardsContainer.innerHTML = ROLES.map(role => `
    <div class="glass-card rounded-2xl p-4 border border-cyber-border cursor-pointer transition flex items-start gap-3 hover:bg-blue-500/5 select-none role-card" data-role-id="${role.id}">
      <span class="flex-shrink-0">${getIconSvg(role.id, 'text-blue-400')}</span>
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
      <span class="flex-shrink-0">${getIconSvg('custom', 'text-blue-400')}</span>
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
        <span class="text-xs font-bold text-white flex items-center gap-1.5">${getIconSvg(fw.id, 'text-purple-400')} ${fw.name}</span>
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
      <span class="block mb-1.5 flex justify-center">${getIconSvg(out.id, 'text-pink-400')}</span>
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
          <span>${getIconSvg(temp.id, 'text-amber-400')}</span>
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
          <span>${getIconSvg(blockId, 'text-gray-400')}</span>
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