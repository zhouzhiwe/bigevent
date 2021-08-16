$(function() {
    var form = layui.form
        // var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })
    initUserInfo()
        // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                form.val('formUserInfo', res.data)
            }
        })
    }
    $("#btnReset").on("click", function(e) {
        e.preventDefault()
            // initUserInfo()
        $(".layui-form")[0].reset()
    })
    $(".layui-form").on("submit", function(e) {
        e.preventDefault()
        $.ajax({
            method: "PUT",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg("请求修改失败")
                }
                layer.msg("请求修改成功")
                window.parent.getUserinfo()
            }
        })
    })
})