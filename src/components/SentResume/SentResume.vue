<template>
  <div class="resumes" v-if="resumes">
    <tab>
      <tab-item :selected="resumeState === '已投递'" @click.native="resumeState = '已投递';resumeStateNum = 1">
        已投递
      </tab-item>
      <tab-item :selected="resumeState === '待沟通'" @click.native="resumeState = '待沟通';resumeStateNum = 2">
        待沟通
      </tab-item>
      <tab-item :selected="resumeState === '面试'" @click.native="resumeState = '面试';resumeStateNum = 3">面试
      </tab-item>
      <tab-item :selected="resumeState === '不合适'" @click.native="resumeState = '不合适';resumeStateNum = 4">不合适
      </tab-item>
    </tab>
    <panel :list="resumeList"></panel>
  </div>
</template>
<script type="es6">
  import tools from '../../utils/tools'
  import {Tab, TabItem, Panel} from 'vux'
  export default {
    components: {
      Tab,
      TabItem,
      Panel
    },
    data () {
      return {
        resumes: {},
        resumeState: '已投递',
        resumeStateNum: 1,
        resumeList: []
      }
    },
    created () {
      let self = this
      this.$http.post('getSentResume', {token: tools.getStorage('token')}).then((_res) => {
        console.log(_res)
        if (_res.body.success) {
          this.resumes = _res.body.data.resumes
          this.resumes.forEach((_resume) => {
            if (_resume.jobApply.Process === this.resumeStateNum) {
              this.resumeList.push({
                src: tools.imageHost + _resume.CompanyLogo,
                title: _resume.CompanyName,
                desc: _resume.Brief
              })
            }
          })
        } else if (_res.body.error.code === 6) {
          this.$vux.alert.show({
            title: '提示',
            content: '登录已失效!',
            onHide () {
              self.$router.push('/')
            }
          })
        }
      })
    },
    watch: {
      resumeStateNum: {
        handler: function (val) {
          this.resumeList = []
          this.resumes.forEach((_resume) => {
            if (_resume.jobApply.Process === val) {
              this.resumeList.push({
                src: tools.imageHost + _resume.CompanyLogo,
                title: _resume.CompanyName,
                desc: _resume.Brief
              })
            }
          })
        },
        deep: true
      }
    }
  }
</script>
<style lang="less"></style>
