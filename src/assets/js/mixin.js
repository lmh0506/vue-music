import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'assets/js/config'
import {shuffle} from 'assets/js/util'

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
    playList(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('组件必须要实现这个函数')
    }
  }
}

export const playerMixin = {
  computed: {
    modeIcon() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapState([
      'sequenceList',
      'mode',
      'playList'
    ]),
    ...mapGetters([
      'currentSong'
    ])
  },
  methods: {
    changeMode() { // 改变播放模式
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = []

      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }

      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
      setPlayingState: 'SET_PLAYING_STATE'
    })
  }
}

export const searchMixin = {
  computed: {
    ...mapState([
      'searchHistory'
    ])
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange(query) {
      this.query = query
    },
    ...mapActions([
      'deleteSearchHistory',
      'saveSearchHistory'
    ])
  }
}
