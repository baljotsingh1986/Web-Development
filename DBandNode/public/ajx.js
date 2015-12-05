//Helper Function to validate name, reps, weight and date
function valid(name, reps, weight, date) {   
    
    if (!name) {
       alert("Name field can not be empty");
       return false;
    }
    if (isNaN(reps) || isNaN(weight)){
       alert("Not valid number input for reps or weight");
       return false;
    }
    if(parseInt(reps) < 0 || parseInt(weight) < 0) { 
       alert("reps or weight can not be less than 0");
       return false;
    }
    var arr = date.split('-');
    if(arr.length != 3) {
      alert("Not a valid date");
      return false;
   }
   if(isNaN(arr[0]) || isNaN(arr[1]) || isNaN(arr[2])) {
      alert("Not a valid date");
      return false;
   }
   var year = parseInt(arr[0]);
   var month = parseInt(arr[1]);
   var day = parseInt(arr[2]);
   if (year > 2017 || year < 2000 || day < 1 || day > 31 || month < 1 || month >12) { 
       alert("Not a valid date");
      return false;
   }
  if (year % 4 == 0 && month == 2){
     	if (day > 29){
           alert("Not a valid date");
           return false;
        }
   }
 if (year % 4 != 0 && month == 2){
        if (day > 28){
           alert("Not a valid date");
           return false;
        }
    }
    if (month == 1 ||  month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
        if (day > 31){
           alert("Not a valid date");
           return false;
        }
    }
   if (month == 4 ||  month == 6 || month == 9 || month == 11){
        if (day > 30){
           alert("Not a valid date");
           return false;
        }
    }

  return true;
}

//Ajax call to inserts into tables
document.getElementById('newentry').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var name  = document.getElementById('name').value;
    var reps  = document.getElementById('reps').value;
    var weight  = document.getElementById('weight').value;
    var date  = document.getElementById('date').value;
    var lbs  = document.getElementById('lbs').value;

    if(!valid(name, reps, weight, date)){
      return;
    }
    if (lbs === "lbs"){
       lbs = 1;
    }
   
    else {
       var lbs = 0;
    }

    req.open('GET', 'http://52.10.150.58:3000/insert?name='+name+'&reps='+reps+'&weight='+weight+'&date='+date+'&lbs='+lbs, true);
 
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        document.getElementById('result').innerHTML = req.responseText;
      } else {
        console.log("Error in network request: " + request.statusText);
      }});
    req.send();
    event.preventDefault();
  });

function del(str){
    var req = new XMLHttpRequest();

    req.open('GET', 'http://52.10.150.58:3000/delete?id='+str, true);

    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        document.getElementById('result').innerHTML = req.responseText;
      } else {
        console.log("Error in network request: " + request.statusText);
      }});
    req.send();
    event.preventDefault();
}

//Function for Ajax call to change the row to make the row editable
function update(str){
    var req = new XMLHttpRequest();

    req.open('GET', 'http://52.10.150.58:3000/update-row?id='+str, true);

    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        document.getElementById('result').innerHTML = req.responseText;
      } else {
        console.log("Error in network request: " + request.statusText);
      }});
    req.send();
    event.preventDefault();
}

//Function to update the table
function save(str){
    var req = new XMLHttpRequest();
    var row  = document.getElementsByName("update");
    var name = row[0].value;
    var reps = row[1].value;
    var weight = row[2].value;
    var date = row[3].value;
    var lbs = row[4].value;
   
    if(!valid(name, reps, weight, date)){
      return;
    }
  
    if(isNaN(lbs)) { 
       alert("Enter 1 for lbs and 0 for kg.");
       return;
    }
    
    if(parseInt(lbs) > 1 || parseInt(lbs)<0) {
       alert("Enter 1 for lbs and 0 for kg.");
       return;
    }


    req.open('GET', 'http://52.10.150.58:3000/update?name='+name+'&reps='+reps+'&weight='+weight+'&date='+date+'&lbs='+lbs+'&id='+str, true);

    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        document.getElementById('result').innerHTML = req.responseText;
      } else {
        console.log("Error in network request: " + request.statusText);
      }});
    req.send();
    event.preventDefault();
}
