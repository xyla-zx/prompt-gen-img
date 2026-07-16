import { ROLES, VISUAL_PRESETS } from './templates.js';

/**
 * Compiles the prompt into markdown based on current state and block order.
 */
export function compilePrompt(state, blockOrder = ['role', 'context', 'data', 'analysis', 'output', 'visual']) {
  const parts = [];

  blockOrder.forEach(blockId => {
    switch (blockId) {
      case 'role': {
        const role = ROLES.find(r => r.id === state.roleId);
        const roleText = role
          ? (state.roleId === 'custom' && state.customRole ? state.customRole : role.systemText)
          : 'คุณคือผู้เชี่ยวชาญระดับมืออาชีพ';

        parts.push(`# STEP 1 : ROLE\n\n${roleText}\nจงคิดและตอบในมุมมองของผู้เชี่ยวชาญอย่างเป็นระบบและถี่ถ้วน`);
        break;
      }
      case 'context': {
        const lines = [];
        if (state.projectName) lines.push(`- **ชื่อโปรเจกต์/หัวข้อ**: ${state.projectName}`);
        if (state.projectGoal) lines.push(`- **เป้าหมายโปรเจกต์**: ${state.projectGoal}`);
        if (state.audience) lines.push(`- **กลุ่มผู้รับชม/กลุ่มเป้าหมายหลัก**: ${state.audience}`);
        if (state.difficulty) lines.push(`- **ระดับความยาก/ลึกของเนื้อหา**: ${state.difficulty}`);
        if (state.background) lines.push(`- **ภูมิหลัง (Background)**: ${state.background}`);
        if (state.objective) lines.push(`- **วัตถุประสงค์เชิงรุก (Objective)**: ${state.objective}`);
        if (state.target) lines.push(`- **ผู้รับผลประโยชน์หลัก (Target Users)**: ${state.target}`);
        if (state.stakeholders) lines.push(`- **ผู้มีส่วนเกี่ยวข้อง (Stakeholders)**: ${state.stakeholders}`);
        if (state.constraints) lines.push(`- **ข้อจำกัด (Constraints/Rules)**: ${state.constraints}`);

        if (lines.length > 0) {
          parts.push(`# STEP 2 : CONTEXT\n\nนี่คือข้อมูลบริบทและเป้าหมายของโปรเจกต์นี้:\n\n${lines.join('\n')}`);
        }
        break;
      }
      case 'data': {
        if (state.rawData && state.rawData.trim()) {
          parts.push(`# STEP 3 : RAW DATA / INPUT\n\nนี่คือข้อมูลดิบ เอกสาร หรือประเด็นที่รวบรวมได้:\n\n\`\`\`text\n${state.rawData.trim()}\n\`\`\``);
        }
        break;
      }
      case 'analysis': {
        const frameworks = state.analysisFrameworks || [];
        if (frameworks.length > 0) {
          const fwList = frameworks.map(fw => {
            switch (fw) {
              case 'swot': return '- **SWOT Analysis**: แยกแยะจุดแข็ง (Strengths), จุดอ่อน (Weaknesses), โอกาส (Opportunities) และอุปสรรค (Threats)';
              case '5w1h': return '- **5W1H**: วิเคราะห์ ใคร (Who), ทำอะไร (What), ที่ไหน (Where), เมื่อไหร่ (When), ทำไม (Why), อย่างไร (How)';
              case 'ipo': return '- **IPO Framework**: ระบุข้อมูลนำเข้า (Input), กระบวนการประมวลผล (Process), และผลผลิตที่ต้องการ (Output)';
              case 'timeline': return '- **Timeline & Phase**: แบ่งระยะเวลาการดำเนินงาน ลำดับก่อน-หลัง (Sequential Phase)';
              case 'priority': return '- **Priority Matrix**: จัดลำดับความสำคัญของประเด็นตาม Impact vs Effort';
              case 'risk': return '- **Risk & Mitigation**: หาจุดเสี่ยงที่อาจเกิดขึ้นพร้อมเสนอแนวทางป้องกัน/รับมือ';
              case 'gap': return '- **Gap Analysis**: วิเคราะห์สถานะปัจจุบัน (As-Is) เปรียบเทียบกับสถานะที่ต้องการ (To-Be) และสิ่งที่ต้องทำเพื่อปิดช่องว่าง';
              case 'roadmap': return '- **Strategic Roadmap**: กำหนดหลักชัยสำคัญ (Milestones) ในระยะสั้น กลาง ยาว';
              case 'user_journey': return '- **User Journey Mapping**: แจกแจงขั้นตอนประสบการณ์ของผู้ใช้งาน อารมณ์ ปัญหา (Pain Points) และโอกาสปรับปรุง';
              case 'agile': return '- **Agile Delivery**: ซอยงานย่อยเป็น Tasks, User Stories และจัดแบ่ง Sprint เพื่อส่งมอบงานได้เร็ว';
              default: return `- **${fw}**`;
            }
          });

          parts.push(`# STEP 4 : SYSTEMATIC ANALYSIS\n\nโปรดวิเคราะห์ข้อมูลข้างต้นอย่างเป็นระบบ โดยประยุกต์ใช้กรอบแนวคิดเหล่านี้:\n\n${fwList.join('\n')}\n\n*ข้อบังคับ: หากข้อมูลดิบที่ให้มามีไม่เพียงพอสำหรับการวิเคราะห์ตาม Frameworks ข้างต้น ให้คุณใช้วิจารณญาณตั้งสมมติฐานที่สมเหตุสมผลตามบริบทของโครงการและดำเนินกระบวนการวิเคราะห์ทันที โดยไม่จำเป็นต้องหยุดถามกลับ และต้องส่งมอบผลลัพธ์การวิเคราะห์ควบคู่กับ Visual Prompt ในการตอบกลับนี้ทันที*`);
        }
        break;
      }
      case 'output': {
        if (state.outputFormat) {
          const outName = state.outputFormat.toUpperCase();
          let outputText = `# STEP 5 : OUTPUT STRUCTURE\n\nจัดเรียงโครงสร้างผลลัพธ์ให้อยู่ในรูปแบบ **${outName}**:\n- แบ่งเป็น Executive Summary, หัวข้อหลัก (Main Topics) และรายละเอียดปลีกย่อย (Sub-topics)\n- แนบตารางสรุปหรือเปรียบเทียบข้อมูลที่สำคัญเพื่อให้อ่านเข้าใจได้ทันที\n- จัดโครงสร้างด้วย Markdown ลำดับหัวข้อ H1, H2, H3 อย่างเป็นระเบียบ`;
          
          if (state.outputStructure && state.outputStructure.trim()) {
            const formattedStructure = state.outputStructure.trim().split('\n').map(line => `  ${line}`).join('\n');
            outputText += `\n- **ข้อบังคับ: คุณต้องจัดลำดับหัวข้อและข้อมูลตามโครงสร้างนี้อย่างเคร่งครัด**:\n${formattedStructure}`;
          }
          
          parts.push(outputText);
        }
        break;
      }
      case 'visual': {
        const layoutObj = VISUAL_PRESETS.layouts.find(l => l.id === state.layout);
        const styleObj = VISUAL_PRESETS.styles.find(s => s.id === state.stylePreset);
        const colorObj = VISUAL_PRESETS.colors.find(c => c.id === state.colorTheme);
        const iconObj = VISUAL_PRESETS.icons.find(i => i.id === state.iconStyle);
        const densityObj = VISUAL_PRESETS.densities.find(d => d.id === state.density);
        const wsObj = VISUAL_PRESETS.whitespaces.find(w => w.id === state.whitespace);

        const specs = [
          `- **Layout / Aspect Ratio**: ${layoutObj ? layoutObj.name : '16:9'}`,
          `- **Style Theme**: ${styleObj ? styleObj.name : 'Modern Startup'}`,
          `- **Color Theme (โทนสี)**: ${colorObj ? colorObj.name : 'Auto'}`,
          `- **Icon Style (ไอคอน)**: ${iconObj ? iconObj.name : 'Flat'}`,
          `- **Information Density (ความแน่นข้อมูล)**: ${densityObj ? densityObj.name : 'Balanced'}`,
          `- **Whitespace (ระยะเว้นว่าง)**: ${wsObj ? wsObj.name : 'Medium'}`,
          `- **Audience Tone**: เหมาะสำหรับนำเสนอแก่กลุ่ม ${state.audience || 'บุคคลทั่วไป'}`
        ];

        parts.push(`# STEP 6 : VISUALIZATION PLAN & CONFIRMATION GATING (ขั้นตอนการยืนยันก่อนวาดภาพ)

**[ข้อบังคับร้ายแรง - CRITICAL CONSTRAINT: ห้ามวาดภาพ หรือเรียกใช้งานระบบ ChatGPT Image / เครื่องมือสร้างภาพใดๆ ในรอบคำตอบแรกนี้โดยเด็ดขาด!]**

หน้าที่ของคุณในการตอบกลับรอบแรกนี้คือ:
1. แสดงผลการวิเคราะห์โครงสร้างเนื้อหาข้อมูลตามขั้นตอนที่ 1-5 ด้านบนออกมาเป็นตัวอักษร (Markdown Text) ให้ครบถ้วนเสร็จสิ้นก่อน
2. หยุดการตอบกลับทันทีหลังจากแสดงบทสรุปตัวอักษร และพิมพ์ถามผู้ใช้ปิดท้ายด้วยประโยคต่อไปนี้อย่างชัดเจน:
   *"ข้อมูลการวิเคราะห์และสรุปเนื้อหาข้างต้นเสร็จเรียบร้อยแล้ว ต้องการให้ผมวาดและสร้างภาพกราฟิกสรุปข้อมูล (Infographic/Slide Deck) ออกมาให้เลยหรือไม่ครับ? (หากพร้อมแล้ว พิมพ์บอกได้เลยครับ)"*
3. **ห้ามเจเนอเรตภาพเด็ดขาด** จนกว่าผู้ใช้งานจะมีข้อความตอบกลับยืนยันอนุมัติการสร้างภาพ (เช่น พิมพ์ว่า "วาดได้", "เริ่มเลย", "ตกลง" หรือคำที่เกี่ยวข้อง)

**[ขั้นตอนการสร้างภาพหลังผู้ใช้งานกดยืนยันแล้ว]**
เมื่อผู้ใช้งานกดยืนยันตอบรับว่าต้องการเรียบร้อยแล้ว จึงให้คุณ (AI) เรียกใช้เครื่องมือสร้างภาพในตัวเพื่อวาดและเจเนอเรตภาพจริงออกมาแสดงในแชตทันที โดยนำข้อมูลสรุปการวิเคราะห์ด้านบนมาจัดเรียงในรูปภาพตามพารามิเตอร์ดีไซน์นี้:

${specs.join('\n')}

*ข้อเน้นย้ำเพิ่มเติม: ให้วาดรูปภาพสำเร็จรูปแสดงข้อมูลเชิงตัวเลขและเนื้อหาภาษาไทยตามสรุปข้างต้น ห้ามเขียนออกมาเป็น Text Prompt และต้องเน้นความชัดเจนของข้อมูลที่สรุปได้ให้อ่านง่ายเป็นสำคัญ (Function First, Form Follows Function)*`);
        break;
      }
    }
  });

  return parts.join('\n\n------------------------------------------------\n\n');
}

/**
 * Calculates prompt score (out of 100) and provides checklists/feedbacks.
 */
export function calculateScores(state) {
  let score = 0;
  const feedback = [];

  // 1. Role (max 15)
  if (state.roleId) {
    if (state.roleId === 'custom' && !state.customRole) {
      feedback.push({ category: 'role', status: 'warning', text: 'เลือก Custom Role แต่ยังไม่ได้ระบุรายละเอียดบทบาท' });
      score += 5;
    } else {
      score += 15;
    }
  } else {
    feedback.push({ category: 'role', status: 'error', text: 'ไม่ได้ระบุบทบาท (Role) ของ AI' });
  }

  // 2. Project Base (max 10)
  let projPoints = 0;
  if (state.projectName) projPoints += 5;
  if (state.projectGoal) projPoints += 5;
  score += projPoints;
  if (projPoints < 10) {
    feedback.push({ category: 'project', status: 'warning', text: 'ควรระบุชื่อโครงการและเป้าหมายหลักให้ชัดเจนขึ้น' });
  }

  // 3. Context Details (max 20)
  let contextPoints = 0;
  if (state.background) contextPoints += 5;
  if (state.objective) contextPoints += 5;
  if (state.target || state.audience) contextPoints += 5;
  if (state.constraints) contextPoints += 5;
  score += contextPoints;
  if (contextPoints < 20) {
    feedback.push({ category: 'context', status: 'info', text: 'การเพิ่มภูมิหลัง (Background) และข้อจำกัด (Constraints) จะช่วยให้ AI ตอบได้ตรงเป้าหมายไม่หลงประเด็น' });
  }

  // 4. Raw Data (max 15)
  if (state.rawData && state.rawData.trim().length > 10) {
    score += 15;
  } else {
    feedback.push({ category: 'data', status: 'warning', text: 'กรอกข้อมูลดิบหรือแหล่งข้อมูลน้อยเกินไป AI อาจวิเคราะห์ได้ไม่ลึกซึ้ง' });
  }

  // 5. Analysis Frameworks (max 10)
  const fwCount = (state.analysisFrameworks || []).length;
  if (fwCount > 0) {
    score += Math.min(10, fwCount * 5);
  } else {
    feedback.push({ category: 'analysis', status: 'info', text: 'แนะเลือก Framework การวิเคราะห์อย่างน้อย 1 ชนิด (เช่น SWOT หรือ IPO) เพื่อช่วยเพิ่มมิติการวิเคราะห์' });
  }

  // 6. Output (max 10)
  if (state.outputFormat) {
    score += 10;
  } else {
    feedback.push({ category: 'output', status: 'error', text: 'โปรดเลือกรูปแบบ Output (เช่น Slide, Report, Infographic)' });
  }

  // 7. Visual Elements (max 20)
  let visualPoints = 0;
  if (state.layout) visualPoints += 4;
  if (state.stylePreset) visualPoints += 4;
  if (state.colorTheme) visualPoints += 4;
  if (state.iconStyle) visualPoints += 4;
  if (state.whitespace) visualPoints += 4;
  score += visualPoints;
  if (visualPoints < 20) {
    feedback.push({ category: 'visual', status: 'info', text: 'กรอกรูปแบบด้าน Visual ให้ครบถ้วนเพื่อส่งต่อให้ AI เจนภาพได้แม่นยำขึ้น' });
  }

  // Image Readiness Score (based only on visual details)
  let imageReadiness = 0;
  if (state.layout) imageReadiness += 20;
  if (state.stylePreset) imageReadiness += 20;
  if (state.colorTheme) imageReadiness += 20;
  if (state.iconStyle) imageReadiness += 20;
  if (state.whitespace) imageReadiness += 20;

  return {
    score,
    imageReadiness,
    feedback
  };
}

/**
 * Heuristically parses a simple raw prompt and expands it into a fully structured UPA state.
 */
export function optimizePrompt(rawText) {
  if (!rawText || !rawText.trim()) {
    return {
      success: false,
      message: 'กรุณากรอกข้อความก่อนทำการปรับแต่ง'
    };
  }

  const query = rawText.toLowerCase();
  let roleId = 'ba';
  let projectName = 'โครงการที่ได้ปรับแต่ง';
  let projectGoal = 'สรุปวิเคราะห์ข้อมูลอย่างรอบด้าน';
  let bg = 'ต้องการแปลงแนวคิดดิบให้เป็นโครงร่างที่นำไปปฏิบัติได้จริง';
  let objective = 'สร้างผลลัพธ์ที่เป็นระเบียบ ลำดับขั้นตอนชัดเจน และมีข้อเสนอแนะที่จับต้องได้';
  let audience = 'ผู้บริหารระดับสูงและผู้เกี่ยวข้องในโครงการ';
  let rawData = rawText;
  let frameworks = ['5w1h', 'priority'];
  let outputFormat = 'presentation';
  let stylePreset = 'modern';
  let layout = '16_9';
  let colorTheme = 'blue';

  // Keyword Matching heuristics
  if (query.includes('ขาย') || query.includes('ตลาด') || query.includes('แบรนด์') || query.includes('โฆษณา')) {
    roleId = 'marketing';
    projectName = 'แผนแคมเปญการตลาดและการสื่อสาร';
    projectGoal = 'วางกลยุทธ์เจาะตลาดเป้าหมายและเขียนคำโฆษณาเชิงรุก';
    frameworks = ['swot', '5w1h', 'priority'];
    outputFormat = 'infographic';
    stylePreset = 'modern';
    colorTheme = 'orange';
  } else if (query.includes('สอน') || query.includes('เรียน') || query.includes('หลักสูตร') || query.includes('เด็ก')) {
    roleId = 'teacher';
    projectName = 'หลักสูตรการจัดกิจกรรมและการสอน';
    projectGoal = 'ย่อยเนื้อหาที่ซับซ้อนให้อ่านง่าย สนุก และเข้าใจง่ายสำหรับผู้เรียน';
    frameworks = ['ipo', 'timeline'];
    outputFormat = 'presentation';
    stylePreset = 'google';
    colorTheme = 'green';
  } else if (query.includes('เขียนโค้ด') || query.includes('โปรแกรม') || query.includes('code') || query.includes('ระบบ')) {
    roleId = 'programmer';
    projectName = 'สถาปัตยกรรมและการพัฒนาซอฟต์แวร์';
    projectGoal = 'ออกแบบระบบที่มีความเสถียร ปลอดภัย และเขียนโค้ดตาม Best Practices';
    frameworks = ['ipo', 'risk', 'gap'];
    outputFormat = 'markdown';
    stylePreset = 'dark';
    colorTheme = 'cool_gray';
  } else if (query.includes('วิจัย') || query.includes('thesis') || query.includes('ข้อมูลเชิงลึก') || query.includes('วิเคราะห์')) {
    roleId = 'researcher';
    projectName = 'งานวิจัยและรวบรวมองค์ความรู้';
    projectGoal = 'ค้นหาข้อเท็จจริงพร้อมทฤษฎีอ้างอิง และทำการวิเคราะห์แบบไม่มีอคติ';
    frameworks = ['gap', 'swot', 'risk'];
    outputFormat = 'report';
    stylePreset = 'academic';
    colorTheme = 'blue';
  } else if (query.includes('ดีไซน์') || query.includes('ux') || query.includes('ui') || query.includes('ผู้ใช้งาน')) {
    roleId = 'ux';
    projectName = 'การออกแบบประสบการณ์ผู้ใช้ (UX Design)';
    projectGoal = 'สร้างโครงร่างแผนผัง (User Flow) และออกแบบหน้าจอตามความสะดวกสบายของผู้ใช้';
    frameworks = ['user_journey', 'gap', 'priority'];
    outputFormat = 'infographic';
    stylePreset = 'apple';
    colorTheme = 'purple';
  }

  const optimizedState = {
    projectName,
    projectGoal,
    audience,
    difficulty: 'Intermediate',
    roleId,
    customRole: '',
    background: bg,
    objective,
    target: 'ทีมปฏิบัติการและผู้ที่เกี่ยวข้องในโครงการ',
    stakeholders: 'คณะทำงาน และหัวหน้าแผนก',
    constraints: 'ต้องเน้นความจริงที่จับต้องได้ ประหยัดงบประมาณ และสามารถนำไปเริ่มทำได้ทันทีใน 30 วัน',
    rawData,
    analysisFrameworks: frameworks,
    outputFormat,
    layout,
    stylePreset,
    density: 'balanced',
    colorTheme,
    iconStyle: 'flat',
    whitespace: 'medium'
  };

  const optimizedText = compilePrompt(optimizedState);
  const beforeScore = Math.min(25, Math.max(10, Math.floor(rawText.length / 3))); // Estimate raw prompt score
  const afterScore = calculateScores(optimizedState).score;

  return {
    success: true,
    beforeScore,
    afterScore,
    optimizedState,
    optimizedText,
    explanation: [
      { element: 'Role', status: 'added', text: `กำหนดบทบาท AI ให้เป็นผู้เชี่ยวชาญเฉพาะทางระดับมืออาชีพ (${roleId.toUpperCase()})` },
      { element: 'Context', status: 'added', text: 'เติมภูมิหลัง วัตถุประสงค์ กลุ่มเป้าหมาย และข้อจำกัดในการแก้ปัญหา' },
      { element: 'Analysis Frameworks', status: 'added', text: `เพิ่มกรอบการคิดวิเคราะห์อย่างเป็นระบบ เช่น ${frameworks.join(', ').toUpperCase()}` },
      { element: 'Visual Specifications', status: 'added', text: `กำหนดขนาด (${layout}) สไตล์การจัดวาง และโทนสีหลักเพื่อให้ภาพสอดคล้องกับเนื้อหา` }
    ]
  };
}
