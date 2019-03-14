// cnpm install mongodb
// cnpm install mysql
// node app.js >> run.log

var ObjectID = require('mongodb').ObjectID;
var MongoClient = require("mongodb").MongoClient;
var DB_URL = "mongodb://username:password@ip:port/dbname";
function insertData(db, id, data)
{
    var collect = db.db('libertyblog-dev');
    var devices = collect.collection('albums');
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
// start 14, end 795
var end = 0;
var albumid = -1;
//select p.* from tb_photo p where p.albumid=-1;
//'select a.userid,p.* from tb_photo p, tb_album a where p.albumid=a.id and a.id=' + albumid
connection.query('select p.* from tb_photo p where p.albumid=' + albumid, function(err, rows, fields) {
    if (err) throw err;
    MongoClient.connect(DB_URL, function(error, db){
        var data = {
            "name":"","author_id":ObjectID("5a4ca9c0623bf51b5e326f5f"),"cover":"","publish_time":new Date('2017-08-26T16:28:34.000Z'),"hide":0,"rank":99,"photonum":0,"content":"",images:[]
        };
        for(var i= 0,r;r=rows[i++];){
            var item = {
                "photo_id":r.id,"description":r.des,"publish_time":new Date(r.posttime),"url":r.url,"source":r.source
            };
            data.images.push(item);
        }
        insertData(db, albumid, data);
        //console.log(data);
    });
});
connection.end();

