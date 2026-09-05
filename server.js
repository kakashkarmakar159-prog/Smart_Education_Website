
const express=require('express');
const fs=require('fs');
const path=require('path');
const app=express();
const PORT=process.env.PORT||3000;
const ROOT=path.join(__dirname,'..');
const DATA=path.join(ROOT,'data');
app.use(express.json({limit:'2mb'}));
app.use(express.static(ROOT));
app.get('/',(req,res)=>res.sendFile(path.join(ROOT,'Open.html')));

function readJSON(file,fallback){try{return JSON.parse(fs.readFileSync(path.join(DATA,file),'utf8'))}catch(e){return fallback}}
function writeJSON(file,obj){fs.writeFileSync(path.join(DATA,file),JSON.stringify(obj,null,2),'utf8')}

app.get('/api/teacher-papers',(req,res)=>res.json(readJSON('Teacherquestion.json',{papers:[]})));
app.get('/api/computer-questions',(req,res)=>res.json(readJSON('Computerquestion.json',{questions:[]})));

app.post('/api/save-teacher-paper',(req,res)=>{
  const p=req.body;
  if(!p || !p.id || !p.password || !p.subject || !p.class || !p.semester) return res.status(400).json({ok:false,error:'Missing required fields'});
  const data=readJSON('Teacherquestion.json',{papers:[]});
  data.papers=data.papers.filter(x=>x.id!==p.id);
  data.papers.push(p);
  writeJSON('Teacherquestion.json',data);
  res.json({ok:true,paper:p});
});

app.post('/api/save-result',(req,res)=>{
  const r=req.body;
  const data=readJSON('results.json',{results:[]});
  data.results=data.results.filter(x=>x.id!==r.id);
  data.results.push(r);
  writeJSON('results.json',data);
  res.json({ok:true});
});

app.get('/api/results',(req,res)=>res.json(readJSON('results.json',{results:[]})));

app.listen(PORT,()=>console.log(`Smart Education running at http://localhost:${PORT}`));
