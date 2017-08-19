<template>
  <Scroll class="listview" 
          ref='listview' 
          :data='data' 
          :listenScroll='listenScroll' 
          :probeType='probeType'
          @scroll='scroll'>
    <ul>
      <li v-for='(group, index) in data' :key="index" class="list-group" ref='listgroup'>
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for='(item, index) in group.items' :key="index" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar" alt="">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut"            @touchstart='onShortcutTouchStart' @touchmove.stop.prevent='onShortcutTouchMove'>
      <ul>
        <li v-for="(item, index) in shortcutList"     :key="index" 
        :data-index='index'
        class="item"
        :class="{'current': index === currentIndex}">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show='fixedTitle' ref='fixed'>
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show='!data.length' class="loading-container">
      <loading></loading>
    </div>
  </Scroll>
</template>

<script type='text/ecmascript-6'>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'assets/js/dom'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30

  export default {
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map(group => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        let item = this.data[this.currentIndex]
        return item ? item.title : ''
      }
    },
    methods: {
      onShortcutTouchStart(e) { // 手指按下事件
        // 获取按下位置的dom元素的index值
        let anchorIndex = parseInt(getData(e.target, 'index'))
        // 存储按下时候的y坐标
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        // 存储按下时的index值
        this.touch.anchorIndex = anchorIndex
        // 左侧列表滚动到对应的index值
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) { // 手指移动事件
        // 存储移动时手指所在的y坐标
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        // 计算按下时与现在的y坐标的差
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT || 0
        let anchorIndex = this.touch.anchorIndex + Math.round(delta)
        // 左侧列表滚动到对应的index值
        this._scrollTo(anchorIndex)
      },
      _scrollTo(index) {
        let listgroup = this.$refs.listgroup
        if (isNaN(index) || index < 0 || index >= listgroup.length) {
          return
        }
        this.$refs.listview.scrollToElement(listgroup[index], 0)
        this.currentIndex = index
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _calculateHeight() { // 计算每组的高度
        // 每次计算前先清空原数组
        this.listHeight = []
        const list = this.$refs.listgroup
        let height = 0
        this.listHeight.push(height)
        // 将每组距离顶部的高度添加到数组中
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectItem(item) {
        this.$emit('select', item)
      }
    },
    watch: {
      data() { // 每当列表数据发生变化时重新计算高度
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(newY) {
        // 每当滚动时y坐标变化时 实时改变当前index值
        const listHeight = this.listHeight
        // 当滚动到顶部 newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }

        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          // 当新的y坐标在两组之间时 改变当前index
          if (-newY >= height1 && -newY <= height2) {
            // 下一组的顶部到窗体顶部的距离
            this.diff = height2 + newY
            this.currentIndex = i
            return
          }
        }

        // 滚动到底部 且-newY > 最后一个的元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../assets/stylus/variable'

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
