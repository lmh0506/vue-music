<template>
  <transition name="slide">
    <music-list :title="title" :bgImage='bgImage' :songs='songs' :rank='true'></music-list>
  </transition>
</template>

<script type='text/ecmascript-6'>
  import MusicList from 'components/music-list/music-list'
  import {mapState, mapMutations} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'assets/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      ...mapState([
        'topList'
      ]),
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        return this.topList.picUrl
      }
    },
    methods: {
      ...mapMutations({
        setTopList: 'SET_TOPLIST'
      }),
      _getMusicList() {
        let id = this.topList.id || this.$route.params.id
        getMusicList(id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
            this.setTopList({
              topTitle: res.topinfo.ListName,
              picUrl: res.topinfo.pic_album
            })
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(item => {
          const musicData = item.data
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })

        return ret
      }
    },
    created() {
      this._getMusicList()
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition : all 0.3s ease
  
  .slide-enter, .slide-leave-to
    transform : translate3d(100%, 0, 0)
</style>
