package main

import (
	"fmt"
	"log"
	"os"

	"gopkg.in/gcfg.v1"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var (
	session *mgo.Session = nil
	config  Config
)

type Config struct {
	Default struct {
		Using         int
		DictFile      string
		StopTokenFile string
		StaticFolder  string
	}
	Mongodb struct {
		Username string
		Password string
		Host     string
		Port     int
		Dbname   string
	}
}

type Address struct {
	Address string
}

type Location struct {
	Longitude float64
	Latitude  float64
}

type Person struct {
	Id       bson.ObjectId `bson:"_id"`
	Name     string
	Age_Int  int
	Address  []Address
	Location Location
}

type Article struct {
	Id          bson.ObjectId `bson:"_id"`
	Title       string
	Content     string
	Description string
	Author_id   string
	Visit_count uint64
	Tags        []string
}

func initial() {
	var err error
	log.SetFlags(log.Flags() | log.Lshortfile)
	err = gcfg.ReadFileInto(&config, "conf.ini")
	if err != nil {
		log.Println("Failed to parse config file: %s", err.Error())
		os.Exit(-1)
	}

	//连接
	var url string = fmt.Sprintf("mongodb://%s:%s@%s:%d/%s",
		config.Mongodb.Username,
		config.Mongodb.Password,
		config.Mongodb.Host,
		config.Mongodb.Port,
		config.Mongodb.Dbname)
	session, err = mgo.Dial(url)
	if err != nil {
		log.Println(err)
		return
	}
	//设置模式
	session.SetMode(mgo.Monotonic, true)
}

func reindexSearch() {
	if nil == session {
		initial()
	}
	var size int = 1
	var offset int = 0
	var total int = 0
	var articles []Article = make([]Article, size)
	condition := bson.M{"type": bson.M{"$eq": 1}, "status": bson.M{"$gt": 0}}
	// type为1所有可见文章，type为2时候是仅仅私有文章

	//获取文档集
	collection := session.DB(config.Mongodb.Dbname).C("articles")
	total, _ = collection.Find(condition).Count()
	fmt.Println("total:", total)
	for page := 1; offset < total; page++ {
		offset = (page - 1) * size
		fmt.Println("offset:", offset)
		//查找记录
		if err := collection.Find(condition).Skip(offset).Limit(size).Sort("-updated").All(&articles); err != nil {
			log.Println(err.Error())
			return
		}
		for i := 0; i < size; i++ {
			// fmt.Println("do:", articles[i].Title)
			// reindex
			weibo := Weibo{
				Id:           articles[i].Id.String(),
				Title:        articles[i].Title,
				Text:         articles[i].Content,
				UserName:     articles[i].Author_id,
				RepostsCount: articles[i].Visit_count,
				Timestamp:    1375667058,
				Labels:       articles[i].Tags,
			}
			addIndex(weibo)
		}
	}

}

func test() {
	//获取文档集
	collection := session.DB("myDB").C("myCollection")
	// 创建索引
	index := mgo.Index{
		Key:        []string{"name"}, // 索引字段， 默认升序,若需降序在字段前加-
		Unique:     true,             // 唯一索引 同mysql唯一索引
		DropDups:   true,             // 索引重复替换旧文档,Unique为true时失效
		Background: true,             // 后台创建索引
	}
	if err := collection.EnsureIndex(index); err != nil {
		log.Println(err)
		return
	}
	if err := collection.EnsureIndexKey("$2dsphere:location"); err != nil { // 创建一个范围索引
		log.Println(err)
		return
	}
	//添加记录
	person := Person{
		Id:      bson.NewObjectId(),
		Name:    "逍遥",
		Age_Int: 24,
		Address: []Address{
			Address{
				Address: "仙灵岛",
			},
		},
		Location: Location{
			Longitude: 1,
			Latitude:  1,
		},
	}
	if err := collection.Insert(person); err != nil {
		log.Println(err)
		return
	}
	//查找记录
	newPerson := &Person{}
	if err := collection.Find(bson.M{"age_int": 24}).One(newPerson); err != nil {
		log.Println(err)
		return
	}
	//修改记录
	if err := collection.Update(bson.M{"age_int": 24}, bson.M{"$set": bson.M{"age_int": 26}}); err != nil {
		log.Println(err)
		return
	}
	//删除记录
	//if err := collection.Remove(bson.M{"age_int": 26}); err != nil {
	//  log.Println(err)
	//  return
	//}
	//位置搜索
	selector := bson.M{
		"location": bson.M{
			"$near": bson.M{
				"$geometry": bson.M{
					"type":        "Point",
					"coordinates": []float64{1, 1},
				},
				"$maxDistance": 1,
				//"$minDistance": 0,
			},
		},
	}
	if err := collection.Find(selector).One(newPerson); err != nil {
		log.Println(err)
		return
	}
	//
	session.Close()
	session = nil
}
