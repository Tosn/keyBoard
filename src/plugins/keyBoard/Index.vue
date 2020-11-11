<template>
  <div class="keyboard-section">
    <div class="keyboard-header">
      <div class="board-left">
        <span class="can-edit" v-for="item in currentExchangeList" @click="chooseData(item)" :key="item.label">{{item.label}}</span>
      </div>
      <label for="">安全键盘</label>
      <div class="board-right">
        <span class="can-edit" @click="confirm">完成</span>
      </div>
    </div>
    <div class="keyboard-box" :class="viewClass(viewState)">
      <span
        v-for="item in viewDataList"
        :class="charClass(item)"
        :key="`${viewClass(viewState)}-${item}`"
         @click="btnClick(item)"
         v-html="compileItem(item)"
      >
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      exCludes: ['up', 'space', 'del'],
      exchangeList: [
        { target: 'char', label: 'ABC' },
        { target: 'symbol', label: '符' },
        { target: 'num', label: '123' }
      ],
      value: '', // 明文
      // passwordValue: '', // 密文
      charState: 'lower', // lower upper
      char: [
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
        'up', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
        'space', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del'
      ],
      symbol: [
        '&', '"', ';', '^', ',', '|', '$', '*', ':', '\'',
        '?', '{', '[', '~', '#', '}', '.', ']', '\\', '!',
        '(', '%', '-', '_', '+', '/', ')', '=', '<', '`',
        '>', '@', 'space', 'del'
      ],
      num: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'],
      viewState: 'char', // char abc  num number  symbol 符号
      viewDataList: null
    }
  },
  computed: {
    currentExchangeList () {
      return this.exchangeList.filter(item => item.target !== this.viewState)
    },
    isUpper () {
      // 是否开启打大写
      return this.charState === 'upper'
    }
  },
  created () {
    this.initComp()
  },
  methods: {
    initComp () {
      this.initData()
    },
    initData () {
      this.viewDataList = [...this.char]
    },
    charClass (item) {
      let className = ''
      if (this.exCludes.indexOf(item) >= 0) {
        className += `board-iconfont board-${item} `
      }
      if (this.isUpper && item === 'up') {
        className += 'current'
      }
      return className
    },
    viewClass (state) {
      return `view-${state}`
    },
    chooseData (item) {
      this.viewState = item.target
      this.viewDataList = [...this[item.target]]
    },
    compileItem (item) {
      if (this.exCludes.indexOf(item) < 0 && this.isUpper) {
        return item.toUpperCase()
      }
      if (this.exCludes.indexOf(item) >= 0) {
        return this.compileSymbol(item)
      }
      return item
    },
    compileSymbol (key) {
      switch (key) {
        case 'up': {
          return '&#xe699;'
        }
        case 'del': {
          return '&#xe620;'
        }
        case 'space': {
          return '&#xe7bc;'
        }
      }
    },
    btnClick (ite) {
      // 键盘点击
      if (ite === 'space') {
        this.value += ' '
        // this.passwordValue += '*'
      } else if (ite === 'del') {
        this.value = this.value.slice(0, this.value.length - 1)
        // this.passwordValue = this.passwordValue.slice(0,this.passwordValue.length -1)
      } else if (ite === 'up') {
        this.charState = this.charState === 'lower' ? 'upper' : 'lower'
      } else {
        this.value += this.isUpper ? ite.toUpperCase() : ite
        // this.passwordValue += '*'
      }
      this.inserValue(this.value)
    },
    confirm () {
      this.removeBoardHtml()
    }
  }
}
</script>

<style lang="scss">
@import './index.scss';
</style>
