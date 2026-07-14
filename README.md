# 🗺️ Universal Prompt Architecture (UPA) Studio

[![Vite](https://img.shields.io/badge/Vite-5.4.21-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JS](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Universal Prompt Architecture (UPA) Studio** เป็นเว็บแอปพลิเคชันระดับมืออาชีพสำหรับวิศวกรรมคำสั่ง (Prompt Engineering) ที่พัฒนาขึ้นภายใต้กรอบแนวคิด **RCDASIOV (Role, Context, Data, Analysis, Structure, Image, Option, Visual)** ช่วยให้ผู้ใช้งานสามารถออกแบบ คัดกรอง คัดแยกสเปกความต้องการ และคอมไพล์สรุปเป็นคำสั่งสำหรับป้อนให้ AI นำไปประมวลผลได้อย่างมีประสิทธิภาพสูงสุด

---

## 🌟 ฟีเจอร์หลัก (Key Features)

*   **🧙‍♂️ Prompt Architect (Wizard Mode)**: โหมดวิซาร์ดจัดแบ่งการกรอกข้อมูล 8 ขั้นตอนเชิงลึก (Project Profile, Role Assignment, Context Details, Raw Data Input, Analysis Frameworks, Output Formats, Visual Themes, and Review Checklists)
*   **🗺️ Universal Blueprint Creator**: แบบฟอร์มสเปกโครงสร้างระบบในหน้าเดียว (Single Page Editor) ออกแบบครอบคลุมทั้งข้อมูลโครงการ ความต้องการระบบ (Requirements), วิธีการจัดส่ง (Agile/Waterfall), โมเดลประมวลผล (IPO Model) และ เกณฑ์ UAT
*   **🎛️ Prompt Blocks Studio**: แดชบอร์ดสำหรับจัดระเบียบโครงสร้างคำสั่งแบบลากย้ายสลับตำแหน่งบล็อกได้ทันที (Drag & Drop) เพื่อทดสอบลีลาการเรียงหัวข้อที่ให้ผลลัพธ์ดีที่สุด
*   **⚡ Smart Prompt Optimizer**: ระบบปรับปรุงและขยายความคำสั่งดั้งเดิม (Simple Prompt) ให้เป็นคำสั่งสถาปัตยกรรมระดับมืออาชีพพร้อมใช้ในคลิกเดียว
*   **📚 Spec Template Library**: คลังต้นแบบความต้องการตามสายงาน (เช่น IoT / Software System, Business, Marketing, Education) โหลดใช้งานเป็นฐานข้อมูลเริ่มต้นได้ทันที
*   **📊 Live Preview & Quality Gauges**: หน้าต่างพรีวิวผลลัพธ์คำสั่งแบบสดสองรูปแบบ (Formatted Markdown และ Raw Text) พร้อมมาตรวัดคะแนนความครบถ้วนของข้อมูลคุณภาพ (Prompt Quality) และความพร้อมในการนำไปเจนภาพ (Image Readiness) แบบเรียลไทม์

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

*   **Core**: HTML5, Vanilla JavaScript (ES6+ Module)
*   **Styling**: Tailwind CSS (3.4.3), Custom Cyberpunk Neon & Glassmorphism Design
*   **Markdown Processor**: Marked.js (สำหรับการประมวลผลการแสดงผล Markdown ในกล่องพรีวิวอย่างปลอดภัย)
*   **Build Tool**: Vite (5.4.21)

---

## 🚀 เริ่มต้นใช้งานในเครื่องโลคอล (Getting Started)

### ความต้องการของระบบ (Prerequisites)
*   [Node.js](https://nodejs.org/) (เวอร์ชัน 18.x หรือใหม่กว่า)
*   [npm](https://www.npmjs.com/) 

### 1. ติดตั้ง Dependencies
เปิด Terminal ในโฟลเดอร์โครงการแล้วรันคำสั่ง:
```bash
npm install
```

### 2. รันระบบสำหรับพัฒนา (Dev Server)
เพื่อเริ่มระบบและเปิดเบราว์เซอร์ดูผลลัพธ์:
```bash
npm run dev
```
ระบบจะรันบน [http://localhost:5173/](http://localhost:5173/) หรือพอร์ตที่ระบบจัดสรรให้

### 3. บิลด์โครงการเพื่อนำไปใช้งานจริง (Production Build)
สร้างโฟลเดอร์ `dist` สำหรับเก็บไฟล์เว็บสำเร็จรูป:
```bash
npm run build
```

---

## 📂 โครงสร้างโฟลเดอร์หลัก (Project Structure)

```text
prompt-gen-img/
├── dist/                  # ไฟล์คอมไพล์สำเร็จรูปสำหรับนำไปรันจริง
├── src/
│   ├── main.js            # ตัวควบคุมหลัก (DOM Caching, Event Binding, UI Synchronization)
│   ├── promptEngine.js    # กลไกเบื้องหลังการประเมินคะแนนและการแปลงข้อมูลเป็นโครงคำสั่ง
│   ├── templates.js       # คลังข้อมูลบทบาท (Roles) และ Specs ต้นแบบ (Templates)
│   ├── utils.js           # ฟังก์ชันเสริมการแปลงลิงก์ย่อดาวน์โหลดไฟล์ (Serialization & Tools)
│   └── style.css          # สไตล์เสริมความโปร่งแสง กระจกฝ้า (Glassmorphic) และ Cyber Neon Accent
├── index.html             # โครงสร้างหน้าเว็บหลักและเลย์เอาต์ระบบ
├── package.json           # ไฟล์สเปกพึ่งพาระบบ (Scripts & Dependencies)
└── tailwind.config.js     # การตั้งค่าโทนสีนีออนและฟอนต์ความกว้างเส้นระบบ
```

---

## 📄 สัญญาอนุญาต (License)

โครงการนี้อยู่ภายใต้สัญญาอนุญาตแบบ **MIT License** - ดูรายละเอียดเพิ่มเติมได้ในไฟล์ [LICENSE](LICENSE)

---

## ✍️ ผู้จัดทำ (Author)
*   **Email**: manachaisank@gmail.com
*   **GitHub**: [@xyla-zx](https://github.com/xyla-zx)
