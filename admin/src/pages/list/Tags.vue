<template>
  <div>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="名称"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-input placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="状态"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-select placeholder="请选择">
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="排位"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-input-number style="width: 100%" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
          <a-row v-if="advanced">
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="更新日期"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-date-picker style="width: 100%" placeholder="请输入更新日期" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="使用状态"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-select placeholder="请选择">
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="描述"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-input placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? '收起' : '展开'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button @click="visible = true" type="primary">新建</a-button>
      </div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows="selectedRows"
      >
        <span slot="action" slot-scope="text, record">
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item @click="updateTag(record)">修改</a-menu-item>
            <a-menu-item>
              <a-popconfirm placement="top" title="Are you sure delete this one?"
                            @confirm="_confirmDel(record.key, record._id)" okText="Yes" cancelText="No">
                Delete
              </a-popconfirm>
            </a-menu-item>
          </a-menu>
          <a-button>
            更多 <a-icon type="down" />
          </a-button>
        </a-dropdown>

        </span>
      </a-table>
    </div>
  </a-card>
  <a-modal title="详情"
                     :visible="visible"
                     @ok="_confirmAdd"
                     @cancel="_cancelAdd">
    <a-form>
      <a-form-item
        label="名称"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
      >
        <a-input placeholder="尽量简洁" v-model="newTag.name" />
      </a-form-item>
      <a-form-item
        label="排序"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
        :required="false"
        help="数值越大排名越靠前，取值范围0~1000"
      >
        <a-input-number :min="0" :max="1000" v-model="newTag.sort"/>
        <span>位</span>
      </a-form-item>
      <a-form-item
        label="分类"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
        :required="false"
        help="选择标签分类"
      >
          <a-select v-model="newTag.cid">
            <a-select-option value="5a4ca9c1623bf51b5e326f67">IT技术</a-select-option>
            <a-select-option value="5a5ca7608cef9674e1046d3b">Business</a-select-option>
            <a-select-option value="5a4ca9c1623bf51b5e326f6b">其它分类</a-select-option>
          </a-select>
      </a-form-item>
      <a-form-item
        label="is_index"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
        :required="false"
        help="is index"
      >
        <a-radio-group v-model="newTag.is_index">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="是否显示"
        :labelCol="{span: 7}"
        :wrapperCol="{span: 10}"
        :required="false"
        help="显示到主页"
      >
        <a-radio-group v-model="newTag.is_show">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
</a-modal>
</div>
</template>

<script>
import { mapState } from 'vuex'
import StandardTable from '../../components/table/StandardTable'
const columns = [
  {
    title: '描述',
    dataIndex: 'name'
  },
  {
    title: '标签分类',
    dataIndex: 'categoryName'
  },
  {
    title: '排序',
    dataIndex: 'sort',
    sorter: true,
    needTotal: true,
    customRender: (text) => '第 ' + text + '位'
  },
  {
    title: 'index',
    dataIndex: 'is_index',
    customRender: (text) => text ? '是' : '否'
  },
  {
    title: 'show',
    dataIndex: 'is_show',
    customRender: (text) => text ? '是' : '否'
  },
  {
    title: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const initTag = {
  name: '',
  cid: '5a4ca9c1623bf51b5e326f67',
  is_index: true,
  is_show: true,
  sort: 1,
  isAdd: true // true add, false update
}

export default {
  name: 'QueryList',
  components: { StandardTable },
  data () {
    return {
      tagCategoryId: 0,
      advanced: false,
      columns: columns,
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
      newTag: initTag
    }
  },
  computed: {
    ...mapState({
      total: state => state.tags.list.length,
      dataSource: state => {
        const dataSource = []
        for (let i = 0; i < state.tags.list.length; i++) {
          dataSource.push({
            key: i,
            _id: state.tags.list[i]._id,
            name: state.tags.list[i].name,
            sort: state.tags.list[i].sort,
            is_show: state.tags.list[i].is_show,
            is_index: state.tags.list[i].is_index,
            categoryName: state.tags.list[i].cid.name,
            cid: state.tags.list[i].cid._id
          })
        }
        return dataSource
      }
    })
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.$store.dispatch('tags/getTags', this.tagCategoryId)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // add tag
    _confirmAdd: function () {
      var _this = this
      let str = ''
      if (this.newTag.isAdd === true) {
        str = 'tags/add'
      } else {
        str = 'tags/update'
      }
      this.$store.dispatch(str, this.newTag)
        .then(res => {
          _this.$message.success('success')
          _this.visible = false
          _this.newTag = initTag
        })
        .catch(err => {
          _this.$message.error(err)
        })
    },
    updateTag: function (tag) {
      this.newTag = tag
      this.newTag.isAdd = false
      this.visible = true
    },
    _cancelAdd: function () {
      this.visible = false
      this.newTag = initTag
    },
    // delete tag
    _confirmDel: function (index, id) {
      var _this = this
      this.$store.dispatch('tags/delete', id)
        .then(res => {
          _this.list.splice(index, 1) // 删除list中对应的行
          _this.$store.commit('tags/setTotal', _this.total - 1) // 更改total值。
          _this.$message.success('success')
        })
        .catch(err => {
          _this.$message.error(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
