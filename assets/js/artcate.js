$(function() {
    initArtCateList()
    var layer = layui.layer
    var form = layui.form

    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/cate/list",
            success: function(res) {

                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
            }
        })
    }
    var indexAdd = null;
    $("#addCate").on("click", function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        })
    })
    $("body").on("submit", "#form-add", function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/cate/add",
            data: $(this).serialize(),
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg("新增分类失败")
                }
                layer.msg("新增分类成功")
                initArtCateList()
                layer.close(indexAdd)
            }
        })
    })
    var indexEdit = null;
    $("tbody").on("click", ".btn-edit", function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });
        var id = $(this).attr("data-id")
        console.log(id);
        $.ajax({
            method: "GET",
            url: '/my/cate/info?id=' + id,
            success: function(res) {
                form.val("form-edit", res.data)
            }
        })
    })
    $("body").on("submit", "#form-edit", function(e) {
        e.preventDefault()
        $.ajax({
            method: "PUT",
            url: '/my/cate/info',
            data: $(this).serialize(),
            success: function(res) {
                if (res.code !== 0) {
                    return layer.msg("修改分类失败")
                }
                layer.msg("修改分类成功")
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    $("tbody").on("click", ".btn-del", function() {
        var id = $(this).attr("data-id")
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'delete',
                url: '/my/cate/del?id=' + id,
                success: function(res) {
                    if (res.code !== 0) {
                        return layer.msg("删除分类失败")
                    }
                    layer.msg("删除分类成功")
                    layer.close(index);
                    initArtCateList()
                }
            })
        });
    })
})