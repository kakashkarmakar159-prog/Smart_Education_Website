
function saveComputer(){
 const s={name:qs('#name').value.trim(),subject:qs('#subject').value.trim(),class:qs('#class').value,semester:qs('#semester').value};
 if(!s.name||!s.subject){alert('Student name and subject are required.');return}
 saveJSON('computerStudent',s);saveJSON('currentStudent',s);location.href='ComputerHome.html';
}
