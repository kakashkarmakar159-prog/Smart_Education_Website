const p=loadJSON('teacherDraft',null);
qs('#name').textContent=p?.teacherName||'Teacher Profile';
qs('#avatar').textContent=(p?.teacherName||'T')[0].toUpperCase();
qs('#topAvatar').textContent=(p?.teacherName||'T')[0].toUpperCase();
qs('#details').textContent=p?`${p.subject} • Class ${p.class} • Semester ${p.semester}`:'';

fetch('Teacherquestion.json').then(r=>r.json()).then(d=>{
  const papers=d.papers||[];
  const rs=loadJSON('resultsLocal',[]);
  qs('#papers').innerHTML=papers.map(x=>{
    const rr=rs.filter(r=>r.paper?.id===x.id);
    return `<section class="card teacher-paper-card">
      <div class="question-head"><div><b>${esc(x.subject)}</b><div class="sub">${esc(x.teacherName)} • Class ${esc(x.class)} • Semester ${esc(x.semester)}</div></div><span class="badge">${esc(x.status||'draft')}</span></div>
      <p class="sub"><b>${x.questions.length}</b> questions · <b>${rr.length}</b> student result(s)</p>
      <div class="teacher-result-list">
        ${rr.map(r=>`<div class="teacher-result-row"><div><b>${esc(r.student?.name||'Student')}</b><div class="sub">${esc(r.date||'')} · ${r.score}/${r.total}</div></div><div class="actions compact-actions"><button class="btn secondary" onclick="viewResult('${encodeURIComponent(r.id)}')">Result</button><button class="btn" onclick="editResult('${encodeURIComponent(r.id)}')">Edit</button></div></div>`).join('')||'<span class="sub">No local result yet.</span>'}
      </div>
    </section>`;
  }).join('')||'<div class="empty">No question papers.</div>';
}).catch(()=>qs('#papers').innerHTML='<div class="empty">Question papers could not be loaded.</div>');

function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function viewResult(encoded){const id=decodeURIComponent(encoded);saveJSON('lastResult',loadJSON('resultsLocal',[]).find(r=>r.id===id));saveJSON('teacherView',true);location.href='StudentExamResult.html'}
function editResult(encoded){const id=decodeURIComponent(encoded);const r=loadJSON('resultsLocal',[]).find(x=>x.id===id);if(!r)return;saveJSON('lastResult',r);saveJSON('teacherView',true);location.href='TeacherMarkShitEdit.html'}
window.viewResult=viewResult;window.editResult=editResult;
