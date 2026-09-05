const s = loadJSON('computerStudent', {});

qs('#welcome').textContent =
    `Welcome ${s.name || 'Student'} • ${s.subject || 'Computer'} • Class ${s.class || ''} • Semester ${s.semester || ''}`;

function safeText(v) {
    return String(v ?? '').replace(/[&<>"']/g, m => ({
        '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
    }[m]));
}

function openProfile() {
    location.href = 'StudentProfile.html';
}

function normalizeSubject(v) {
    return String(v ?? '').trim().toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/-/g, ' ');
}

function isCommercialLaw(subject) {
    const n = normalizeSubject(subject);
    return n === 'commercial law';
}

function renderCommercialLaw(d) {
    const boxes = Array.isArray(d.topicBoxes) ? d.topicBoxes : [];
    const host = qs('#subjects');

    const matching = boxes.filter(t =>
        normalizeSubject(t.subject || 'COMMERCIAL LAW') === 'commercial law' &&
        String(t.class || '12') === String(s.class || '12') &&
        String(t.semester || '3') === String(s.semester || '3')
    );

    host.innerHTML = matching.map(t => `
        <a class="computer-tile"
           href="ComputerQuestion.html?topic=${encodeURIComponent(t.id)}&subject=${encodeURIComponent('COMMERCIAL LAW')}&class=${encodeURIComponent(s.class || '12')}&semester=${encodeURIComponent(s.semester || '3')}">
            <img class="tile-photo"
                 src="${safeText(t.image)}"
                 alt="${safeText(t.title)}"
                 onerror="this.onerror=null;this.src='Subject.jpg'">
            <div class="tile-info">
                <span class="tile-title">${safeText(t.title)}</span>
                <span class="tile-meta">Class ${safeText(s.class || '12')} · Semester ${safeText(s.semester || '3')}</span>
                <span class="tile-count">Questions ${safeText(t.questionStart)}–${safeText(t.questionEnd)}</span>
            </div>
        </a>
    `).join('') || '<div class="empty">No Commercial Law topics found.</div>';

    updateProfile();
    applySearch();
}

function renderGroups(groups, images) {
    qs('#subjects').innerHTML = groups.map(({sub, cl, sem, arr}) => {
        const img = images[sub] || 'Subject.jpg';
        const href = arr[0].type === 'math' ? 'ComputerMathQuestion.html' : 'ComputerQuestion.html';
        return `<a class="computer-tile" href="${href}?id=${encodeURIComponent(arr[0].id)}">
            <img class="tile-photo" src="${img}" alt="${safeText(sub)} subject photo">
            <div class="tile-info">
                <span class="tile-title">${safeText(sub)}</span>
                <span class="tile-meta">Class ${safeText(cl)} · Semester ${safeText(sem)}</span>
                <span class="tile-count">${arr.length} questions</span>
            </div>
        </a>`;
    }).join('') || '<div class="empty">No matching computer questions.</div>';

    updateProfile();
    applySearch();
}

function updateProfile() {
    const student = currentStudent();
    const name = student.name || s.name || 'S';
    qs('#topAvatar').textContent = name.trim().charAt(0).toUpperCase() || 'S';
}

function applySearch() {
    const input = qs('#topicSearch');
    if (!input) return;

    input.oninput = () => {
        const v = input.value.toLowerCase().trim();
        qsa('.computer-tile').forEach(x => {
            x.style.display =
                (!v || x.textContent.toLowerCase().includes(v))
                    ? 'block'
                    : 'none';
        });
    };
}

fetch('Computerquestion.json')
    .then(r => {
        if (!r.ok) throw new Error('Unable to load question data');
        return r.json();
    })
    .then(d => {
        if (isCommercialLaw(s.subject)) {
            renderCommercialLaw(d);
            return;
        }

        const groups = {};
        (d.questions || [])
            .filter(q =>
                (!s.subject || normalizeSubject(q.subject) === normalizeSubject(s.subject)) &&
                (!s.class || String(q.class) === String(s.class)) &&
                (!s.semester || String(q.semester) === String(s.semester))
            )
            .forEach(q => {
                const k = `${q.subject}|${q.class}|${q.semester}`;
                (groups[k] ??= []).push(q);
            });

        renderGroups(
            Object.entries(groups).map(([k, arr]) => {
                const [sub, cl, sem] = k.split('|');
                return {sub, cl, sem, arr};
            }),
            d.subjectImages || {}
        );
    })
    .catch(err => {
        console.error(err);
        qs('#subjects').innerHTML =
            '<div class="empty">Question data পাওয়া যায়নি।</div>';
    });
