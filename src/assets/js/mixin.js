import {mapState} from 'vuex'

export const playlistMixin = {
  computed: {
    ...mapState([
      'playList'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playList)
  },
  activated() {
    this.handlePlaylist(this.playList)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('组件必须要实现这个函数')
    }
  }
}