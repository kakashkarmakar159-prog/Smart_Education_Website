function saveStudent(){
 const s={name:qs('#name').value.trim(),password:qs('#password').value.trim(),class:qs('#class').value,semester:qs('#semester').value};
 if(!s.name||!s.password){alert('Student name and teacher password are required.');return}
 saveJSON('currentStudent',s);
 const localPapers=loadJSON('publishedPapers',[]);
 fetch('data/Teacherquestion.json')
  .then(r=>{if(!r.ok)throw new Error('Question data not found');return r.json()})
  .then(d=>{
   const base=Array.isArray(d?.papers)?d.papers:[];
   const papers=[...base,...(Array.isArray(localPapers)?localPapers:[])];
   const p=papers.find(x=>x.status==='published'&&String(x.password).trim()===String(s.password).trim()&&String(x.class).trim()===String(s.class).trim()&&String(x.semester).trim()===String(s.semester).trim());
   if(p){saveJSON('currentPaper',p);location.href='ExamRules.html'}
   else alert('No published question paper matched this password, class and semester.');
  })
  .catch(err=>alert('Question paper data could not be loaded. Please check the published paper and try again.'))
}