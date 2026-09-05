const params = new URLSearchParams(location.search);

const requestedId = params.get('id');
const requestedTopic = params.get('topic');
const requestedSubject = params.get('subject');
const requestedClass = params.get('class');
const requestedSemester = params.get('semester');

let questions = [];
let dataCache = null;

const selected = {};
const revealed = {};

function norm(v) {
    return String(v ?? '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizeQuestions(data) {
    const all = Array.isArray(data?.questions) ? data.questions : [];

    // Topic pages are ALWAYS restricted by subject + class + semester + topic.
    // This prevents a Bengali/Accountancy question from appearing in a Commercial Law topic.
    if (requestedTopic) {
        const topicQuestions = all.filter(q =>
            norm(q.topic) === norm(requestedTopic) &&
            norm(q.subject) === norm(requestedSubject || q.subject) &&
            (!requestedClass || String(q.class) === String(requestedClass)) &&
            (!requestedSemester || String(q.semester) === String(requestedSemester)) &&
            q.type !== 'math'
        );

        return topicQuestions;
    }

    // If a specific question ID is supplied, keep the old behaviour,
    // but still restrict the result to that question's own group.
    if (requestedId) {
        const requested = all.find(q => String(q.id) === String(requestedId));

        if (requested) {
            return all.filter(q =>
                norm(q.subject) === norm(requested.subject) &&
                String(q.class) === String(requested.class) &&
                String(q.semester) === String(requested.semester) &&
                q.type !== 'math'
            );
        }

        return [];
    }

    // IMPORTANT: Never fall back to the first 12 questions.
    // An unscoped URL must not accidentally show Bengali questions.
    if (requestedSubject) {
        return all.filter(q =>
            norm(q.subject) === norm(requestedSubject) &&
            (!requestedClass || String(q.class) === String(requestedClass)) &&
            (!requestedSemester || String(q.semester) === String(requestedSemester)) &&
            q.type !== 'math'
        );
    }

    return [];
}

function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, m => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[m]));
}

function isCorrect(q) {
    return selected[q.id] !== undefined &&
        String(selected[q.id]).trim() === String(q.answer ?? '').trim();
}

fetch('Computerquestion.json')
    .then(r => {
        if (!r.ok) throw new Error('Unable to load question data');
        return r.json();
    })
    .then(data => {
        dataCache = data;
        questions = normalizeQuestions(data);
        render();
    })
    .catch(err => {
        console.error(err);
        qs('#questionArea').innerHTML =
            '<div class="empty">Question data পাওয়া যায়নি।</div>';
    });

function render() {
    if (!questions.length) {
        qs('#questionArea').innerHTML = `
            <div class="empty">
                <h3>No questions found</h3>
                <p>এই Topic-এর জন্য নির্দিষ্ট প্রশ্ন data-তে পাওয়া যায়নি।</p>
            </div>`;
        return;
    }

    const first = questions[0];

    qs('#meta').textContent =
        `Class ${first.class} · Semester ${first.semester}`;

    qs('#subjectBannerTitle').textContent = first.subject;

    const subjectImages =
        (dataCache && dataCache.subjectImages) || {};

    const topicBox =
        (dataCache?.topicBoxes || []).find(t =>
            norm(t.id) === norm(requestedTopic)
        );

    qs('#subjectBannerImage').src =
        topicBox?.image ||
        subjectImages[first.subject] ||
        'Subject.jpg';

    qs('#countBadge').textContent =
        `${questions.length} Questions`;

    qs('#questionButtons').innerHTML =
        questions.map((q, i) =>
            `<button class="q-index ${i === 0 ? 'active' : ''}"
                     onclick="focusQuestion(${i})">${i + 1}</button>`
        ).join('');

    qs('#questionArea').innerHTML =
        questions.map((q, i) => questionCard(q, i)).join('');

    updateProfile();
}

function optionClass(q, o) {
    if (selected[q.id] === undefined) return '';

    const correct =
        String(o).trim() === String(q.answer ?? '').trim();

    const chosen =
        String(selected[q.id]).trim() === String(o).trim();

    if (correct) return 'correct';
    if (chosen && !correct) return 'wrong';

    return '';
}

function questionCard(q, i) {
    const value = selected[q.id];
    const type = (q.type || 'normal').toLowerCase();
    const isMath = type === 'math';

    const opts = (q.options || []).map(o => `
        <label class="option ${value === o ? 'selected' : ''} ${optionClass(q, o)}">
            <input type="radio"
                   name="q-${esc(q.id)}"
                   ${value === o ? 'checked' : ''}
                   onchange="choose('${encodeURIComponent(q.id)}','${encodeURIComponent(o)}')">
            <span>${esc(o)}</span>
        </label>
    `).join('');

    const status =
        value === undefined
            ? ''
            : (isCorrect(q)
                ? '<span class="feedback good">✓ Correct</span>'
                : '<span class="feedback bad">✕ Wrong</span>');

    const solution =
        (isMath && revealed[q.id])
            ? `<div class="solution"><b>Solution:</b> ${esc(q.solution || `Correct answer: ${q.answer}`)}</div>`
            : '';

    const solutionButton =
        isMath
            ? `<button class="btn secondary solution-btn"
                       onclick="showSolution('${encodeURIComponent(q.id)}')">
                    ${revealed[q.id] ? 'Hide Solution' : 'Solution'}
               </button>`
            : '';

    // For normal Q&A questions with no options, show the supplied answer
    // as the answer panel without changing the existing MCQ behaviour.
    const answerPanel =
        !isMath && !(q.options || []).length
            ? `<div class="answer-panel">
                   <b>উত্তর:</b> ${esc(q.answer)}
               </div>`
            : '';

    return `<article class="question-card" id="question-${i}">
        <div class="question-head">
            <span class="q-number">Question ${i + 1}</span>
            <span class="question-status">${status}</span>
            <span class="badge">${q.marks ?? 1} Mark</span>
        </div>
        <div class="qtext">${esc(q.question)}</div>
        <div class="options">${opts}</div>
        ${answerPanel}
        ${solutionButton}
        ${solution}
    </article>`;
}

function choose(encodedId, encodedValue) {
    const id = decodeURIComponent(encodedId);
    const value = decodeURIComponent(encodedValue);

    selected[id] = value;
    render();

    const idx = questions.findIndex(q => q.id === id);
    if (idx >= 0) setTimeout(() => focusQuestion(idx), 0);
}

function showSolution(encodedId) {
    const id = decodeURIComponent(encodedId);

    revealed[id] = !revealed[id];
    render();

    const idx = questions.findIndex(q => q.id === id);
    if (idx >= 0) setTimeout(() => focusQuestion(idx), 0);
}

function focusQuestion(index) {
    const el = document.getElementById(`question-${index}`);

    if (el) {
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    qsa('.q-index').forEach((b, i) =>
        b.classList.toggle('active', i === index)
    );
}

function updateProfile() {
    const student = currentStudent();
    const name = student.name || 'Student';

    qs('#topAvatar').textContent =
        name.trim().charAt(0).toUpperCase() || 'S';
}

window.choose = choose;
window.showSolution = showSolution;
window.focusQuestion = focusQuestion;
