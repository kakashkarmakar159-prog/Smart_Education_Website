const r=loadJSON('lastResult',null);
function grade(p){return p>=90?'A':p>=80?'B':p>=70?'C':'D'}
if(!r){qs('#meta').textContent='No result found.'}
else{
 const p=r.total?Math.round(r.score/r.total*100):0; const g=grade(p); const studentName=r.student?.name||'Student';
 qs('#topAvatar').textContent=studentName.trim().charAt(0).toUpperCase()||'S';
 qs('#examTitle').textContent=`Class ${r.paper?.class||''} ${r.paper?.semester?'semester '+r.paper.semester:''} ${r.paper?.subject||'Exam'}`;
 qs('#meta').textContent=`Test Attempted on ${r.date||'—'}`;
 qs('#scoreMain').textContent=r.score;qs('#totalMain').textContent='/'+r.total;qs('#percentageMain').textContent=p+'%';qs('#score').textContent=r.score;qs('#total').textContent=r.total;qs('#percentage').textContent=p+'%';qs('#gradeMain').textContent=g;qs('#rank').textContent=p>=90?'Top 5%':p>=80?'Top 15%':'—';
 const details=r.details||[];const correct=details.filter(d=>d.earned===d.marks&&d.yourAnswer!=='').length;const attempted=details.filter(d=>d.yourAnswer!=='').length;const incorrect=attempted-correct;const unattempted=Math.max(0,details.length-attempted);
 qs('#correct').textContent=correct;qs('#incorrect').textContent=incorrect;qs('#unattempted').textContent=unattempted;qs('#correctPct').textContent=(details.length?Math.round(correct/details.length*100):0)+'%';qs('#incorrectPct').textContent=(details.length?Math.round(incorrect/details.length*100):0)+'%';qs('#unattemptedPct').textContent=(details.length?Math.round(unattempted/details.length*100):0)+'%';
 qs('#subSubject').textContent=r.paper?.subject||'—';qs('#subTotal').textContent=r.total;qs('#subObtained').textContent=r.score;qs('#subPercentage').textContent=p+'%';qs('#subPerformance').textContent=p>=90?'Excellent':p>=80?'Very Good':p>=70?'Good':'Needs Improvement';
 qs('.score-ring').style.background=`conic-gradient(#22a363 0 ${Math.min(100,p)}%,#e4e6ed ${Math.min(100,p)}% 100%)`;
}
function openResultPreview(){if(loadJSON('teacherView',false))location.href='TeacherMarkShitEdit.html';else location.href='StudentMarkShit.html'}
window.openResultPreview=openResultPreview;
