
function saveTeacher(){
 const p={teacherName:qs('#teacher').value.trim(),password:qs('#password').value.trim(),subject:qs('#subject').value.trim(),class:qs('#class').value,semester:qs('#semester').value,questions:[],status:'draft',id:'paper-'+Date.now()};
 if(!p.teacherName||!p.password||!p.subject){alert('Teacher name, password and subject are required.');return}
 saveJSON('teacherDraft',p);location.href='TeacherQuestion.html';
}
