$(function () {
    'use strict';

    $(document).on("pageInit", "", function (e, id, page) {

    });

    //登录
    $(document).on("pageInit", "#page-admin-login", function (e, id, page) {
        
    });

    //首页
    $(document).on("pageInit", "#page-admin-index", function (e, id, page) {

    });

    //首页
    $(document).on("pageInit", "#page-admin-data", function (e, id, page) {
        F2.Global.setTheme({
            colors: ["#f9bf1f"]
        })
        var data = [{
            day: '周一',
            value: 300
        }, {
            day: '周二',
            value: 400
        }, {
            day: '周三',
            value: 350
        }, {
            day: '周四',
            value: 500
        }, {
            day: '周五',
            value: 490
        }, {
            day: '周六',
            value: 600
        }, {
            day: '周日',
            value: 900
        }];
        var chart = new F2.Chart({
            id: 'mountNode',
            pixelRatio: window.devicePixelRatio
        });

        chart.source(data, {});
        chart.tooltip({
            showCrosshairs: true,
            showItemMarker: false,
            onShow: function onShow(ev) {
                var items = ev.items;
                items[0].name = null;
                items[0].value = '$ ' + items[0].value;
            }
        });
        chart.axis('day', {
            label: function label(text, index, total) {
                var textCfg = {};
                if (index === 0) {
                    textCfg.textAlign = 'left';
                } else if (index === total - 1) {
                    textCfg.textAlign = 'right';
                }
                return textCfg;
            }
        });
        chart.line().position('day*value');
        chart.point().position('day*value').style({
            stroke: '#fff',
            lineWidth: 1
        });
        chart.render();
    });


    $.init();
});