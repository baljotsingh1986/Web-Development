//Hosting: http://52.10.150.58:3000/get

/*File Name: db.js
*Author: Baljot Singh
*Purpose: To get requests from client side to display, update, insert, delete data into
*         server side databse and send the information to client side accordingly as html page/plain text  
*/

var mySql = require('mysql');
var pool = mySql.createPool({
        host  : 'localhost',
        user  : 'user',
        password: 'password',
        database: 'mydb'
    });

var express = require('express');

var app = express();
//var bodyParser = require('body-parser');

var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(express.static('public'));

app.set('port', 3000);

//Helper Function to select data from database and build a html table
function getData(res, next, str){
    pool.query("SELECT id, name, reps, weight, date, lbs FROM workouts", function(err, rows, fields) {
        if(err) {
            next(err);
            return;
        }
        var context = {};
        var table = '<table class="table table-striped" > <tr> <th>Name</th> <th>Reps</th> <th>Weight</th> <th>Date</th> <th>lbs or kg</th><th>Action</th> </tr>';
        for (var i = 0; i < rows.length; i++){
            table += '<tr id="'+rows[i].id+'">\n';
            table += "<td>" + rows[i].name + "</td>\n";
            table += "<td>" + rows[i].reps + "</td>\n";
            table += "<td>" + rows[i].weight + "</td>\n";
            table += "<td>" + rows[i].date.toUTCString().slice(0, -13) + "</td>\n";
            table += "<td>" + rows[i].lbs + "</td>\n";
            table += '<td><input name="'+rows[i].id+'" type="button" value="Delete" class="btn btn-default" onClick="del(this.name)"><input name="'+rows[i].id+'" type="button" value="Update" class="btn btn-default" onClick="update(this.name)"></td>\n';
            table += "</tr>\n";
        }

        table += "</table>\n";
        context.result = table;
        res.render(str, context);
    });
}

//to reset the table
app.get('/reset-table',function(req,res,next){
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err){
            var createString = "CREATE TABLE workouts("+
                    "id INT PRIMARY KEY AUTO_INCREMENT,"+
                    "name VARCHAR(255) NOT NULL,"+
                    "reps INT,"+
                    "weight INT,"+
                    "date DATE,"+
                    "lbs BOOLEAN)";
            pool.query(createString, function(err){
                context.tablereset = "<p><b>Table Reset</b></p>";
                res.render('data',context);
            });
    });
});

//To insert data into table
app.get('/insert',function(req,res,next){
        pool.query("INSERT INTO workouts (name,reps,weight,date,lbs) VALUES (?,?,?,?,?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs],         function(err, result){
        if(err){
            next(err);
            return;
        }
        if(result.insertId){
            res.type('text/plain');
            id = result.insertId.toString();
            res.send(id);
        }
    });
});

//To delete row from table
app.get('/delete',function(req,res,next){
        pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
            if(err){
                next(err);
                return;
            }
            if(result){
                res.type('text/plain');
                res.send("Success");
            }
    });
});

//To update the tables
app.get('/update',function(req,res,next){
    pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs, req.query.id], function(err, result){
        if(err){
            next(err);
            return;
        }

        if(result){
            res.type('text/plain');
            res.send("Success");
        }
    });
});

//To display table
app.get('/get', function(req,res,next) {
    getData(res, next, 'home');
});

//Page not found error
app.use(function(req,res){
    res.status(404);
    res.render('404');
});

//Error for execucting querries
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

//Start app
app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

