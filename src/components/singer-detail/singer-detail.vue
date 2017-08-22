<template>
  <transition name="slide">
    <music-list :songs='songs' :title="title" :bgImage='bgImage'></music-list>
  </transition>
</template>

<script type='text/ecmascript-6'>
  import {mapState, mapMutations} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'assets/js/song'
  import Singer from 'assets/js/singer'
  import MusicList from 'components/music-list/music-list'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapState([
        'singer'
      ]),
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      }
    },
    methods: {
      _getDetail() {
        let id = this.singer.id || this.$route.params.id
        getSingerDetail(id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
            if (!this.singer.id) {
              let singer = new Singer({
                id: res.data.singer_mid,
                name: res.data.singer_name
              })
              this.setSinger(singer)
            }
          } else {
            this.$router.push({
              path: '/singer'
            })
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    },
    created() {
      this._getDetail()
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../assets/stylus/variable'

  .slide-enter-active, .slide-leave-active
    transition : all 0.3s
  .slide-enter, .slide-leave-to
    transform : translate3d(100%, 0, 0)
</style>
