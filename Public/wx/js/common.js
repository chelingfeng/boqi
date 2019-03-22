function pay(orderId = '', callback = '') {
    if (orderId) {
        if (callback == '') {
            callback = location.href;
        }
        wx.miniProgram.navigateTo({ url: '/pages/pay/pay?orderId=' + orderId + '&callback=' + encodeURIComponent(callback) })
    }
}

function getTime(deadline) {
    var timestamp = parseInt(new Date().getTime() / 1000);
    var times = deadline - timestamp;
    var hour = 0;
    var minute = 0;
    var second = 0;
    if (times > 0) {
        second = times % 60;
        minute = ~~(times / 60) % 60;
        hour = ~~(times / 60 / 60);
    }
    if (second < 10) second = '0' + second;
    if (minute < 10) minute = '0' + minute;
    if (hour < 10) hour = '0' + hour;
    return { hour, minute, second };
}

var $_GET = (function () {
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if (typeof (u[1]) == "string") {
        u = u[1].split("&");
        var get = {};
        for (var i in u) {
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();