# CVDesignHub — ATS-Friendly Resume Builder

CVDesignHub is a modern, premium, and open-source resume and cover letter builder designed to help job seekers create professional, ATS-friendly resumes that get past filters. Built with React, Vite, TailwindCSS, and Zustand.

---

## 🚀 Key Features

- **Live Editing & Preview**: Real-time visual editor with instant side-by-side previewing.
- **ATS Optimization**: Generates clean, parser-friendly documents. Exports as true text-selectable PDF and structured DOCX.
- **9 Resume Templates**: Classic, Modern, Tech, Executive, Jupiter, Mars, Minimalist, Entry-Level, and Blank templates.
- **Cover Letter Builder**: Separate dedicated wizard to write and preview matching cover letters.
- **Privacy & Auto-Save**: All data is saved locally on your device via IndexedDB (Zustand store persistent state). No sign-up required, no data uploaded to external databases.
- **Rich Text Toolbar**: Simple markdown/bold/italic formatting for professional descriptions.

---

## 🛠️ Repository Architecture

### Two-Entry Vite Setup
This project builds two independent HTML entry points:
1. **`index.html`**: The static marketing landing page.
2. **`app.html`**: The React application, mounted via `src/main.jsx`.

This configuration is defined in [vite.config.js](file:///c:/Users/divya/Downloads/NNN/cvBuilder/vite.config.js) under `rollupOptions.input`.

### Active Directory Map
- **[src/components/features/](file:///c:/Users/divya/Downloads/NNN/cvBuilder/src/components/features/)**: Contains the active, live component tree:
  - `form/`: `FormWizard.jsx` and individual editing steps (PersonalInfo, Experience, Education, Skills, Summary).
  - `preview/`: Live `TemplateRenderer.jsx`, switcher, reorder controls, and settings.
  - `parser/`: Parser UI (`FileUploader.jsx`) for importing existing resumes.
  - `analysis/`: ATS scoring widget (`ATSScorer.jsx`) and job matching helpers.
  - `export/`: Export control buttons (`ExportButtons.jsx`).
  - `coverletter/`: Cover letter creation view (`CoverLetterBuilder.jsx`).
- **[src/components/templates/](file:///c:/Users/divya/Downloads/NNN/cvBuilder/src/components/templates/)**: Contains the 9 active resume templates (ClassicTemplate, ModernTemplate, TechTemplate, etc.) rendered dynamically by `TemplateRenderer.jsx`.
- **[src/store/](file:///c:/Users/divya/Downloads/NNN/cvBuilder/src/store/)**: Global state management powered by Zustand (`useResumeStore.js`).
- **[src/utils/](file:///c:/Users/divya/Downloads/NNN/cvBuilder/src/utils/)**: Helpers for PDF extraction (`fileHelpers.js`) and database operations (`storage.js`).
- **[src/__tests__/](file:///c:/Users/divya/Downloads/NNN/cvBuilder/src/__tests__/)**: Holds test fixtures and test outputs.

---

## 💻 Local Development

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation
Install project dependencies:
```bash
npm install
```

### Start Development Server
Launches the dev server for both the marketing landing page and the app:
```bash
npm run dev
```
- Open static page: `http://localhost:5173/` or `http://localhost:5173/index.html`
- Open React application: `http://localhost:5173/app.html`

### Build for Production
Compiles the static assets and React app into the `dist/` folder:
```bash
npm run build
```

### Preview Production Build
Runs a local web server to preview the production build in `dist/`:
```bash
npm run preview
```

### Code Linting
Run ESLint check:
```bash
npm run lint
```

---

## 🧪 Testing & Fixtures

- Test fixture documents (`test_resume.pdf` / `test_resume.docx`) are stored in [src/__tests__/fixtures/](file:///c:/Users/divya/Downloads/NNN/cvBuilder/src/__tests__/fixtures/).
- To regenerate fresh test files, run the generator script:
```bash
node scripts/generate_test_files.js
```
The output files will be created inside the `src/__tests__/fixtures/` directory.
