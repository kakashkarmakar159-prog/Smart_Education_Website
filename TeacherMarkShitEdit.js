const r=loadJSON('lastResult',null);
const teacherView=loadJSON('teacherView',false);
if(!teacherView || !r){
  alert('Teacher edit access is available only from Teacher Profile.');
  location.href='Open.html';
}else{
  qs('#topAvatar').textContent=(r.paper?.teacherName||'T').trim().charAt(0).toUpperCase()||'T';
  renderRows();
}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function renderRows(){
 qs('#rows').innerHTML=(r.details||[]).map((d,i)=>{
   const opts=(d.options||[]);
   return `<tr>
    <td>${i+1}</td>
    <td><textarea id="q-${i}" class="edit-input">${esc(d.question)}</textarea>${opts.length?`<div class="option-edit-list">${opts.map((o,j)=>`<input id="o-${i}-${j}" class="edit-input" value="${esc(o)}" placeholder="Option ${j+1}">`).join('')}</div>`:''}</td>
    <td><textarea id="a-${i}" class="edit-input">${esc(d.yourAnswer||'')}</textarea></td>
    <td><textarea id="c-${i}" class="edit-input">${esc(d.correctAnswer||'')}</textarea></td>
    <td><input id="m-${i}" class="edit-input mark-input" type="number" min="0" value="${Number(d.earned)||0}"></td>
    <td><button class="btn secondary" onclick="enableEdit(${i})">Edit</button></td>
   </tr>`;
 }).join('')||'<tr><td colspan="6" class="empty">No answer details found.</td></tr>';
}
function enableEdit(i){
 ['q','a','c','m'].forEach(k=>{const el=qs(`#${k}-${i}`);if(el){el.focus();el.classList.add('editing')}});
 qsa(`[id^="o-${i}-"]`).forEach(el=>el.classList.add('editing'));
}
function saveTeacherMarks(){
 if(!r)return;
 (r.details||[]).forEach((d,i)=>{
   d.question=qs(`#q-${i}`)?.value||d.question;
   d.yourAnswer=qs(`#a-${i}`)?.value||'';
   d.correctAnswer=qs(`#c-${i}`)?.value||d.correctAnswer;
   const m=Number(qs(`#m-${i}`)?.value); d.earned=Number.isFinite(m)?Math.max(0,m):0;
   if(d.options){d.options=d.options.map((_,j)=>qs(`#o-${i}-${j}`)?.value||'');}
 });
 r.score=(r.details||[]).reduce((a,b)=>a+(Number(b.earned)||0),0);
 r.total=(r.details||[]).reduce((a,b)=>a+(Number(b.marks)||0),0);
 r.editedByTeacher=true;r.editedAt=new Date().toLocaleString();
 saveJSON('lastResult',r);
 let rs=loadJSON('resultsLocal',[]);const ix=rs.findIndex(x=>x.id===r.id);if(ix>=0)rs[ix]=r;else rs.push(r);saveJSON('resultsLocal',rs);
 alert('Question, answers and marks saved successfully.');
 saveJSON('teacherView',true);location.href='StudentExamResult.html';
}
window.enableEdit=enableEdit;window.saveTeacherMarks=saveTeacherMarks;
