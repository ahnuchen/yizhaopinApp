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
            <Xinput v-model="confirmPassword" type="password" title="确认密码" @input.native="confirmPasswordState = ''"
                    novalidate :icon-type="confirmPasswordState" placeholder="请确认密码..."
                    :show-clear="false"></Xinput>
        </group>
        <group>
            <Xbutton type="primary" @click.native="signUp">注册</Xbutton>
            <divider>已经有账号?</divider>
            <router-link to="/">
                <Xbutton plain type="primary">去登录</Xbutton>
            </router-link>
        </group>
    </div>
</template>

<script type="es6">
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
                confirmPassword: '',
                userNameState: '',
                passwordState: '',
                confirmPasswordState: ''
            }
        },
        methods: {
            signUp () {
                if (!this.userName) {
                    this.$vux.toast.show({text: '请填写用户名!', type: 'warn'})
                    this.userNameState = 'error'
                } else if (!this.userPassword) {
                    this.$vux.toast.show({text: '请设置密码!', type: 'warn'})
                    this.passwordState = 'error'
                } else if (!this.confirmPassword) {
                    this.$vux.toast.show({text: '请确认密码!', type: 'warn'})
                    this.confirmPasswordState = 'error'
                } else if (this.userPassword !== this.confirmPassword) {
                    this.$vux.toast.show({text: '两次密码输入不一致!', type: 'warn'})
                } else {
                    this.$http.post('signUp', {
                        Account: this.userName,
                        Password: this.userPassword
                    }).then((response) => {
                        let self = this
                        if (response.body.success) {
                            this.$vux.alert.show({
                                title: '提示', content: '注册成功！', onHide () {
                                    self.$router.push('/')
                                }
                            })
                        } else {
                            this.$vux.alert.show({content: response.body.error.message, title: '注册失败'})
                        }
                    })
                }
            }
        }
    }
</script>

<style>
</style>
