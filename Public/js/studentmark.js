$(function(){ 


      $(document).on("pageInit","#useraccount_checkdetails",function(e , id , page) { 


            $('.imgBox').click(function(){
                var imgsrc = $(this).attr('data-src');
                $('.box').show();
                $('.box img').attr('src',imgsrc);
            })

            $('.box').click(function(){ 
              $('.box').hide()
            })
 
            var data = $.parseJSON($('#data').val()); 

            if(data.roomscoreid == ''){
                $.alert('还未考核，不能查询', function () {
                    var studentNumber = sessionStorage.getItem('studentNumber');
                    var url = hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=index&token="+hqb.token+"&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"&studentNumber="+studentNumber;
                    window.location.href = url;
                });
            }

            roomClearItemList = data.roomClearItemList;
            if (roomClearItemList.length > 0) {
                for (var i = 0; i < roomClearItemList.length; i++) {
                   $('#item_'+roomClearItemList[i].itemid).text(roomClearItemList[i].score);
                   if (roomClearItemList[i].score2 != '') {
                      $('.notmark').show();
                      $('#item_second_'+roomClearItemList[i].itemid).text(roomClearItemList[i].score2);
                   }else{
                      $('.notmark').hide();
                      $('#div_second_'+roomClearItemList[i].itemid).hide();
                   } 
                };
            }else{
               $('.notmark').hide();
            }
            
          perList = data.perList;

          for (var i = 0; i < perList.length; i++) {
             for (var a = 0; a < perList[i].itemList.length; a++) {
                itemList = perList[i].itemList;
                var totalscore = 0;
                var pick       = 0;
                var pick2       = 0;
                for (var b = 0; b < itemList.length; b++) {
                      totalscore  += ($('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-fullmark')*1.0);
                      pick        += (itemList[b].score*1.0);
                      pick2        += (itemList[b].score2*1.0);  
                     if(itemList[b].appealed == 0){
                          $('#peopleappeal_'+itemList[b].bedid).show();
                          $('#ispeopleappeal_'+itemList[b].bedid).hide();
                          $('#peopleappeal_'+itemList[b].bedid).attr('data-perscoreid',itemList[b].perscoreid); 

                          $('#peopleappeal_'+itemList[b].bedid).attr('data-bedid',itemList[b].bedid);
                          $('#ispeopleappeal_'+itemList[b].bedid).attr('data-bedid',itemList[b].bedid);
                     }
                     else{
                          $('#peopleappeal_'+itemList[b].bedid).hide();
                          $('#ispeopleappeal_'+itemList[b].bedid).hide();
                     }
                     $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).text(itemList[b].score);
              
                     if (itemList[b].score2 != '') {
                        $('#peopleappeal').hide();   
                        $('.lbl_score2_'+itemList[b].bedid).show();            
                        $('#bed_second_'+itemList[b].bedid+'_'+itemList[b].itemid).text(itemList[b].score2);
                     }else{
                        $('.lbl_score2_'+itemList[b].bedid).hide();          
                        $('#div_second_'+itemList[b].bedid+'_'+itemList[b].itemid).text(itemList[b].score2);
                     }
                };  
                $('#lbl_score2_'+perList[i].bedid).text(100 - (totalscore*1.0 - (pick2*1.0)) );
                $('#lbl_'+perList[i].bedid).text(100 - (totalscore*1.0 - (pick*1.0)) );
                if ($('#lbl_'+perList[i].bedid).text() >= 100) {
                  $('#speopleappeal_'+ perList[i].bedid).hide();
                }
             }; 
          };

 


    //寝室分申诉(抽查)
    $('.btn_roomappeal').click(function(){
            var roomscoreid = $('#roomscoreid').val();
            $.confirm('确认要申诉吗？', function () {
                $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=check_roomappeal",
                {
                  roomscoreid:roomscoreid,  
                },function (data)
                {  
                   if (data.code == 0) {
                      $.alert('申诉成功');        
                      $('#roomappeal').hide();
                      $('#isroomappeal').show();
                   }else{
                      $.alert(data.msg);
                      return false;
                   }

                },'json')
            }); 
    })
    //个人分申诉(抽查)
    $('.btn_peopleappeal').click(function(){
          var perscoreid = $(this).attr('data-perscoreid');
          var bedid = $(this).attr('data-bedid');

          $.confirm('确认要申诉吗？', function () {
              $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=check_perappeal",
              {
                perscoreid:perscoreid,  
              },function (data)
              {  
                  if (data.code == 0) {

                     $.alert('申诉成功');        
                     $('#peopleappeal_'+bedid).hide();
                     $('#ispeopleappeal_'+bedid).show();  
                   }else{
                      $.alert(data.msg);
                      return false;
                   }
              },'json')
          }); 
    })

  })


  $(document).on("pageInit","#useraccount_weekdetails",function(e , id , page) { 
      var data = $.parseJSON($('#data').val());
      console.log(data); 
       if(data.roomscoreid == ''){
          $.alert('还未考核，不能查询', function () {
              var studentNumber = sessionStorage.getItem('studentNumber');
              var url = hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=index&token="+hqb.token+"&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"&studentNumber="+studentNumber;
              window.location.href = url;
          });
      }

      roomClearItemList = data.roomClearItemList;
      if(roomClearItemList.length > 0){
          for (var i = 0; i < roomClearItemList.length; i++) {
               $('#item_'+roomClearItemList[i].itemid).text(roomClearItemList[i].score);
               if (roomClearItemList[i].score2 != '') {
                  $('.notmark').show();
                  $('#item_second_'+roomClearItemList[i].itemid).text(roomClearItemList[i].score2);
               }else{
                  $('.notmark').hide();
                  $('#div_second_'+roomClearItemList[i].itemid).hide();
               }     
          };
      }else{
         $('.notmark').hide();
      }
    

      perList = data.perList;
      console.log(perList);
      var studentNumber = sessionStorage.getItem('studentNumber');
      var schoolcode = sessionStorage.getItem('schoolcode');
      for (var i = 0; i < perList.length; i++) {
         for (var a = 0; a < perList[i].itemList.length; a++) {
            itemList = perList[i].itemList;
            var totalscore = 0;
            var pick       = 0;
            var pick2       = 0;
            for (var b = 0; b < itemList.length; b++) {
                  totalscore  += ($('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-fullmark')*1.0);
                  pick        += (itemList[b].score*1.0);
                  pick2        += (itemList[b].score2*1.0);  
                 if(itemList[b].appealed == 0){
                      $('#peopleappeal_'+itemList[b].bedid).show();
                      $('#ispeopleappeal_'+itemList[b].bedid).hide();
                      $('#peopleappeal_'+itemList[b].bedid).attr('data-perscoreid',itemList[b].perscoreid); 

                      $('#peopleappeal_'+itemList[b].bedid).attr('data-bedid',itemList[b].bedid);
                      $('#ispeopleappeal_'+itemList[b].bedid).attr('data-bedid',itemList[b].bedid);
                 }
                 else{
                      $('#peopleappeal_'+itemList[b].bedid).hide();
                      $('#ispeopleappeal_'+itemList[b].bedid).hide();
                 }
                 $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).text(itemList[b].score);
          
                 if (itemList[b].score2 != '') {
                    $('#peopleappeal').hide();   
                    $('.lbl_score2_'+itemList[b].bedid).show();             
                    $('#bed_second_'+itemList[b].bedid+'_'+itemList[b].itemid).text(itemList[b].score2);
                 }else{
                    $('.lbl_score2_'+itemList[b].bedid).hide();    
                    $('#div_second_'+itemList[b].bedid+'_'+itemList[b].itemid).text(itemList[b].score2);
                 }  
            };  
            $('#lbl_score2_'+perList[i].bedid).text(100 - (totalscore*1.0 - (pick2*1.0)) );
            $('#lbl_'+perList[i].bedid).text(100 - (totalscore*1.0 - (pick*1.0)) );

            if ($('#lbl_'+perList[i].bedid).text() >= 100) {                  
                $('#speopleappeal_'+ perList[i].bedid).hide();
            } 
         }; 
      };

      
      $('.imgBox').click(function(){
          var imgsrc = $(this).attr('data-src');
          $('.box').show();
          $('.box img').attr('src',imgsrc);
      })

      $('.box').click(function(){ 
        $('.box').hide()
      })

    //寝室分申诉(月)
    $('.btn_roomappeal').click(function(){
            var roomscoreid = $('#roomscoreid').val();

            $.confirm('确认要申诉吗？', function () {
                $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=week_roomappeal",
                {
                  roomscoreid:roomscoreid,  
                },function (data)
                {  
                   if (data.code == 0) {
                      $.alert('申诉成功');        
                      $('#roomappeal').hide();
                      $('#isroomappeal').show();
                   }else{
                      $.alert(data.msg);
                      return false;
                   }

                },'json')
            }); 
    })

    $('.btn_peopleappeal').click(function(){
          var perscoreid = $(this).attr('data-perscoreid');
          var bedid = $(this).attr('data-bedid');

          $.confirm('确认要申诉吗？', function () {
              $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=week_perappeal",
              {
                perscoreid:perscoreid,  
              },function (data)
              {  
                  if (data.code == 0) {

                     $.alert('申诉成功');        
                     $('#peopleappeal_'+bedid).hide();
                     $('#ispeopleappeal_'+bedid).show();  
                   }else{
                      $.alert(data.msg);
                      return false;
                   }
              },'json')
          }); 
    })

  })

  $(document).on("pageInit","#useraccount_mothdetails",function(e , id , page) { 

      $('.imgBox').click(function(){
          var imgsrc = $(this).attr('data-src');
          $('.box').show();
          $('.box img').attr('src',imgsrc);
      })

      $('.box').click(function(){ 
          $('.box').hide()
      })

      var data = $.parseJSON($('#data').val());
      if(data.roomscoreid == ''){
          $.alert('还未考核，不能查询', function () {
              var studentNumber = sessionStorage.getItem('studentNumber');
              var url = hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=index&token="+hqb.token+"&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"&studentNumber="+studentNumber;
              window.location.href = url;
          });
      }
       
      roomClearItemList = data.roomClearItemList;
      if (roomClearItemList.length > 0) {
        for (var i = 0; i < roomClearItemList.length; i++) {
             $('#item_'+roomClearItemList[i].itemid).text(roomClearItemList[i].score);
             if (roomClearItemList[i].score2 != '') {
                $('.notmark').show();
                $('#item_second_'+roomClearItemList[i].itemid).text(roomClearItemList[i].score2);
             }else{
                $('.notmark').hide();
                $('#div_second_'+roomClearItemList[i].itemid).hide();
             }
        };
      }else{
        $('.notmark').hide();
      }
      

      perList = data.perList;     
      var studentNumber = sessionStorage.getItem('studentNumber');
      var schoolcode = sessionStorage.getItem('schoolcode');
      for (var i = 0; i < perList.length; i++) {
         for (var a = 0; a < perList[i].itemList.length; a++) {
            itemList = perList[i].itemList;
            var totalscore = 0;
            var pick       = 0;
            var pick2       = 0;
            for (var b = 0; b < itemList.length; b++) {
                  totalscore  += ($('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-fullmark')*1.0);
                  pick        += (itemList[b].score*1.0);
                  pick2        += (itemList[b].score2*1.0);  
                 if(itemList[b].appealed == 0){
                      $('#peopleappeal_'+itemList[b].bedid).show();
                      $('#ispeopleappeal_'+itemList[b].bedid).hide();
                      $('#peopleappeal_'+itemList[b].bedid).attr('data-perscoreid',itemList[b].perscoreid); 

                      $('#peopleappeal_'+itemList[b].bedid).attr('data-bedid',itemList[b].bedid);
                      $('#ispeopleappeal_'+itemList[b].bedid).attr('data-bedid',itemList[b].bedid);
                 }
                 else{
                      $('#peopleappeal_'+itemList[b].bedid).hide();
                      $('#ispeopleappeal_'+itemList[b].bedid).hide();
                 }
                 $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).text(itemList[b].score);
          
                 if (itemList[b].score2 != '') {
                    $('#peopleappeal').hide();   
                    $('.lbl_score2_'+itemList[b].bedid).show();                      
                    $('#bed_second_'+itemList[b].bedid+'_'+itemList[b].itemid).text(itemList[b].score2);
                 }else{
                    $('.lbl_score2_'+itemList[b].bedid).hide();      
                    $('#div_second_'+itemList[b].bedid+'_'+itemList[b].itemid).text(itemList[b].score2);
                 }  
            };  
            $('#lbl_score2_'+perList[i].bedid).text(100 - (totalscore*1.0 - (pick2*1.0)) );
            $('#lbl_'+perList[i].bedid).text(100 - (totalscore*1.0 - (pick*1.0)) );

            if ($('#lbl_'+perList[i].bedid).text() >= 100) {                  
                $('#speopleappeal_'+ perList[i].bedid).hide();
            } 
         }; 
      };


    //寝室分申诉(月)
    $('.btn_roomappeal').click(function(){
            var roomscoreid = $('#roomscoreid').val();
            $.confirm('确认要申诉吗？', function () {
                $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=month_roomappeal",
                {
                  roomscoreid:roomscoreid,  
                },function (data)
                {  
                   if (data.code == 0) {
                      $.alert('申诉成功');        
                      $('#roomappeal').hide();
                      $('#isroomappeal').show();
                   }else{
                      $.alert(data.msg);
                      return false;
                   }

                },'json')
            }); 
    })

    $('.btn_peopleappeal').click(function(){
          var perscoreid = $(this).attr('data-perscoreid');
          var bedid = $(this).attr('data-bedid');

          $.confirm('确认要申诉吗？', function () {
              $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=month_perappeal",
              {
                perscoreid:perscoreid,  
              },function (data)
              {  
                  if (data.code == 0) {

                     $.alert('申诉成功');        
                     $('#peopleappeal_'+bedid).hide();
                     $('#ispeopleappeal_'+bedid).show();  
                   }else{
                      $.alert(data.msg);
                      return false;
                   }
              },'json')
          }); 
    })

  })




	//加载登陆页面
	$(document).on("pageInit","#useraccount_login",function(e , id , page) {

    Isbinding(); 
      
    function Isbinding(){
      $.post(hqb.root+"/index.php?m=Apartment&c=Swap&a=Isbinding", 
      {
        schoolcode:hqb.schoolcode,openid:hqb.openid,              
      }, function(res) 
      {   
        console.log(res);
        if(res.code == 40013) //40013
        {    
          $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=login&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode, true);
          $.confirm(res.msg, function () { 

          }); 
        }
        else
        {  
            $.post(hqb.root+"/index.php?m=Apartment&c=Swap&a=getliststudentsummer",
            {
              schoolcode:hqb.schoolcode,openid:hqb.openid,  
            },function (data)
            {  
              console.log(data);
              $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=index&token="+hqb.token+"&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"&studentNumber="+data.data.studentNumber, true);
            },'json')
        }        
      }, 'json'); 
    }

 
		$('.btnConfirm').click(function(){
            var studentName = $('#name').val();
            var studentNumber = $('#studentnumber').val();
            sessionStorage.setItem('studentNumber',studentNumber); // 存入studentNumber 
            sessionStorage.setItem('schoolcode',hqb.schoolcode); // 存入schoolcode
            sessionStorage.setItem('openid',hqb.openid); // 存入openid
            sessionStorage.setItem('token',hqb.token);
            if (studentName =='') {
              $.alert('姓名不能为空');
              return false;
            };
            if (studentNumber == '') {
              $.alert('学号不能为空');
              return false;
            };

            $.showIndicator();
            $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=bindmessage", { 
                studentName: studentName,studentNumber:studentNumber,schoolcode:hqb.schoolcode,openid:hqb.openid,type:0,               
            }, function(res) {
                $.hideIndicator();
                if (res.code == '40011') {
                   $.alert(res.msg);                   
                   return false;
                }
               else{               
                    $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=GradeForStudent&a=index&token="+hqb.token+"&openid="+hqb.openid+"&schoolcode="+hqb.schoolcode+"&studentNumber="+studentNumber, true);
                }
               
                }, 'json');
 
		})
	})


	//查分页面
	$(document).on("pageInit", "#useraccount_index", function(e, id, page) { 

        //周打分联动
        $(page).on('change','#year',function(){
             var semesterList = $.parseJSON($('#semesterList').val());  
             $('#semester').empty();
             $('#semester').append('<option value="">学期</option>');
              
             $('#week').empty();
             $('#week').append('<option value="">周</option> ');
             console.log(semesterList);
             
             var yearid = $(this).val(); 
             for (var i = 0; i < semesterList.length; i++) {
                if(yearid == semesterList[i].year){
                   semester = semesterList[i].semesterList;
                   for (var b = 0; b < semester.length; b++) {
                        $('#semester').append('<option value="'+semester[b].semesterId+'">'+(b+1)+'</option> ');
                   }; 
                }
             };
        })
        //semester[b].semesterName
        //学期联动
        $(page).on('change','#semester',function(){
           var yearid = $('#year').val();
           var semesterid = $('#semester').val();

           $('#week').empty();
           $('#week').append('<option value="">周</option> ');

           var semesterList = $.parseJSON($('#semesterList').val());  

             for (var i = 0; i < semesterList.length; i++) {
                if(yearid == semesterList[i].year){
                   semester = semesterList[i].semesterList;
                   for (var b = 0; b < semester.length; b++) {
                     if(semesterid == semester[b].semesterId){
                        for (var c = 1; c <= semester[b].countweek; c++) {
                          $('#week').append('<option value="'+c+'">'+c+'</option> ');
                           
                        };
                     }
                   };
                }
             };
        })

        //抽查联动
        $(page).on('change','#checkschoolyear',function(){

             var semesterList = $.parseJSON($('#semesterList').val());  
             $('#checksemester').empty();
             $('#checksemester').append('<option value="">学期</option>');
 
             var schoolYearId = $(this).val(); 
             for (var i = 0; i < semesterList.length; i++) {
                if(schoolYearId == semesterList[i].schoolYearId){
                   semester = semesterList[i].semesterList;
                   for (var b = 0; b < semester.length; b++) {
                        $('#checksemester').append('<option value="'+semester[b].semesterId+'">'+(b+1)+'</option> ');
                   }; 
                }
             };

        })


       $('.week').click(function(){
       	    var year = $('#year').val();
            if (year == '') {
              $.alert('请选择年份');
              return false;
            };
       	    var semester = $('#semester').val();
            if (semester == '') {
              $.alert('请选择学期');
              return false;
            };
       	    var week = $('#week').val();
            if (week == '') {
              $.alert('请选择周');
              return false;
            };
       	    var url = configs.weekdetails_url+"&year="+year+"&semester="+semester+"&week="+week;
            // $.router.load(url);
            window.location.href = url; 
       })

      $(document).on('change','#date-input',function(){ 
          var  data = $(this).val() ;
          console.info(data);
          $('#date-input').val(data.substring(0,7));
          console.log( $('#date-input').val() )
      })

       $('.month').click(function(){
            var date = $('#date-input').val();
            if (date == '') {
              $.alert('请选择月份');
              return false;
            }; 
            var url = configs.details_url+"&date="+date;
            // $.router.load(url);
            window.location.href = url; 
       })


      $(document).on('click','.check',function(){
            var schoolyearid = $('#checkschoolyear').val();
            if(schoolyearid == ''){
                $.alert('学年');
                return false;
            }
            var checksemesterid = $('#checksemester').val();
            if (checksemesterid == '') {
                $.alert('学期');
                return false;
            };
            $.ajax({
              type: 'POST',
              url: configs.checklist_url,
              
              data: {
                 semesterid:checksemesterid,schoolyearid:schoolyearid,
              },
              success: function(data) {  

                  if(data.dataList.length > 0){
                      GetChekList(data.dataList);
                  }else{
                    $.alert(data.msg);
                  }
                  $.hideIndicator();    
                } 
            });  
      })
      function GetChekList (data) {         
          var strjoin = []; 

          strjoin.push({text: '请选择',label: true});  
          for (var i = 0; i < data.length; i++) {
              var checkid = data[i].checkId;  
              var tableid = data[i].tableId;
              var url = configs.checkdetails_url+"&tableid="+tableid+"&checkid="+checkid
              strjoin.push({
                      text: data[i].title,  
                      url: url,  
                      bold: true,  
                      onClick: function() { 
                          window.location.href = this.url; 
                          // $.router.load(this.url);
                      }
              });
             
          }; 

          var buttons1 = strjoin;

          var buttons2 = [
            {
              text: '取消',
              bg: 'danger'
            }
          ];
          var groups = [buttons1, buttons2];
          $.actions(groups);
      } 
  })

	$.init();
})