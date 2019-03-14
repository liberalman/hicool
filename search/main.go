// 一个微博搜索的例子。
package main

import (
	"bufio"
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"reflect"
	"strconv"
	"strings"

	"encoding/gob"
	"encoding/json"
	"net/http"
	"os/signal"

	"github.com/go-ego/riot"
	"github.com/go-ego/riot/types"
)

const (
	// SecondsInADay seconds in a day
	SecondsInADay = 86400
	// MaxTokenProximity max token proximity
	MaxTokenProximity = 2
)

var (
	searcher = riot.Engine{}

	weiboData = flag.String("weibo_data",
		"./weibo_data.txt", "微博数据文件")
	dictFile = flag.String("dict_file",
		"./dict/dictionary.txt", "词典文件")
	stopTokenFile = flag.String("stop_token_file",
		"./dict/stop_tokens.txt", "停用词文件")

	staticFolder = flag.String("static_folder", "static", "静态文件目录")
)

// Weibo weibo json struct
type Weibo struct {
	// Id           uint64 `json:"id"`
	Id           string   `json:"id"`
	Timestamp    uint64   `json:"timestamp"`
	UserName     string   `json:"user_name"`
	RepostsCount uint64   `json:"reposts_count"`
	Text         string   `json:"text"`
	Labels       []string `json:"labels"`
	Description  string   `json:"description"`
	Title        string   `json:"title"`
}

type Unit struct {
	Timestamp    uint64
	RepostsCount uint64
}

/*******************************************************************************
    索引
*******************************************************************************/
func indexWeibo() {
	wbs := make(map[string]Weibo)
	// 读入微博数据
	file, err := os.Open(*weiboData)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		data := strings.Split(scanner.Text(), "||||")
		if len(data) != 10 {
			continue
		}

		wb := Weibo{}
		// wb.Id, _ = strconv.ParseUint(data[0], 10, 64)
		wb.Id = data[0]
		wb.Timestamp, _ = strconv.ParseUint(data[1], 10, 64)
		wb.UserName = data[3]
		wb.RepostsCount, _ = strconv.ParseUint(data[4], 10, 64)
		wb.Text = data[9]
		wbs[wb.Id] = wb
	}

	log.Print("添加索引")
	for docId, weibo := range wbs {
		searcher.Index(docId, types.DocData{
			Content: weibo.Text,
			Fields: WeiboScoringFields{
				Timestamp:    weibo.Timestamp,
				RepostsCount: weibo.RepostsCount,
				UserName:     weibo.UserName,
				Labels:       weibo.Labels,
				Title:        weibo.Title,
				Description:  weibo.Description,
			},
		})
	}

	searcher.Flush()
	log.Printf("索引了%d条微博\n", len(wbs))
}

func addIndex(weibo Weibo) {
	searcher.RemoveDoc(weibo.Id)
	searcher.Index(weibo.Id, types.DocData{
		Content: weibo.Text,
		Labels:  weibo.Labels,
		Fields: WeiboScoringFields{
			Timestamp:    weibo.Timestamp,
			RepostsCount: weibo.RepostsCount,
			UserName:     weibo.UserName,
			Labels:       weibo.Labels,
			Title:        weibo.Title,
			Description:  weibo.Description,
		},
	})
	searcher.Flush()
}

func removeIndex(id string) {
	searcher.RemoveDoc(id)
	searcher.Flush()
}

/*******************************************************************************
    评分
*******************************************************************************/

// WeiboScoringFields  weibo scoring fields
type WeiboScoringFields struct {
	Timestamp    uint64
	RepostsCount uint64
	UserName     string
	Labels       []string
	Title        string
	Description  string
}

// WeiboScoringCriteria custom weibo scoring criteria
type WeiboScoringCriteria struct {
}

// Score score and sort
func (criteria WeiboScoringCriteria) Score(
	doc types.IndexedDoc, fields interface{}) []float32 {
	if reflect.TypeOf(fields) != reflect.TypeOf(WeiboScoringFields{}) {
		return []float32{}
	}
	wsf := fields.(WeiboScoringFields)
	output := make([]float32, 3)
	if doc.TokenProximity > MaxTokenProximity {
		output[0] = 1.0 / float32(doc.TokenProximity)
	} else {
		output[0] = 1.0
	}
	output[1] = float32(wsf.Timestamp / (SecondsInADay * 3))
	output[2] = float32(doc.BM25 * (1 + float32(wsf.RepostsCount)/10000))
	return output
}

/*******************************************************************************
    JSON-RPC
*******************************************************************************/

// JsonResponse json response
type JsonResponse struct {
	Docs []*Weibo `json:"docs"`
}

// JsonRpcServer json rpc server
func JsonRpcServer(w http.ResponseWriter, req *http.Request) {
	query := req.URL.Query().Get("query")
	output := searcher.SearchDoc(types.SearchReq{
		Text: query,
		RankOpts: &types.RankOpts{
			ScoringCriteria: &WeiboScoringCriteria{},
			OutputOffset:    0,
			MaxOutputs:      100,
		},
	})

	// 整理为输出格式
	docs := []*Weibo{}
	for _, doc := range output.Docs {
		// get data from mongodb
		wb := Weibo{}
		wb.Id = doc.DocId
		wb.Text = doc.Content
		fields := doc.Fields.(WeiboScoringFields)
		wb.Timestamp = fields.Timestamp
		wb.RepostsCount = fields.RepostsCount
		wb.UserName = fields.UserName
		wb.Title = fields.Title
		wb.Description = fields.Description
		wb.Labels = fields.Labels
		// wb.Text = doc.Content
		for _, t := range output.Tokens {
			wb.Text = strings.Replace(wb.Text, t, "<font color=red>"+t+"</font>", -1)
		}
		docs = append(docs, &wb)
	}
	response, _ := json.Marshal(&JsonResponse{Docs: docs})

	// fmt.Println("response...", response)

	w.Header().Set("Content-Type", "application/json")
	io.WriteString(w, string(response))
}

/*
curl -X POST -H 'Content-Type: application/json' \
 -d '{ "id": "3607871495567320", "timestamp": 1375667058, "user_name": "Hicool网", "labels": ["golang","c++"], "reposts_count": 240, "title": "Title", "text": "socho is a good boy.", "description": "This is a..." }' \
 http://localhost:8080/index/add
*/
func rpcAddIndex(w http.ResponseWriter, req *http.Request) {
	var weibo Weibo
	body, _ := ioutil.ReadAll(req.Body)
	if err := json.Unmarshal(body, &weibo); err != nil {
		io.WriteString(w, err.Error())
	} else {
		fmt.Println(weibo)
		addIndex(weibo)
		response, _ := json.Marshal(weibo)
		w.Header().Set("Content-Type", "application/json")
		io.WriteString(w, string(response))
	}
}

func rpcRemoveIndex(w http.ResponseWriter, req *http.Request) {
	id := req.URL.Query().Get("id")
	removeIndex(id)
}

/*******************************************************************************
	主函数
*******************************************************************************/
func main() {
	// 解析命令行参数
	flag.Parse()

	// 初始化
	gob.Register(WeiboScoringFields{})
	log.Print("引擎开始初始化")
	searcher.Init(types.EngineOpts{
		Using:   0,
		GseDict: *dictFile,
		// GseDict:       "zh",
		StopTokenFile: *stopTokenFile,
		IndexerOpts: &types.IndexerOpts{
			IndexType: types.LocsIndex,
		},
		// 如果你希望使用持久存储，启用下面的选项
		// 默认使用leveldb持久化，如果你希望修改数据库类型
		// 请用 StoreEngine: " " 或者修改 Riot_Store_Engine 环境变量
		UseStore:    true,
		StoreFolder: "weibo_search",
		// StoreEngine: "bg",
	})
	searcher.Flush()
	log.Println("引擎初始化完毕")

	// 索引
	// log.Println("建索引开始")
	// go indexWeibo()
	// log.Println("建索引完毕")

	// 捕获 ctrl-c
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	go func() {
		for range c {
			log.Println("捕获Ctrl-c，退出服务器")
			searcher.Close()
			os.Exit(0)
		}
	}()

	http.HandleFunc("/json", JsonRpcServer)
	http.HandleFunc("/index/add", rpcAddIndex)
	http.HandleFunc("/index/remove", rpcRemoveIndex)
	http.Handle("/", http.FileServer(http.Dir(*staticFolder)))
	log.Println("服务器启动")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
