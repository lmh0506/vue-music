<template>
  <transition name="slide">
    <music-list :title="title" :bgImage='bgImage' :songs='songs'></music-list>
  </transition>
</template>

<script type='text/ecmascript-6'>
  import MusicList from 'components/music-list/music-list'
  import {mapState, mapMutations} from 'vuex'
  import {getSongList} from 'api/recommend'
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
        'disc'
      ]),
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      }
    },
    methods: {
      _getSongList() {
        let id = this.disc.dissid || this.$route.params.id
        getSongList(id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
            this.setDisc({
              dissname: res.cdlist[0].dissname,
              imgurl: res.cdlist[0].logo
            })
          } else {
            this.$router.push({
              path: '/recommend'
            })
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(musicData => {
          if (musicData.songid && musicData.albumid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
    },
    created() {
      this._getSongList()
    },
    components: {
      MusicList
    }
  }
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform : translate3d(100%, 0, 0)
</style>

