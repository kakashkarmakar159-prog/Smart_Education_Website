
function startExam(){
 const isComputer=new URLSearchParams(location.search).get('computer')==='1';
 location.href=isComputer?'ComputerExam.html':'StudentExam.html';
}
