$(document).ready(function(){
    $(window).resize(function () {          
        if($(window).width() < 1650){
            $("body").css('zoom', $(window).width() / 1700);
        }
    });
    if($(window).width() < 1650){
        $("body").css('zoom', $(window).width() / 1700);
        // alert($(window).height() / 1700);
    }
    function showCase(obj){
        var w_height = $(window).height();
        $(obj+" .case").each(function(index){
            var thisTop = $(this).offset().top;
            if(thisTop - w_height < 100){
                $(this).addClass('on');
            }
        });
    }
    $("#guanggao .mask a").css('width', (100 / $(".mask a").length) + '%');
    $("#guanggao .mask").css('width', (100 * $(".mask a").length) + '%');
    // showCase('#index-case');
    // showCase('#work-case');
    $('body').scroll(function(){
        showCase('#index-case');
        showCase('#work-case');
    });

    

    setTimeout(function(){
        var g_width  = $("#guanggao").width();
        var g_height = $("#guanggao").height();
        $("#guanggao .sz").css('top', g_height - 60).css('left', g_width/2 - ($('#guanggao .sz').width() - 20)/2).show();
        $("#guanggao .left").css('left', 70).css('top', g_height/2 ).show().click(function(){
            var index = $("#guanggao .sz .liang").index();
            if(index == 0){
                index = $("#guanggao .sz span").length - 1;
            }else{
                index--;
            }
            $("#guanggao .sz span:eq("+index+")").trigger('mouseover');
            window.clearInterval(time);
            time = setInterval(function(){
                $("#guanggao .right").trigger('click');
            }, 6000);
        });
        $("#guanggao .right").css('right', 70).css('top', g_height/2 ).show().click(function(){
            var index = $("#guanggao .sz .liang").index();
            if(index == ($("#guanggao .sz span").length) - 1){
                index = 0;
            }else{
                index++;
            }
            $("#guanggao .sz span:eq("+index+")").trigger('mouseover');
            window.clearInterval(time);
            time = setInterval(function(){
                $("#guanggao .right").trigger('click');
            }, 6000);
        });
    }, 2000)

    $("#guanggao .sz span").mouseover(function(){
        var marginLeft = 100 * $(this).index();
        $("#guanggao .mask").animate({
            marginLeft:'-'+marginLeft+'%',
        }, 900);
        $("#guanggao .sz span").removeClass('liang');
        $("#guanggao .sz span:eq("+$(this).index()+")").addClass('liang');
    });

    $(".case").mouseover(function(){
        var width  = $(this).width();
        var height = $(this).height();
        $(this).css('width', width).css('height', height);
        $(this).find('img').animate({
            height:(height*1.2)+'px',
            width:(width*1.2)+'px',
            marginLeft:'-'+(width*0.1)+'px',
            marginTop:'-'+(height*0.1)+'px',
        }, 300);
        $(this).find('.desc').fadeIn();
    }).mouseleave(function(){
        $(this).find('img').animate({
            height:'100%',
            width:'100%',
            marginLeft:'0px',
            marginTop:'0px',
        }, 300);
        $(this).find('.desc').fadeOut();
    });

    $("#work-nav ul li").mouseover(function(){
        if($(this).hasClass('on')){ return false; }
        $(this).find('p').animate({
            width:'50%',
        }, 300);
    }).mouseleave(function(){
        if($(this).hasClass('on')){ return false; }
        $(this).find('p').animate({
            width:'0%',
        }, 300);
    });

    // $(".show_img").attr('src', $(".thumb li img:eq(0)").attr('data-img'));
    $("#detail .show_img").css('width', (100 / $(".show_img").length) + '%');
    $("#detail .mask").css('width', (100 * $(".show_img").length) + '%');
    $(".thumb li").click(function(){
        $(".thumb li").removeClass('liang');
        $(this).addClass('liang');
        var marginLeft = 100 * $(this).index();
        $("#detail .mask").animate({
            marginLeft:'-'+marginLeft+'%',
        }, 600);
        // $(".show_img").attr('src', $(this).find('img').attr('data-img'));
    });

    

    setInterval(function(){ changePoint(); }, 1200);

    function changePoint(){
        $(".point").animate({
            height:'28px',
            width:'28px',
            top:'86px',
            left:'1146px',
        }, 600).animate({
            height:'38px',
            width:'38px',
            top:'80px',
            left:'1140px',
        }, 600);
    }

});
