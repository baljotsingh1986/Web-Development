/*Function to inform user about the actio*/
function inform(msg) {
    var div = document.getElementById("table"), text = document.createElement("p");
    div.style.position = "relative";
    div.style.marginTop = "20px";
    text.style.textAlign = "center";
    text.style.border = "none";
    text.style.backgroundColor = "transparent";
    text.style.color = "saddlebrown";
    text.style.fontSize = "1em";
    text.style.fontFamily = '"Lucida" Grande, sans-serif';
    text.style.width = "auto";
    text.textContent = msg;
    div.appendChild(text);
}

/*Function to build a table with results*/
function buildTable(allData, Originalnumbers, sorted) {
    var newTable = document.createElement("table"), div = document.getElementById("table"), msg = "Data set you entered: ", i; 
    for (i = 0; i < Originalnumbers.length; i++) {
        msg += Originalnumbers[i];
        if (i < Originalnumbers.length - 1) {
            msg += ', ';
        }
    }
    inform(msg);
    msg = "Data set in order: "; 
    for (i = 0; i < sorted.length; i++) {
        msg += sorted[i];
        if (i < sorted.length - 1) {
            msg += ', ';
        }
    }
    inform(msg);
    var row = document.createElement("tr"), cell = document.createElement("th");
    cell.setAttribute("colspan", "2")
    cell.textContent = "Results";
    row.appendChild(cell);
    newTable.appendChild(row);
    for (var prop in allData) {
        row = document.createElement("tr");
        cell = document.createElement("td");
        cell.textContent = prop;
        row.appendChild(cell);
        cell = document.createElement("td");
        cell.textContent = allData[prop];
        row.appendChild(cell);
        newTable.appendChild(row);
    }
    div.appendChild(newTable);
}

/*Function to get mean of data*/
function getMean(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return (sum/arr.length).toFixed(4);
}

/*Function to get median of data*/
function getMedian(arr) {
    var index;
    if(arr.length % 2 === 0) {
        index = arr.length/2;
        return (arr[index] + arr[index -1])/2;
    }
    
    else {
        index = (arr.length - 1)/2
        return arr[index];
    }
}

/*Function to get variance of data*/
function getVariance(arr, mean, denominator) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += Math.pow((arr[i] - mean), 2);
    }
    return (sum/denominator).toFixed(4);
}

/*Function to get deviation of data*/
function getDeviation(variance) {
    return (Math.sqrt(variance)).toFixed(4);
}

/*Function to get mode of data*/
function getMode(arr) {
    var modeArr = [], count = 0, initialVal = arr[0], maxCount = 0;
    
    for(var i = 1; i < arr.length; i++) {
        if(arr[i] !== initialVal) {
            initialVal = arr[i];
            if (count > maxCount) {
                maxCount = count;
            }
            count = 0;
        }
        
        else {
            count++;
            if(count > maxCount) {
                modeArr = [];
                modeArr.push(arr[i]);
            }
            
            else if (maxCount !== 0 && maxCount === count) {
                modeArr.push(arr[i]);
            }
        }
    }
    return modeArr;
}

/*Function to calculate all results*/
function calculate(){
    var div = document.getElementById("table"), numberData = [], dataElement, data, arrData, originalData = [], allCalc = {}, option = document.getElementById("options"),
        optionVal, mode = [];
    div.textContent = "";
    dataElement = document.getElementById("data");
    data = dataElement.value.trim();
    if (!data) {
        inform("Please enter some data first");
        return;
    }
    arrData = data.split(',');
    for (var i = 0; i < arrData.length; i++) {
        if (isNaN(arrData[i])) {
            inform("Please enter valid data");
            return;
        }
        
        else if(arrData[i] != "") {
            numberData.push(Number(arrData[i]));
        }
    }
    originalData = numberData.slice();
    numberData.sort(function(a,b){return a-b;});
    allCalc.Minimum = numberData[0];
    allCalc.Maximum = numberData[numberData.length - 1];
    allCalc.Range = allCalc.Maximum - allCalc.Minimum;
    allCalc.Count = numberData.length;
    allCalc.Mean = getMean(numberData);
    allCalc.Median = getMedian(numberData);
    optionVal = option.value;
    if (optionVal === "Population") {
        allCalc.Variance = getVariance(numberData, allCalc.Mean, numberData.length);
    }
    
    else if (optionVal == "Sample") {
        allCalc.Variance = getVariance(numberData, allCalc.Mean, numberData.length - 1);
    }
    allCalc.StandardDeviation = getDeviation(allCalc.Variance);
    mode = getMode(numberData);
    allCalc.Mode = (mode.length == 0) ? "No Mode":mode;
    buildTable(allCalc, originalData, numberData);
}

function trig(){
    document.getElementById("input").addEventListener("click", calculate, false);
}

document.addEventListener("DOMContentLoaded", trig, false);
