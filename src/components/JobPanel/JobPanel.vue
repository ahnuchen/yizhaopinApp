<!--suppress CssUnknownTarget -->
<template>
  <router-link :to="'/jobdetail/'+job.ID">
    <div class="panel-body vux-1px-b">
      <div class="left">
        <img :src="imageHost + job.CompanyLogo" alt="Logo" class="logo">
      </div>
      <div class="center">
        <h3 class="company">{{job.CompanyName}}</h3>
        <p class="brief">{{job.Brief}} [ {{job.City}} ]</p>
        <small class="time">{{getSendTime(job.updatedAt,'yyyy-MM-dd')}}</small>
      </div>
      <div class="right">
        <div class="salary">
          {{job.minSalary}}K-{{job.maxSalary}}K
        </div>
      </div>
    </div>
  </router-link>
</template>
<script type="es6">
  import tools from '../../utils/tools'
  const IMAGEHOST = tools.imageHost
  export default {
    name: 'job-panel',
    props: {
      job: {
        type: Object
      }
    },
    data () {
      return {
        imageHost: IMAGEHOST
      }
    },
    methods: {
      getSendTime (_time, fmt){
        let date = tools.formatDate(new Date(_time), fmt)
        if (date === tools.formatDate(new Date(), fmt)) {
          return '今天 ' + tools.formatDate(new Date(_time), 'hh:mm')
        }
        return date
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';

  .panel-body {
    position: relative;
    display: flex;
    width: 100%;
    height: 100px;
    color: #000;
  }

  .left {
    flex: 0 0 100px;
    width: 100px;
    height: 100px;
  }

  .logo {
    width: 80px;
    height: 80px;
    border-radius: 5%;
    margin-top: 6px;
  }

  .center {
    flex: 2;
    padding: 10px 0 10px 0;
  }

  .time {
    color: #999;
  }

  .right {
    flex: 1;
    position: absolute;
    right: 20px;
    height: 100%;
  }

  .salary {
    line-height: 100px;
    color: #00b912;
  }
</style>
