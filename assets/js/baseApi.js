// $.ajaxPrefilter(function(options) {
//     // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
//     options.url = 'http://ajax.frontend.itheima.net' + options.url
//   })
$.ajaxPrefilter(function(options) {
    // console.log(options);

    options.url = "http://www.liulongbin.top:3008" + options.url
})