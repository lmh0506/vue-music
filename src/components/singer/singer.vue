<template>
  <div>
    <div class="singer" ref="singer">
      <list-view @select="selectSinger" :data='singerList' ref="list"></list-view>
      <router-view></router-view>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>
  import {getSingerList} from 'api/singer'
  import Singer from 'assets/js/singer'
  import ListView from 'base/listview/listview'
  import {ERR_OK} from 'api/config'
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'assets/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        singerList: []
      }
    },
    components: {
      ListView
    },
    methods: {
      _getSingerList() {
        // 获取歌手列表数据
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singerList = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        // 创建一个map对象存储分离后的列表数据
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }

        list.forEach((item, index) => {
          // 遍历歌手列表 取前十条为热门
          if (index < HOT_SINGER_LEN) {
            // 如果符合条件添加歌手对象
            map.hot.items.push(new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            }))
          }

          // 如果key不存在则赋值 一个新对象
          const key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }

          // 将每个歌手添加到其名字首字母对应的列表中
          map[key].items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })

        // 为了得到有序列表，需要处理map
        let hot = []
        let ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }

        // 按a-z排序
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      selectSinger(singer) {
        this.setSinger(singer)
        this.$router.push({
          path: `/singer/${singer.id}`
        })
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    created() {
      this._getSingerList()
    }
  }
</script>

<style lang="stylus" scoped>
  .singer
    position : fixed
    top : 80px
    bottom : 0px
    width : 100%
</style>

