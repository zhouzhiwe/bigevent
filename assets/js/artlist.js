$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    function padZero(n) {
        return n > 9 ? n : "0" + n
    }
    template.defaults.imports.dataFormat = function(date) {
        var dt = new Date(date)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var h = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var s = padZero(dt.getSeconds())
        return y + "-" + m + "-" + d + " " + h + ":" + mm + ":" + s
    }
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable()
    initCate()

    function initTable() {
        $.ajax({
            method: "GET",
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.code) {
                    return layer.msg('获取文章列表失败！')
                }
                var htmlStr = template("tpl-table", res)
                $("tbody").html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/cate/list',
            success: function(res) {
                // console.log(res);
                if (res.code !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }
    $("#form-search").on("submit", function(e) {
        e.preventDefault()
        var cate_id = $("[name=cate_id]").val()
        var state = $("[name=state]").val()
        q.cate_id = cate_id
        q.state = state
        initTable()
    })

    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum,
            limits: [2, 3, 5, 10],
            layout: ["count", "limit", 'prev', 'page', 'next', "skip"], // 设置默认被选中的分页
            jump: function(obj, first) {
                // console.log(obj.curr);
                // console.log(first);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        });
    }
    $("tbody").on("click", ".btn-del", function() {
        var id = $(this).attr("data-id")
        var len = $(".btn-del").length
        console.log(id);
        console.log(len);

        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: "DELETE",
                url: '/my/article/info?id=' + id,
                success: function(res) {
                    console.log(res);
                    if (res.code !== 0) {
                        return layer.msg("删除失败")
                    }
                    layer.msg("删除成功")
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})