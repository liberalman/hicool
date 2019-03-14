// cnpm install mongodb
// cnpm install mysql
// node app.js >> run.log

var ObjectID = require('mongodb').ObjectID;
var MongoClient = require("mongodb").MongoClient;
var DB_URL = "mongodb://username:password@ip:port/dbname";
function insertData(db, id, data)
{
    var collect = db.db('dbname');
    var devices = collect.collection('articles');
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
var end = 299;
for (var j = 206; j <= end;) {
    connection.query('select * from tb_post where id>=' + j + ' and id<=' + end + ' limit 10', function(err, rows, fields) {
        if (err) throw err;
        MongoClient.connect(DB_URL, function(error, db){
            for(var i= 0,r;r=rows[i++];){
                var author_id = ObjectID("5a4ca9c0623bf51b5e326f5f");
                if(r.userid != 1) {
                    author_id = ObjectID("5a5624e4ba18d80e4dd3162b");
                }
                var data = {"author_id":author_id,"title":r.title,"content":r.content,"description":r.digest,
                    "publish_time":new Date(r.posttime),"created":new Date(r.posttime),"updated":new Date(r.updated),"top":false,
                    "visit_count":r.views,"status":r.show,"pubtype":r.pubtype,"reprint_url":r.reprinturl,"editor_type":r.editortype
                };
                if(r.coverurl != ""){
                    data.images = [{"url":r.coverurl}];
                }
                if(1 == r.istop){
                    data.top = true;
                }
                insertData(db, r.id, data);
            }
        });
    });
    j = j+10;
}
connection.end();

