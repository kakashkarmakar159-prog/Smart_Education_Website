
const r=loadJSON('lastResult',null);
if(r){qs('#meta').textContent=`${r.student.name} • ${r.paper.subject} • ${r.date}`;
qs('#rows').innerHTML=r.details.map((d,i)=>`<tr><td>${i+1}</td><td>${d.question}</td><td>${d.yourAnswer||'Not answered'}</td><td>${d.correctAnswer}</td><td class="mark ${d.earned===d.marks?'good':'bad'}">${d.earned}/${d.marks}</td></tr>`).join('')}
