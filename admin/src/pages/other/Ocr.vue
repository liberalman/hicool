<template>
  <div>
    <div id="main">
      <div class="system">
        <aside>
          <input id="file"
                 type="file"
                 @change="getCustomImage">
          <label for="file">选择文件</label>
          <button @click="ocr">Go &#128514;</button>
        </aside>
        <div class="canvas-display">
          <canvas id="input">
          </canvas>
          <canvas v-show="bOrA" id="output">
          </canvas>
        </div>
      </div>
    </div>
    <div v-html="content"></div>
  </div>
</template>

<script>
  import axios from "axios"

  var FileSaver = require("file-saver")

  export default {
    name: "Ocr",
    data() {
      return {
        inputCtx: "",
        outputCtx: "",
        width: 800,
        height: 480,
        bOrA: true,
        asciiArray: [],
        divisor: 1,
        custom: [0, 0, 0, 0, 1, 0, 0, 0, 0],
        imageData: "", // 原图的imageData
        content: '',
        baidu_access_token: '',
        form: {
          resultText: ''
        },
        file: {}
      };
    },
    components: {},
    methods: {
      getBaiduToken() {
        // 第一步获取token
        let _this = this
        axios.get('https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=lHEhnp7KXT1gQTIbxlaIWG2G&client_secret=qxCn1ar7klqbooh9ds6LOQbQXyMlK8h4',
          {
            headers: {
              dataType: 'json'
            }
          }).then(res => {
          if (res.status == 200) {
            this.baidu_access_token = res.data.access_token;
          } else {
            _this.$message({
              type: "error",
              message: res
            });
          }
        })
      },
      ocr() {
        // 第二步 将图片进行base64 编码，截取，不需要头信息，并且不需要进行lurlencode
        let _this = this
        var reader = new FileReader()
        reader.readAsDataURL(this.file)

        reader.addEventListener("load", () => {
          let img = new Image();
          img.src = reader.result;
          img.onload = function () {
            _this.draw(this, this.width, this.height);
          };
        });

        reader.onload = () => {
          this.fileData = reader.result
          this.fileData = this.fileData.split(',')
          this.fileData = this.fileData[1];
          var form = new FormData();
          // 文件对象
          form.append("image", this.fileData);
          form.append("access_token", this.baidu_access_token);
          this.form.resultText = '';
          //let baiduApi = 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic'
          axios.post('https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic', form,
            //this.axios.post(baiduApi,form,
            {
              headers: {
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
              }
            }).then(res => {
            if (res.status == 200) {
              let str = '';
              console.info(res);
              let data = res.data.words_result;
              for (var i = 0; i < data.length; i++) {
                str = str + data[i].words + '\n'
              }
              _this.content = str
            }
          })
            .catch(error => {
              _this.$message({
                type: "error",
                message: "请求失败，请稍后再试"
              });
            })
        }
      },
      getCustomImage(e) {
        let _this = this;
        this.file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.addEventListener("load", () => {
          let img = new Image();
          img.src = reader.result;
          img.onload = function () {
            _this.draw(this, this.width, this.height);
          };
        });
      },
      convolutionMatrix(input, kernel, offset = 0) {
        let ctx = this.outputCtx;
        let output = ctx.createImageData(input);
        let w = input.width,
          h = input.height;
        let iD = input.data,
          oD = output.data;
        for (let y = 1; y < h - 1; y += 1) {
          for (let x = 1; x < w - 1; x += 1) {
            for (let c = 0; c < 3; c += 1) {
              let i = (y * w + x) * 4 + c;
              oD[i] =
                offset +
                (kernel[0] * iD[i - w * 4 - 4] +
                  kernel[1] * iD[i - w * 4] +
                  kernel[2] * iD[i - w * 4 + 4] +
                  kernel[3] * iD[i - 4] +
                  kernel[4] * iD[i] +
                  kernel[5] * iD[i + 4] +
                  kernel[6] * iD[i + w * 4 - 4] +
                  kernel[7] * iD[i + w * 4] +
                  kernel[8] * iD[i + w * 4 + 4]) /
                this.divisor;
            }
            oD[(y * w + x) * 4 + 3] = 255;
          }
        }
        ctx.putImageData(output, 0, 0);
      },
      draw(img, width, height) {
        let display = document.querySelector(".canvas-display");
        let input = document.querySelector("#input");
        let output = document.querySelector("#output");
        display.removeChild(input);
        display.removeChild(output);
        this.inputCtx = input.getContext("2d");
        this.outputCtx = output.getContext("2d");
        if (80 / 48 < width / height) {
          output.width = input.width = 800;
          output.height = input.height = (800 * height) / width;
          let top = 240 - (400 * height) / width;
          output.style.top = input.style.top = top + "px";
          output.style.left = input.style.left = "0px";
          display.appendChild(input);
          display.appendChild(output);
        } else {
          output.height = input.height = 480;
          output.width = input.width = (480 * width) / height;
          let left = 400 - (240 * width) / height;
          output.style.top = input.style.top = "0px";
          output.style.left = input.style.left = left + "px";
          display.appendChild(input);
          display.appendChild(output);
        }
        let ctx = this.inputCtx;
        ctx.drawImage(img, 0, 0, input.width, input.height);
        let imageData = ctx.getImageData(0, 0, input.width, input.height);
        this.imageData = imageData;
        this.convolutionMatrix(imageData, this.custom, 0);
      }
    },
    mounted() {
      if ('' == this.baidu_access_token) {
        this.getBaiduToken()
      }
    }
  };
</script>

<style lang="less">
  @import "./convolution.css";

  #main {
    color: #eee;
    width: 1000px;
    margin: 50px auto;
    .system {
      display: flex;
      aside {
        width: 200px;
      }
      .canvas-display {
        position: relative;
        width: 800px;
        height: 480px;
        canvas {
          position: absolute;
        }
      }
    }
  }
</style>
