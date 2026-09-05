# Smart Education Website

This version follows the supplied interface reference: compact mobile-style white/purple cards, the same top header pattern with dark/light mode and profile, Student/Teacher/Computer entry screens, exam/result/profile flows, and a Teacher question builder supporting multiple question types.

## Run

1. Open PowerShell in this folder.
2. Run `npm install`
3. Run `npm start`
4. Open `http://localhost:3000/` or `http://localhost:3000/Open.html`

## Teacher question types

- MCQ
- True / False
- Fill in the blank
- Short Answer
- Long Answer

Each teacher question stores `subject`, `class`, `semester`, `password`, question type, marks and time inside `Teacherquestion.json` after publishing.

## Computer data

`Computerquestion.json` contains computer practice questions grouped by subject/class/semester. Math questions provide a Solution button; other practice questions do not.

## Subject JPG photos

Computer Home now shows one JPG image for each subject card. Default JPG files are in `` and can be replaced with your own JPG/JPEG files.

You can also click the small camera button on a subject card and choose a JPG/JPEG photo. The selected image is stored in the browser for that subject + class + semester, so it remains after refreshing the page on the same browser/device.

## Computer Question feedback

Computer Question now supports multiple questions. After selecting an answer, the correct option turns green and an incorrect selected option turns red. Math questions also have a Solution button. The profile icon remains at the top-right and opens Student Profile.

## GitHub Pages

The root `index.html` opens `Open.html` automatically on the GitHub Pages URL. Frontend HTML/CSS/JavaScript/JSON features work as static files. The Node/Express backend in `backend/server.js` is retained for local/server hosting and is not executed by GitHub Pages.


## GitHub Pages note
The Student Save page now loads `data/Teacherquestion.json` and also checks locally published papers. Local publishing works in the same browser. For teachers and students on different devices to share newly created papers, a real hosted backend/database is required; GitHub Pages alone cannot write new JSON files back into the repository.
