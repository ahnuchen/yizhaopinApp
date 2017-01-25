<template>
  <div>
    <Xheader :left-options="{showBack: false}">易招聘</Xheader>
    <div class="jobs-content" v-show="active==='职位'">
      <div v-for="job in jobList">
        <job-panel :job="job"></job-panel>
      </div>
      <div class="load-more" v-if="jobList.length >= 8"><span v-show="showLoadMore"
                                                              @click="loadMore">{{loadMoreText}}</span>
        <spinner v-show="!showLoadMore" type="ios-small"></spinner>
      </div>
    </div>
    <div class="resume-content" v-show="active==='简历'">
      <SentResume></SentResume>
    </div>
    <div class="personal-content" v-show="active==='我的'">
      个人中心
    </div>
    <tabbar style="position: fixed;">
      <tabbar-item selected @click.native="active = '职位'">
        <img slot="icon" src="./house.png">
        <span slot="label">职位</span>
      </tabbar-item>
      <tabbar-item @click.native="active = '简历'">
        <img slot="icon" src="./resume.svg">
        <span slot="label">简历</span>
      </tabbar-item>
      <tabbar-item @click.native="active = '我的'">
        <img slot="icon" src="./people.png">
        <span slot="label">我的</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
  import Xheader from 'vux/src/components/x-header/index.vue'
  import Xinput from 'vux/src/components/x-input/index.vue'
  import Xbutton from 'vux/src/components/x-button/index.vue'
  import JobPanel from '../JobPanel/JobPanel.vue'
  import SentResume from '../SentResume/SentResume.vue'
  import {Divider, Group, Tabbar, TabbarItem, Panel, Scroller, Spinner} from 'vux'
  export default {
    components: {
      Divider,
      Xheader,
      Group,
      Xinput,
      Xbutton,
      Tabbar,
      TabbarItem,
      Panel,
      Scroller,
      Spinner,
      JobPanel,
      SentResume
    },
    data () {
      return {
        active: '职位',
        jobs: [],
        findKey: {
          currentPage: 0,
          countPerPage: 8
        },
        type: '1',
        jobList: [],
        showLoadMore: true,
        loadMoreText: '加载更多...'
      }
    },
    created () {
      this.$http.post('getAlljobs', this.findKey).then((_res) => {
        if (_res.body.success) {
          this.jobs = _res.body.data.rows
          this.jobList = this.jobList = this.jobList.concat(this.jobs)
        } else {
          this.$vux.toast.show('获取职位失败')
        }
      })
    },
    methods: {
      loadMore () {
        this.findKey.currentPage++
        this.showLoadMore = !this.showLoadMore
        this.$http.post('getAlljobs', this.findKey).then((_res) => {
          if (_res.body.success) {
            this.jobs = _res.body.data.rows
            this.jobList = this.jobList.concat(this.jobs)
            if (_res.body.data.count === this.jobList.length) {
              this.loadMoreText = '已经没有了～'
            }
            this.showLoadMore = !this.showLoadMore
          } else {
            this.$vux.toast.show('获取职位失败')
            this.showLoadMore = !this.showLoadMore
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .jobs-content {
    margin-bottom: 64px;
  }

  .load-more {
    text-align: center;
  }
</style>
