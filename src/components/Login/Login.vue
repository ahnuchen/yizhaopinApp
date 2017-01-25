<template>
  <div>
    <Xheader :left-options="{showBack: false}">登录</Xheader>
    <group>
      <Xinput v-model="userName" type="text" title="账号" novalidate @input.native="userNameState = ''"
              :icon-type="userNameState" placeholder="请输入用户名..."
              :show-clear="false"></Xinput>
      <Xinput v-model="userPassword" type="password" title="密码" @input.native="passwordState = ''"
              novalidate :icon-type="passwordState" placeholder="请输入密码..."
              :show-clear="false"></Xinput>
    </group>
    <group>
      <Xbutton type="primary" @click.native="login">登录</Xbutton>
      <divider>还没有账号?</divider>
      <router-link to="/register">
        <Xbutton plain type="primary">去注册</Xbutton>
      </router-link>
    </group>
  </div>
</template>

<script>
  import Tools from '../../utils/tools'
  import Xheader from 'vux/src/components/x-header/index.vue'
  import Xinput from 'vux/src/components/x-input/index.vue'
  import Xbutton from 'vux/src/components/x-button/index.vue'
  import {Divider, Group} from 'vux'

  export default {
    components: {
      Divider,
      Xheader,
      Group,
      Xinput,
      Xbutton
    },
    data () {
      return {
        userName: '',
        userPassword: '',
        res: {},
        userNameState: '',
        passwordState: ''
      }
    },
    methods: {
      login () {
        if (!this.userName) {
          this.$vux.toast.show({text: '请输入用户名', type: 'warn', time: 1000})
          this.userNameState = 'error'
        } else if (!this.userPassword) {
          this.$vux.toast.show({text: '请输入密码', type: 'warn', time: 1000})
          this.passwordState = 'error'
        } else {
          this.$http.post('signIn', {
            Account: this.userName,
            Password: this.userPassword
          }).then((response) => {
            this.res = response.body
            if (this.res.success) {
              this.$vux.toast.show('登陆成功！')
              Tools.setStorage('token', this.res.data.token)
              Tools.setStorage('userInfo', this.res.data.user)
              this.$router.push('/home')
            } else {
              this.$vux.alert.show({title: '登录失败!', content: this.res.error.message})
            }
          }, () => {
            this.$vux.alert.show({title: '登录失败!', content: '无法连接服务器...'})
          })
        }
      }
    }
  }
</script>

<style scoped>
</style>
