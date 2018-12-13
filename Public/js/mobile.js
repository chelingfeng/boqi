'use strict';



$(function () { 
     $(document).on("pageInit", "#graduation-search", function(e, id, page) { 
           // 搜索按钮
            $(page).on('click', '.button-search', function(){
                var strValue = $('#txt_Value').val();
                $.post(hqb.root+"/index.php?m=Apartment&c=Index&a=graduationsearch", {
                strValue: strValue,               
                }, function(res) {
                     if(res == "")
                     { 
                         document.getElementById("div_search").style.display="none";
                         document.getElementById("div_detail").style.display="none";   
                         document.getElementById("d_Notstudent").style.display="";                  
                     }
                    else
                     {
                        document.getElementById("d_Notstudent").style.display="none"; 
                        document.getElementById("div_search").style.display="none";
                        document.getElementById("div_detail").style.display=""; 
                        document.getElementById('d_studentName').innerHTML=res.studentName;
                        document.getElementById('d_studentNumber').innerHTML=res.studentNumber;
                        document.getElementById('d_collegeName').innerHTML=res.collegeName;
                        document.getElementById('d_className').innerHTML=res.className;
                        document.getElementById('d_bedName').innerHTML=res.bedName;

                        if(res.unPassedDep != "")
                        {
                             var unPassedDep = res.unPassedDep;//.substring(1);
                             document.getElementById('d_unPassedDep').innerHTML=unPassedDep;
                             document.getElementById("d_NotPay").style.display="";  
                             document.getElementById("d_YesPay").style.display="none";
                        }
                        else
                        {
                            document.getElementById('d_unPassedDep').innerHTML='无';
                            document.getElementById("d_YesPay").style.display=""; 
                            document.getElementById("d_NotPay").style.display="none";  
                        }                         
                     }
                    
                    
                }, 'json');

            });


            $(page).on('click','.button-sure',function(){           
                      Isdisplay();          
            });


            $(page).on('click','.button-nostudent',function(){           
                      Isdisplay();                 
            });


            function Isdisplay()
            {
                   document.getElementById("div_search").style.display="";
                   document.getElementById("div_detail").style.display="none";                                 
                   document.getElementById("d_NotPay").style.display="none";  
                   document.getElementById("d_YesPay").style.display="none"; 
                   document.getElementById("d_Notstudent").style.display="none";   
            }

     });


    // 初始化入口
    $.init();

});
