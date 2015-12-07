/*File Name: ajx.js
*Author: Baljot Singh
*Purpose: To send ajax requests to server from client side to update, insert, delete data from
*         server side databse and update the client page accordingly
*/

//Helper Function to validate name, reps, weight and date
function valid(name, reps, weight, date) {
    if (!name || !reps || !weight) {
        alert("Empty fields are not allowed");
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

//helper function to retrace table back to cells to display values from input
//Takes an array of html elements with name value as 'update'
function reTrace(oldInputs){
    var id2;
    var len = oldInputs.length;
    var arr = []; //Empty array to add values of input

    //If there is not elemenet of name value update this loop will not execute len will be 0
    for (var i = 0; i < len; i++){
        var val = oldInputs[i].getAttribute('preval');
        arr.push(val);

        //If it is end of old inputs change the button in next cell
        if (i == (len-1)){
            var par = oldInputs[i].parentElement;
            var nex = par.nextElementSibling;
            var child = nex.childNodes;
            id2 = child[0].getAttribute('name');
            nex.removeChild(child[0]);

            var newInput = document.createElement('input');
            newInput.setAttribute('name', id2);
            newInput.setAttribute('type','button');
            newInput.setAttribute('value', 'Delete');
            newInput.setAttribute('class','btn btn-default');
            newInput.setAttribute('onClick', 'del(this.name)');
            nex.appendChild(newInput);

            var newInput = document.createElement('input');
            newInput.setAttribute('name', id2);
            newInput.setAttribute('type','button');
            newInput.setAttribute('value', 'Update');
            newInput.setAttribute('class','btn btn-default');
            newInput.setAttribute('onClick', 'update(this.name)');
            nex.appendChild(newInput);

            //Change the cells from input to show text
            id2 = id2.trim();
            var oldRow = document.getElementById(id2).getElementsByTagName('td');
            for (var i = 0; i < arr.length; i++){
                if(i == 3){
                    d = new Date(arr[i]);
                    oldRow[i].textContent = d.toUTCString().slice(0, -13);
                }

                else{
                    oldRow[i].textContent = arr[i];
                }
            }
        }
    }
}

//Takes an array of html elements with name value as 'update'
function changee(oldInputs){
    var id2;
    var len = oldInputs.length;
    var arr = []; //Empty array to add values of input

    //If there is not elemenet of name value update this loop will not execute len will be 0
    for (var i = 0; i < len; i++){
        var val = oldInputs[i].value;
        arr.push(val);

        //If it is end of old inputs change the button in next cell
        if (i == (len-1)){
            var par = oldInputs[i].parentElement;
            var nex = par.nextElementSibling;
            var child = nex.childNodes;
            id2 = child[0].getAttribute('name');
            nex.removeChild(child[0]);

            var newInput = document.createElement('input');
            newInput.setAttribute('name', id2);
            newInput.setAttribute('type','button');
            newInput.setAttribute('value', 'Delete');
            newInput.setAttribute('class','btn btn-default');
            newInput.setAttribute('onClick', 'del(this.name)');
            nex.appendChild(newInput);
 var newInput = document.createElement('input');
            newInput.setAttribute('name', id2);
            newInput.setAttribute('type','button');
            newInput.setAttribute('value', 'Update');
            newInput.setAttribute('class','btn btn-default');
            newInput.setAttribute('onClick', 'update(this.name)');
            nex.appendChild(newInput);

            //Change the cells from input to show text
            id2 = id2.trim();
            var oldRow = document.getElementById(id2).getElementsByTagName('td');
            for (var i = 0; i < arr.length; i++){
                if(i == 3){
                    d = new Date(arr[i]);
                    oldRow[i].textContent = d.toUTCString().slice(0, -13);
                }

                else{
                    oldRow[i].textContent = arr[i];
                }
            }
        }
    }
}

//Function to make the selcted row editable by user
function update(str){

    //If there is row already selected for editing
    var oldInputs = document.getElementsByName('update');  //Get the row cells which are editable
    reTrace(oldInputs);  //Call the function to change the row from taking input from user to display data

    var id = str.trim();

    var row = document.getElementById(id);
    var cells = row.getElementsByTagName('td');

    //For loop to change the row to editable
    for (var i = 0; i < cells.length - 1; i++){
        var newInputElement = document.createElement('input');
        newInputElement.setAttribute('name', 'update');
        newInputElement.setAttribute('class','form-control');

        if(i == 3){
            var d = new Date(cells[i].textContent + " 00:00:00");
            var day = d.getDate();
            var year = d.getFullYear();
            var month = d.getMonth() + 1;
            var date = year+'-'+month+'-'+day;
            cells[i].textContent = "YYYY-MM-DD";
 newInputElement.setAttribute('value', date);
            newInputElement.setAttribute('preval', date);
            cells[i].appendChild(newInputElement);

        }

        else{
            var val = cells[i].textContent;
            cells[i].textContent = "";
            newInputElement.setAttribute('preval',val);
            newInputElement.setAttribute('value', val);
            cells[i].appendChild(newInputElement);
        }

    } //End of for loop

    //Change the button for last cell
    cells[cells.length-1].textContent = "";
    var newInputElement = document.createElement('input');
    newInputElement.setAttribute('name', id);
    newInputElement.setAttribute('type', 'button');
    newInputElement.setAttribute('value', 'Save');
    newInputElement.setAttribute('class', 'btn btn-default');
    newInputElement.setAttribute('onClick', 'save(this.name)');
    cells[cells.length-1].appendChild(newInputElement);
}

//Ajax call to inserts into tables
document.getElementById('newentry').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var name  = document.getElementById('name').value.trim();
    var reps  = document.getElementById('reps').value.trim();
    var weight  = document.getElementById('weight').value.trim();
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
        //If request is successfull create a row in table on client side
        if(req.status >= 200 && req.status < 400){
            var id = req.responseText;  //Get the id of inserted row as reponse from server as plain text

            arr = [];
            arr.push(name);
            arr.push(reps);
            arr.push(weight);
            arr.push(date);
            arr.push(lbs);

            var row = document.createElement('tr'); //Create html element for new row
            row.setAttribute('id',id);  //Set attribute to id

            for(var i = 0; i < arr.length; i++){
                var cell = document.createElement('td');
                if (i == 3){
                    d = new Date(arr[i]);
                    cell.textContent = d.toUTCString().slice(0, -13);
                }

                else{
                    cell.textContent = arr[i];
                }
                row.appendChild(cell);
            }
            //Create last cell in row to hold update and delete buttons
            var cell = document.createElement('td');
            var newInput = document.createElement('input');
            newInput.setAttribute('name', id);
            newInput.setAttribute('type','button');
            newInput.setAttribute('value', 'Delete');
            newInput.setAttribute('class','btn btn-default');
            newInput.setAttribute('onClick', 'del(this.name)');
            cell.appendChild(newInput);

            var newInput = document.createElement('input');
            newInput.setAttribute('name', id);
            newInput.setAttribute('type','button');
            newInput.setAttribute('value', 'Update');
            newInput.setAttribute('class','btn btn-default');
            newInput.setAttribute('onClick', 'update(this.name)');
            cell.appendChild(newInput);
            row.appendChild(cell);

            //As there is only one table get the parent of rows and append new row to it
            var rows = document.getElementsByTagName('tr');
            rows[0].parentElement.appendChild(row);

        } else {
            console.log("Error in network request: " + req.statusText);
        }});

    req.send();
    event.preventDefault();
});

//funtion for ajax call to delete row from database and table
function del(str){
    //get the parent of row which is going to get deleted
    var row = document.getElementById(str.trim());
    var par = row.parentNode;

    var req = new XMLHttpRequest();

    req.open('GET', 'http://52.10.150.58:3000/delete?id='+str, true);

    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
             par.removeChild(row);  //If request is succesfull delete the row from client side
        } else {
            console.log("Error in network request: " + req.statusText);
        }});

    req.send();
    event.preventDefault();
}

//Function to save the table
function save(str){
    var req = new XMLHttpRequest();
    var row  = document.getElementsByName("update");
    var name = row[0].value.trim();
    var reps = row[1].value.trim();
    var weight = row[2].value.trim();
    var date = row[3].value.trim();
    var lbs = row[4].value.trim();

    if(!valid(name, reps, weight, date)){
        return;
    }

    if(!lbs) {
        alert("Enter 1 for lbs and 0 for kg.");
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
    var change = false;

    //Check if any value is changed by user
    for (var i = 0; i < row.length; i++){
        var prev = row[i].getAttribute('preval');
        var val = row[i].value;
        if(prev != val){
            change =true;
            break;
        }
    }

    //If date is not change by user just save as it is and return no need to call server
    if(!change){
        reTrace(row);
        return;
    }

    //Other wise call server to update and change after
    req.open('GET', 'http://52.10.150.58:3000/update?name='+name+'&reps='+reps+'&weight='+weight+'&date='+date+'&lbs='+lbs+'&id='+str, true);

    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
            changee(row);
        } else {
            console.log("Error in network request: " + req.statusText);
        }});
    req.send();
    event.preventDefault();
}                    
