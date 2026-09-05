let paper=loadJSON('teacherDraft',null);let idx=0;let qsStore=[];
if(!paper){location.href='TeacherSave.html'}else{qsStore=paper.questions||[];qs('#paperMeta').textContent=`${paper.teacherName} • ${paper.subject} • Class ${paper.class} • Semester ${paper.semester}`;renderList();load()}
function blank(){return {id:'q-'+Date.now()+Math.random().toString(16).slice(2),type:'mcq',question:'',options:['','','',''],answer:'',marks:1,time:5}}
function current(){return qsStore[idx]||blank()}
function renderList(){qs('#qList').innerHTML=qsStore.map((q,i)=>`<button class="${i===idx?'active':''}" onclick="gotoQuestion(${i})">Q ${i+1}<br><small>${q.type||'mcq'}</small></button>`).join('')+`<button onclick="addQuestion()">＋ Add</button>`}
function load(){const q=current();qs('#counter').textContent=`Question ${idx+1}`;qs('#type').value=q.type||'mcq';qs('#question').value=q.question||'';qs('#marks').value=q.marks||1;qs('#time').value=q.time||5;typeChanged(true)}
function typeChanged(skip=false){const type=qs('#type').value;const q=current();let html='';if(type==='mcq'){const opts=q.options?.length===4?q.options:['','','',''];html=`<h4>MCQ Options</h4>${opts.map((o,i)=>`<div class="field"><label>Option ${String.fromCharCode(65+i)}</label><input class="opt" data-i="${i}" value="${esc(o)}"></div>`).join('')}<div class="field"><label>Correct Option</label><select id="answer">${opts.map((o,i)=>`<option value="${i}" ${q.answer===o||q.answer===i?'selected':''}>${String.fromCharCode(65+i)}</option>`).join('')}</select></div>`}
else if(type==='truefalse'){html=`<h4>True / False</h4><div class="field"><label>Correct Answer</label><select id="answer"><option ${String(q.answer).toLowerCase()==='true'?'selected':''}>True</option><option ${String(q.answer).toLowerCase()==='false'?'selected':''}>False</option></select></div>`}
else if(type==='fillblank'){html=`<h4>Fill in the blank</h4><div class="notice">Use ______ in the question where the blank should appear.</div><div class="field"><label>Correct Answer</label><input id="answer" value="${esc(q.answer||'')}"></div>`}
else {html=`<h4>${type==='short'?'Short Answer':'Long Answer'}</h4><div class="field"><label>Model / Correct Answer</label><textarea id="answer">${esc(q.answer||'')}</textarea></div>`}
qs('#typeEditor').innerHTML=html;if(!skip)renderList()}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function collect(){let q=current();q.type=qs('#type').value;q.question=qs('#question').value.trim();q.marks=Number(qs('#marks').value)||1;q.time=Number(qs('#time').value)||5;if(q.type==='mcq'){q.options=qsa('.opt').map(x=>x.value.trim());const ai=Number(qs('#answer').value);q.answer=q.options[ai]||''}else{q.options=[];q.answer=qs('#answer').value.trim()}q.id=q.id||'q-'+Date.now();qsStore[idx]=q}
function gotoQuestion(i){collect();idx=i;load();renderList()}
function addQuestion(){collect();qsStore.push(blank());idx=qsStore.length-1;load();renderList()}
function backQuestion(){collect();if(idx>0){idx--;load();renderList()}}
function nextQuestion(){collect();if(idx===qsStore.length-1)qsStore.push(blank());idx++;load();renderList()}
function saveQuestion(){collect();paper.questions=qsStore.filter(q=>q.question);saveJSON('teacherDraft',paper);location.href='TeacherPabliest.html'}
