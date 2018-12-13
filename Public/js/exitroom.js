

$(function () { 
     $(document).on("pageInit", "#graduation-search", function(e, id, page) {

            $("#btnsearch").click(function(){
                var schoolcode = $("input[name='schoolcode']").val();
                var studentnumber = $("#studentnumber").val();
                if(studentnumber == ''){
                    $.alert('请输入学号');
                    return false;
                }
                $.showIndicator();
                $.ajax({
                    type: 'post',
                    url: search_url,
                    data: {schoolcode:schoolcode, studentnumber:studentnumber},
                    success:function(data){
                        console.log(data);
                        if(data.code == 0){
                            $("#div_search, .nomy, .noroom").hide();
                            $("#div_detail").show();
                            $("#mylist li, #roomlist li").remove();
                            $("#Name").html(data.data.Name);
                            $("#studentNumber").html(data.data.studentNumber);
                            $("#collegeName").html(data.data.collegeName);
                            $("#className").html(data.data.className);
                            $("#bedName").html(data.data.bedName);
                            if(data.data.roomList != '无违欠'){
                                for(i = 0; i < data.data.roomList.length; i++){
                                    $("#roomlist").append("<li>"+data.data.roomList[i].Nature+"</li>")
                                }
                            }else{
                                $(".noroom").show();
                            }
                            if(data.data.bedList != '无违欠'){
                                for(i = 0; i < data.data.bedList.length; i++){
                                    $("#mylist").append("<li>"+data.data.bedList[i].Nature+"</li>")
                                }
                            }else{
                                $(".nomy").show();
                            }
                        }else if(data.code == 40012){
                            $("#div_search").hide();
                            $("#d_Notstudent").show();
                        }else{
                            $.alert(code.msg);
                        }
                        $.hideIndicator();
                    }
                });
            });

            $(".button-nostudent").click(function(){
                $("#studentnumber").val('');
                $("#div_search").show();
                $("#d_Notstudent").hide();
            });

            $(".button-sure").click(function(){
                $("#studentnumber").val('');
                $("#div_search").show();
                $("#d_Notstudent, #div_detail").hide();
            });

     });

    // 初始化入口
    $.init();

});
