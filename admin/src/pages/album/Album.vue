<template>
  <div class="card-list">
    <a-list
      :grid='{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }'
      :dataSource="album.images"
    >
      <a-list-item slot="renderItem" slot-scope="item, index">
        <template v-if="item === null">
          <a-button class="new-btn" type="dashed">
            <a-icon type="plus" />新增相册
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <img slot="cover" :src="item.url" height="154"/>
            <a-card-meta title="">
              <div slot="description">
                {{item.description}}
              </div>
            </a-card-meta>
            <div class="content">
              <span>{{item.publish_time | dateFormat}}</span>
              <avatar-list>
                <avatar-list-item size="small" tips="曲丽丽" :src="item.author_id.avatar" />
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
  name: 'Album',
  components: { AvatarListItem, AvatarList },
  data () {
    console.log(this.$store.state.album)
    return {
      page: 1,
      size: 10,
      sortOrder: 'false' // true 按updated字段顺序排序，false 则是倒序
    }
  },
  computed: {
    ...mapState({
      album: state => state.album
    })
  },
  mounted () {
    this.fetchData(this.$route.params.id)
  },
  methods: {
    fetchData: function (id) {
      this.$store.dispatch('album/getAlbum', id)
    }
  },
  watch: { // 监听路由跳转。因为跳转为了提高效率，复用已经生成的组件，这样就达不到刷新数据的效果了。所以监听路由方向，以确定何时刷新。
    '$route' (to, from) {
      if (to.path.indexOf('/album/') >= 0) {
        this.fetchData(to.params.id)
      }
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
