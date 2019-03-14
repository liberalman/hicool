// cnpm install mongodb
// cnpm install mysql
// node app.js >> run.log

var ObjectID = require('mongodb').ObjectID;
var MongoClient = require("mongodb").MongoClient;
var DB_URL = "mongodb://username:password@ip:port/dbname";
function insertData(db, id, data)
{
    var collect = db.db('libertyblog-dev');
    var devices = collect.collection('timelines');
    devices.insert(data,function(error, result){
        if(error)
        {
            console.log('Error: id:' + id + " " + error + '\n');
            //process.exit(1);
        }else{
            console.log('id:' + id + ' has been handle success. ' + result.result.n + '\n');
        }
        db.close();
    });
}


var mysql=require('mysql');
var connection = mysql.createConnection({
        host     : '',
        user     : '',
        password : '',
        database : '',
        port:''
});
connection.connect();

var timelineid = 5;
//select p.* from tb_photo p where p.timelineid=-1;
//'select a.userid,p.* from tb_photo p, tb_album a where p.timelineid=a.id and a.id=' + timelineid
connection.query('select tp.* from tb_timeline t, tb_time_point tp where tp.timelineid=t.id and t.id=' + timelineid, function(err, rows, fields) {
    if (err) throw err;
    MongoClient.connect(DB_URL, function(error, db){
        var data = { "name":"","author_id":ObjectID("5a4ca9c0623bf51b5e326f5f"),"cover":"","publish_time":new Date('2017-08-26T16:28:34.000Z'),"hide":0,"rank":99,"linenum":0,"content":"",points:[] };
        for(var i= 0,r;r=rows[i++];){
            var item = {"point_id":r.id,"title":r.title,"content":r.content,"position":r.pos,"icosty":r.icosty,"publish_time":new Date(r.createtime),"url":r.url};
            data.points.push(item);
        }
        insertData(db, timelineid, data);
        //console.log(data);
    });
});
connection.end();


