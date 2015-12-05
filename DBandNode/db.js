// http://52.10.150.58:3000/get

var mySql = require('mysql');
var pool = mySql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

var express = require('express');

var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('port', 3000);

app.get('/reset-table',function(req,res,next){
   
   var context = {};
   var handlebars = require('express-handlebars').create({defaultLayout:'main'});

    app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');

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
      res.render('home',context);
    })
  });
});

app.get('/insert',function(req,res,next){

var handlebars = require('express-handlebars').create({defaultLayout:'doc'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

  var context = {};
  pool.query("INSERT INTO workouts (name,reps,weight,date,lbs) VALUES (?,?,?,?,?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){
    if(err){
      next(err);
      return;
    }
   pool.query("SELECT id, name, reps, weight, date, lbs FROM workouts", function(err, rows, fields){
                                if(err) {
                                        next(err);
                                        return;
                                }
                                var table = '<table class="table table-striped" > <tr> <th>Name</th> <th>Reps</th> <th>Weight</th> <th>Date</th> <th>lbs or kg</th><th>Action</th> </tr>';
                               
                                for (var i = 0; i < rows.length; i++){
                                        table += '<tr id="'+rows[i].id+'">\n';
                                        table += "<td>" + rows[i].name + "</td>\n";
                                        table += "<td>" + rows[i].reps + "</td>\n";
                                        table += "<td>" + rows[i].weight + "</td>\n";
                                        table += "<td>" + rows[i].date.toDateString() + "</td>\n";
                                        table += "<td>" + rows[i].lbs + "</td>\n";
                                        table += '<td><input name="'+rows[i].id+'" type="button" value="Delete" class="btn btn-default" onClick="del(this.name)"><input name="'+rows[i].id+' "type="button" value="Update" class="btn btn-default" onClick="update(this.name)"></td>\n';
                                        table += "</tr>\n";
                                }
				table += "</table>\n";
                                context.result = table;
                                res.render('data',context);
                        });
 });
});

app.get('/update-row',function(req,res,next){
 
  var handlebars = require('express-handlebars').create({defaultLayout:'doc'});

  app.engine('handlebars', handlebars.engine);
  app.set('view engine', 'handlebars');
 
  var context = {};
  pool.query("SELECT id, name, reps, weight, date, lbs FROM workouts", function(err, rows, fields){
                                if(err) {
                                        next(err);
                                        return;
                                }
				var id=req.query.id;
                                var table = '<table class="table table-striped" > <tr> <th>Name</th> <th>Reps</th> <th>Weight</th> <th>Date</th> <th>lbs or kg</th><th>Action</th> </tr>';
                                for (var i = 0; i < rows.length; i++){
					if(id == rows[i].id){
						
						var day =rows[i].date.getDate();
						var year =rows[i].date.getFullYear();
						var month = rows[i].date.getMonth() + 1;
						var date = year+'-'+month+'-'+day;
					
						table += '<tr id="'+rows[i].id+'">\n';
                                        	table += '<td><input name="update" type="text" value=' + rows[i].name + ' class="form-control"></td>\n';
						table += '<td><input name="update" type="text" value=' + rows[i].reps + ' class="form-control"></td>\n';
						table += '<td><input name="update" type="text" value=' + rows[i].weight + ' class="form-control"></td>\n';
						table += '<td>YYYY-MM-DD<input name="update" type="text" value="' + date + '"  class="form-control"></td>\n';
						table += '<td><input name="update" type="text" value=' + rows[i].lbs + ' class="form-control"></td>\n';
                                        	table += '<td><input name="'+rows[i].id+' "type="button" value="Save" class="btn btn-default" onClick="save(this.name)"></td>\n';
                                        	table += "</tr>\n";

					} else {
					
                                        	table += '<tr id="'+rows[i].id+'">\n';
                                        	table += "<td>" + rows[i].name + "</td>\n";
                                        	table += "<td>" + rows[i].reps + "</td>\n";
                                        	table += "<td>" + rows[i].weight + "</td>\n";
                                        	table += "<td>" + rows[i].date.toDateString() + "</td>\n";
                                        	table += "<td>" + rows[i].lbs + "</td>\n";
                                        	table += '<td><input name="'+rows[i].id+'" type="button" value="Delete" class="btn btn-default" onClick="del(this.name)"><input name="'+rows[i].id+' "type="button" value="Update" class="btn btn-default" onClick="update(this.name)"></td>\n';
                                        	table += "</tr>\n";
                                	}
				}
                                table += "</table>\n";
                                context.result = table;
                                res.render('data',context);
				return;
                        });
});

app.get('/delete',function(req,res,next){
  
  var context = {};
  var handlebars = require('express-handlebars').create({defaultLayout:'doc'});

  app.engine('handlebars', handlebars.engine);
  app.set('view engine', 'handlebars');

  pool.query("DELETE FROM workouts WHERE id=?", [req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    
     pool.query("SELECT id, name, reps, weight, date, lbs FROM workouts", function(err, rows, fields){
                                if(err) {
                                        next(err);
                                        return;
                                }
                                var table = '<table class="table table-striped" > <tr> <th>Name</th> <th>Reps</th> <th>Weight</th> <th>Date</th> <th>lbs or kg</th><th>Action</th> </tr>';
                                
                                for (var i = 0; i < rows.length; i++){
                                        table += '<tr id="'+rows[i].id+'">\n';
                                        table += "<td>" + rows[i].name + "</td>\n";
                                        table += "<td>" + rows[i].reps + "</td>\n";
                                        table += "<td>" + rows[i].weight + "</td>\n";
                                        table += "<td>" + rows[i].date.toDateString() + "</td>\n";
                                        table += "<td>" + rows[i].lbs + "</td>\n";
                                        table += '<td><input name="'+rows[i].id+'" type="button" value="Delete" class="btn btn-default" onClick="del(this.name)"><input name="'+rows[i].id+' "type="button" value="Update" class="btn btn-default" onClick="update(this.name)"></td>\n';
                                        table += "</tr>\n";
                                }
                                table += "</table>\n";
                                context.result = table;
                                res.render('data',context);
                        });

  });
});

app.get('/update',function(req,res,next){
  var context = {};
  var handlebars = require('express-handlebars').create({defaultLayout:'doc'});

  app.engine('handlebars', handlebars.engine);
  app.set('view engine', 'handlebars');


  pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs, req.query.id], function(err, result){
    if(err){
      next(err);
      return;
    }

     pool.query("SELECT id, name, reps, weight, date, lbs FROM workouts", function(err, rows, fields){
                                if(err) {
                                        next(err);
                                        return;
                                }
                                var table = '<table class="table table-striped" > <tr> <th>Name</th> <th>Reps</th> <th>Weight</th> <th>Date</th> <th>lbs or kg</th><th>Action</th> </tr>';
                               
                                for (var i = 0; i < rows.length; i++){
                                        table += '<tr id="'+rows[i].id+'">\n';
                                        table += "<td>" + rows[i].name + "</td>\n";
                                        table += "<td>" + rows[i].reps + "</td>\n";
                                        table += "<td>" + rows[i].weight + "</td>\n";
                                        table += "<td>" + rows[i].date.toDateString() + "</td>\n";
                                        table += "<td>" + rows[i].lbs + "</td>\n";
                                        table += '<td><input name="'+rows[i].id+'" type="button" value="Delete" class="btn btn-default" onClick="del(this.name)"><input name="'+rows[i].id+' "type="button" value="Update" class="btn btn-default" onClick="update(this.name)"></td>\n';
                                        table += "</tr>\n";
                                }
                                table += "</table>\n";
                                context.result = table;
                                res.render('data',context);
                        });

  });
});


app.get('/get', function(req,res,next) {
		var handlebarsGet = require('express-handlebars').create({defaultLayout:'main'});

		app.engine('handlebars', handlebarsGet.engine);
		app.set('view engine', 'handlebars');

		var context={};
		pool.query("SELECT id, name, reps, weight, date, lbs FROM workouts", function(err, rows, fields){
				if(err) { 
					next(err);
					return;
				}
				var table = "";
				for (var i = 0; i < rows.length; i++){
					table += '<tr id="'+rows[i].id+'">\n';
					table += "<td>" + rows[i].name + "</td>\n";
					table += "<td>" + rows[i].reps + "</td>\n";
					table += "<td>" + rows[i].weight + "</td>\n";
 					table += "<td>" + rows[i].date.toDateString() + "</td>\n";
 					table += "<td>" + rows[i].lbs + "</td>\n";
					table += '<td><input name="'+rows[i].id+'" type="button" value="Delete" class="btn btn-default" onClick="del(this.name)"><input name="'+rows[i].id+' "type="button" value="Update" class="btn btn-default" onClick="update(this.name)"></td>\n';
					table += "</tr>\n";
				}
				context.results = table;
				res.render('home',context);

				
			});  	
	}
);
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
