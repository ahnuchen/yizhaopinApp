<!--suppress CssUnknownTarget -->
<template>
  <div>
    <Xheader :left-options="{showBack:true,backText: '返回'}">职位详情</Xheader>
    <div class="sub-header vux-1px-b">
      <span>{{job.Brief}}</span>
      <span style="float: right">收藏</span>
    </div>
    <div class="vux-1px-b reqs">
      <FlexBox>
        <FlexBoxItem>薪水:{{job.minSalary}}K-{{job.maxSalary}}K</FlexBoxItem>
        <FlexBoxItem>工作城市:{{job.City}}</FlexBoxItem>
        <FlexBoxItem>职位类型:{{getTypeById(job.Type)}}</FlexBoxItem>
      </FlexBox>
      <FlexBox>
        <FlexBoxItem>工作经验:{{getExperienceById(job.Experience)}}</FlexBoxItem>
        <FlexBoxItem>最低学历:{{getDegreeById(job.Degree)}}</FlexBoxItem>
      </FlexBox>
    </div>
    <div class="vux-1px-b content">
      <img :src="imageHost+job.CompanyLogo" alt="Logo" width="80" height="80">
      <div class="content-inline">
        <h3>{{job.CompanyName}}</h3>
        <p><span>{{getState(job.CompanyStage)}} </span>/<span> {{getScale(job.CompanyScale)}}</span></p>
      </div>
    </div>
    <div class="divider"><h3>职位描述</h3>
    </div>
    <div v-if="job.Description" class="desc">
      <p v-for="desc in getDesc(job.Description)">{{desc}}</p>
    </div>
    <Xbutton @click.native="submitResume" type="primary" class="submit-btn">投个简历</Xbutton>
  </div>
</template>
<script type="es6">
  import Xheader from 'vux/src/components/x-header/index.vue'
  import FlexBox from 'vux/src/components/flexbox/flexbox.vue'
  import FlexBoxItem from 'vux/src/components/flexbox/flexbox-item.vue'
  import Xbutton from 'vux/src/components/x-button/index.vue'
  import tools from '../../utils/tools'
  export default {
    components: {
      Xheader,
      FlexBox,
      FlexBoxItem,
      Xbutton
    },
    data () {
      return {
        job: {},
        imageHost: tools.imageHost,
        CompanyScale: ['未知', '15人以下', '15-50人', '50-150人', '150-500人', '500-2000人', '2000人以上'],
        CompanyState: ['未知', '不需要融资', '天使轮', 'A轮', 'B轮', 'C轮', 'D轮及以上', '上市公司']
      }
    },
    created () {
      this.$http.post('getAlljobs', {ID: this.$route.params.job_id}).then((_res) => {
        if (_res.body.success) {
          this.job = _res.body.data.rows[0]
        } else {
          this.$vux.toast.show('获取职位详情失败')
        }
      })
    },
    methods: {
      //@学历 {0:大专,1:本科,2：硕士,3:博士,4:不限}
      getDegreeById(id) {
        switch (parseInt(id)) {
          case 0:
            return '大专';
          case 1:
            return '本科';
          case 2:
            return '硕士';
          case 3:
            return '博士';
          case 4:
            return '不限';
        }
      },
      // @职位类型{1:全职,2:兼职,3:实习}
      getTypeById(id) {
        switch (parseInt(id)) {
          case 1:
            return '全职';
          case 2:
            return '兼职';
          case 3:
            return '实习';
        }
      },
      // @工作经验{1:不限,2:应届毕业生,3:1-3年,4:3-5年,5:5-10年}
      getExperienceById(id) {
        switch (parseInt(id)) {
          case 1:
            return '不限';
          case 2:
            return '应届毕业生';
          case 3:
            return '1-3年';
          case 4:
            return '3-5年';
          case 5:
            return '5-10年'
        }
      },
      getDesc (_d) {
        return _d.split('\n')
      },
      getState (id) {
        return this.CompanyState[parseInt(id)]
      },
      getScale (id) {
        return this.CompanyScale[parseInt(id)]
      },
      submitResume () {
        let self = this
        if (!tools.getStorage('token')) {
          this.$vux.confirm.show({
            title: '提示',
            content: '需要登录后才可以投递简历哦',
            confirmText: '去登陆',
            onConfirm () {
              console.log(11111)
              self.$router.push('/')
            }
          })
        } else {
          this.$http.post('addResume', {
            companyID: this.job.companyID,
            token: tools.getStorage('token'),
            jobID: this.$route.params.job_id
          }).then((_res) => {
            console.log(_res)
            if (_res.body.success) {
              this.$vux.toast.show('投递成功！')
            } else {
              this.$vux.confirm.show({
                title: '提示',
                content: '<p style="text-align: center">' + _res.body.error.message + '!</p>',
                confirmText: '去登陆',
                onConfirm () {
                  self.$router.push('/')
                }
              })
            }
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';

  .sub-header {
    height: 44px;
    line-height: 44px;
    padding: 0 5px 0 5px;
  }

  .reqs {
    height: 66px;
    line-height: 33px;
    padding: 5px;
  }

  .desc {
    margin-bottom: 55px;
    padding: 0 10px 0 10px;
  }

  .divider {
    text-align: center;
    height: 30px;
    color: rgb(229, 246, 241);
    background-color: #43ff6c;
  }

  .submit-btn {
    position: fixed;
    bottom: 0;
  }

  .content {
    height: 100px;
  }

  .content img {
    width: 80px;
    height: 80px;
    margin-top: 10px;
  }

  .content-inline {
    display: inline-block;
    height: 100px;
    vertical-align: top;
    margin-top: 20px;
    margin-left: 20px;
  }

</style>
