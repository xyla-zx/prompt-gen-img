export const ROLES = [
  {
    id: 'ba',
    name: 'Business Analyst',
    emoji: '📊',
    description: 'เน้นวิเคราะห์ความต้องการทางธุรกิจ ปัญหา คอขวด และความคุ้มค่าของการลงทุน',
    systemText: 'คุณคือ Business Analyst ผู้เชี่ยวชาญด้านการวิเคราะห์ความต้องการทางธุรกิจ (Business Requirement Analysis) การออกแบบกระบวนการ และการประเมินความเสี่ยง'
  },
  {
    id: 'pm',
    name: 'Product Manager',
    emoji: '🚀',
    description: 'เน้นคุณค่าของผลิตภัณฑ์ การจัดลำดับความสำคัญ การทำ Roadmap และความต้องการของผู้ใช้',
    systemText: 'คุณคือ Product Manager ผู้เชี่ยวชาญด้านการพัฒนาผลิตภัณฑ์ การทำ Roadmap การจัด Priority ด้วย frameworks ต่างๆ และการสร้างคุณค่าให้ผู้ใช้งาน'
  },
  {
    id: 'ux',
    name: 'UX Designer',
    emoji: '🎨',
    description: 'เน้นการทำความเข้าใจผู้ใช้ แผนผังการทำงาน (User Flow) และประสบการณ์การใช้งานที่ราบรื่น',
    systemText: 'คุณคือ UX Designer ผู้เชี่ยวชาญด้านการออกแบบประสบการณ์ผู้ใช้ (User Experience Design) การทำความเข้าใจพฤติกรรมผู้ใช้ การสร้าง User Flow และ Information Architecture'
  },
  {
    id: 'data',
    name: 'Data Analyst',
    emoji: '📈',
    description: 'เน้นการสกัดข้อมูล หา Insight สร้างสมมติฐาน และอธิบายความหมายของตัวเลข',
    systemText: 'คุณคือ Data Analyst ผู้เชี่ยวชาญด้านการวิเคราะห์ข้อมูลดิบ การค้นหา Insight ที่ซ่อนอยู่ การทำความสะอาดข้อมูล และการเสนอแนวทางการทำ Data-Driven Decision'
  },
  {
    id: 'researcher',
    name: 'Researcher',
    emoji: '🔍',
    description: 'เน้นการหาข้อเท็จจริง ทฤษฎีอ้างอิง การเปรียบเทียบข้อดีข้อเสียอย่างเป็นระบบและเป็นกลาง',
    systemText: 'คุณคือ Researcher ผู้เชี่ยวชาญด้านการทำวิจัย ค้นคว้าข้อมูลเชิงลึก การรวบรวมหลักฐานและทฤษฎีอ้างอิง การวิเคราะห์เปรียบเทียบอย่างเป็นวิทยาศาสตร์และเป็นกลาง'
  },
  {
    id: 'marketing',
    name: 'Marketing Strategist',
    emoji: '📣',
    description: 'เน้นการตลาด กลุ่มเป้าหมาย คำโฆษณา (Copywriting) และการดึงดูดใจผู้บริโภค',
    systemText: 'คุณคือ Marketing Strategist ผู้เชี่ยวชาญด้านกลยุทธ์การตลาด การสื่อสารแบรนด์ การทำ Copywriting และการคิดแคมเปญเพื่อกระตุ้นยอดขายและสร้าง Engagement'
  },
  {
    id: 'teacher',
    name: 'Teacher / Educator',
    emoji: '🍎',
    description: 'เน้นการย่อยเรื่องยากให้เข้าใจง่าย ออกแบบหลักสูตร และมีกิจกรรมประกอบการเรียนการสอน',
    systemText: 'คุณคือ Teacher/Educator ผู้เชี่ยวชาญด้านการเรียนการสอน การออกแบบบทเรียน (Lesson Plan) การเปรียบเปรยให้เข้าใจง่าย และการสร้างสื่อการสอนที่ดึงดูดความสนใจ'
  },
  {
    id: 'programmer',
    name: 'Software Engineer',
    emoji: '💻',
    description: 'เน้นการออกแบบสถาปัตยกรรมโค้ด ความปลอดภัย ประสิทธิภาพ และการทำงานร่วมกัน',
    systemText: 'คุณคือ Software Engineer ผู้เชี่ยวชาญด้านสถาปัตยกรรมซอฟต์แวร์ การเขียนโค้ดที่สะอาด (Clean Code) การวิเคราะห์ Algorithm และระบบความปลอดภัย'
  }
];

export const TEMPLATES = [{id:"universal-blueprint-starter",name:"Universal Blueprint Starter (แม่แบบเริ่มต้นพิมพ์เขียวสากล)",category:"Framework Starter",emoji:"🗺️",description:"แม่แบบสากลสำหรับผู้เริ่มต้นเพื่อเรียนรู้การวางโครงพิมพ์เขียวระบบ (Project Blueprint) มีตัวอย่างแนะนำทุกขั้นตอน",data:{projectName:"[ระบุชื่อโครงการของคุณ] เช่น: ระบบ HR Attendance & Leave Management",projectGoal:"[ระบุเป้าหมายสูงสุดของระบบ] เช่น: พัฒนาระบบลงเวลาทำงานและจัดการการลาของพนักงานผ่าน Mobile Application เพื่อเพิ่มความถูกต้อง ลดงาน Manual และเพิ่มประสิทธิภาพการประมวลผลข้อมูลของ HR",audience:"[ระบุกลุ่มเป้าหมายของเอกสาร] เช่น: Product Owner (PO), HR Director, และทีมพัฒนาซอฟต์แวร์",difficulty:"Advanced",roleId:"ba",customRole:"",background:"[ระบุภูมิหลัง/ปัญหาเดิมก่อนทำระบบ] เช่น: เดิมการลงเวลางานและบันทึกสิทธิ์วันลาของพนักงานทำโดยการตอกบัตรหรือใช้ตาราง Excel ซึ่งทำให้ข้อมูลคลาดเคลื่อนสูงและเป็นภาระงาน HR สิ้นเดือนในการประมวลผลคำนวณเงินเดือนแบบ Manual",objective:`[ระบุวัตถุประสงค์ระบบเป็นข้อๆ]
1) พัฒนาแอปมือถือลงเวลางานด้วยการสแกนหน้าและจับพิกัด GPS
2) พัฒนาระบบยื่นและอนุมัติวันลาพักร้อนออนไลน์แบบเห็นวันลาคงเหลือ
3) จัดทำระบบส่งสรุปรายงาน ขาด ลา มาสาย ให้ HR อัตโนมัติทุกสิ้นเดือน`,target:"[ระบุกลุ่มผู้ใช้ตรงของระบบ] เช่น: พนักงานทั่วไป, หัวหน้าแผนกผู้มีสิทธิ์อนุมัติวันลา, และเจ้าหน้าที่ HR",stakeholders:"[ระบุผู้เกี่ยวข้องหลัก] เช่น: Product Owner (PO), ฝ่ายทรัพยากรบุคคล (HR), พนักงาน (Employee), ผู้จัดการ (Manager), นักพัฒนาซอฟต์แวร์ (Developer), ผู้ทดสอบระบบ (Tester)",constraints:`[ระบุข้อจำกัดและขอบเขตงาน]
- In-Scope (ในขอบเขต): ระบบสแกนใบหน้าและ GPS, ฟังก์ชันแสดงสิทธิ์ลาและกดยื่นลาพักร้อน, ระบบรายงานส่ง HR สิ้นเดือน
- Out-of-Scope (นอกขอบเขต): การทำระบบแชตสนทนา (Chat) ภายในแอปพลิเคชัน (ตัดออกไปทำในเฟสถัดไปเพื่อส่งมอบงานทันกำหนด)`,rawData:`[ระบุรายการความต้องการของระบบของคุณ]
ตัวอย่างรายการความต้องการ (System Requirements):
1. บันทึกเวลางานด้วยการสแกนใบหน้า (Scan Face) และจับพิกัด GPS ผ่านมือถือพนักงาน
2. มีระบบห้องแชต (Chat) คุยสื่อสารแลกเปลี่ยนข้อมูลกันภายในแอปพลิเคชันหลักโดยตรง
3. ประมวลผล ขาด ลา มาสาย อัตโนมัติ และจัดส่งสรุปข้อมูลให้ฝ่าย HR ประจำทุกสิ้นเดือน
4. ตรวจสอบโควตาวันลาคงเหลือ และกดยื่นลาพักร้อนผ่านหน้าแอปพลิเคชันได้ทันที

[ระบุแนวทางการวิเคราะห์เชิงระบบที่คุณต้องการ]
ตัวอย่างแนวทางการสั่งการวิเคราะห์ (Analysis Guidelines):
1. วิเคราะห์ข้อกำหนดด้วย 5W1H & PO: นำหัวข้อความต้องการ 1-4 ด้านบนมาแจกแจงวิเคราะห์ 5W1H (Who, What, Where, When, Why, How) พร้อมให้คำแนะนำในฐานะ PO ว่าฟังก์ชันใดจำเป็นในเฟส 1 (In-Scope) และฟังก์ชันใดควรเลื่อนไปทำเฟสหน้า (Out-of-Scope)
2. อภิปรายเปรียบเทียบวิธีการจัดส่ง (Waterfall vs Agile): เปรียบเทียบข้อดีข้อเสีย และหากเลือกวิเคราะห์ข้อ 1 (บันทึกเวลาสแกนหน้า+GPS) และข้อ 3 (รายงานสรุปส่ง HR) เป็นแกนสำคัญ ให้อภิปรายหาข้อสรุปว่าจะใช้แนวทางใดเพราะเหตุผลใด
3. จัดเรียงสถาปัตยกรรมกระบวนการประมวลผล (IPO Model): วิเคราะห์ตัวนำเข้าข้อมูล (Input), ขั้นตอนประมวลผล (Process), และข้อมูลแสดงผลสรุป (Output) ของระบบ`,outputStructure:`1. PO Kick-off (เป้าหมายสูงสุด และรายละเอียดขอบเขตงาน In-Scope vs Out-of-Scope)
2. Gathering Workshop (ตารางพาร์สข้อกำหนดความต้องการแบบ 5W1H และผลลัพธ์การคัดกรองโดย PO)
3. Methodology (การวิเคราะห์ข้อดีข้อเสีย Waterfall vs Agile, ข้อสรุปเหตุผลการเลือกใช้ และ Sprint Roadmap)
4. Quality Gates & Dev (ขั้นตอนหลักในการควบคุมคุณภาพและวงจรส่งมอบการพัฒนาซอฟต์แวร์)
5. Testing & UAT (รายละเอียดแผนการทดสอบแบบ Developer/System/Integration Test และ เกณฑ์ UAT)
6. Go-Live & Support (แผนการนำระบบขึ้นสภาพแวดล้อมใช้งานจริง และโครงสร้างการให้บริการช่วยเหลือหลังใช้ระบบ)`,analysisFrameworks:["5w1h","ipo","timeline","priority"],outputFormat:"infographic",layout:"16_9",stylePreset:"academic",density:"rich",colorTheme:"auto",iconStyle:"flat",whitespace:"compact"}},{id:"smart-meeting-nameplate",name:"Smart Meeting Nameplate System (ระบบป้ายชื่อห้องประชุมอัจฉริยะ)",category:"IoT / Software Blueprint",emoji:"🏷️",description:"บลูปริ้นท์สเปกสถาปัตยกรรมระบบ IoT ป้ายชื่อจอ E-Paper และเว็บหน้าบ้านสำหรับจัดการการประชุมรวมศูนย์",data:{projectName:"Smart Meeting Nameplate System (ระบบป้ายชื่อห้องประชุมอัจฉริยะ)",projectGoal:"พัฒนาระบบ IoT แสดงผลป้ายชื่อผู้เข้าร่วมประชุมแบบ E-Paper ที่ประหยัดพลังงานสูงสุดและจัดการข้อมูลแบบรวมศูนย์ เพื่อลดการสิ้นเปลืองทรัพยากรกระดาษ ลดระยะเวลาการเตรียมงานของเจ้าหน้าที่ และช่วยให้การปรับเปลี่ยนผังที่นั่งประชุมมีความยืดหยุ่นและเป็นไปได้ทันที",audience:"ผู้บริหารระดับสูง, ทีมไอที/เครือข่าย, และผู้ประสานงานจัดประชุม",difficulty:"Advanced",roleId:"ba",customRole:"",background:"การพิมพ์ป้ายชื่อผู้เข้าประชุมด้วยกระดาษทุกครั้งมีการสิ้นเปลืองทรัพยากรสูง และการเตรียมป้ายกระดาษใช้เวลานาน อีกทั้งไม่สามารถอัปเดตหรือสลับตำแหน่งที่นั่งผู้เข้าประชุมแบบกะทันหันในระหว่างการจัดเตรียมงานได้ นอกจากนี้ อุปกรณ์แสดงผลทั่วไปมักต้องการพลังงานต่อเนื่องทำให้มีสายไฟรบกวนบนโต๊ะประชุม",objective:`1) พัฒนาบอร์ดฮาร์ดแวร์ IoT (ใช้ ESP32/XIAO_ESP32S3) ร่วมกับจอแสดงผล E-Paper เพื่อการแสดงผลแบบไร้สายและคงสภาพการแสดงผลได้แม้ไม่มีไฟเลี้ยง
2) พัฒนาระบบลดทราฟฟิกเครือข่ายและประหยัดแบตเตอรี่ด้วยการทำ Polling 10 วินาที ควบคู่กับ HTTP ETag (304 Not Modified)
3) พัฒนาระบบส่วนกลาง API Server ด้วย .NET 8 และ PostgreSQL พร้อมใช้ระบบแคชความเร็วสูง (In-Memory Cache) เพื่อลดภาระโหลดฐานข้อมูลลงกว่า 1,000 เท่า
4) พัฒนาแอปพลิเคชันส่วนหน้า (Angular 19 Web Dashboard) ที่มีฟังก์ชันลงทะเบียนจับคู่บอร์ด (Auto-Discovery), แก้ไขข้อมูลป้ายรายบุคคล และการอัปโหลดไฟล์ผู้เข้าประชุมจำนวนมาก (Excel Batch Upload)`,target:"เจ้าหน้าที่ผู้จัดเตรียมและประสานงานห้องประชุม (Meeting Admins / Operators), ผู้เข้าประชุมและผู้บริหาร (Meeting Attendees / Board of Directors)",stakeholders:"ผู้บริหารระดับสูงของ Siam Toyota Manufacturing (STM) หรือผู้บริหารองค์กร, ทีมสนับสนุนด้านไอทีและระบบเครือข่าย (IT / Network Operations Team), ทีมผู้จัดงานและงานเลขานุการจัดประชุม",constraints:`ในขอบเขตโครงการ (In-Scope): เฟิร์มแวร์ ESP32 จัดการ WiFi, วาดภาพพิกเซลพอดีจอ (ชื่อ, โลโก้, แถบสีแดง), หน้าเว็บ Angular 19 ลงทะเบียนสถานะอัปโหลด Excel, API Server .NET 8 + Dapper แคช ActivePlatesData
นอกขอบเขตโครงการ (Out-of-Scope): การต่อสัญญาณภายนอกเครือข่าย LAN/VPN องค์กร, การออกแบบเคสอุปกรณ์ 3D Print, เชื่อมต่อโดยตรง Outlook/Google Calendar ในเฟสแรก`,rawData:`ข้อมูลทางเทคนิคและการคัดกรองความต้องการ (Requirements & Specs):
1. การคัดกรองข้อกำหนดวิเคราะห์ความจำเป็น (5W1H Analysis):
   - บันทึกแสดงผลชื่อผู้เข้าประชุมบนจอ E-Paper: วาดภาพโลโก้ STM, รหัสป้าย, ชื่อ-สกุล และตำแหน่ง (จำเป็นมากเฟส 1)
   - ตรวจสอบ ETag Check (HTTP 304): บอร์ด ESP32 และเซิร์ฟเวอร์เช็คเวอร์ชันข้อมูลทุก 10 วินาทีเพื่อข้ามขั้นตอนวาดจอหากไม่มีการอัปเดต ช่วยประหยัดแบตเตอรี่ (จำเป็นมากเฟส 1)
   - อัปโหลดไฟล์ Excel Batch Upload: นำเข้ารายชื่อผู้เข้าประชุมยกแผงผ่านหน้าแผงควบคุม ป้องกันความขัดแย้งของข้อมูลด้วยระบบ Diff View (จำเป็นมากเฟส 1)
   - ค้นหาระบุตัวตนบอร์ดทางกายภาพ (Identify Device): สั่งให้ป้ายเป้าหมายกะพริบสลับสีชั่วคราวเป็นเวลา 15 วินาทีเพื่อหาตำแหน่งจริงบนโต๊ะ (จำเป็นมากเฟส 1)
   - ผูกบอร์ดผ่าน Auto-Discovery (Device Binding): แสดงรายชื่อ MAC Address ที่ยังไม่เชื่อมโยงบน Dropdown หน้าเว็บเพื่อผูกเข้ากับหมายเลขป้ายได้ทันที (จำเป็นมากเฟส 1)
   - เชื่อมโยงระบบปฏิทินองค์กรอัตโนมัติ (เช่น Exchange / Google Calendar Sync): เลื่อนไปพิจารณาใน Phase 2 (นอกขอบเขตเฟสแรก)
2. แผนงานการพัฒนา 3 Sprints (Agile / Waterfall Hybrid):
   - Sprint 1: ประกอบบอร์ดฮาร์ดแวร์ XIAO_ESP32S3 กับจอ E-Paper, ตรรกะ WiFi Auto-Reconnect, สร้าง Schema ฐานข้อมูลใน PostgreSQL, และทำ API GET แรกบน .NET 8 API
   - Sprint 2: ตรรกะวาดภาพ (โลโก้ STM สีแดง, ชื่อผู้เข้าประชุมในกรอบดำโค้งมน, ตำแหน่ง และแถบสีแดงของบริษัท), ระบบตรวจสอบ HTTP ETag (304), และหน้าจอแสดงสถานะบนเว็บ Angular 19
   - Sprint 3: ระบบนำเข้า Excel อัปโหลด, Diff Check, คำสั่งระบุตัวเครื่อง (Identify), และทำการทดสอบระบบจริงแบบบูรณาการ (System Integration Test) ในสภาพแวดล้อมเสมือนจริง
3. ขั้นตอนประกันคุณภาพและการทดสอบ (Quality Gates & testing):
   - ลำดับการส่งมอบ: Requirement Review -> Hardware Verification -> Deploy API/DB -> HW-SW Integration -> UAT -> Go-Live
   - Developer Test: ตรวจสอบการตัดคำไทย/อังกฤษบนจอ e-Paper (truncateToFit) ไม่ให้ล้นกรอบ และการคำนวณ MD5 Hash ของข้อมูลป้ายในเซิร์ฟเวอร์เพื่อออก ETag
   - System Test: ตรวจระบบ Auto-Discovery ของ MAC ที่ยังไม่ได้ลงทะเบียนในแคช RAM (UnmappedMacs) และระบบจำแนกความขัดแย้งข้อมูล Excel Upload
   - Integration Test: นำบอร์ดใหม่ต่อเน็ตเพื่อโชว์ "Device Not Registered", ผูกบอร์ดในเว็บและตรวจการอัปเดตเป็น "Waiting for data...", ทำการอัปโหลดรายชื่อและระบบต้องตอบ HTTP 304 หากไม่มีการอัปเดต
4. รายละเอียดสถาปัตยกรรม (Input - Process - Output):
   - Input: MAC Address, SSID/Pass, รหัส ETag, โครงสร้างข้อมูล JSON (ชื่อ, นามสกุล, ตำแหน่ง, รหัสโต๊ะ), ไฟล์ Excel (.xlsx)
   - Process: การเก็บข้อมูลในระบบ In-Memory Cache (ActivePlatesData) เพื่อดึงข้อมูล O(1) ช่วยลดโหลดฐานข้อมูล PostgreSQL 1,000 เท่า, การคำนวณ MD5 Hash, และการวาดพิกเซล (วาดเส้น, วาดกรอบโค้งมน, และแสดงสถานะพิเศษกะพริบระบุตำแหน่ง)
   - Output: จอ E-Paper แสดงโลโก้ STM แถบสีแดงและชื่อในกรอบดำโค้งมน, หน้าจอแสดงสถานะระบบ ("WiFi Connect Fail", "Device Not Registered"), หน้าเว็บ Live Status Dashboard (24 ป้าย พร้อมสถานะ Online/Offline และประวัติอัปโหลด Diff View)
   - หมายเหตุ: สเปกภาพ E-Paper วาดโลโก้ STM ด้านซ้ายบน, รหัสป้ายขวาบน (เช่น No. 07), ชื่อนามสกุลพิมพ์ตัวหนาสีขาวในกรอบสี่เหลี่ยมโค้งมนสีดำตรงกลางเด่นชัด, บรรทัดล่างตัวอักษร STS สีดำ, แถบสีแดงด้านล่างสุดมีข้อความ TOYATA สีขาวเด่นชัด`,analysisFrameworks:["5w1h","ipo","timeline","gap"],outputFormat:"infographic",layout:"16_9",stylePreset:"glass",density:"rich",colorTheme:"blue",iconStyle:"flat",whitespace:"compact",outputStructure:`1. Project Kick-off
2. Requirements & 5W1H Analysis
3. Methodology & Sprint Roadmap
4. Quality Gates & Testing Plan
5. Input - Process - Output (IPO) Architecture
6. E-Paper Visual & Dashboard Outputs`}},{id:"hr-attendance-blueprint",name:"HR Attendance Blueprint (บอร์ดวิเคราะห์ระบบสแกนหน้าและยื่นลา)",category:"Software / Project Blueprint",emoji:"📊",description:"แม่แบบคัดกรองความต้องการ 5W1H, เปรียบเทียบ Agile vs Waterfall, วางโครงสร้าง IPO และแผนการส่งมอบ 6 ขั้นตอนของโครงการระบบลงเวลาพนักงาน",data:{projectName:"ระบบลงเวลาทำงานและจัดการการลาของพนักงาน (HR Attendance & Leave Management)",projectGoal:"พัฒนาระบบลงเวลาทำงานและจัดการการลาของพนักงานผ่าน Mobile Application เพื่อเพิ่มความถูกต้อง ลดงาน Manual และเพิ่มประสิทธิภาพการประมวลผลข้อมูลของ HR",audience:"Product Owner (PO), HR Director, และทีมพัฒนาซอฟต์แวร์",difficulty:"Advanced",roleId:"ba",customRole:"",background:"บริษัทต้องการปรับเปลี่ยนการลงเวลางานจากแบบตอกบัตรหรือตาราง Excel ที่มีปัญหาข้อมูลคลาดเคลื่อน มาเป็นระบบ Mobile App แบบสแกนใบหน้าและจับพิกัด GPS เพื่อเพิ่มความรวดเร็วและให้ฝ่าย HR ประมวลผลรอบเงินเดือนได้แบบอัตโนมัติ",objective:"ออกแบบและวิเคราะห์ความต้องการเชิงลึกสำหรับระบบลงเวลาและจัดการลาของพนักงาน เพื่อเสนอต่อ Product Owner (PO) ในการอนุมัติขอบเขตการทำงานเฟสแรก และเลือก Methodology การพัฒนาที่เหมาะสม",target:"พนักงานทั่วไป, หัวหน้าแผนกผู้มีอำนาจอนุมัติ และเจ้าหน้าที่ HR",stakeholders:"PO (Product Owner), HR (ฝ่ายทรัพยากรบุคคล), พนักงาน (Employee), ผู้จัดการ (Manager), Developer (นักพัฒนา), Tester (ผู้ทดสอบระบบ)",constraints:"ในขอบเขตการทำงานต้องสามารถตรวจสอบความถูกต้องของพิกัดและใบหน้าได้ และต้องส่งมอบรายงานสรุปสิ้นเดือนให้ฝ่าย HR ส่วนเรื่องการทำแชตในแอปให้ตัดออกเป็นเฟสถัดไปเพื่อรักษาข้อจำกัดเรื่องเวลาส่งมอบ",rawData:`ความต้องการของระบบ (System Requirements):
1. บันทึกเวลาโดยการสแกนใบหน้า (Scan Face) ร่วมกับระบบพิกัดตำแหน่ง (GPS Location) บนมือถือพนักงาน
2. มีระบบห้องแชต (Chat) คุยกันได้ภายในแอปพลิเคชันหลักโดยตรงโดยที่พนักงานไม่ต้องสลับแอปไปใช้งานส่วนอื่น
3. ประมวลผลและจัดส่งข้อมูลการ ขาด ลา มาสาย ไปให้ฝ่าย HR อัตโนมัติในทุกสิ้นเดือน
4. พนักงานสามารถดูสิทธิ์วันลาคงเหลือและยื่นคำขออนุมัติลาพักร้อนผ่านหน้าจอแอปพลิเคชันได้เลย

ข้อสั่งการสำหรับการวิเคราะห์ของ BA:
1. การคัดกรองวิเคราะห์ความต้องการด้วย 5W1H & PO Filter:
   - นำความต้องการข้อ 1-4 มาทำตารางแจกแจงวิเคราะห์ 5W1H (Who, What, Where, When, Why, How)
   - คัดกรองและให้ข้อเสนอแนะในมุมมองของ PO (Product Owner) ว่าจำเป็นต้องทำในเฟสแรก (Phase 1 / In-Scope) หรือตัดออกไปรอเฟสหน้า (Phase 2 / Out-of-Scope)
2. อภิปรายระเบียบวิธีการพัฒนา (Waterfall vs Agile):
   - ทำการเปรียบเทียบข้อดีข้อเสียของการพัฒนาทั้งสองแบบ
   - หากเลือกและอ้างอิงความต้องการข้อ 1 (บันทึกเวลาสแกนหน้า+GPS) และข้อ 3 (รายงานสรุปสิ้นเดือนส่ง HR) เป็นหลักสำคัญ ให้ทำการอภิปรายอธิบายหาข้อสรุปร่วมกันว่าควรเลือกแนวทางใดเพราะเหตุผลใด
3. สถาปัตยกรรมกระบวนการ (Input - Process - Output):
   - ดำเนินการจัดทำ IPO Framework ของทั้งระบบเพื่อชี้แจงการรับส่งข้อมูลของ Hardware มือถือและ Server
4. จัดรูปแบบหน้าตาการนำเสนอภาพและข้อมูลในรายงาน (Infographic Layout) ให้ออกมาแบ่งเป็น 6 ส่วนหลักดังนี้:
   - ส่วนที่ 1: PO Kick-off (รายละเอียดชื่อโครงการ, เป้าหมาย และขอบเขต In-Scope / Out-of-Scope)
   - ส่วนที่ 2: Gathering Workshop (ตารางวิเคราะห์ 5W1H & ผลการตัดสินคัดกรองโดย PO ของความต้องการข้อ 1-4)
   - ส่วนที่ 3: Methodology (อภิปรายเปรียบเทียบ Waterfall vs Agile, ข้อสรุปการเลือกแนวทาง และตัวอย่างแผนงาน Sprint Roadmap 3 Sprints)
   - ส่วนที่ 4: Quality Gates & Development (ขั้นตอนวงจรการส่งมอบ: Requirement -> Design -> Dev -> Testing -> UAT -> Go-Live)
   - ส่วนที่ 5: Testing & UAT (รายละเอียดแผนการเทสต์ Developer/System/Integration Test และ เกณฑ์ UAT ที่ HR ต้องตรวจรับ)
   - ส่วนที่ 6: Go-Live & Support (การส่งมอบระบบและการดูแลระบบช่วงหลังเปิดตัวจริง)`,analysisFrameworks:["5w1h","ipo","timeline","priority"],outputFormat:"infographic",layout:"16_9",stylePreset:"academic",density:"rich",colorTheme:"blue",iconStyle:"flat",whitespace:"compact",outputStructure:`1. PO Kick-off
2. Gathering Workshop (5W1H) & Requirement Analysis
3. Methodology (Waterfall or Agile) & Decision Summary
4. Quality Gates & Development Process
5. Testing & UAT Validation
6. Go-Live & Support Plan`}},{id:"hr-attendance",name:"HR Attendance Analytics (ตัวอย่างระบบลงเวลา)",category:"Business / HR",emoji:"📅",description:"ระบบวิเคราะห์การเข้างานของพนักงาน ออกแบบโครงสร้างและวิเคราะห์ข้อมูลเพื่อทำรายงาน",data:{projectName:"HR Attendance Dashboard",projectGoal:"สร้างรายงานสรุปและภาพ Info สถิติการมาทำงาน สาย ขาด ลา เพื่อให้ผู้บริหารมองเห็นแนวโน้มปัญหาของแต่ละแผนกได้ทันที",audience:"HR Director และผู้บริหารระดับสูง (C-Level)",difficulty:"Intermediate",roleId:"data",customRole:"",background:"บริษัทมีข้อมูลดิบเกี่ยวกับการสแกนนิ้วมือและการลางานจำนวนมาก แต่ยังไม่มีการวิเคราะห์เชิงลึกที่สรุปผลให้เห็นภาพใหญ่ขององค์กร",objective:"วิเคราะห์อัตราการมาสายและอัตราการลาของแต่ละแผนกในรอบ 6 เดือนที่ผ่านมา เพื่อเสนอแนวทางปรับปรุงกฎการทำงาน",target:"พนักงานทุกระดับ โดยเน้นการเปรียบเทียบระหว่างแผนกที่มีความยืดหยุ่นสูง (เช่น IT) กับแผนกปฏิบัติการ (เช่น Production)",stakeholders:"HR Director, CEO, Department Heads",constraints:"ข้อมูลต้องรักษาสิทธิความเป็นส่วนตัว (Anonymized) ไม่ระบุชื่อพนักงานเดี่ยวๆ และจำกัดงบประมาณในการทำระบบบิ๊กดาต้า",rawData:`ข้อมูลสถิติเบื้องต้น:
- แผนก Production: มาสายเฉลี่ย 12%, อัตราการลาป่วย 5% (วันจันทร์และวันศุกร์สูงสุด)
- แผนก IT: มาสายเฉลี่ย 2% (ทำงานยืดหยุ่น), อัตราการลาป่วย 1%
- แผนก Sales: อัตราการลากิจสูงสุด 8% (เนื่องจากต้องพบลูกค้าแต่ลงระบบเป็นลา)
- แผนก HR: อัตราการมาสาย 4%, ลา 2%`,analysisFrameworks:["swot","5w1h","priority","gap"],outputFormat:"infographic",layout:"16_9",stylePreset:"modern",density:"balanced",colorTheme:"blue",iconStyle:"flat",whitespace:"medium"}},{id:"market-entry",name:"Market Entry Strategy (กลยุทธ์เจาะตลาดใหม่)",category:"Marketing",emoji:"🚀",description:"วิเคราะห์ความเป็นไปได้ในการนำผลิตภัณฑ์ประเภทอาหารเสริมเพื่อสุขภาพเข้าตลาดไทย",data:{projectName:"Health Supplement Market Entry",projectGoal:"วางแผนเจาะตลาดและออกแบบสื่อโฆษณาเพื่อชูจุดเด่นสินค้าอาหารเสริมพืชออร์แกนิกในกลุ่มคนรักสวนกระแสใหม่",audience:"ผู้ประกอบการ SME และนักลงทุนร่วมทุน (Venture Capitalists)",difficulty:"Advanced",roleId:"marketing",customRole:"",background:"กระแสรักสุขภาพและการปลูกผักกินเองที่บ้านโตขึ้นมาก แต่ผู้บริโภคยังกังวลเรื่องสารเคมีตกค้างจากปุ๋ยเคมีทั่วไป",objective:"นำเสนอกลยุทธ์สร้างความเชื่อมั่น แผนภาพเปรียบเทียบประสิทธิภาพ และข้อดีของปุ๋ยอินทรีย์นาโนบับเบิลกับคู่แข่งรายใหญ่",target:"กลุ่ม Gen Y และ Gen Z ที่รักการปลูกต้นไม้ในเมือง (Urban Gardening) ในพื้นที่จำกัด เช่น คอนโด",stakeholders:"Founder, Angel Investors, Marketing Team",constraints:"งบการตลาดปีแรกจำกัด เน้นการทำการตลาดออนไลน์ผ่าน Content Marketing และ Influencer แนวรักษ์โลก",rawData:`คู่แข่ง:
- แบรนด์เคมีรายใหญ่: ราคาถูก, หาง่าย, แต่ไม่ปลอดภัยต่อสัตว์เลี้ยงและเด็ก
- แบรนด์ปุ๋ยหมักธรรมชาติทั่วไป: ปลอดภัย, ราคาปานกลาง, แต่ส่งกลิ่นเหม็นและใช้งานยากในอาคาร
สินค้าของเรา:
- ปุ๋ยน้ำออร์แกนิกนาโน: ไร้กลิ่น, เข้มข้นสูง, ใช้ง่ายด้วยสเปรย์, ปลอดภัย 100%, ราคาพรีเมียมแต่ใช้ได้นาน`,analysisFrameworks:["swot","5w1h","timeline","risk"],outputFormat:"presentation",layout:"a4",stylePreset:"apple",density:"simple",colorTheme:"green",iconStyle:"outline",whitespace:"generous"}},{id:"lesson-plan-ai",name:"Lesson Plan: AI for Kids (บทเรียน AI สำหรับเด็ก)",category:"Education",emoji:"🤖",description:"ออกแบบเนื้อหาการสอนวิชาพื้นฐานปัญญาประดิษฐ์ให้เด็กอายุ 10-12 ปี โดยไม่มีการเขียนโค้ด",data:{projectName:"AI for Kids Lesson Plan",projectGoal:"สร้างแผนการสอน สไลด์บรรยาย และโครงงานตัวอย่างเรื่อง AI ให้เด็กประถมเข้าใจง่าย สนุก และเห็นการประยุกต์ใช้จริง",audience:"คุณครูประถมศึกษาตอนปลาย และเด็กนักเรียนอายุ 10-12 ปี",difficulty:"Beginner",roleId:"teacher",customRole:"",background:"เด็กๆ ได้ยินคำว่า AI เสมอในชีวิตประจำวัน (TikTok, YouTube, Siri) แต่ขาดความเข้าใจว่ามันทำงานอย่างไร และมีความกลัวว่ามันคิดเองได้เหมือนมนุษย์",objective:"อธิบายแนวคิด Machine Learning (การจำแนกภาพสัตว์เลี้ยง) ผ่านกิจกรรมบอร์ดเกมและการทดลองจริงโดยไม่ต้องเขียนโค้ด",target:"เด็กนักเรียนระดับประถม 4-6 ไม่มีพื้นฐานคอมพิวเตอร์",stakeholders:"ครูผู้สอน, ผู้ปกครอง, คณะกรรมการโรงเรียน",constraints:"เวลาสอนมีจำกัดเพียง 1 ชั่วโมงครึ่ง และคอมพิวเตอร์ในห้องเรียนอาจมีอินเทอร์เน็ตที่ไม่เสถียร",rawData:`เป้าหมายบทเรียน:
1. เด็กเข้าใจความแตกต่างระหว่าง "การเขียนโปรแกรมทั่วไป" กับ "การสอน AI"
2. กิจกรรม: ให้นักเรียนจำลองเป็น AI คัดแยกรูปแมวกับหมาด้วยบัตรคำ
3. การประยุกต์ใช้: แนะนำโปรแกรม Teachable Machine ของ Google`,analysisFrameworks:["ipo","timeline","gap"],outputFormat:"presentation",layout:"16_9",stylePreset:"google",density:"balanced",colorTheme:"orange",iconStyle:"flat",whitespace:"medium"}}];

export const VISUAL_PRESETS = {
  layouts: [
    { id: '16_9', name: 'Widescreen (16:9)', desc: 'เหมาะสำหรับ Slide Presentation, YouTube, หน้าจอแนวกว้าง' },
    { id: 'a4', name: 'A4 Documents', desc: 'เหมาะสำหรับรายงาน, คู่มือ, E-book, เอกสารสรุป' },
    { id: 'landscape', name: 'Landscape (4:3)', desc: 'สัดส่วนแนวราบแบบดั้งเดิม เหมาะสำหรับการนำเสนอทั่วไป' },
    { id: 'portrait', name: 'Portrait (9:16)', desc: 'เหมาะสำหรับมือถือ, Infographic แนวตั้ง, IG/TikTok Stories' },
    { id: 'square', name: 'Square (1:1)', desc: 'เหมาะสำหรับ Social Media Post, โปสเตอร์สี่เหลี่ยมจัตุรัส' }
  ],
  styles: [
    { id: 'apple', name: 'Apple Aesthetic', desc: 'มินิมอล หรูหรา สะอาด เน้นภาพโปร่งใส แสงธรรมชาติ ฟอนต์บางเฉียบ' },
    { id: 'google', name: 'Google Material', desc: 'สีสันสดใส การ์ดมีมิติเงา ไอคอนสีแบน เข้าใจง่าย เป็นมิตรกับผู้ใช้' },
    { id: 'microsoft', name: 'Microsoft Fluent', desc: 'สไตล์องค์กรกึ่งสามมิติ (Semi-3D) หนาแน่น มีมิติกระจกฝ้า แผ่นสีเรียงซ้อน' },
    { id: 'modern', name: 'Modern Startup', desc: 'สีสดใสตัดกับโทนเข้ม/พาสเทล ลูกเล่นนีออนสะท้อนแสง ลายกราฟิกเรขาคณิต' },
    { id: 'minimal', name: 'Minimalist Clean', desc: 'ใช้สีน้อยมาก (ขาว-เทา-ดำ) เน้นจัดช่องไฟกว้าง ตัวหนังสือบอกเล่าเรื่องราว' },
    { id: 'glass', name: 'Glassmorphism Blur', desc: 'โปร่งแสงทับซ้อนเหมือนกระจกฝ้า สีรุ้งสะท้อน แสงนีออนพื้นหลัง ฟอนต์คมชัด' },
    { id: 'dark', name: 'Futuristic Dark Mode', desc: 'ธีมดำ/น้ำเงินเข้ม ไฮไลต์ด้วยแสงสีเขียว/ฟ้า/ม่วงส่องสว่าง เหมาะสำหรับสาย Tech' },
    { id: 'academic', name: 'Academic Clean', desc: 'โทนสุขุม สีกรมท่า แดงเบอร์กันดี หรือเทา เส้นสายคลาสสิก จัดตารางเป็นระเบียบ' }
  ],
  densities: [
    { id: 'simple', name: 'Simple (เข้าใจง่าย)', desc: 'ข้อมูลน้อย เน้นหัวข้อเด่น เหมาะสำหรับสไลด์พรีเซนต์ผู้บริหาร' },
    { id: 'balanced', name: 'Balanced (สมดุล)', desc: 'อัตราส่วนข้อมูลและภาพกำลังดี อ่านสนุก เหมาะสำหรับแผ่นพับหรือโปสเตอร์ทั่วไป' },
    { id: 'rich', name: 'Rich (ข้อมูลแน่น)', desc: 'มีรายละเอียดเชิงลึก ตาราง แผนภูมิจำนวนมาก เหมาะสำหรับ Infographic เชิงเทคนิค' }
  ],
  colors: [
    { id: 'blue', name: 'Corporate Blue (ฟ้าน้ำเงิน)', hex: '#3B82F6', desc: 'น่าเชื่อถือ มืออาชีพ สงบ สุขุม เหมาะกับงานธุรกิจ' },
    { id: 'green', name: 'Eco Green (เขียวธรรมชาติ)', hex: '#10B981', desc: 'สดชื่น เป็นธรรมชาติ การเจริญเติบโต สุขภาพ เกษตรกรรม' },
    { id: 'purple', name: 'Creative Purple (ม่วงคิดสร้างสรรค์)', hex: '#8B5CF6', desc: 'หรูหรา ลึกลับ นวัตกรรม เทคโนโลยีสร้างสรรค์ งานวิจัยขั้นสูง' },
    { id: 'orange', name: 'Energetic Orange (ส้มกระฉับกระเฉง)', hex: '#F59E0B', desc: 'กระตือรือร้น การศึกษา เยาวชน อาหาร ความเป็นมิตร' },
    { id: 'cool_gray', name: 'Cool Slate Gray (เทาสไตล์เทค)', hex: '#64748B', desc: 'ทันสมัย เรียบง่าย เป็นกลาง เข้าได้กับทุกเนื้อหา' },
    { id: 'auto', name: 'Auto System Match', hex: 'linear-gradient(to right, #3B82F6, #10B981)', desc: 'จับคู่โทนสีตามบทบาท (Role) ที่เลือกโดยอัตโนมัติ' }
  ],
  icons: [
    { id: 'flat', name: 'Flat 2D Icons', desc: 'ไอคอนแบนสองมิติ สีสันกลมกลืน ดูเรียบง่ายสบายตา' },
    { id: 'outline', name: 'Line / Outline Icons', desc: 'ไอคอนเส้นร่างลายเส้นบาง ทันสมัยและดูเป็นมืออาชีพ' },
    { id: 'filled', name: 'Solid / Filled Icons', desc: 'ไอคอนแบบลงสีทึบ ชัดเจน มองเห็นง่ายจากระยะไกล' },
    { id: 'three_d', name: '3D Rendered Icons', desc: 'ไอคอนกึ่งสามมิติ มีแสงเงาและความนูนลึก เพิ่มความพรีเมียม' },
    { id: 'none', name: 'No Icons (Text Only)', desc: 'ไม่ใช้ไอคอน เน้นการจัดลำดับด้วยขนาดตัวอักษรและเส้นขั้น' }
  ],
  whitespaces: [
    { id: 'generous', name: 'มาก (Generous)', desc: 'ระยะห่างเยอะ อ่านสบายตา เหมาะกับสไตล์ Premium Minimalist' },
    { id: 'medium', name: 'ปานกลาง (Balanced)', desc: 'สัดส่วนมาตรฐาน ระยะห่างพอเหมาะสำหรับรายงานและสไลด์ทั่วไป' },
    { id: 'compact', name: 'แน่น (Compact)', desc: 'ระยะห่างกระชับ เพื่อใส่รายละเอียด ข้อมูล ตาราง ตัวเลขให้มากที่สุด' }
  ]
};
