var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server); 
 var mysql  = require('mysql');  
 var bodyParser = require('body-Parser');
 
 var userName;
 var passWord;
 
var connection = mysql.createConnection({     
  host     : 'localhost',       
  user     : 'root',              
  password : '0017',       
  port: '3306',                   
  database: 'chatroom', 
}); 


app.use(express.static(__dirname ));
server.listen(8000,function(){
    console.log('Sever is running');
});

app.get('/login.html',function(req,res){
    res.sendFile('login.html');
})

app.get('/process_reg', function (req, res) {
    res.sendFile(__dirname + '/signUp.html');
})

app.get('/process_regSuccess', function (req, res) {
     userName = req.query.username;
     passWord = req.query.password;
     sql = 'SELECT username FROM users WHERE username = ?';
     sqlParams = userName;
    connection.query(sql,sqlParams, function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ',err.message);
            return;
          }
        var text = JSON.stringify(result);
        if(text != "[]")
        {
            res.sendFile(__dirname + '/errorHandle/wrongReg.html');
        }
        else
        {
        var addSql = 'INSERT INTO users(username, password) VALUES(?,?)';
        var addSqlParams = [userName, passWord];
     connection.query(addSql,addSqlParams,function (err, result) {
            if(err){
              console.log('[SELECT ERROR] - ',err.message);
              return;
            }
        
    });
        res.sendFile(__dirname + '/login.html');
       }
    })
   
})

app.get('/process_get', function (req, res) {
    //window.location.href = "index.html";
    // 输出 JSON 格式
    //var  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,"dsf","fds.fjd",id,"dfin")';
   //var  addSqlParams = ['root', 'https://cgdds.runoob.com',id, 'CN'];
  userName = req.query.username;
  passWord = req.query.password;
   var sql = 'SELECT password FROM users WHERE username = ?'
   var sqlParams = [userName];
   connection.query(sql, sqlParams, function(err,result){
    if(err){
        console.log('[SELECT ERROR] - ',err.message);
        return;
      }
       var text = JSON.stringify(result);
       if(text != "[]")
       {
           var obj = JSON.parse(text);
       //if(obj[0].name == "Facebook"){
       //console.log(obj[0].password);
       if(obj[0].password == passWord)
       {
          res.sendFile(__dirname + '/index.html');
       }
       else{res.sendFile(__dirname + '/errorHandle/wrongLog.html');}
       }
       else{res.sendFile(__dirname + '/errorHandle/wrongLog.html');}
       //res.sendFile(__dirname + '/index.html');
   })
    
  // connection.end();
  
 })
io.on('connection', function(socket) {
    //console.log('a user in');
    /*socket.on('registering', function(message){

    })*/
    
    socket.on('login', function(message) {
        var sql = 'SELECT * FROM history';
        var text;
        var obj;
        connection.query(sql,function(err,result){
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
              }
               text = JSON.stringify(result);
               obj = JSON.parse(text);
               //console.log(obj[0].other);
               //console.log(result);
               socket.emit('system',obj);
           });
        //console.log(obj[0].other);
       
    });
    socket.on('getName',function(message){
        socket.emit('receiveName', userName);
        console.log(userName);
    });
    socket.on('sendMsg',function(message){
        //console.log(message);
        var addSql = 'INSERT INTO history(hMsg,other) VALUES(?,?)';
        var addSqlParams = [message,"OK"];
        connection.query(addSql, addSqlParams, function(err,result){
            if(err){
                console.log('[SELECT ERROR] - ',err.message);
                return;
              }
              
           });
        io.sockets.emit('newMessage', message);
    });
});
