import Axios from 'axios'
import { Loading, Message, MessageBox } from 'element-ui'
// 超时时间
Axios.defaults.timeout = 5000
// http请求拦截器
Axios.interceptors.request.use(config => {
    return config   //放行请求
}, error => {
    Message.error({
        message: '网络不给力,请稍后再试'
    })
    return error
})
//   http响应拦截器
Axios.interceptors.response.use(data => {
    // 响应成功关闭loading
    const code = data.data.code;
    if (code == -2) { //未登录
        MessageBox.alert('请先登录', '提示', {
            confirmButtonText: '确定',
            callback: action => {
                window.location.href = '/login'
            }
        });
    }
    return data
}, error => {
    Message.error({
        message: '网络不给力,请稍后再试'
    })
    return Promise.reject(error)
})