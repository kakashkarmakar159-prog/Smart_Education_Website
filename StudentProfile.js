const s=currentStudent();
const name=s.name||'Student';
qs('#avatar').textContent=name.trim().charAt(0).toUpperCase()||'S';
qs('#topAvatar').textContent=name.trim().charAt(0).toUpperCase()||'S';
qs('#name').textContent=name;
qs('#details').textContent=s.name?`Class ${s.class||''} • Semester ${s.semester||''} • Stay curious, keep learning!`:'Stay curious, keep learning!';
const all=loadJSON('resultsLocal',[]);
const teacherPaperId=loadJSON('teacherPaperId',null), teacherView=loadJSON('teacherView',false);
const rs=teacherPaperId&&teacherView?all.filter(r=>r.paper?.id===teacherPaperId):all.filter(r=>r.student?.name===name);
const iconMap={Mathematics:'Mathematics.jpg',Physics:'Subject.jpg',Chemistry:'Subject.jpg',Bengali:'Bengali.jpg',English:'English.jpg','Computer Science':'Computer.jpg',Computer:'Computer.jpg',Accountancy:'Accountancy.jpg'};
function grade(p){return p>=90?'A':p>=80?'B':p>=70?'C':'D'}
function render(){
 const rows=rs.slice().reverse();
 qs('#history').innerHTML=rows.length?rows.map(r=>{const p=r.total?Math.round(r.score/r.total*100):0,g=grade(p),sub=r.paper?.subject||'Subject';return `<div class="result-row"><div class="subject-cell"><img class="subject-icon" src="${iconMap[sub]||'Subject.jpg'}" alt=""><span>${sub}</span></div><div class="score-wrap"><div class="scorebar"><span style="width:${Math.min(p,100)}%;background:${p>=90?'#2878c9':p>=80?'#e6ae24':p>=70?'#42a665':'#d94a48'}"></span></div><b class="score-num">${r.score}</b></div><span class="grade-pill grade-${g}">${g}</span><button class="preview-btn" onclick="viewResult('${r.id}')">Preview</button></div>`}).join(''):`<div class="empty">No exam results yet.</div>`;
 qs('#graph').innerHTML=rows.length?rows.slice(0,8).reverse().map((r,i)=>{const p=r.total?Math.round(r.score/r.total*100):0;return `<div class="graph-item"><div class="graph-score">${p}</div><div class="graph-bar" style="height:${Math.max(10,Math.min(100,p))}%"></div><div class="graph-label">${i+1}</div></div>`}).join(''):`<div class="empty" style="width:100%">Exam marks will appear here after submission.</div>`;
 if(teacherView&&teacherPaperId) qs('#details').textContent='Teacher Result View';
}
function viewResult(id){const r=all.find(x=>x.id===id);if(r){saveJSON('lastResult',r);location.href='StudentExamResult.html'}}
window.viewResult=viewResult;render();
