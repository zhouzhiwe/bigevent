$(function() {
    initCate()
    var layer = layui.layer
    var form = layui.form
    initEditor()

    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/cate/list',
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg("初始化文章分类失败！")
                }
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $("#btnChooseImage").on("click", function() {
        console.log(111);
        $("#coverFile").click()
    })
    $("#coverFile").on("change", function(e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
            // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    var art_state = '已发布'
    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })
    $("#form-pub").on("submit", function(e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])
        fd.append("state", art_state)
            // console.log(fd.get("state"));

        // fd.forEach(function(v, k) {
        //     console.log(v, k);
        // })
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })

    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg("发布文章失败！")
                }
                layer.msg("发布文章成功！")
                location.href = "/article/art_list.html"
            }
        })
    }
})