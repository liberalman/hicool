<template>
  <div class="card-list">
    <a-list
      :grid='{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }'
      :dataSource="list"
    >
      <a-list-item slot="renderItem" slot-scope="item, index">
        <template v-if="item === null">
          <a-button class="new-btn" type="dashed">
            <a-icon type="plus" />新增相册
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <img slot="cover" :src="item.cover" height="154"/>
            <a-card-meta :title="item.title">
              <div slot="description">
                <router-link :to="{ path: '/album/' + item._id }">
                {{item.content}}
                </router-link>
              </div>
            </a-card-meta>
            <div class="content">
              <span>{{item.publish_time | dateFormat}}</span>
              <avatar-list>
                <avatar-list-item size="small" tips="曲丽丽" :src="item.author_id.avatar" />
                <avatar-list-item size="small" tips="周星星" src="https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png" />
                <avatar-list-item size="small" tips="董娜娜" src="https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png" />
              </avatar-list>
            </div>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AvatarList from '../../components/tool/AvatarList'

const AvatarListItem = AvatarList.Item

export default {
  name: 'CardList',
  components: { AvatarListItem, AvatarList },
  data () {
    return {
      page: 1,
      size: 10,
      sortOrder: 'false' // true 按updated字段顺序排序，false 则是倒序
    }
  },
  computed: {
    ...mapState({
      total: state => state.albums.total,
      list: state => state.albums.list
    })
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData: function () {
      this.$store.dispatch('albums/getAlbums', {
        page: this.page,
        size: this.size,
        sortOrder: this.sortOrder
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }
  .new-btn{
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 301px; /* 188 */
  }
  .meta-content{
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 64px;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  /* ProjectList 中的样式*/
  .content{
    display: flex;
    margin-top: 16px;
    margin-bottom: -4px;
    line-height: 20px;
    height: 20px;
    & > span {
      color: rgba(0,0,0,.45);
      flex: 1;
      font-size: 12px;
    }
    .avatarList {
      flex: 0 1 auto;
    }
  }
</style>
