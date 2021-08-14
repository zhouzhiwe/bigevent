$(function() {
    $("#link-reg").on("click", function() {
        $(".login-box").hide().siblings(".reg-box").show()
    })
    $("#link-login").on("click", function() {
        $(".reg-box").hide().siblings(".login-box").show()
    })
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return "两次密码不一致"
            }
        }
    })
    $("#reg-form").on("submit", function(e) {
        e.preventDefault()
        var data = {
            username: $("#reg-form [name=username]").val(),
            password: $("#reg-form [name=password]").val(),
            repassword: $("#reg-form [name=repassword]").val()
        };
        // console.log(data);

        $.post("/api/reg", data, function(res) {
            // console.log(res);
            if (res.code !== 0) {
                return layer.msg(res.message)
            }
            layer.msg("注册成功，请登录！");
            $("#link-login").click()
        })
    })
    $("#login-form").submit(function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg("登录失败")
                }
                layer.msg("登录成功")
                localStorage.setItem('token', res.token)
                    // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})