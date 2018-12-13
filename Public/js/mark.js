function size(par) { 
	var max = 100; 
	if (par.value.length <= max) {
		var str = max - par.value.length; 
		document.getElementById("remainSize").innerHTML = str.toString(); 
	}else{
		par.value = par.value.substr(0, max);
	}
} 

$(function(){


  //加载抽查打分 
  $(document).on("pageInit", "#useraccount_markcheck", function(e, id, page) { 

      // 允许上传的图片类型  
      var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];  
      // 1024KB，也就是 1MB  
      var maxSize = 5*1024 * 1024;  
      // 图片最大宽度  
      var maxWidth = 300;  
      // 最大上传图片数量  
      var maxCount = 6;  
      $('.js_file').on('change', function (event) {  
        var imgtype = $(this).attr('data-type');

        // return false;
         
          var files = event.target.files;  

          // 如果没有选中文件，直接返回  
          if (files.length === 0) {  
              return;  
          }  
    
          for (var i = 0, len = files.length; i < len; i++) {  
              var file = files[i];  
              var reader = new FileReader();  
    
              // 如果类型不在允许的类型范围内  
              if (allowTypes.indexOf(file.type) === -1) {  
                  $.weui.alert({text: '该类型不允许上传'});  
                  continue;  
              }  
    
              if (file.size > maxSize) {  
                  $.weui.alert({text: '图片太大，不允许上传'});  
                  continue;  
              }  
    
              if ($('.weui_uploader_file').length >= maxCount) {  
                  $.weui.alert({text: '最多只能上传' + maxCount + '张图片'});  
                  return;  
              }  
    
              reader.onload = function (e) {  
                  var img = new Image();  
                  img.onload = function () {  
                      // 不要超出最大宽度  
                      var w = Math.min(maxWidth, img.width);  
                      // 高度按比例计算  
                      var h = img.height * (w / img.width);  
                      var canvas = document.createElement('canvas');  
                      var ctx = canvas.getContext('2d');  
                      // 设置 canvas 的宽度和高度  
                      canvas.width = w;  
                      canvas.height = h;  
                      ctx.drawImage(img, 0, 0, w, h);  
                      var base64 = canvas.toDataURL('image/png');

                      var token = $('#token').val();
                      var adminid = $('#adminid').val();
                      var schoolcode = $('#schoolcode').val();
                      var imgid ='';
                      $.post(configs.server_url+configs.server_api, 
                      {
                        img:base64.replace('data:image/png;base64,', 'data:image/png;base64,/'),token:token,adminid:adminid,schoolcode:schoolcode,
                      }, function(data) 
                      { 
                            console.log(data);
                            if(data.code == 0)
                            {  
                                  imgid = data.data.fileId;
                                  if(imgtype == '1'){
                                    var safefileids = $('#safefileid').val();
                                    safefileids += data.data.fileId + ',';
                                    $('#safefileid').val(safefileids);  
                                  }else if(imgtype == '2'){
                                      var clearfileids = $('#clearfileid').val();
                                      clearfileids += data.data.fileId + ',';
                                      $('#clearfileid').val(clearfileids);
                                       
                                  }else{
                                      var perfileids = $('#perfileid').val();
                                      perfileids += data.data.fileId + ',';
                                      $('#perfileid').val(perfileids); 
                                  } 

                                  // 插入到预览区  
                                  var $preview = $('<li class="weui_uploader_file weui_uploader_status"><i class="img-delete"  data-type='+imgtype+' data-imgid='+imgid+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+data.data.serverPath+' src='+data.data.serverPath+'><div class="weui_uploader_status_content">0%</div></li>');  
                                  $('#weui_uploader_files'+imgtype).append($preview);  
                                  var num = $('.weui_uploader_file').length;  
                                  $('.js_counter').text(num + '/' + maxCount);  
                
                                  // 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传  
                
                                  var progress = 0;   
                                  function uploading() {
                                      $(".weui_uploader_file").find('.weui_uploader_status_content').text((++progress) + '%');  
                                      if (progress < 100) {  
                                          setTimeout(uploading, 30);  
                                      }  
                                      else {  
                                          // 如果是失败，塞一个失败图标  
                                          //$preview.find('.weui_uploader_status_content').html('<i class="weui_icon_warn"></i>');  
                                          $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();  
                                      }   
                                  }  
                                  setTimeout(uploading, 30);  
                            }
                            else
                            {
                                $.alert(data.msg);
                                return false;
                            } 

                    }, 'json');
 
                  };  
    
                  img.src = e.target.result;    
              };  
              reader.readAsDataURL(file);  


          }  
      });  


      $(document).delegate('.imgBox','click',function(){         
          var imgsrc = $(this).attr('data-src');
          $('.box').show();
          $('.box img').attr('src',imgsrc);
      })
 
      $('.box').click(function(){ 
        $('.box').hide()
      })
 
      $(document).delegate('.img-delete','click',function(){
        
              var arr= new Array();
              var imgid = $(this).attr('data-imgid');
              var type = $(this).attr('data-type');
              var ids = '';
              if (type == 1) {
                  ids = $('#safefileid').val();     
              }else if(type == 2){
                  ids = $('#clearfileid').val();   
              }else {
                  ids = $('#perfileid').val();   
              }
                       
              var ids = ids.substring(0,ids.length-1);  
              arr = ids.split(','); 
              console.log(arr);
              arr.splice($.inArray(imgid,arr),1);

              if (type == 1) {
                 $('#safefileid').val(arr);
              }else if(type == 2){
                 $('#clearfileid').val(arr);   
              }else{
                 $('#perfileid').val(arr);   
              }
              
              $(this).parent().remove();
      })

        var arrs = [];
        var itemidarr = [];
        var bedidarr = [];
        var scorearr = [];
        var scoreitemcopy = [];
        var scoreitemcopyid = [];
        var safescorelist= [];
        var clearscorelist = [];
        var parrs = [];// 修改时候用的

        var safeitemarr = [];
        var safebedarr = [];
        var safemark =[];
 
        var itemarr = [];
        var hygiene = [];
        var roomscoreid = $('#roomscoreid').val();
        if (roomscoreid != '') {
            var data = $.parseJSON($('#data').val());
            console.log(data);
            

            $('#lbl_total').text(data.safeScore);
            $('#lbl_cleartotal').text(data.clearScore);

            roomSafeItemList = data.roomSafeItemList;
            for (var i = 0; i < roomSafeItemList.length; i++) {
               if (roomSafeItemList[i].flag == 1) {
                   $('#roomlist_'+roomSafeItemList[i].itemId).append('<span  data-fullmark='+roomSafeItemList[i].score+' data-roomid='+roomSafeItemList[i].roomId+' data-itemid='+roomSafeItemList[i].itemId+' class="break-room btn_removeroom">寝室</span>');
                   safescorelist.push({itemid:roomSafeItemList[i].itemId,score:roomSafeItemList[i].score,roomid:roomSafeItemList[i].roomId}); 
                }else{
                   $('#roomlist_'+roomSafeItemList[i].itemId).append('<span data-bedid='+roomSafeItemList[i].bedId+' data-fullmark='+roomSafeItemList[i].score+' data-itemid='+roomSafeItemList[i].itemId+' class="break-room btn_remove">'+roomSafeItemList[i].bedNum+'</span>');
                   safeitemarr.push(roomSafeItemList[i].itemId);
                   safebedarr.push(roomSafeItemList[i].bedId);
                   safemark.push(roomSafeItemList[i].score);

                   safescorelist.push({itemid:roomSafeItemList[i].itemId,score:roomSafeItemList[i].score,bedid:roomSafeItemList[i].bedId}); 
                }
               $('#safescorelist').val(JSON.stringify(safescorelist)); 
               
            };


            roomClearItemList = data.roomClearItemList;
            for (var i = 0; i < roomClearItemList.length; i++) {
               $('#item_'+roomClearItemList[i].itemId).val(roomClearItemList[i].score);
               itemarr.push(roomClearItemList[i].itemId);
               hygiene.push(roomClearItemList[i].score);
               clearscorelist.push({itemid:roomClearItemList[i].itemId,score:roomClearItemList[i].score});                            
               $('#clearscorelist').val(JSON.stringify(clearscorelist));
            };

            imglist = data.picList;
            for (var i = 0; i < imglist.length; i++) {

              var path = imglist[i].savePath.split(',');
              var fileid = imglist[i].fileid.split(',');
              var imgmsg ='';
              for (var b = 0; b < path.length; b++) { 
                 imgmsg += '<li class="weui_uploader_file weui_uploader_status"><i class="img-delete" data-type='+imglist[i].picType+' data-imgid='+fileid[b]+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+path[b]+' src='+path[b]+'></li>';    
               }; 

               if (imglist[i].picType == 1) {
                  $('#safefileid').val(imglist[i].fileid+','); 
                  $('#weui_uploader_files1').append(imgmsg);      
               } 
               else if(imglist[i].picType == 2){ 
                  $('#clearfileid').val(imglist[i].fileid+',');
                  $('#weui_uploader_files2').append(imgmsg); 
               }else if(imglist[i].picType == 3){ 
                    $('#perfileid').val(imglist[i].fileid+',');
                    $('#weui_uploader_files3').append(imgmsg); 
               }                         

           }; 


            bedList = data.bedList;
            console.log(bedList);
            for (var i = 0; i < bedList.length; i++) {
                var itemList = bedList[i].itemList;
                var totalscore = 0;
                var pick       = 0;
                for (var b = 0; b < itemList.length; b++) {
                   totalscore  += ($('#bed_'+itemList[b].bedId+'_'+itemList[b].itemId).attr('data-fullmark')*1.0);
                   pick        += (itemList[b].score*1.0);

                   $('#bed_'+itemList[b].bedId+'_'+itemList[b].itemId).val(itemList[b].score);
                   arrs.push(itemList[b].bedId+'_'+itemList[b].itemId);
                   itemidarr.push(itemList[b].itemId);
                   bedidarr.push(itemList[b].bedId);            
                   scorearr.push(itemList[b].score);
                   parrs.push(itemList[b].perscoreid);

                   $('#bed_'+itemList[b].bedId+'_'+itemList[b].itemId).attr('data-perscoreid',itemList[b].perscoreid);
                    
                
                   scoreitemcopyid.push({itemid:itemList[b].itemId,bedid:itemList[b].bedId,score:itemList[b].score,id:itemList[b].bedId+'_'+itemList[b].itemId});
                   scoreitemcopy.push({bedscoreid:itemList[b].perscoreid,itemid:itemList[b].itemId,bedid:itemList[b].bedId,score:itemList[b].score});

                    $('#scoreitem').val(JSON.stringify(scoreitemcopy));
                };
                $('#lbl_'+bedList[i].bedId).text(100 - (totalscore*1.0 - (pick*1.0)) );
            };
            

        }else{
            var peoplelist = $.parseJSON($('#peoplelist').val());            
            var scoreitem = $.parseJSON($('#scoreitem').val()); 
            for (var i = 0; i < peoplelist.length; i++) {
                for (var a = 0; a < scoreitem.length; a++) {
                     arrs.push(peoplelist[i].bedId+'_'+scoreitem[a].itemId);
                     itemidarr.push(scoreitem[a].itemId);
                     bedidarr.push(peoplelist[i].bedId);
                     scorearr.push(scoreitem[a].fullMark);  

                      
                     scoreitemcopyid.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark,id:peoplelist[i].bedId+'_'+scoreitem[a].itemId});
                     scoreitemcopy.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark});
                   
                     $('#scoreitem').val(JSON.stringify(scoreitemcopy) );
                }; 
           
            }; 

        }





       //保存
       $(page).on('click','.btn_save',function(){ 
              var adminid = $('#adminid').val(); 
          
              var checkid = $('#checkid').val();
              var roomid = $('#roomid').val();
              var tableid = $('#tableid').val();

              var safescorelist = $('#safescorelist').val();
              if (safescorelist == '') {
                safescorelist ='[]';
              };
              var safescore = $('#lbl_total').text();
              var safefileid = $('#safefileid').val();


              var clearscorelist = $('#clearscorelist').val();
              if(clearscorelist == ''){
                  clearscorelist = '[]';
              }
              var clearscore = $('#lbl_cleartotal').text();
              var clearfileid = $('#clearfileid').val();

              var scoreitem = $('#scoreitem').val();
              var perfileid = $('#perfileid').val();

              var roomscoreid = $('#roomscoreid').val();



              var flatId = $('#flatId').val();
              var flatname = $('#flatname').val();
              var liveareaid = $('#liveareaid').val();
              var areaname = $('#areaname').val();
              
              if (roomscoreid == '') {
                    $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForSpot&a=addcheckscore", 
                    {
                        checkid:checkid,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,safescorelist:safescorelist,clearscore:clearscore,safescore:safescore,clearfileid:clearfileid,safefileid:safefileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                             $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForSpot&a=add_checkperson_score", 
                              {
                                checkid:checkid,roomid:roomid,tableid:tableid,scoreitem:scoreitem,safescorelist:safescorelist,perfileid:perfileid,adminid:adminid,
                              }, function(data) 
                              { 
                                  if(res.code == 0)
                                  { 
                                       $.alert('打分成功', function () {
                                          $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=dormcheck&tableid="+tableid+"&areaname="+areaname+"&flatname="+encodeURIComponent(flatname)+"&checkid="+checkid+"&flatId="+flatId, true);
                                      }); 
                                  }
                                  else
                                  {
                                    $.alert(data.msg);
                                    return false;
                                  } 

                              }, 'json');
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }else{

                  $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForSpot&a=updatecheckscore", 
                    {
                        checkid:checkid,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,safescorelist:safescorelist,clearscore:clearscore,safescore:safescore,clearfileid:clearfileid,safefileid:safefileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                             $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForSpot&a=edit_checkperson_score", 
                              {
                                  checkid:checkid,roomid:roomid,tableid:tableid,scoreitem:scoreitem,safescorelist:safescorelist,perfileid:perfileid,adminid:adminid,
                              }, function(data) 
                              { 
                                  if(res.code == 0)
                                  { 
                                       $.alert('打分成功', function () {
                                         $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=dormcheck&tableid="+tableid+"&areaname="+areaname+"&flatname="+encodeURIComponent(flatname)+"&checkid="+checkid+"&flatId="+flatId, true);
                                      }); 
                                  }
                                  else
                                  {
                                    $.alert(data.msg);
                                    return false;
                                  } 

                              }, 'json');
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }
 
       })


 
        

 
        $(page).on('change','.personal',function(){ 
              var roomscoreid = $('#roomscoreid').val();
              var bedid = $(this).attr('data-bedid');
              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var id = $(this).attr('data-id');
              var perscoreid = $(this).attr('data-perscoreid');
              var score = $(this).val();


              if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $(this).val(fullmark);
                $(this).focus();
                return false;
             }

              for (var i = 0; i < arrs.length; i++) {
                 if (arrs[i] == bedid+'_'+itemid) {
                    arrs.splice($.inArray(arrs[i],arrs),1); 
                    itemidarr.splice($.inArray(itemidarr[i],itemidarr),1); 
                    bedidarr.splice($.inArray(bedidarr[i],bedidarr),1); 
                    scorearr.splice($.inArray(scorearr[i],scorearr),1);
                    parrs.splice($.inArray(parrs[i],parrs),1);
                 }
              };

              arrs.push(bedid+'_'+itemid);
              itemidarr.push(itemid);
              bedidarr.push(bedid);            
              scorearr.push(score);
              parrs.push(perscoreid);

              scoreitemcopy = []; 
              for (var i = 0; i < itemidarr.length; i++) {
                if(roomscoreid ==''){
                    scoreitemcopy.push({itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }else{
                    scoreitemcopy.push({bedscoreid:parrs[i],itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }
                 
              };

              var counttotle = 0; 
              $(".personal").each(function(){ 　                     　　 
                     if ( bedid  ==  $(this).attr('data-bedid')) {
                        if($(this).val() != ''){
                          counttotle += (($(this).attr('data-fullmark') * 1.0) - ($(this).val() * 1.0 ));  
                        }                         
                     }; 
               }) 

              $('#lbl_'+bedid).text(100 - (counttotle * 1.0)  );
 
              $('#scoreitem').val(JSON.stringify(scoreitemcopy));  
        })

        var safescorelist = []; //安全检查
        var clearscorelist = []; //卫生检查
        var v = 0;
        $(page).on('change','.clear',function(){ 
             var itemid = $(this).attr('data-itemid');  
             var fullmark = $(this).attr('data-fullmark');        
             var score =  $('#item_'+itemid).val();  
             if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $('#item_'+itemid).val(fullmark);
                $('#item_'+itemid).focus();
                //return false;
             }

             for (var i = 0; i < itemarr.length; i++) {
                 if (itemarr[i] == itemid) {
                    itemarr.splice($.inArray(itemarr[i],itemarr),1); 
                    hygiene.splice($.inArray(hygiene[i],hygiene),1); 
                 }
            }
 
           itemarr.push(itemid);
           hygiene.push(score);

           clearscorelist = [];
           for (var i = 0; i < itemarr.length; i++) { 
               clearscorelist.push({itemid:itemarr[i],score:hygiene[i]});
           }; 

           var counttotle = 0; 
           $(".clear").each(function(){ 　                     　　 
                 if ( $(this).val() != '') {
                      counttotle += (($(this).attr('data-fullmark') * 1.0) -($(this).val() * 1.0 ));
                 }; 
           }) 
           $('#lbl_cleartotal').text(100 - (counttotle * 1.0) );

           $('#clearscorelist').val(JSON.stringify(clearscorelist));
       
 
        })


        
        // 选择未归床号
        $(page).on('click','.rules-add',function(){ 
            var roomscoreid = $('#roomscoreid').val();
            var itemid = $(this).attr('data-itemid'); 
            var fullmark = $(this).attr('data-fullMark');
            var topnum = $(this).attr('data-topnum');
            var peoplelist = $.parseJSON($('#peoplelist').val());  
            var roomid = $('#roomid').val();
            var strjoin = [];

            for (var i = 0; i < peoplelist.length; i++) {
                strjoin.push({
                      text: peoplelist[i].bedNum,  
                      bedid:peoplelist[i].bedId,   
                      itemid:itemid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true, 
                      onClick: function() {    
                          var fulltotal = $('#lbl_total').text();//获取总分

                          $('#roomlist_'+this.itemid).append('<span data-bedid='+this.bedid+' data-fullmark='+this.fullmark+' data-itemid='+this.itemid+' class="break-room btn_remove">'+this.text+'</span>');  
                           var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值
                           
                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }
                          safescorelist.push({itemid:this.itemid,score:this.fullmark,bedid:this.bedid});
                           
                          $('#safescorelist').val(JSON.stringify(safescorelist)); 
                      }
                });
            }; 
            strjoin.push({
                      text: '寝室',  
                      bedId:'',  
                      itemid:itemid,  
                      roomid:roomid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true,
                      onClick: function() {    
                         
                          $('#roomlist_'+this.itemid).append('<span data-fullmark='+ this.fullmark+' data-itemid='+this.itemid+' data-roomid='+ this.roomid+' class="break-room btn_removeroom">'+this.text+'</span>'); 
                          var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值
                          var fulltotal = $('#lbl_total').text();//获取总分
                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }

                        safescorelist.push({itemid:this.itemid,score:this.fullmark, roomid:this.roomid});    
 
                        $('#safescorelist').val(JSON.stringify(safescorelist));  
                      }
                });


 

            var buttons1 = strjoin;

            var buttons2 = [
              {
                text: '取消',
                bg: 'danger'
              }
            ];
            var groups = [buttons1, buttons2];
            $.actions(groups); 
        }) 

        $(page).on('click','.btn_removeroom',function(){ 　
              var roomid = $(this).attr('data-roomid');
              var fullmark = $(this).attr('data-fullmark');
              var itemid = $(this).attr('data-itemid');
              safescorelist = $.parseJSON($('#safescorelist').val());

              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');

              safescorelist.splice($.inArray(roomid,safescorelist),1); 
              var safetotle = $('#lbl_total').text(); 
              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
                 if ( (number*1.0) <= (topnum*1.0) ) {
                  $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
                };
              } 

              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();
              　
        })

      $(page).on('click','.btn_remove',function(){ 　
               
              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var bedid = $(this).attr('data-bedid');
              safescorelist = $.parseJSON($('#safescorelist').val());

              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');
         
              safescorelist.splice($.inArray(bedid,safescorelist),1); 

              var safetotle = $('#lbl_total').text(); 

              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
                if ( (number*1.0) <= (topnum*1.0) ) {
                  $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
                };

              }  
              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();　 　 
              　
        })
  })

  //加载抽查选择房间页面
  $(document).on("pageInit", "#useraccount_dormcheck", function(e, id, page) { 

              //选择已打过分的房间
        $(page).on('click','.showCardFrom',function(){ 
              var roomid = $(this).attr('data-roomId');
              var roomscoreid = $(this).attr('data-roomScoreId');
              var checkid = $(this).attr('data-checkid');
              var tableid = $(this).attr('data-tableid');
              var roomname = $(this).attr('data-roomName');
              var url = configs.markcheck_url+"&tableid="+tableid+"&roomscoreid="+roomscoreid+"&roomname="+roomname+"&roomid="+roomid+"&checkid="+checkid;
              window.location.href = url; 

        })
 

        // 选择空房间 
        $(page).on('click','.showCard',function(){
             var roomid = $(this).attr('data-roomid');
             var roomname = $(this).attr('data-roomname');
             var checkid = $(this).attr('data-checkid');
             var tableid = $(this).attr('data-tableid');
             var url = configs.markcheck_url+"&tableid="+tableid+"&roomname="+roomname+"&roomid="+roomid+"&checkid="+checkid;
             window.location.href = url; 
        })


  })



  //加载月打分 
  $(document).on("pageInit", "#useraccount_markmoth", function(e, id, page) { 
     

      // 允许上传的图片类型  
      var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];  
      // 1024KB，也就是 1MB  
      var maxSize = 5*1024 * 1024;  
      // 图片最大宽度  
      var maxWidth = 300;  
      // 最大上传图片数量  
      var maxCount = 6;  
      $('.js_file').on('change', function (event) { 

        var imgtype = $(this).attr('data-type');

        // return false;
         
          var files = event.target.files;  

          // 如果没有选中文件，直接返回  
          if (files.length === 0) {  
              return;  
          }  
    
          for (var i = 0, len = files.length; i < len; i++) {  
              var file = files[i];  
              var reader = new FileReader();  
    
              // 如果类型不在允许的类型范围内  
              if (allowTypes.indexOf(file.type) === -1) {  
                  $.weui.alert({text: '该类型不允许上传'});  
                  continue;  
              }  
    
              if (file.size > maxSize) {  
                  $.weui.alert({text: '图片太大，不允许上传'});  
                  continue;  
              }  
    
              if ($('.weui_uploader_file').length >= maxCount) {  
                  $.weui.alert({text: '最多只能上传' + maxCount + '张图片'});  
                  return;  
              }  
    
              reader.onload = function (e) {  
                  var img = new Image();  
                  img.onload = function () {  
                      // 不要超出最大宽度  
                      var w = Math.min(maxWidth, img.width);  
                      // 高度按比例计算  
                      var h = img.height * (w / img.width);  
                      var canvas = document.createElement('canvas');  
                      var ctx = canvas.getContext('2d');  
                      // 设置 canvas 的宽度和高度  
                      canvas.width = w;  
                      canvas.height = h;  
                      ctx.drawImage(img, 0, 0, w, h);  
                      var base64 = canvas.toDataURL('image/png');

                      var token = $('#token').val();
                      var adminid = $('#adminid').val();
                      var schoolcode = $('#schoolcode').val();
                      var imgid ='';
                      $.post(configs.server_url+configs.server_api, 
                      {
                        img:base64.replace('data:image/png;base64,', 'data:image/png;base64,/'),token:token,adminid:adminid,schoolcode:schoolcode,
                      }, function(data) 
                      { 
                            console.log(data);
                            if(data.code == 0)
                            {  
                                  imgid = data.data.fileId;
                                  if(imgtype == '1'){
                                    var safefileids = $('#safefileid').val();
                                    safefileids += data.data.fileId + ',';
                                     $('#safefileid').val(safefileids);  
                                  }else if(imgtype == '2'){
                                      var clearfileids = $('#clearfileid').val();
                                      clearfileids += data.data.fileId + ',';
                                      $('#clearfileid').val(clearfileids);
                                       
                                  }else{
                                      var perfileids = $('#perfileid').val();
                                      perfileids += data.data.fileId + ',';
                                      $('#perfileid').val(perfileids); 
                                  } 


                                   // 插入到预览区  
                                  //var $preview = $('<li class="weui_uploader_file weui_uploader_status imgBox" data-src='+data.data.serverPath+' style="background-image:url(' + base64 + ')"><i class="img-delete" data-type='+imgtype+' data-imgid='+imgid+'>-</i><div class="weui_uploader_status_content">0%</div></li>');  
                                  var $preview = $('<li class="weui_uploader_file weui_uploader_status"><i class="img-delete"  data-type='+imgtype+' data-imgid='+imgid+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+data.data.serverPath+' src='+data.data.serverPath+'><div class="weui_uploader_status_content">0%</div></li>');  
                                  $('#weui_uploader_files'+imgtype).append($preview);  
                                  var num = $('.weui_uploader_file').length;  
                                  $('.js_counter').text(num + '/' + maxCount);  
                
                                  // 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传  
                
                                  var progress = 0;   
                                  function uploading() {
                                      $(".weui_uploader_file").find('.weui_uploader_status_content').text((++progress) + '%');  
                                      if (progress < 100) {  
                                          setTimeout(uploading, 30);  
                                      }  
                                      else {   
                                          $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();  
                                      }   
                                  }  
                                  setTimeout(uploading, 30);  
                            }
                            else
                            {
                                $.alert(data.msg);
                                return false;
                            } 

                    },'json'); 
                  };  
    
                  img.src = e.target.result;    
              };  
              reader.readAsDataURL(file);  


          }  
      });  


      $(document).delegate('.imgBox','click',function(){ 
        
          var imgsrc = $(this).attr('data-src');
          $('.box').show();
          $('.box img').attr('src',imgsrc);
      })
 
      $('.box').click(function(){ 
        $('.box').hide()
      })
 
      $(document).delegate('.img-delete','click',function(){
        
              var arr= new Array();
              var imgid = $(this).attr('data-imgid');
              var type = $(this).attr('data-type');
              var ids = '';
              if (type == 1) {
                  ids = $('#safefileid').val();     
              }else if(type == 2){
                  ids = $('#clearfileid').val();   
              }else {
                  ids = $('#perfileid').val();   
              }
                       
              var ids = ids.substring(0,ids.length-1);  
              arr = ids.split(','); 
              console.log(arr);
              arr.splice($.inArray(imgid,arr),1);

              if (type == 1) {
                 $('#safefileid').val(arr);
              }else if(type == 2){
                 $('#clearfileid').val(arr);   
              }else{
                 $('#perfileid').val(arr);   
              }
              
              $(this).parent().remove();
      })



        var arrs = [];
        var itemidarr = [];
        var bedidarr = [];
        var scorearr = [];
        var scoreitemcopy = [];
        var scoreitemcopyid = [];
        var safescorelist= [];
        var clearscorelist = [];
        var parrs = [];// 修改时候用的

        var safeitemarr = [];
        var safebedarr = [];
        var safemark =[];
 
        var itemarr = [];
        var hygiene = [];

        var roomscoreid = $('#roomscoreid').val();
        if (roomscoreid != '') {
            var data = $.parseJSON($('#data').val());

            
            $('#lbl_total').text(data.safeScore);
            $('#lbl_cleartotal').text(data.clearScore);

             roomSafeItemList = data.roomSafeItemList;
            for (var i = 0; i < roomSafeItemList.length; i++) {
                if (roomSafeItemList[i].flag ==1) {
                   $('#roomlist_'+roomSafeItemList[i].itemId).append('<span  data-fullmark='+roomSafeItemList[i].score+' data-roomid='+roomSafeItemList[i].roomId+' data-itemid='+roomSafeItemList[i].itemId+' class="break-room btn_removeroom">寝室</span>');
                   safescorelist.push({itemid:roomSafeItemList[i].itemId,score:roomSafeItemList[i].score,roomid:roomSafeItemList[i].roomId}); 
                }else{
                   $('#roomlist_'+roomSafeItemList[i].itemId).append('<span data-bedid='+roomSafeItemList[i].bedId+' data-fullmark='+roomSafeItemList[i].score+' data-itemid='+roomSafeItemList[i].itemId+' class="break-room btn_remove">'+roomSafeItemList[i].bedNum+'</span>');
                   safeitemarr.push(roomSafeItemList[i].itemId);
                   safebedarr.push(roomSafeItemList[i].bedId);
                   safemark.push(roomSafeItemList[i].score);

                   safescorelist.push({itemid:roomSafeItemList[i].itemId,score:roomSafeItemList[i].score,bedid:roomSafeItemList[i].bedId}); 
                }
               $('#safescorelist').val(JSON.stringify(safescorelist));
            };


            roomClearItemList = data.roomClearItemList;
            for (var i = 0; i < roomClearItemList.length; i++) {
               $('#item_'+roomClearItemList[i].itemId).val(roomClearItemList[i].score);
               itemarr.push(roomClearItemList[i].itemId);
               hygiene.push(roomClearItemList[i].score);

               clearscorelist.push({itemid:roomClearItemList[i].itemId,score:roomClearItemList[i].score});                            
               $('#clearscorelist').val(JSON.stringify(clearscorelist));
            };

            imglist = data.picList;
            for (var i = 0; i < imglist.length; i++) {

              var path = imglist[i].savePath.split(',');
              var fileid = imglist[i].fileid.split(',');
              var imgmsg ='';
              for (var b = 0; b < path.length; b++) { 
                 imgmsg += '<li class="weui_uploader_file weui_uploader_status"><i class="img-delete" data-type='+imglist[i].picType+' data-imgid='+fileid[b]+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+path[b]+' src='+path[b]+'></li>';    
               }; 

               if (imglist[i].picType == 1) {
                  $('#safefileid').val(imglist[i].fileid+','); 
                  $('#weui_uploader_files1').append(imgmsg);      
               } 
               else if(imglist[i].picType == 2){ 
                  $('#clearfileid').val(imglist[i].fileid+',');
                  $('#weui_uploader_files2').append(imgmsg); 
               }else if(imglist[i].picType == 3){ 
                    $('#perfileid').val(imglist[i].fileid+',');
                    $('#weui_uploader_files3').append(imgmsg); 
               }                         

           };  
            bedList = data.bedList;   

            for (var i = 0; i < bedList.length; i++) {
                var itemList = bedList[i].itemList; 
                var totalscore = 0;
                var pick       = 0;
                for (var b = 0; b < itemList.length; b++) {
 
                   totalscore  += ($('#bed_'+itemList[b].bedId+'_'+itemList[b].itemId).attr('data-fullmark')*1.0);
                   pick        += (itemList[b].score*1.0);
                   $('#bed_'+itemList[b].bedId+'_'+itemList[b].itemId).val(itemList[b].score);

                   arrs.push(itemList[b].bedId+'_'+itemList[b].itemId);
                   itemidarr.push(itemList[b].itemId);
                   bedidarr.push(itemList[b].bedId);            
                   scorearr.push(itemList[b].score);
                   parrs.push(itemList[b].perscoreid);

                   $('#bed_'+itemList[b].bedId+'_'+itemList[b].itemId).attr('data-perscoreid',itemList[b].perscoreid);                   

                   scoreitemcopyid.push({itemid:itemList[b].itemId,bedid:itemList[b].bedId,score:itemList[b].score,id:itemList[b].bedId+'_'+itemList[b].itemId});
                   scoreitemcopy.push({bedscoreid:itemList[b].perscoreid,itemid:itemList[b].itemId,bedid:itemList[b].bedId,score:itemList[b].score});
                    
                   $('#scoreitem').val(JSON.stringify(scoreitemcopy));
                };
                $('#lbl_'+bedList[i].bedId).text(100 - (totalscore*1.0 - (pick*1.0)) );
            };
             
        }else{
            var peoplelist = $.parseJSON($('#peoplelist').val());            
            var scoreitem = $.parseJSON($('#scoreitem').val()); 
            for (var i = 0; i < peoplelist.length; i++) {
                for (var a = 0; a < scoreitem.length; a++) {
                     arrs.push(peoplelist[i].bedId+'_'+scoreitem[a].itemId);
                     itemidarr.push(scoreitem[a].itemId);
                     bedidarr.push(peoplelist[i].bedId);
                     scorearr.push(scoreitem[a].fullMark);  

                      
                     scoreitemcopyid.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark,id:peoplelist[i].bedId+'_'+scoreitem[a].itemId});

                     scoreitemcopy.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark});
                                     
                     $('#scoreitem').val(JSON.stringify(scoreitemcopy) );
                }; 
           
            }; 

        }





       //保存
       $(page).on('click','.btn_save',function(){ 
              var adminid = $('#adminid').val(); 

          
              var datetext = $('#datetext').val();
              var roomid = $('#roomid').val();
              var tableid = $('#tableid').val();

              var safescorelist = $('#safescorelist').val();
              if (safescorelist == '') {
                   safescorelist = '[]';
              };
              var safescore = $('#lbl_total').text();
              var safefileid = $('#safefileid').val();


              var clearscorelist = $('#clearscorelist').val();
              if (clearscorelist == '') {
                  clearscorelist = '[]';
              };
              var clearscore = $('#lbl_cleartotal').text();
              var clearfileid = $('#clearfileid').val();

              var scoreitem = $('#scoreitem').val();
              var perfileid = $('#perfileid').val();

              var roomscoreid = $('#roomscoreid').val();



              var flatId = $('#flatId').val();
              var flatname = $('#flatname').val();
              var liveareaid = $('#liveareaid').val();
              var areaname = $('#areaname').val();
              
              if (roomscoreid == '') {
                    $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForMonth&a=addmothscore", 
                    {
                        datetext:datetext,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,safescorelist:safescorelist,clearscore:clearscore,safescore:safescore,clearfileid:clearfileid,safefileid:safefileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                             $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForMonth&a=add_person_score", 
                              {
                                datetext:datetext,roomid:roomid,tableid:tableid,scoreitem:scoreitem,safescorelist:safescorelist,perfileid:perfileid,adminid:adminid,
                              }, function(data) 
                              { 
                                  if(res.code == 0)
                                  { 
                                       $.alert('打分成功', function () {
                                          $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=dormmoth&areaname="+areaname+"&liveareaid="+liveareaid+"&flatname="+encodeURIComponent(flatname)+"&date="+datetext+"&flatId="+flatId, true);
                                      }); 
                                  }
                                  else
                                  {
                                    $.alert(data.msg);
                                    return false;
                                  } 

                              }, 'json');
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }else{

                  $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForMonth&a=updatemothscore", 
                    {
                        datetext:datetext,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,safescorelist:safescorelist,clearscore:clearscore,safescore:safescore,clearfileid:clearfileid,safefileid:safefileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                             $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForMonth&a=edit_person_score", 
                              {
                                  datetext:datetext,roomid:roomid,tableid:tableid,scoreitem:scoreitem,safescorelist:safescorelist,perfileid:perfileid,adminid:adminid,
                              }, function(data) 
                              { 
                                  if(res.code == 0)
                                  { 
                                       $.alert('打分成功', function () {
                                         $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=dormmoth&areaname="+areaname+"&liveareaid="+liveareaid+"&flatname="+encodeURIComponent(flatname)+"&date="+datetext+"&flatId="+flatId, true);
                                      }); 
                                  }
                                  else
                                  {
                                    $.alert(data.msg);
                                    return false;
                                  } 

                              }, 'json');
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }
 
       })


 
        

 
        $(page).on('change','.personal',function(){  

              var roomscoreid = $('#roomscoreid').val();
              var bedid = $(this).attr('data-bedid');
              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var id = $(this).attr('data-id');
              var perscoreid = $(this).attr('data-perscoreid');
              var score = $(this).val();


              if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $(this).val(fullmark);
                $(this).focus();
                return false;
             }

              for (var i = 0; i < arrs.length; i++) {
                 if (arrs[i] == bedid+'_'+itemid) {
                    arrs.splice($.inArray(arrs[i],arrs),1); 
                    itemidarr.splice($.inArray(itemidarr[i],itemidarr),1); 
                    bedidarr.splice($.inArray(bedidarr[i],bedidarr),1); 
                    scorearr.splice($.inArray(scorearr[i],scorearr),1);
                    parrs.splice($.inArray(parrs[i],parrs),1);
                 }
              };

              arrs.push(bedid+'_'+itemid);
              itemidarr.push(itemid);
              bedidarr.push(bedid);            
              scorearr.push(score);
              parrs.push(perscoreid);

              scoreitemcopy = []; 
              for (var i = 0; i < itemidarr.length; i++) {
                if(roomscoreid ==''){
                    scoreitemcopy.push({itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }else{
                    scoreitemcopy.push({bedscoreid:parrs[i],itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }
                 
              }; 
              var counttotle = 0; 
              $(".personal").each(function(){ 　                     　　 
                     if ( bedid  ==  $(this).attr('data-bedid')) {
                        if($(this).val() != ''){
                          counttotle += (($(this).attr('data-fullmark') * 1.0) - ($(this).val() * 1.0 ));  
                        }                         
                     }; 
               }) 

              $('#lbl_'+bedid).text(100 - (counttotle * 1.0)  ); 
 
              $('#scoreitem').val(JSON.stringify(scoreitemcopy));  
        })

        var safescorelist = []; //安全检查
        var clearscorelist = []; //卫生检查
      
        var v = 0;
        $(page).on('change','.clear',function(){ 
             var itemid = $(this).attr('data-itemid');  
             var fullmark = $(this).attr('data-fullmark');        
             var score =  $('#item_'+itemid).val();  
 
             if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $('#item_'+itemid).val(fullmark);
                $('#item_'+itemid).focus(); 
                //return false;
             }

             for (var i = 0; i < itemarr.length; i++) {
                 if (itemarr[i] == itemid) {
                    itemarr.splice($.inArray(itemarr[i],itemarr),1); 
                    hygiene.splice($.inArray(hygiene[i],hygiene),1); 
                 }
            }

           itemarr.push(itemid);
           hygiene.push(score);

           clearscorelist = [];
          
           for (var i = 0; i < itemarr.length; i++) {
               clearscorelist.push({itemid:itemarr[i],score:hygiene[i]});　
           }; 
       　
           var counttotle = 0; 
           $(".clear").each(function(){ 　                     　　 
                 if ( $(this).val() != '') {
                      counttotle += (($(this).attr('data-fullmark') * 1.0) -($(this).val() * 1.0 ));
                 }; 
           }) 
           $('#lbl_cleartotal').text(100 - (counttotle * 1.0) );

           $('#clearscorelist').val(JSON.stringify(clearscorelist)); 
        })



        // 选择未归床号
        $(page).on('click','.rules-add',function(){ 
            var roomscoreid = $('#roomscoreid').val();
            var itemid = $(this).attr('data-itemid'); 
            var fullmark = $(this).attr('data-fullMark');
            var topnum = $(this).attr('data-topnum');
            var peoplelist = $.parseJSON($('#peoplelist').val());  
            var roomid = $('#roomid').val();
            var strjoin = [];

            for (var i = 0; i < peoplelist.length; i++) {
                strjoin.push({
                      text: peoplelist[i].bedNum,  
                      bedid:peoplelist[i].bedId,   
                      itemid:itemid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true, 
                      onClick: function() {    
                         
                          var fulltotal = $('#lbl_total').text();//获取总分                         

                          $('#roomlist_'+this.itemid).append('<span data-bedid='+this.bedid+' data-fullmark='+this.fullmark+' data-itemid='+this.itemid+' class="break-room btn_remove">'+this.text+'</span>');  
                          var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值

                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }
                          
                          safescorelist.push({itemid:this.itemid,score:this.fullmark,bedid:this.bedid});
                           
                          $('#safescorelist').val(JSON.stringify(safescorelist)); 
                      }
                });
            }; 
            strjoin.push({
                      text: '寝室',  
                      bedId:'', 
                      itemid:itemid,  
                      roomid:roomid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true,
                      onClick: function() {    
                         
                          $('#roomlist_'+this.itemid).append('<span data-fullmark='+ this.fullmark+' data-itemid='+this.itemid+' data-roomid='+ this.roomid+' class="break-room btn_removeroom">'+this.text+'</span>'); 
                          var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值
                          var fulltotal = $('#lbl_total').text();//获取总分
                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }

                        safescorelist.push({itemid:this.itemid,score:this.fullmark, roomid:this.roomid});    


                        $('#safescorelist').val(JSON.stringify(safescorelist));    
 
                      }
                });


 

            var buttons1 = strjoin;

            var buttons2 = [
              {
                text: '取消',
                bg: 'danger'
              }
            ];
            var groups = [buttons1, buttons2];
            $.actions(groups); 
        }) 


        $(page).on('click','.btn_removeroom',function(){ 

              var roomid = $(this).attr('data-roomid');
              var fullmark = $(this).attr('data-fullmark');
              var itemid = $(this).attr('data-itemid');
              safescorelist = $.parseJSON($('#safescorelist').val());


              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');

              safescorelist.splice($.inArray(roomid,safescorelist),1); 
              var safetotle = $('#lbl_total').text(); 
              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
               if ( (number*1.0) <= (topnum*1.0) ) {
                $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
              };
            } 

 
              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();
          })





            $(page).on('click','.btn_remove',function(){ 

              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var bedid = $(this).attr('data-bedid');
              safescorelist = $.parseJSON($('#safescorelist').val());

              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');


              safescorelist.splice($.inArray(bedid,safescorelist),1); 

              var safetotle = $('#lbl_total').text(); 

              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
                if ( (number*1.0) <= (topnum*1.0) ) {
                  $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
                };

              }  

              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();　 
        })
              　
       
  })
 ////--------------------------------以上月打分--------------------------------------------  

    //加载月打分房间列表
   $(document).on("pageInit", "#useraccount_drommoth", function(e, id, page) { 

          //选择已打过分的房间
        $(page).on('click','.showCardFrom',function(){ 
              var roomid = $(this).attr('data-roomId');
              var roomscoreid = $(this).attr('data-roomScoreId');
              var date = $(this).attr('data-date');
              var roomname = $(this).attr('data-roomName');
              var url = configs.markmoth_url+"&roomscoreid="+roomscoreid+"&roomname="+roomname+"&roomid="+roomid+"&date="+date;
              window.location.href = url; 

        })




        // 选择空房间 
        $(page).on('click','.showCard',function(){
             var roomid = $(this).attr('data-roomid');
             var roomname = $(this).attr('data-roomname');
             var date = $(this).attr('data-date');
             var url = configs.markmoth_url+"&roomname="+roomname+"&roomid="+roomid+"&date="+date;
             window.location.href = url; 
        })


   })






  //加载打分页
  $(document).on("pageInit", "#useraccount_mark", function(e, id, page) { 


      // 允许上传的图片类型  
      var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];  
      // 1024KB，也就是 1MB  
      var maxSize = 5*1024 * 1024;  
      // 图片最大宽度  
      var maxWidth = 300;  
      // 最大上传图片数量  
      var maxCount = 6;  
      $('.js_file').on('change', function (event) {  
        var imgtype = $(this).attr('data-type');

        // return false;
         
          var files = event.target.files;  

          // 如果没有选中文件，直接返回  
          if (files.length === 0) {  
              return;  
          }  
    
          for (var i = 0, len = files.length; i < len; i++) {  
              var file = files[i];  
              var reader = new FileReader();  
    
              // 如果类型不在允许的类型范围内  
              if (allowTypes.indexOf(file.type) === -1) {  
                  $.weui.alert({text: '该类型不允许上传'});  
                  continue;  
              }  
    
              if (file.size > maxSize) {  
                  $.weui.alert({text: '图片太大，不允许上传'});  
                  continue;  
              }  
    
              if ($('.weui_uploader_file').length >= maxCount) {  
                  $.weui.alert({text: '最多只能上传' + maxCount + '张图片'});  
                  return;  
              }  
    
              reader.onload = function (e) {  
                  var img = new Image();  
                  img.onload = function () {  
                      // 不要超出最大宽度  
                      var w = Math.min(maxWidth, img.width);  
                      // 高度按比例计算  
                      var h = img.height * (w / img.width);  
                      var canvas = document.createElement('canvas');  
                      var ctx = canvas.getContext('2d');  
                      // 设置 canvas 的宽度和高度  
                      canvas.width = w;  
                      canvas.height = h;  
                      ctx.drawImage(img, 0, 0, w, h);  
                      var base64 = canvas.toDataURL('image/png');

                      var token = $('#token').val();
                      var adminid = $('#adminid').val();
                      var schoolcode = $('#schoolcode').val();
                      var imgid ='';
                      $.post(configs.server_url+configs.server_api, 
                      {
                        img:base64.replace('data:image/png;base64,', 'data:image/png;base64,/'),token:token,adminid:adminid,schoolcode:schoolcode,
                      }, function(data) 
                      { 
                            console.log(data);
                            if(data.code == 0)
                            {      
                                  imgid = data.data.fileId;
                                  if(imgtype == '1'){
                                    var safefileids = $('#safefileid').val();
                                    safefileids += data.data.fileId + ',';

                                    $('#safefileid').val(safefileids);  
                                  }else if(imgtype == '2'){
                                      var clearfileids = $('#clearfileid').val();
                                      clearfileids += data.data.fileId + ',';
                                      $('#clearfileid').val(clearfileids);
                                       
                                  }else{
                                      var perfileids = $('#perfileid').val();
                                      perfileids += data.data.fileId + ',';
                                      $('#perfileid').val(perfileids); 
                                  }

                                  var $preview = $('<li class="weui_uploader_file weui_uploader_status"><i class="img-delete"  data-type='+imgtype+' data-imgid='+imgid+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+data.data.serverPath+' src='+data.data.serverPath+'><div class="weui_uploader_status_content">0%</div></li>');  
                                  $('#weui_uploader_files'+imgtype).append($preview);  
                                  var num = $('.weui_uploader_file').length;  
                                  $('.js_counter').text(num + '/' + maxCount); 

                                  // 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传  
    
                                  var progress = 0;   
                                  function uploading() {
                                      $(".weui_uploader_file").find('.weui_uploader_status_content').text((++progress) + '%');  
                                      if (progress < 100) {  
                                          setTimeout(uploading, 30);  
                                      }  
                                      else {  
                                          // 如果是失败，塞一个失败图标  
                                          //$preview.find('.weui_uploader_status_content').html('<i class="weui_icon_warn"></i>');  
                                          $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();  
                                      }   
                                  }  
                                  setTimeout(uploading, 30);   
                            }
                            else
                            {
                                $.alert(data.msg);
                                return false;
                            } 

                    }, 'json');


                       
                       
                  };  
    
                  img.src = e.target.result;    
              };  
              reader.readAsDataURL(file);  


          }  
      });  


      $(document).delegate('.imgBox','click',function(){         
          var imgsrc = $(this).attr('data-src');
          $('.box').show();
          $('.box img').attr('src',imgsrc);
      })
 
      $('.box').click(function(){ 
        $('.box').hide()
      })
 
      $(document).delegate('.img-delete','click',function(){
        
              var arr= new Array();
              var imgid = $(this).attr('data-imgid');
              var type = $(this).attr('data-type');
              var ids = '';
              if (type == 1) {
                  ids = $('#safefileid').val();     
              }else if(type == 2){
                  ids = $('#clearfileid').val();   
              }else {
                  ids = $('#perfileid').val();   
              }
                       
              var ids = ids.substring(0,ids.length-1);  
              arr = ids.split(','); 
              console.log(arr);
              arr.splice($.inArray(imgid,arr),1);

              if (type == 1) {
                 $('#safefileid').val(arr);
              }else if(type == 2){
                 $('#clearfileid').val(arr);   
              }else{
                 $('#perfileid').val(arr);   
              }
              
              $(this).parent().remove();
      })


        var arrs = [];
        var itemidarr = [];
        var bedidarr = [];
        var scorearr = [];
        var scoreitemcopy = [];
        var scoreitemcopyid = [];
        var safescorelist= [];
        var clearscorelist = [];
        var parrs = [];// 修改时候用的

        var safeitemarr = [];
        var safebedarr = [];
        var safemark =[];

        var itemarr =[];
        var hygiene =[];
        var roomscoreid = $('#roomscoreid').val();
        if (roomscoreid != '') {
            var data = $.parseJSON($('#data').val());
            $('#lbl_total').text(data.safeScore);
            $('#lbl_cleartotal').text(data.clearScore);

            roomSafeItemList = data.roomSafeItemList;
            for (var i = 0; i < roomSafeItemList.length; i++) {

               if (roomSafeItemList[i].flag ==1) {
                   $('#roomlist_'+roomSafeItemList[i].itemid).append('<span  data-fullmark='+roomSafeItemList[i].score+' data-roomid='+roomSafeItemList[i].roomId+' data-itemid='+roomSafeItemList[i].itemid+' class="break-room btn_removeroom">寝室</span>');
                   safescorelist.push({itemid:roomSafeItemList[i].itemid,score:roomSafeItemList[i].score,roomid:roomSafeItemList[i].roomId}); 
                }else{
                   $('#roomlist_'+roomSafeItemList[i].itemid).append('<span data-bedid='+roomSafeItemList[i].bedid+' data-fullmark='+roomSafeItemList[i].score+' data-itemid='+roomSafeItemList[i].itemid+' class="break-room btn_remove">'+roomSafeItemList[i].bedNum+'</span>');
                   safeitemarr.push(roomSafeItemList[i].itemid);
                   safebedarr.push(roomSafeItemList[i].bedid);
                   safemark.push(roomSafeItemList[i].score);

                   safescorelist.push({itemid:roomSafeItemList[i].itemid,score:roomSafeItemList[i].score,bedid:roomSafeItemList[i].bedid}); 
                }
               $('#safescorelist').val(JSON.stringify(safescorelist));
            };


            roomClearItemList = data.roomClearItemList;
            for (var i = 0; i < roomClearItemList.length; i++) {
               $('#item_'+roomClearItemList[i].itemid).val(roomClearItemList[i].score);
               itemarr.push(roomClearItemList[i].itemid);
               hygiene.push(roomClearItemList[i].score);
               clearscorelist.push({itemid:roomClearItemList[i].itemid,score:roomClearItemList[i].score});                            
               $('#clearscorelist').val(JSON.stringify(clearscorelist));
            };
 
            imglist = data.picList;
            for (var i = 0; i < imglist.length; i++) {

              var path = imglist[i].savePath.split(',');
              var fileid = imglist[i].fileid.split(',');
              var imgmsg ='';
              for (var b = 0; b < path.length; b++) { 
                 imgmsg += '<li class="weui_uploader_file weui_uploader_status"><i class="img-delete" data-type='+imglist[i].picType+' data-imgid='+fileid[b]+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+path[b]+' src='+path[b]+'></li>';    
               }; 

               if (imglist[i].picType == 1) {
                  $('#safefileid').val(imglist[i].fileid+','); 
                  $('#weui_uploader_files1').append(imgmsg);      
               } 
               else if(imglist[i].picType == 2){ 
                  $('#clearfileid').val(imglist[i].fileid+',');
                  $('#weui_uploader_files2').append(imgmsg); 
               }else if(imglist[i].picType == 3){ 
                    $('#perfileid').val(imglist[i].fileid+',');
                    $('#weui_uploader_files3').append(imgmsg); 
               }                         

           };  



            bedList = data.bedList;
            console.log(bedList);
            for (var i = 0; i < bedList.length; i++) {
                var itemList = bedList[i].itemList;
                var totalscore = 0;
                var pick       = 0;

                for (var b = 0; b < itemList.length; b++) {
                   totalscore  += ($('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-fullmark')*1.0);
                   pick        += (itemList[b].score*1.0);

                   $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).val(itemList[b].score);
                   arrs.push(itemList[b].bedid+'_'+itemList[b].itemid);
                   itemidarr.push(itemList[b].itemid);
                   bedidarr.push(itemList[b].bedid);            
                   scorearr.push(itemList[b].score);
                   parrs.push(itemList[b].perscoreid);

                   $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-perscoreid',itemList[b].perscoreid);
                   

                   scoreitemcopyid.push({itemid:itemList[b].itemid,bedid:itemList[b].bedid,score:itemList[b].score,id:itemList[b].bedid+'_'+itemList[b].itemid});
                   scoreitemcopy.push({bedscoreid:itemList[b].perscoreid,itemid:itemList[b].itemid,bedid:itemList[b].bedid,score:itemList[b].score});
                    
                   $('#scoreitem').val(JSON.stringify(scoreitemcopy));
                };
                $('#lbl_'+bedList[i].bedid).text(100 - (totalscore*1.0 - (pick*1.0)) );
            };
            

        }else{
            var peoplelist = $.parseJSON($('#peoplelist').val());            
            var scoreitem = $.parseJSON($('#scoreitem').val()); 
            for (var i = 0; i < peoplelist.length; i++) {
                for (var a = 0; a < scoreitem.length; a++) {
                     arrs.push(peoplelist[i].bedId+'_'+scoreitem[a].itemId);
                     itemidarr.push(scoreitem[a].itemId);
                     bedidarr.push(peoplelist[i].bedId);
                     scorearr.push(scoreitem[a].fullMark);  

                      
                     scoreitemcopyid.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark,id:peoplelist[i].bedId+'_'+scoreitem[a].itemId});

                     scoreitemcopy.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark});
                   
                     $('#scoreitem').val(JSON.stringify(scoreitemcopy) );
                }; 
           
            }; 

        }


 




       //保存
       $(page).on('click','.btn_save',function(){ 
              var adminid = $('#adminid').val(); 

              var semesterid = $('#semesterid').val();
              var currentweek = $('#currentweek').val();
              var roomid = $('#roomid').val();
              var tableid = $('#tableid').val();

              var safescorelist =$('#safescorelist').val();
              if (safescorelist == '') {
                  safescorelist ='[]';
              }

              
               
              var safescore = $('#lbl_total').text();
              var safefileid = $('#safefileid').val();


              var clearscorelist = $('#clearscorelist').val();
              if (clearscorelist == '') {
                 clearscorelist = '[]';
              };
              var clearscore = $('#lbl_cleartotal').text();
              var clearfileid = $('#clearfileid').val();

              var scoreitem = $('#scoreitem').val();
              var perfileid = $('#perfileid').val();

              var roomscoreid = $('#roomscoreid').val();



              var flatId = $('#flatId').val();
              var flatname = $('#flatname').val();
              var liveareaid = $('#liveareaid').val();
              var areaname = $('#areaname').val();
              
              if (roomscoreid == '') {
                    $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForWeek&a=addweekscore", 
                    {
                      semesterid:semesterid,currentweek:currentweek,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,safescorelist:safescorelist,clearscore:clearscore,safescore:safescore,clearfileid:clearfileid,safefileid:safefileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                             $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForWeek&a=weekadd_person_score", 
                              {
                                semesterid:semesterid,currentweek:currentweek,roomid:roomid,tableid:tableid,scoreitem:scoreitem,safescorelist:safescorelist,perfileid:perfileid,adminid:adminid,
                              }, function(data) 
                              { 
                                  if(res.code == 0)
                                  { 
                                       $.alert('打分成功', function () {
                                        $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=dorm&areaname="+areaname+"&liveareaid="+liveareaid+"&week="+currentweek+"&flatname="+encodeURIComponent(flatname)+"&semesterid="+semesterid+"&flatId="+flatId, true);
                                      }); 
                                  }
                                  else
                                  {
                                    $.alert(data.msg);
                                    return false;
                                  } 

                              }, 'json');
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }else{

                  $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForWeek&a=updateweekscore", 
                    {
                      semesterid:semesterid,currentweek:currentweek,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,safescorelist:safescorelist,clearscore:clearscore,safescore:safescore,clearfileid:clearfileid,safefileid:safefileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                             $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForWeek&a=edit_weekperson_score", 
                              {
                                semesterid:semesterid,currentweek:currentweek,roomid:roomid,tableid:tableid,scoreitem:scoreitem,safescorelist:safescorelist,perfileid:perfileid,adminid:adminid,
                              }, function(data) 
                              { 
                                  if(res.code == 0)
                                  { 
                                       $.alert('打分成功', function () {
                                        $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=dorm&areaname="+areaname+"&liveareaid="+liveareaid+"&week="+currentweek+"&flatname="+encodeURIComponent(flatname)+"&semesterid="+semesterid+"&flatId="+flatId, true);
                                      }); 
                                  }
                                  else
                                  {
                                    $.alert(data.msg);
                                    return false;
                                  } 

                              }, 'json');
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }
 
       })


 
        

 
        $(page).on('change','.personal',function(){ 
              var roomscoreid = $('#roomscoreid').val();
              var bedid = $(this).attr('data-bedid');
              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var id = $(this).attr('data-id');
              var perscoreid = $(this).attr('data-perscoreid');
              var score = $(this).val();


              if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $(this).val(fullmark);
                $(this).focus();
                return false;
             }

              for (var i = 0; i < arrs.length; i++) {
                 if (arrs[i] == bedid+'_'+itemid) {
                    arrs.splice($.inArray(arrs[i],arrs),1); 
                    itemidarr.splice($.inArray(itemidarr[i],itemidarr),1); 
                    bedidarr.splice($.inArray(bedidarr[i],bedidarr),1); 
                    scorearr.splice($.inArray(scorearr[i],scorearr),1);
                    parrs.splice($.inArray(parrs[i],parrs),1);
                 }
              };

              arrs.push(bedid+'_'+itemid);
              itemidarr.push(itemid);
              bedidarr.push(bedid);            
              scorearr.push(score);
              parrs.push(perscoreid);

              scoreitemcopy = []; 
              for (var i = 0; i < itemidarr.length; i++) {
                if(roomscoreid ==''){
                    scoreitemcopy.push({itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }else{
                    scoreitemcopy.push({bedscoreid:parrs[i],itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }
                 
              };

              var counttotle = 0; 
              $(".personal").each(function(){ 　                     　　 
                     if ( bedid  ==  $(this).attr('data-bedid')) {
                        if($(this).val() != ''){
                          counttotle += (($(this).attr('data-fullmark') * 1.0) - ($(this).val() * 1.0 ));  
                        }                         
                     }; 
               }) 

              $('#lbl_'+bedid).text(100 - (counttotle * 1.0)  ); 
 
              $('#scoreitem').val(JSON.stringify(scoreitemcopy));  
        })

        var safescorelist = []; //安全检查
        var clearscorelist = []; //卫生检查
      
        var v = 0;
        $(page).on('change','.clear',function(){ 
             var itemid = $(this).attr('data-itemid');  
             var fullmark = $(this).attr('data-fullmark');        
             var score =  $('#item_'+itemid).val();  
             if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $('#item_'+itemid).val(fullmark);
                $('#item_'+itemid).focus();
                //return false;
             }
             for (var i = 0; i < itemarr.length; i++) {
                 if (itemarr[i] == itemid) {
                    itemarr.splice($.inArray(itemarr[i],itemarr),1); 
                    hygiene.splice($.inArray(hygiene[i],hygiene),1); 
                 }
            }
 
           itemarr.push(itemid);
           hygiene.push(score);

           clearscorelist = [];

           for (var i = 0; i < itemarr.length; i++) {
               clearscorelist.push({itemid:itemarr[i],score:hygiene[i]});               
           }; 


           var counttotle = 0; 
           $(".clear").each(function(){ 　                     　　 
                 if ( $(this).val() != '') {
                      counttotle += (($(this).attr('data-fullmark') * 1.0) -($(this).val() * 1.0 ));
                 }; 
           }) 
           $('#lbl_cleartotal').text(100 - (counttotle * 1.0) );
           $('#clearscorelist').val(JSON.stringify(clearscorelist)); 
        })
       
        // 选择未归床号
        $(page).on('click','.rules-add',function(){ 
            var itemid = $(this).attr('data-itemid'); 
            var fullmark = $(this).attr('data-fullMark');
            var topnum = $(this).attr('data-topnum');
            var peoplelist = $.parseJSON($('#peoplelist').val());  
            var strjoin = [];
            var roomid = $('#roomid').val();
            console.log(roomid);
 

            for (var i = 0; i < peoplelist.length; i++) {
                strjoin.push({
                      text: peoplelist[i].bedNum,  
                      bedid:peoplelist[i].bedId,   
                      itemid:itemid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true, 
                      onClick: function() {    
                          var fulltotal = $('#lbl_total').text();//获取总分                        

                          $('#roomlist_'+this.itemid).append('<span data-bedid='+this.bedid+' data-fullmark='+this.fullmark+' data-itemid='+this.itemid+' class="break-room btn_remove">'+this.text+'</span>');  
                          var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值

                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }
                          
                          safescorelist.push({itemid:this.itemid,score:this.fullmark,bedid:this.bedid});
                           
                          $('#safescorelist').val(JSON.stringify(safescorelist)); 
                      }
                });
            }; 
            strjoin.push({
                      text: '寝室',  
                      bedId:'',  
                      itemid:itemid,  
                      roomid:roomid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true,
                      onClick: function() {   

                          $('#roomlist_'+this.itemid).append('<span data-fullmark='+ this.fullmark+' data-itemid='+this.itemid+' data-roomid='+ this.roomid+' class="break-room btn_removeroom">'+this.text+'</span>'); 
                          var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值
                          var fulltotal = $('#lbl_total').text();//获取总分
                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }
                        safescorelist.push({itemid:this.itemid,score:this.fullmark, roomid:this.roomid});    
                        $('#safescorelist').val(JSON.stringify(safescorelist));    
 
                      }
                });


 

            var buttons1 = strjoin;

            var buttons2 = [
              {
                text: '取消',
                bg: 'danger'
              }
            ];
            var groups = [buttons1, buttons2];
            $.actions(groups); 
        })

        $(page).on('click','.btn_removeroom',function(){ 　

              var roomid = $(this).attr('data-roomid');
              var fullmark = $(this).attr('data-fullmark');
              var itemid = $(this).attr('data-itemid');
              safescorelist = $.parseJSON($('#safescorelist').val());

              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');

              safescorelist.splice($.inArray(roomid,safescorelist),1); 
              var safetotle = $('#lbl_total').text(); 
              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
                   if ( (number*1.0) <= (topnum*1.0) ) {
                    $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
                  };
              } 


              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();

        })
  
           
        $(page).on('click','.btn_remove',function(){ 　
               
              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var bedid = $(this).attr('data-bedid');
              safescorelist = $.parseJSON($('#safescorelist').val());

              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');
         
              safescorelist.splice($.inArray(bedid,safescorelist),1); 
              var safetotle = $('#lbl_total').text(); 

              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
                  if ( (number*1.0) <= (topnum*1.0) ) {
                    $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
                  };

              }  

              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();　 
              　
        })

   })



  //加载房间页面
  $(document).on("pageInit", "#useraccount_drom", function(e, id, page) { 
        //选择已打过分的房间
        $(page).on('click','.showCardFrom',function(){ 
              var roomid = $(this).attr('data-roomId');
              var roomscoreid = $(this).attr('data-roomScoreId');
              var semesterid = $(this).attr('data-semesterid');
              var week = $(this).attr('data-currentweek');
              var roomname = $(this).attr('data-roomName');
              var url = configs.mark_url+"&roomscoreid="+roomscoreid+"&semesterid="+semesterid+"&roomname="+roomname+"&roomid="+roomid+"&week="+week;
              //$.router.load(url, true);
              window.location.href = url; 

        })




        // 选择空房间 
        $(page).on('click','.showCard',function(){
             var roomid = $(this).attr('data-roomid');
             var roomname = $(this).attr('data-roomname');
             var week = $(this).attr('data-week');
             var url = configs.mark_url+"&roomname="+roomname+"&roomid="+roomid+"&week="+week;
             //$.router.load(url, true);
             window.location.href = url; 
        })
  })
 
  $(document).on("pageInit", "#useraccount_index", function(e, id, page) {

        //一次打分清空
        $('#year').empty();
        $('#semester').empty();
        $('#week').empty();

        $('#checkschoolyear').empty();
        $('#checksemester').empty();

        //二次打分清空
        $('#twoyear').empty();
        $('#twosemester').empty();
        $('#twoweek').empty();

        $('#twocheckschoolyear').empty();
        $('#twochecksemester').empty();

        var d = new Date()
        var vYear = d.getFullYear();        
        var semesterList = $.parseJSON($('#semesterList').val());

        //周打分联动
        $(page).on('change','#year',function(){
             var semesterList = $.parseJSON($('#semesterList').val());  
             $('#semester').empty();              
             $('#week').empty();
             console.log(semesterList);
             
             var yearid = $(this).val(); 
             for (var i = 0; i < semesterList.length; i++) {
                if(yearid == semesterList[i].year){
                   semester = semesterList[i].semesterList;
                   for (var b = 0; b < semester.length; b++) {
                        $('#semester').append('<option value="'+semester[b].semesterId+'">'+(b+1)+'</option> ');
                        for (var c = 1; c <= semester[b].countweek; c++) {    
                          $('#week').append('<option value="'+c+'">'+c+'</option> ');                   
                        };
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

 
        for (var i = 0; i < semesterList.length; i++) {
            if(semesterList[i].year == vYear){
                $('#year').append('<option selected value="'+semesterList[i].year+'">'+semesterList[i].year+'</option> '); // 周打分
                $('#checkschoolyear').append('<option selected value="'+semesterList[i].schoolYearId+'">'+semesterList[i].year+'</option> '); //抽查年
 

                $('#twoyear').append('<option selected value="'+semesterList[i].year+'">'+semesterList[i].year+'</option> '); //二次 周打分
                $('#twocheckschoolyear').append('<option selected value="'+semesterList[i].schoolYearId+'">'+semesterList[i].year+'</option> '); //二次抽查年
                var list = semesterList[i].semesterList;
                for (var b = 0; b < list.length; b++) {
                    if (list[b].isCurrent == 1) {
                       $('#semester').append('<option selected value="'+list[b].semesterId+'">'+(b+1)+'</option> '); //周打分 加载学期
                       $('#checksemester').append('<option selected value="'+list[b].semesterId+'">'+(b+1)+'</option> ');//抽查打分 加载学期

                       $('#twosemester').append('<option selected value="'+list[b].semesterId+'">'+(b+1)+'</option> '); //二次周打分 加载学期
                       $('#twochecksemester').append('<option selected value="'+list[b].semesterId+'">'+(b+1)+'</option> ');//二次抽查打分 加载学期
                       for (var c = 1; c <= list[b].countweek; c++) {
                          if(list[b].currentWeek == c){
                              $('#week').append('<option selected value="'+c+'">'+c+'</option> ');  
                              $('#twoweek').append('<option selected value="'+c+'">'+c+'</option> ');  
                          }else{
                              $('#week').append('<option value="'+c+'">'+c+'</option> ');    
                              $('#twoweek').append('<option value="'+c+'">'+c+'</option> ');  
                          }
                                               
                       };

                    }else{
                       $('#semester').append('<option value="'+list[b].semesterId+'">'+(b+1)+'</option> '); //周打分 加载学期
                       $('#checksemester').append('<option value="'+list[b].semesterId+'">'+(b+1)+'</option> '); //月打分 加载学期

                       $('#twosemester').append('<option value="'+list[b].semesterId+'">'+(b+1)+'</option> '); //二次周打分 加载学期
                       $('#twochecksemester').append('<option value="'+list[b].semesterId+'">'+(b+1)+'</option> ');//二次抽查打分 加载学期
                    } 
                }; 

            }else{
              $('#year').append('<option value="'+semesterList[i].year+'">'+semesterList[i].year+'</option> ');//周打分加载年
              $('#checkschoolyear').append('<option value="'+semesterList[i].schoolYearId+'">'+semesterList[i].year+'</option> ');//抽查打分 加载年

              $('#twoyear').append('<option value="'+semesterList[i].year+'">'+semesterList[i].year+'</option> '); //二次 周打分
              $('#twocheckschoolyear').append('<option value="'+semesterList[i].schoolYearId+'">'+semesterList[i].year+'</option> ');//二次抽查打分 加载年
            }     
        };


        //抽查联动
        $(page).on('change','#checkschoolyear',function(){

             var semesterList = $.parseJSON($('#semesterList').val());  
             $('#checksemester').empty();
 
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



        //二次打分周打分联动
        $(page).on('change','#twoyear',function(){
             var semesterList = $.parseJSON($('#semesterList').val());  
             $('#twosemester').empty();
              
             $('#twoweek').empty();
             console.log(semesterList);
             
             var yearid = $(this).val(); 
             for (var i = 0; i < semesterList.length; i++) {
                if(yearid == semesterList[i].year){
                   semester = semesterList[i].semesterList;
                   for (var b = 0; b < semester.length; b++) {
                        $('#twosemester').append('<option value="'+semester[b].semesterId+'">'+(b+1)+'</option> ');
                        for (var c = 1; c <= semester[b].countweek; c++) {    
                          $('#twoweek').append('<option value="'+c+'">'+c+'</option> ');                   
                        };
                   }; 
                }
             };
        })
        //semester[b].semesterName
        //二次打分学期联动
        $(page).on('change','#twosemester',function(){
           var yearid = $('#twoyear').val();
           var semesterid = $('#twosemester').val();
           $('#twoweek').empty();
           var semesterList = $.parseJSON($('#semesterList').val());  
           for (var i = 0; i < semesterList.length; i++) {
              if(yearid == semesterList[i].year){
                 semester = semesterList[i].semesterList;
                 for (var b = 0; b < semester.length; b++) {
                   if(semesterid == semester[b].semesterId){
                      for (var c = 1; c <= semester[b].countweek; c++) {
                        $('#twoweek').append('<option value="'+c+'">'+c+'</option> ');
                         
                      };
                   }
                 };
              }
           };
        })

        //抽查联动
        $(page).on('change','#twocheckschoolyear',function(){

             var semesterList = $.parseJSON($('#semesterList').val());  
             $('#twochecksemester').empty(); 
 
             var schoolYearId = $(this).val(); 
             for (var i = 0; i < semesterList.length; i++) {
                if(schoolYearId == semesterList[i].schoolYearId){
                   semester = semesterList[i].semesterList;
                   for (var b = 0; b < semester.length; b++) {
                        $('#twochecksemester').append('<option value="'+semester[b].semesterId+'">'+(b+1)+'</option> ');
                   }; 
                }
             };

        })
  })
//semester[b].semesterName

  //加载登陆页面
	$(document).on("pageInit", "#useraccount_login", function(e, id, page) {

 
       
      $(page).on('click','.buttonBlue',function() { //确认登陆

           var loginName = $('#loginName').val(); 
           var loginPwd = $('#loginPwd').val();
           if(loginName == ''){
              $.alert('请输入账号');
              return false;
           }
           if (loginPwd == '') {
              $.alert('请输入密码');
              return false;
           }; 
           $.showIndicator();
           $.ajax({
                  type: 'POST',
                  async:false,
                  url: configs.login_url,
                  data: {
                    loginName:loginName,loginPwd:loginPwd
                  },
                  success: function(data) { 
                      $.hideIndicator();
                      if(data.code  == 0){  
                          if(configs.callback == ''){                           
                              location.href = configs.index_url;
                          }else{
                              location.href = configs.callback;
                          }
                          
                      }else{
                          $.alert(data.msg);
                      } 
                  } 
           });  
      })
 

	});

  $.init();
});


   
	// $("#date-input").calendar({  
	// 	value: ['2016-07-26']
	// });

  //打分选择月
  $(document).on('change','#date-input',function(){ 
      var  data = $(this).val() ;     
      $('#date-input').val(data.substring(0,7));     
  })

 

  //二次打分选择月
  $(document).on('change','#date-input_two',function(){ 
      var data = $(this).val() ; 
      $('#date-input_two').val(data.substring(0,7)); 
  })
   
  //点击打分（月）
  $(document).on('click','.month',function(){  
       var oneyear = $('#oneyear').val();
       if (oneyear == '') {
           $.alert('请选择年');
           return false;
       }
       var onemonth = $('#onemonth').val();
       if (onemonth == '') {
           $.alert('请选择月');
           return false;
       };
       ShowliveArea('2');
  })

 //点击二次打分（月）
  $(document).on('click','.twomonth',function(){ 
       var secondyear = $('#secondyear').val();
       if (secondyear == '') {
           $.alert('请选择年');
           return false;
       }
       var secondmonth = $('#secondmonth').val();
       if (secondmonth == '') {
           $.alert('请选择月');
           return false;
       };
       ShowliveArea('3');
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
          async : false,
          data: {
             schoolyearid:checksemesterid,schoolyearid:schoolyearid,
          },
          success: function(data) {  
              if(data.dataList.length > 0){
                  GetChekList(data.dataList,'1');
              }else{
                $.alert(data.msg);
              }
              $.hideIndicator();    
            } 
        });  
  })

  //二次打分抽查
  $(document).on('click','.twocheck',function(){
        var schoolyearid = $('#twocheckschoolyear').val();
        if(schoolyearid == ''){
            $.alert('学年');
            return false;
        }
        var checksemesterid = $('#twochecksemester').val();
        if (checksemesterid == '') {
            $.alert('学期');
            return false;
        };
        $.ajax({
          type: 'POST',
          url: configs.checklist_url,
          async : false,
          data: {
             schoolyearid:checksemesterid,schoolyearid:schoolyearid,
          },
          success: function(data) {  
              if(data.dataList.length > 0){
                  GetChekList(data.dataList,'2');
              }else{
                $.alert(data.msg);
              }
              $.hideIndicator();    
            } 
        });  
  })
  function GetChekList (data,v) {
        var list = data;
         
        var strjoin = []; 
        strjoin.push({text: '请选择',label: true});  
        for (var i = 0; i < data.length; i++) {
            var checkid = data[i].checkId; 
            var flats = data[i].flatIds;
            var tableid = data[i].tableId;
            strjoin.push({
                    text: data[i].title,  
                    checkId: checkid, 
                    tableid:tableid,   
                    bold : true, 
                    flats:flats,
                    v    : v,
                    onClick: function() {                            
                         showflatList(this.checkId,this.flats,this.tableid,this.v);
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

  function  showflatList(checkid,flats,tableid,v) {
      var strjoin = []; 
      strjoin.push({text: '请选择',label: true});  
      for (var i = 0; i < flats.length; i++) {
          var flatarr = flats[i].flatName.split('-');
          if(v == '1'){
              var url = configs.dormcheck_url+"&tableid="+tableid+"&areaname="+flatarr[0]+"&checkid="+checkid+"&flatId="+flats[i].flatId+"&flatname="+encodeURIComponent(flatarr[1]);
          }else if(v == '2'){
              var url = configs.twodormcheck_url+"&tableid="+tableid+"&areaname="+flatarr[0]+"&checkid="+checkid+"&flatId="+flats[i].flatId+"&flatname="+encodeURIComponent(flatarr[1]);
          }
        
          strjoin.push({
                    text: flats[i].flatName,  
                    checkId: checkid,    
                    bold: true,  
                    url:url,
                    onClick: function() {   
                         // window.location.href = this.url;
                         $.router.load(this.url);
                    }
            });
        
      };


      var buttons1 = strjoin;

      var buttons2 = [
      {
          text: '取消',
          bg: 'danger'
      }];

      var groups = [buttons1, buttons2];
      $.actions(groups);

  }

 




 

	$(document).on('click','.week', function () {

      var year = $('#year').val();
      if(year == ''){
          $.alert('年份');
          return false;
      }
      var semesterid = $('#semester').val();  
      if (semesterid == '') {
          $.alert('学期');
          return false;
      };
      var week = $('#week').val();
      if (week == '') {
          $.alert('周');
          return false;
      }; 
      ShowliveArea('1');
  });


  $(document).on('click','.twoweek', function () {

      var year = $('#twoyear').val();
      if(year == ''){
          $.alert('年份');
          return false;
      }
      var semesterid = $('#twosemester').val();  
      if (semesterid == '') {
          $.alert('学期');
          return false;
      };
      var week = $('#twoweek').val();
      if (week == '') {
          $.alert('周');
          return false;
      }; 
      ShowliveArea('4');
  });


  function ShowliveArea(v) {
        var flatTree = $.parseJSON($('#flatTree').val());  
        var strjoin = []; 
        strjoin.push({text: '请选择生活区',label: true});  
        console.log(flatTree);   
         
        for (var i = 0; i < flatTree['cmpusList'].length; i++) {
           var liveAreaList = flatTree['cmpusList'][i]['liveAreaList'];
   
              for (var a = 0; a < liveAreaList.length; a++) {
              { 
                  var liveareaid = liveAreaList[a].liveAreaId; 
                  strjoin.push({
                    text: liveAreaList[a].title,  
                    liveareaid: liveareaid,    
                    bold: true, 
                    v:v,
                    onClick: function() {                            
                        showflat(this.liveareaid,this.v);
                    }
                  });
              }
          };
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


 function showflat(liveareaid,v){   
        var flatTree = $.parseJSON($('#flatTree').val());  
        var flatjoin = [];
        flatjoin.push({text: '请选择楼栋',label: true}); 

        for (var i = 0; i < flatTree['cmpusList'].length; i++) {
            var liveAreaList = flatTree['cmpusList'][i]['liveAreaList'];
            for (var a = 0; a < liveAreaList.length; a++) {

              if(liveareaid == liveAreaList[a].liveAreaId){ 
                  var flat = liveAreaList[a].flatList;
                  for (var b = 0; b < flat.length; b++) {
                      if (v == '1') {
                            var url = configs.dorm_url+"&semesterid="+$('#semester').val()+"&flatId="+flat[b].flatId+"&flatname="+encodeURIComponent(flat[b].title)+"&week="+$('#week').val()+"&liveareaid="+liveAreaList[a]['liveAreaId']+"&areaname="+liveAreaList[a]['title'];
                      }else if(v == '2'){
                            var oneyear = $('#oneyear').val();
                            var onemonth = $('#onemonth').val();
                            var data = oneyear+'-'+onemonth 
                            var url = configs.dormmoth_url+"&flatId="+flat[b].flatId+"&flatname="+encodeURIComponent(flat[b].title)+"&date="+data+"&liveareaid="+liveAreaList[a]['liveAreaId']+"&areaname="+liveAreaList[a]['title'];
                      }else if(v == '3'){
                            var secondyear = $('#secondyear').val();
                            var secondmonth = $('#secondmonth').val();
                            var data = secondyear+'-'+secondmonth 
                            var url  = configs.twodormmoth_url+"&flatId="+flat[b].flatId+"&flatname="+encodeURIComponent(flat[b].title)+"&date="+data+"&liveareaid="+liveAreaList[a]['liveAreaId']+"&areaname="+liveAreaList[a]['title'];
                      }else if(v == '4'){
                            var url = configs.twodorm_url+"&semesterid="+$('#twosemester').val()+"&flatId="+flat[b].flatId+"&flatname="+encodeURIComponent(flat[b].title)+"&week="+$('#twoweek').val()+"&liveareaid="+liveAreaList[a]['liveAreaId']+"&areaname="+liveAreaList[a]['title'];
                      }      
                      
                     flatjoin.push({
                          text: flat[b].title,                 
                          bold: true,
                          url:url,
                          onClick: function() {
                               // window.location.href = this.url;
                               $.router.load(this.url);
                          }
                      });

                  };
              }
          } 
      }

 
      var buttons1 = flatjoin;

      var buttons2 = [
        {
          text: '取消',
          bg: 'danger'
        }
      ];
      var groups = [buttons1, buttons2];
      $.actions(groups);

    }






  
  
  $(function(){
    $(document).on('click','.alert-text-title', function () {
        $.alert('选择确定将重置本页打分项目，并且不能恢复，请确认是否重置！', '重置打分项');
    });
  })
  




  ///////////二次打分////////////////////
  
    //加载月打分房间列表
   $(document).on("pageInit", "#useraccount_twodrommoth", function(e, id, page) { 

          //选择已打过分的房间
        $(page).on('click','.showCardFrom',function(){ 
              var roomid = $(this).attr('data-roomId');
              var roomscoreid = $(this).attr('data-roomScoreId');
              var date = $(this).attr('data-date');
              var roomname = $(this).attr('data-roomName');
              var url = configs.twomarkmoth_url+"&roomscoreid="+roomscoreid+"&roomname="+roomname+"&roomid="+roomid+"&date="+date;
              window.location.href = url; 

        }) 

        // 选择空房间 
        $(page).on('click','.showCard',function(){
             var roomid = $(this).attr('data-roomid');
             var roomname = $(this).attr('data-roomname');
             var date = $(this).attr('data-date');
             var url = configs.twomarkmoth_url+"&roomname="+roomname+"&roomid="+roomid+"&date="+date;
             window.location.href = url; 
        })


   })





 ////////二次月打分/////////////////////////////////////////////////////////////
 
  $(document).on("pageInit", "#useraccount_twomarkmoth", function(e, id, page) { 

      // 允许上传的图片类型  
      var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];  
      // 1024KB，也就是 1MB  
      var maxSize = 5*1024 * 1024;  
      // 图片最大宽度  
      var maxWidth = 300;  
      // 最大上传图片数量  
      var maxCount = 6;  
      $('.js_file').on('change', function (event) { 

        var imgtype = $(this).attr('data-type');

        // return false;
         
          var files = event.target.files;  

          // 如果没有选中文件，直接返回  
          if (files.length === 0) {  
              return;  
          }  
    
          for (var i = 0, len = files.length; i < len; i++) {  
              var file = files[i];  
              var reader = new FileReader();  
    
              // 如果类型不在允许的类型范围内  
              if (allowTypes.indexOf(file.type) === -1) {  
                  $.weui.alert({text: '该类型不允许上传'});  
                  continue;  
              }  
    
              if (file.size > maxSize) {  
                  $.weui.alert({text: '图片太大，不允许上传'});  
                  continue;  
              }  
    
              if ($('.weui_uploader_file').length >= maxCount) {  
                  $.weui.alert({text: '最多只能上传' + maxCount + '张图片'});  
                  return;  
              }  
    
              reader.onload = function (e) {  
                  var img = new Image();  
                  img.onload = function () {  
                      // 不要超出最大宽度  
                      var w = Math.min(maxWidth, img.width);  
                      // 高度按比例计算  
                      var h = img.height * (w / img.width);  
                      var canvas = document.createElement('canvas');  
                      var ctx = canvas.getContext('2d');  
                      // 设置 canvas 的宽度和高度  
                      canvas.width = w;  
                      canvas.height = h;  
                      ctx.drawImage(img, 0, 0, w, h);  
                      var base64 = canvas.toDataURL('image/png');

                      var token = $('#token').val();
                      var adminid = $('#adminid').val();
                      var schoolcode = $('#schoolcode').val();
                      var imgid ='';
                      $.post(configs.server_url+configs.server_api, 
                      {
                        img:base64.replace('data:image/png;base64,', 'data:image/png;base64,/'),token:token,adminid:adminid,schoolcode:schoolcode,
                      }, function(data) 
                      { 
                            console.log(data);
                            if(data.code == 0)
                            {  
                              imgid = data.data.fileId;
                                  if(imgtype == '0'){
                                    var safefileids = $('#safefileid').val();
                                    safefileids += data.data.fileId + ',';
                                     $('#safefileid').val(safefileids);  
                                  }else if(imgtype == '1'){
                                      var clearfileids = $('#clearfileid').val();
                                      clearfileids += data.data.fileId + ',';
                                      $('#clearfileid').val(clearfileids);
                                       
                                  }else{
                                      var perfileids = $('#perfileid').val();
                                      perfileids += data.data.fileId + ',';
                                      $('#perfileid').val(perfileids); 
                                  }


                                // 插入到预览区  
                                //var $preview = $('<li class="weui_uploader_file weui_uploader_status imgBox" style="background-image:url(' + base64 + ')"><i class="img-delete" data-imgid='+imgid+'>-</i><div class="weui_uploader_status_content">0%</div></li>');  
                                var $preview = $('<li class="weui_uploader_file weui_uploader_status"><i class="img-delete"  data-type='+imgtype+' data-imgid='+imgid+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+data.data.serverPath+' src='+data.data.serverPath+'><div class="weui_uploader_status_content">0%</div></li>');  
                                $('#weui_uploader_files'+imgtype).append($preview);  
                                var num = $('.weui_uploader_file').length;  
                                $('.js_counter').text(num + '/' + maxCount);  
              
                                // 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传  
              
                                var progress = 0;   
                                function uploading() {
                                    $(".weui_uploader_file").find('.weui_uploader_status_content').text((++progress) + '%');  
                                    if (progress < 100) {  
                                        setTimeout(uploading, 30);  
                                    }  
                                    else {  
                                        // 如果是失败，塞一个失败图标  
                                        //$preview.find('.weui_uploader_status_content').html('<i class="weui_icon_warn"></i>');  
                                        $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();  
                                    }   
                                }  
                                setTimeout(uploading, 30); 


                            }
                            else
                            {
                                $.alert(data.msg);
                                return false;
                            } 

                    },'json');  
                  };  
    
                  img.src = e.target.result;    
              };  
              reader.readAsDataURL(file);  


          }  
      });  


      $(document).delegate('.imgBox','click',function(){ 
        
          var imgsrc = $(this).attr('data-src');
          $('.box').show();
          $('.box img').attr('src',imgsrc);
      })
 
      $('.box').click(function(){ 
        $('.box').hide()
      })
 
      $(document).delegate('.img-delete','click',function(){
        
              var arr= new Array();
              var imgid = $(this).attr('data-imgid');
              var type = $(this).attr('data-type');
              var ids = '';
              if (type == 1) {
                  ids = $('#safefileid').val();     
              }else if(type == 2){
                  ids = $('#clearfileid').val();   
              }else {
                  ids = $('#perfileid').val();   
              }
                       
              var ids = ids.substring(0,ids.length-1);  
              arr = ids.split(','); 
              console.log(arr);
              arr.splice($.inArray(imgid,arr),1);

              if (type == 1) {
                 $('#safefileid').val(arr);
              }else if(type == 2){
                 $('#clearfileid').val(arr);   
              }else{
                 $('#perfileid').val(arr);   
              }
              
              $(this).parent().remove();
      })


        var arrs = [];
        var itemidarr = [];
        var bedidarr = [];
        var scorearr = [];
        var scoreitemcopy = [];
        var scoreitemcopyid = [];
        var safescorelist= [];
        var clearscorelist = [];
        var parrs = [];// 修改时候用的

        var safeitemarr = [];
        var safebedarr = [];
        var safemark =[];
 
        var itemarr = [];
        var hygiene = [];

        var roomscoreid = $('#roomscoreid').val();
        var ndata = $.parseJSON($('#ndata').val()); 

        if (roomscoreid != '') {
            var data = $.parseJSON($('#data').val());          
            console.log(data);
            $('#lbl_cleartotal').text(data.clearScore); 
            roomClearItemList = data.roomClearItemList;
            for (var i = 0; i < roomClearItemList.length; i++) {
               $('#item_'+roomClearItemList[i].itemid).val(roomClearItemList[i].score);
               itemarr.push(roomClearItemList[i].itemid);
               hygiene.push(roomClearItemList[i].score);

               clearscorelist.push({itemid:roomClearItemList[i].itemid,score:roomClearItemList[i].score});                            
               $('#clearscorelist').val(JSON.stringify(clearscorelist));
            };


            imglist = data.picList;
            for (var i = 0; i < imglist.length; i++) {

              var path = imglist[i].savePath.split(',');
              var fileid = imglist[i].fileid.split(',');
              var imgmsg ='';
              for (var b = 0; b < path.length; b++) { 
                 imgmsg += '<li class="weui_uploader_file weui_uploader_status"><i class="img-delete" data-imgid='+fileid[b]+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+path[b]+' src='+path[b]+'></li>';    
               }; 

              if(imglist[i].picType == 2 || imglist[i].picType == 4){ 
               $('#clearfileid').val(imglist[i].fileid+',');
               $('#weui_uploader_files1').append(imgmsg);  
             }else if(imglist[i].picType == 3 || imglist[i].picType == 5){ 
               $('#perfileid').val(imglist[i].fileid+',');
               $('#weui_uploader_files2').append(imgmsg); 
             }                         

           }; 
 
            bedList = data.bedList;             
            for (var i = 0; i < bedList.length; i++) {
                var itemList = bedList[i].itemList;
                var totalscore = 0;
                var pick       = 0;
                for (var b = 0; b < itemList.length; b++) {
                   totalscore  += ($('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-fullmark')*1.0);
                   pick        += (itemList[b].score*1.0);
                   $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).val(itemList[b].score);

                   arrs.push(itemList[b].bedid+'_'+itemList[b].itemid);
                   itemidarr.push(itemList[b].itemid);
                   bedidarr.push(itemList[b].bedid);            
                   scorearr.push(itemList[b].score);
                   parrs.push(itemList[b].perscoreid);

                   $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-perscoreid',itemList[b].perscoreid);
                   
 
                   scoreitemcopyid.push({itemid:itemList[b].itemid,bedid:itemList[b].bedid,score:itemList[b].score,id:itemList[b].bedid+'_'+itemList[b].itemid});
                   scoreitemcopy.push({bedscoreid:itemList[b].perscoreid,itemid:itemList[b].itemid,bedid:itemList[b].bedid,score:itemList[b].score});

                    $('#scoreitem').val(JSON.stringify(scoreitemcopy));
                };
                $('#lbl_'+bedList[i].bedid).text(100 - (totalscore*1.0 - (pick*1.0)) );
            };
            

        }else{  
 
            var peoplelist = $.parseJSON($('#peoplelist').val());            
            var scoreitem = $.parseJSON($('#scoreitem').val()); 

            for (var i = 0; i < peoplelist.length; i++) {
                for (var a = 0; a < scoreitem.length; a++) {
                     for (var n = 0; n < ndata['bedlist'].length; n++) {
                          if (peoplelist[i].bedId == ndata['bedlist'][n].bedid) {
                             arrs.push(peoplelist[i].bedId+'_'+scoreitem[a].itemId);
                             itemidarr.push(scoreitem[a].itemId);
                             bedidarr.push(peoplelist[i].bedId);
                             scorearr.push(scoreitem[a].fullMark);   
                             scoreitemcopyid.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark,id:peoplelist[i].bedId+'_'+scoreitem[a].itemId});
                             scoreitemcopy.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark});
                           
                             $('#scoreitem').val(JSON.stringify(scoreitemcopy) );
                          };
                     };
                    
                }; 
           
            }; 

        }
 


       //保存
       $(page).on('click','.btn_twosave',function(){ 
              var adminid = $('#adminid').val();  
              var datetext = $('#datetext').val();
              var roomid = $('#roomid').val();
              var tableid = $('#tableid').val();
 
              var clearscorelist = $('#clearscorelist').val();
              if (clearscorelist == '') {
                  clearscorelist = '[]';
              };
              var clearscore = $('#lbl_cleartotal').text();
              var clearfileid = $('#clearfileid').val();

              var scoreitem = $('#scoreitem').val();
              var perfileid = $('#perfileid').val();

              var roomscoreid = $('#roomscoreid').val();
 
              var flatId = $('#flatId').val();
              var flatname = $('#flatname').val();
              var liveareaid = $('#liveareaid').val();
              var areaname = $('#areaname').val();
              
              if (roomscoreid == '') {
                    $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForMonth&a=month_addsecondmothscore", 
                    {
                        datetext:datetext,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,clearscore:clearscore,clearfileid:clearfileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                             if(scoreitem != ''){
                                  $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForMonth&a=month_add_secondperson_score", 
                                  {
                                    datetext:datetext,roomid:roomid,tableid:tableid,scoreitem:scoreitem,perfileid:perfileid,adminid:adminid,
                                  }, function(data) 
                                  { 
                                      if(res.code == 0)
                                      { 
                                           $.alert('打分成功', function () {
                                              $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodormmoth&areaname="+areaname+"&liveareaid="+liveareaid+"&flatname="+encodeURIComponent(flatname)+"&date="+datetext+"&flatId="+flatId, true);
                                          }); 
                                      }
                                      else
                                      {
                                        $.alert(data.msg);
                                        return false;
                                      } 

                                  }, 'json');
                             }else{
                                  $.alert('打分成功', function () {
                                      $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodormmoth&areaname="+areaname+"&liveareaid="+liveareaid+"&flatname="+encodeURIComponent(flatname)+"&date="+datetext+"&flatId="+flatId, true);
                                  }); 
                             }
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }else{

                  $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForMonth&a=month_updatesecondmothscore", 
                    {
                        datetext:datetext,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,clearscore:clearscore,clearfileid:clearfileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                             if(scoreitem != ''){
                                $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForMonth&a=month_edit_secondperson_score", 
                                {
                                    datetext:datetext,roomid:roomid,tableid:tableid,scoreitem:scoreitem,perfileid:perfileid,adminid:adminid,
                                }, function(data) 
                                { 
                                    if(res.code == 0)
                                    { 
                                         $.alert('打分成功', function () {
                                           $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodormmoth&areaname="+areaname+"&liveareaid="+liveareaid+"&flatname="+encodeURIComponent(flatname)+"&date="+datetext+"&flatId="+flatId, true);
                                        }); 
                                    }
                                    else
                                    {
                                      $.alert(data.msg);
                                      return false;
                                    } 

                                }, 'json');
                             }else{
                                  $.alert('打分成功', function () {
                                     $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodormmoth&areaname="+areaname+"&liveareaid="+liveareaid+"&flatname="+encodeURIComponent(flatname)+"&date="+datetext+"&flatId="+flatId, true);
                                  }); 
                             }
                              
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }
 
       })


 
        

 
        $(page).on('change','.personal',function(){ 
              var roomscoreid = $('#roomscoreid').val();
              var bedid = $(this).attr('data-bedid');
              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var id = $(this).attr('data-id');
              var perscoreid = $(this).attr('data-perscoreid');
              var score = $(this).val();


              if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $(this).val(fullmark);
                $(this).focus();
                return false;
             }

              for (var i = 0; i < arrs.length; i++) {
                 if (arrs[i] == bedid+'_'+itemid) {
                    arrs.splice($.inArray(arrs[i],arrs),1); 
                    itemidarr.splice($.inArray(itemidarr[i],itemidarr),1); 
                    bedidarr.splice($.inArray(bedidarr[i],bedidarr),1); 
                    scorearr.splice($.inArray(scorearr[i],scorearr),1);
                    parrs.splice($.inArray(parrs[i],parrs),1);
                 }
              };

              arrs.push(bedid+'_'+itemid);
              itemidarr.push(itemid);
              bedidarr.push(bedid);            
              scorearr.push(score);
              parrs.push(perscoreid);

              scoreitemcopy = []; 
              for (var i = 0; i < itemidarr.length; i++) {
                if(roomscoreid ==''){
                    scoreitemcopy.push({itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }else{
                    scoreitemcopy.push({bedscoreid:parrs[i],itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }
                 
              };

              var counttotle = 0; 
              $(".personal").each(function(){ 　                     　　 
                     if ( bedid  ==  $(this).attr('data-bedid')) {
                        if($(this).val() != ''){
                          counttotle += (($(this).attr('data-fullmark') * 1.0) - ($(this).val() * 1.0 ));  
                        }                         
                     }; 
               }) 

              $('#lbl_'+bedid).text(100 - (counttotle * 1.0)  ); 
 
              $('#scoreitem').val(JSON.stringify(scoreitemcopy));  
        })

        var safescorelist = []; //安全检查
        var clearscorelist = []; //卫生检查
      
        var v = 0;
        $(page).on('change','.clear',function(){ 
             var itemid = $(this).attr('data-itemid');  
             var fullmark = $(this).attr('data-fullmark');        
             var score =  $('#item_'+itemid).val();  
             if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $('#item_'+itemid).val(fullmark);
                $('#item_'+itemid).focus();
                //return false;
             }

             for (var i = 0; i < itemarr.length; i++) {
                 if (itemarr[i] == itemid) {
                    itemarr.splice($.inArray(itemarr[i],itemarr),1); 
                    hygiene.splice($.inArray(hygiene[i],hygiene),1); 
                 }
            }

           itemarr.push(itemid);
           hygiene.push(score);

           clearscorelist = [];
          
           for (var i = 0; i < itemarr.length; i++) {
               clearscorelist.push({itemid:itemarr[i],score:hygiene[i]});　
           }; 

           var counttotle = 0; 
           $(".clear").each(function(){ 　                     　　 
                 if ( $(this).val() != '') {
                      counttotle += (($(this).attr('data-fullmark') * 1.0) -($(this).val() * 1.0 ));
                 }; 
           }) 
           $('#lbl_cleartotal').text(100 - (counttotle * 1.0) );
       　
           $('#clearscorelist').val(JSON.stringify(clearscorelist));
 
 
        })



        // 选择未归床号
        $(page).on('click','.rules-add',function(){ 
            var roomscoreid = $('#roomscoreid').val();
            var itemid = $(this).attr('data-itemid'); 
            var fullmark = $(this).attr('data-fullMark');
            var topnum = $(this).attr('data-topnum');
            var peoplelist = $.parseJSON($('#peoplelist').val());  
            var roomid = $('#roomid').val();
            var strjoin = [];

            for (var i = 0; i < peoplelist.length; i++) {
                strjoin.push({
                      text: peoplelist[i].bedNum,  
                      bedid:peoplelist[i].bedId,   
                      itemid:itemid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true, 
                      onClick: function() {    
                         
                          var fulltotal = $('#lbl_total').text();//获取总分                         

                          $('#roomlist_'+this.itemid).append('<span data-bedid='+this.bedid+' data-fullmark='+this.fullmark+' data-itemid='+this.itemid+' class="break-room btn_remove">'+this.text+'</span>');  
                          var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值

                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }
                          
                          safescorelist.push({itemid:this.itemid,score:this.fullmark,bedid:this.bedid});
                           
                          $('#safescorelist').val(JSON.stringify(safescorelist)); 
                      }
                });
            }; 
            strjoin.push({
                      text: '寝室',  
                      bedId:'', 
                      itemid:itemid,  
                      roomid:roomid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true,
                      onClick: function() {    
                         
                          $('#roomlist_'+this.itemid).append('<span data-fullmark='+ this.fullmark+' data-itemid='+this.itemid+' data-roomid='+ this.roomid+' class="break-room btn_removeroom">'+this.text+'</span>'); 
                          var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值
                          var fulltotal = $('#lbl_total').text();//获取总分
                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }

                        safescorelist.push({itemid:this.itemid,score:this.fullmark, roomid:this.roomid});    


                        $('#safescorelist').val(JSON.stringify(safescorelist));    
 
                      }
                });


 

            var buttons1 = strjoin;

            var buttons2 = [
              {
                text: '取消',
                bg: 'danger'
              }
            ];
            var groups = [buttons1, buttons2];
            $.actions(groups); 
        }) 


        $(page).on('click','.btn_removeroom',function(){ 

              var roomid = $(this).attr('data-roomid');
              var fullmark = $(this).attr('data-fullmark');
              var itemid = $(this).attr('data-itemid');
              safescorelist = $.parseJSON($('#safescorelist').val());


              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');

              safescorelist.splice($.inArray(roomid,safescorelist),1); 
              var safetotle = $('#lbl_total').text(); 
              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
               if ( (number*1.0) <= (topnum*1.0) ) {
                $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
              };
            } 

 
              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();
          })





            $(page).on('click','.btn_remove',function(){ 

              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var bedid = $(this).attr('data-bedid');
              safescorelist = $.parseJSON($('#safescorelist').val());

              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');


              safescorelist.splice($.inArray(bedid,safescorelist),1); 

              var safetotle = $('#lbl_total').text(); 

              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
                if ( (number*1.0) <= (topnum*1.0) ) {
                  $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
                };

              }  

              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();　 
        }) 
       
  })

  ////////////////二次周打分//////////////////////////////////
  $(document).on("pageInit", "#useraccount_twodrom", function(e, id, page) { 
 
        //选择已打过分的房间
        $(page).on('click','.showCardFrom',function(){  
              var roomid = $(this).attr('data-roomId');
              var roomscoreid = $(this).attr('data-roomScoreId');
              var semesterid = $(this).attr('data-semesterid');
              var week = $(this).attr('data-currentweek');
              var roomname = $(this).attr('data-roomName');
              var url = configs.twomark_url+"&roomscoreid="+roomscoreid+"&semesterid="+semesterid+"&roomname="+roomname+"&roomid="+roomid+"&week="+week;
              window.location.href = url;  
        })


        // 选择空房间 
        $(page).on('click','.showCard',function(){  
             var semesterid = $('#semesterid').val();
             var roomid = $(this).attr('data-roomid');
             var roomname = $(this).attr('data-roomname');
             var week = $(this).attr('data-week');
             var url = configs.twomark_url+"&roomname="+roomname+"&roomid="+roomid+"&semesterid="+semesterid+"&week="+week;
             window.location.href = url; 
        })
  })

  //加载打分页
  $(document).on("pageInit", "#useraccount_twomark", function(e, id, page) { 


      // 允许上传的图片类型  
      var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];  
      // 1024KB，也就是 1MB  
      var maxSize = 5*1024 * 1024;  
      // 图片最大宽度  
      var maxWidth = 300;  
      // 最大上传图片数量  
      var maxCount = 6;  
      $('.js_file').on('change', function (event) {  
        var imgtype = $(this).attr('data-type');

        // return false;
         
          var files = event.target.files;  

          // 如果没有选中文件，直接返回  
          if (files.length === 0) {  
              return;  
          }  
    
          for (var i = 0, len = files.length; i < len; i++) {  
              var file = files[i];  
              var reader = new FileReader();  
    
              // 如果类型不在允许的类型范围内  
              if (allowTypes.indexOf(file.type) === -1) {  
                  $.weui.alert({text: '该类型不允许上传'});  
                  continue;  
              }  
    
              if (file.size > maxSize) {  
                  $.weui.alert({text: '图片太大，不允许上传'});  
                  continue;  
              }  
    
              if ($('.weui_uploader_file').length >= maxCount) {  
                  $.weui.alert({text: '最多只能上传' + maxCount + '张图片'});  
                  return;  
              }  
    
              reader.onload = function (e) {  
                  var img = new Image();  
                  img.onload = function () {  
                      // 不要超出最大宽度  
                      var w = Math.min(maxWidth, img.width);  
                      // 高度按比例计算  
                      var h = img.height * (w / img.width);  
                      var canvas = document.createElement('canvas');  
                      var ctx = canvas.getContext('2d');  
                      // 设置 canvas 的宽度和高度  
                      canvas.width = w;  
                      canvas.height = h;  
                      ctx.drawImage(img, 0, 0, w, h);  
                      var base64 = canvas.toDataURL('image/png');

                      var token = $('#token').val();
                      var adminid = $('#adminid').val();
                      var schoolcode = $('#schoolcode').val();
                      $.post(configs.server_url+configs.server_api, 
                      {
                        img:base64.replace('data:image/png;base64,', 'data:image/png;base64,/'),token:token,adminid:adminid,schoolcode:schoolcode,
                      }, function(data) 
                      { 
                             console.log(data);
                             if(data.code == 0)
                             {  
                                  imgid = data.data.fileId;
                                  if(imgtype == '0'){
                                    var safefileids = $('#safefileid').val();
                                    safefileids += data.data.fileId + ',';
                                     $('#safefileid').val(safefileids);  
                                  }else if(imgtype == '1'){
                                      var clearfileids = $('#clearfileid').val();
                                      clearfileids += data.data.fileId + ',';
                                      $('#clearfileid').val(clearfileids);
                                       
                                  }else{
                                      var perfileids = $('#perfileid').val();
                                      perfileids += data.data.fileId + ',';
                                      $('#perfileid').val(perfileids); 
                                  }


                                // 插入到预览区  
                                //var $preview = $('<li class="weui_uploader_file weui_uploader_status imgBox" style="background-image:url(' + base64 + ')"><i class="img-delete" data-imgid='+imgid+'>-</i><div class="weui_uploader_status_content">0%</div></li>');  
                                var $preview = $('<li class="weui_uploader_file weui_uploader_status"><i class="img-delete"  data-type='+imgtype+' data-imgid='+imgid+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+data.data.serverPath+' src='+data.data.serverPath+'><div class="weui_uploader_status_content">0%</div></li>');  
                                $('#weui_uploader_files'+imgtype).append($preview);  
                                var num = $('.weui_uploader_file').length;  
                                $('.js_counter').text(num + '/' + maxCount);  
              
                                // 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传  
              
                                var progress = 0;   
                                function uploading() {
                                    $(".weui_uploader_file").find('.weui_uploader_status_content').text((++progress) + '%');  
                                    if (progress < 100) {  
                                        setTimeout(uploading, 30);  
                                    }  
                                    else {  
                                        // 如果是失败，塞一个失败图标  
                                        //$preview.find('.weui_uploader_status_content').html('<i class="weui_icon_warn"></i>');  
                                        $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();  
                                    }   
                                }  
                                setTimeout(uploading, 30); 


                            }
                            else
                            {
                                $.alert(data.msg);
                                return false;
                            } 

                    }, 'json'); 
                  };  
    
                  img.src = e.target.result;    
              };  
              reader.readAsDataURL(file);  


          }  
      });  

      $(document).delegate('.imgBox','click',function(){ 
        
          var imgsrc = $(this).attr('data-src');
          $('.box').show();
          $('.box img').attr('src',imgsrc);
      })
 
      $('.box').click(function(){ 
        $('.box').hide()
      })
 
      $(document).delegate('.img-delete','click',function(){
        
              var arr= new Array();
              var imgid = $(this).attr('data-imgid');
              var type = $(this).attr('data-type');
              var ids = '';
              if (type == 1) {
                  ids = $('#safefileid').val();     
              }else if(type == 2){
                  ids = $('#clearfileid').val();   
              }else {
                  ids = $('#perfileid').val();   
              }
                       
              var ids = ids.substring(0,ids.length-1);  
              arr = ids.split(','); 
              console.log(arr);
              arr.splice($.inArray(imgid,arr),1);

              if (type == 1) {
                 $('#safefileid').val(arr);
              }else if(type == 2){
                 $('#clearfileid').val(arr);   
              }else{
                 $('#perfileid').val(arr);   
              }
              
              $(this).parent().remove();
      })



        var arrs = [];
        var itemidarr = [];
        var bedidarr = [];
        var scorearr = [];
        var scoreitemcopy = [];
        var scoreitemcopyid = [];
        var safescorelist= [];
        var clearscorelist = [];
        var parrs = [];// 修改时候用的

        var safeitemarr = [];
        var safebedarr = [];
        var safemark =[];

        var itemarr =[];
        var hygiene =[];
        var roomscoreid = $('#roomscoreid').val();
        var ndata = $.parseJSON($('#ndata').val()); 
        if (roomscoreid != '') {
            var data = $.parseJSON($('#data').val()); 
            $('#lbl_cleartotal').text(data.clearScore);
          

            roomClearItemList = data.roomClearItemList;
            for (var i = 0; i < roomClearItemList.length; i++) {
               $('#item_'+roomClearItemList[i].itemid).val(roomClearItemList[i].score);
               itemarr.push(roomClearItemList[i].itemid);
               hygiene.push(roomClearItemList[i].score);
               clearscorelist.push({itemid:roomClearItemList[i].itemid,score:roomClearItemList[i].score});                            
               $('#clearscorelist').val(JSON.stringify(clearscorelist));
            };
 
            imglist = data.picList;

            for (var i = 0; i < imglist.length; i++) {

              var path = imglist[i].savePath.split(',');
              var fileid = imglist[i].fileid.split(',');
              var imgmsg ='';
              for (var b = 0; b < path.length; b++) { 
                 imgmsg += '<li class="weui_uploader_file weui_uploader_status"><i class="img-delete" data-imgid='+fileid[b]+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+path[b]+' src='+path[b]+'></li>';    
               }; 

              if(imglist[i].picType == 2 || imglist[i].picType == 4){ 
               $('#clearfileid').val(imglist[i].fileid+',');
               $('#weui_uploader_files1').append(imgmsg);  
             }else if(imglist[i].picType == 3 || imglist[i].picType == 5){ 
               $('#perfileid').val(imglist[i].fileid+',');
               $('#weui_uploader_files2').append(imgmsg); 
             }                         

           }; 



            bedList = data.bedList;             
            for (var i = 0; i < bedList.length; i++) {
                var itemList = bedList[i].itemList;
                var totalscore = 0;
                var pick       = 0;
                for (var b = 0; b < itemList.length; b++) {
                   totalscore  += ($('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-fullmark')*1.0);
                   pick        += (itemList[b].score*1.0);
                   $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).val(itemList[b].score);

                   arrs.push(itemList[b].bedid+'_'+itemList[b].itemid);
                   itemidarr.push(itemList[b].itemid);
                   bedidarr.push(itemList[b].bedid);            
                   scorearr.push(itemList[b].score);
                   parrs.push(itemList[b].perscoreid);

                   $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-perscoreid',itemList[b].perscoreid);
                   
 
                   scoreitemcopyid.push({itemid:itemList[b].itemid,bedid:itemList[b].bedid,score:itemList[b].score,id:itemList[b].bedid+'_'+itemList[b].itemid});
                   scoreitemcopy.push({bedscoreid:itemList[b].perscoreid,itemid:itemList[b].itemid,bedid:itemList[b].bedid,score:itemList[b].score});

                    $('#scoreitem').val(JSON.stringify(scoreitemcopy));
                };
                $('#lbl_'+bedList[i].bedid).text(100 - (totalscore*1.0 - (pick*1.0)) );
            };
            

        }else{
            var peoplelist = $.parseJSON($('#peoplelist').val());            
            var scoreitem = $.parseJSON($('#scoreitem').val()); 

            for (var i = 0; i < peoplelist.length; i++) {
                for (var a = 0; a < scoreitem.length; a++) {
                     for (var n = 0; n < ndata['bedlist'].length; n++) {
                          if (peoplelist[i].bedId == ndata['bedlist'][n].bedid) {
                             arrs.push(peoplelist[i].bedId+'_'+scoreitem[a].itemId);
                             itemidarr.push(scoreitem[a].itemId);
                             bedidarr.push(peoplelist[i].bedId);
                             scorearr.push(scoreitem[a].fullMark);   
                             scoreitemcopyid.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark,id:peoplelist[i].bedId+'_'+scoreitem[a].itemId});
                             scoreitemcopy.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark});
                           
                             $('#scoreitem').val(JSON.stringify(scoreitemcopy) );
                          };
                     };
                    
                }; 
           
            };  
        }


 




       //保存
       $(page).on('click','.btn_twosave',function(){ 
              var adminid = $('#adminid').val(); 

              var semesterid = $('#semesterid').val();
              var currentweek = $('#currentweek').val();
              var roomid = $('#roomid').val();
              var tableid = $('#tableid').val();
 
              var clearscorelist = $('#clearscorelist').val();
              if (clearscorelist == '') {
                 clearscorelist = '[]';
              };
              var clearscore = $('#lbl_cleartotal').text();
              var clearfileid = $('#clearfileid').val();

              var scoreitem = $('#scoreitem').val();
              var perfileid = $('#perfileid').val();

              var roomscoreid = $('#roomscoreid').val();



              var flatId = $('#flatId').val();
              var flatname = $('#flatname').val();
              var liveareaid = $('#liveareaid').val();
              var areaname = $('#areaname').val();
              
              if (roomscoreid == '') {
                    $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForWeek&a=week_addsecondweekscore", 
                    {
                      semesterid:semesterid,currentweek:currentweek,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,clearscore:clearscore,clearfileid:clearfileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                          if(scoreitem != ''){
                              $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForWeek&a=week_add_secondperson_score", 
                              {
                                semesterid:semesterid,currentweek:currentweek,roomid:roomid,tableid:tableid,scoreitem:scoreitem,perfileid:perfileid,adminid:adminid,
                              }, function(data) 
                              { 
                                  if(res.code == 0)
                                  { 
                                       $.alert('打分成功', function () {
                                        $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodorm&areaname="+areaname+"&liveareaid="+liveareaid+"&week="+currentweek+"&flatname="+encodeURIComponent(flatname)+"&semesterid="+semesterid+"&flatId="+flatId, true);
                                      }); 
                                  }
                                  else
                                  {
                                    $.alert(data.msg);
                                    return false;
                                  } 

                              }, 'json');
                          }else{
                              $.alert('打分成功', function () {
                                  $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodormmoth&areaname="+areaname+"&liveareaid="+liveareaid+"&flatname="+encodeURIComponent(flatname)+"&date="+datetext+"&flatId="+flatId, true);
                              }); 
                          }
                             
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }else{

                  $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForWeek&a=week_updatesecondweekscore", 
                    {
                      semesterid:semesterid,currentweek:currentweek,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,clearscore:clearscore,clearfileid:clearfileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                          if(scoreitem != ''){
                             $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForWeek&a=week_edit_secondperson_score", 
                              {
                                semesterid:semesterid,currentweek:currentweek,roomid:roomid,tableid:tableid,scoreitem:scoreitem,perfileid:perfileid,adminid:adminid,
                              }, function(data) 
                              { 
                                  if(res.code == 0)
                                  { 
                                       $.alert('打分成功', function () {
                                        $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodorm&areaname="+areaname+"&liveareaid="+liveareaid+"&week="+currentweek+"&flatname="+encodeURIComponent(flatname)+"&semesterid="+semesterid+"&flatId="+flatId, true);
                                      }); 
                                  }
                                  else
                                  {
                                    $.alert(data.msg);
                                    return false;
                                  } 

                              }, 'json');
                          }else{
                                  $.alert('打分成功', function () {
                                     $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodormmoth&areaname="+areaname+"&liveareaid="+liveareaid+"&flatname="+encodeURIComponent(flatname)+"&date="+datetext+"&flatId="+flatId, true);
                                  }); 
                             }

                            
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }
 
       })


 
        

 
        $(page).on('change','.personal',function(){ 
              var roomscoreid = $('#roomscoreid').val();
              var bedid = $(this).attr('data-bedid');
              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var id = $(this).attr('data-id');
              var perscoreid = $(this).attr('data-perscoreid');
              var score = $(this).val();


              if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $(this).val(fullmark);
                $(this).focus();
                return false;
             }

              for (var i = 0; i < arrs.length; i++) {
                 if (arrs[i] == bedid+'_'+itemid) {
                    arrs.splice($.inArray(arrs[i],arrs),1); 
                    itemidarr.splice($.inArray(itemidarr[i],itemidarr),1); 
                    bedidarr.splice($.inArray(bedidarr[i],bedidarr),1); 
                    scorearr.splice($.inArray(scorearr[i],scorearr),1);
                    parrs.splice($.inArray(parrs[i],parrs),1);
                 }
              };

              arrs.push(bedid+'_'+itemid);
              itemidarr.push(itemid);
              bedidarr.push(bedid);            
              scorearr.push(score);
              parrs.push(perscoreid);

              scoreitemcopy = []; 
              for (var i = 0; i < itemidarr.length; i++) {
                if(roomscoreid ==''){
                    scoreitemcopy.push({itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }else{
                    scoreitemcopy.push({bedscoreid:parrs[i],itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }
                 
              };
              var counttotle = 0; 
              $(".personal").each(function(){ 　                     　　 
                   if ( bedid  ==  $(this).attr('data-bedid')) {
                      if($(this).val() != ''){
                        counttotle += (($(this).attr('data-fullmark') * 1.0) - ($(this).val() * 1.0 ));  
                      }                         
                   }; 
               }) 

              $('#lbl_'+bedid).text(100 - (counttotle * 1.0)  );
              $('#scoreitem').val(JSON.stringify(scoreitemcopy));  
        })

        var safescorelist = []; //安全检查
        var clearscorelist = []; //卫生检查
      
        var v = 0;
        $(page).on('change','.clear',function(){ 
             var itemid = $(this).attr('data-itemid');  
             var fullmark = $(this).attr('data-fullmark');        
             var score =  $('#item_'+itemid).val();  
             if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $('#item_'+itemid).val(fullmark);
                $('#item_'+itemid).focus();
                //return false;
             }
             for (var i = 0; i < itemarr.length; i++) {
                 if (itemarr[i] == itemid) {
                    itemarr.splice($.inArray(itemarr[i],itemarr),1); 
                    hygiene.splice($.inArray(hygiene[i],hygiene),1); 
                 }
            }
 
           itemarr.push(itemid);
           hygiene.push(score);

           clearscorelist = [];

           for (var i = 0; i < itemarr.length; i++) {
               clearscorelist.push({itemid:itemarr[i],score:hygiene[i]});               
           }; 

           var counttotle = 0; 
           $(".clear").each(function(){ 　                     　　 
                 if ( $(this).val() != '') {
                      counttotle += (($(this).attr('data-fullmark') * 1.0) -($(this).val() * 1.0 ));
                 }; 
           }) 
           $('#lbl_cleartotal').text(100 - (counttotle * 1.0) );

           $('#clearscorelist').val(JSON.stringify(clearscorelist)); 
        })
       
        // 选择未归床号
        $(page).on('click','.rules-add',function(){ 
            var itemid = $(this).attr('data-itemid'); 
            var fullmark = $(this).attr('data-fullMark');
            var topnum = $(this).attr('data-topnum');
            var peoplelist = $.parseJSON($('#peoplelist').val());  
            var strjoin = [];
            var roomid = $('#roomid').val();
            console.log(roomid);
 

            for (var i = 0; i < peoplelist.length; i++) {
                strjoin.push({
                      text: peoplelist[i].bedNum,  
                      bedid:peoplelist[i].bedId,   
                      itemid:itemid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true, 
                      onClick: function() {    
                          var fulltotal = $('#lbl_total').text();//获取总分                        

                          $('#roomlist_'+this.itemid).append('<span data-bedid='+this.bedid+' data-fullmark='+this.fullmark+' data-itemid='+this.itemid+' class="break-room btn_remove">'+this.text+'</span>');  
                          var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值

                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }
                          
                          safescorelist.push({itemid:this.itemid,score:this.fullmark,bedid:this.bedid});
                           
                          $('#safescorelist').val(JSON.stringify(safescorelist)); 
                      }
                });
            }; 
            strjoin.push({
                      text: '寝室',  
                      bedId:'',  
                      itemid:itemid,  
                      roomid:roomid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true,
                      onClick: function() {   

                          $('#roomlist_'+this.itemid).append('<span data-fullmark='+ this.fullmark+' data-itemid='+this.itemid+' data-roomid='+ this.roomid+' class="break-room btn_removeroom">'+this.text+'</span>'); 
                          var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值
                          var fulltotal = $('#lbl_total').text();//获取总分
                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }
                        safescorelist.push({itemid:this.itemid,score:this.fullmark, roomid:this.roomid});    
                        $('#safescorelist').val(JSON.stringify(safescorelist));    
 
                      }
                });


 

            var buttons1 = strjoin;

            var buttons2 = [
              {
                text: '取消',
                bg: 'danger'
              }
            ];
            var groups = [buttons1, buttons2];
            $.actions(groups); 
        })

        $(page).on('click','.btn_removeroom',function(){ 　

              var roomid = $(this).attr('data-roomid');
              var fullmark = $(this).attr('data-fullmark');
              var itemid = $(this).attr('data-itemid');
              safescorelist = $.parseJSON($('#safescorelist').val());

              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');

              safescorelist.splice($.inArray(roomid,safescorelist),1); 
              var safetotle = $('#lbl_total').text(); 
              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
                   if ( (number*1.0) <= (topnum*1.0) ) {
                    $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
                  };
              } 


              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();

        })
  
           
        $(page).on('click','.btn_remove',function(){ 　
               
              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var bedid = $(this).attr('data-bedid');
              safescorelist = $.parseJSON($('#safescorelist').val());

              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');
         
              safescorelist.splice($.inArray(bedid,safescorelist),1); 
              var safetotle = $('#lbl_total').text(); 

              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
                  if ( (number*1.0) <= (topnum*1.0) ) {
                    $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
                  };

              }  

              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();　 
              　
        })

   })
  
  /////////////////////////二次抽查打分///////////////////////////////

  //加载抽查选择房间页面
  $(document).on("pageInit", "#useraccount_twodormcheck", function(e, id, page) { 


        //选择已打过分的房间
        $(page).on('click','.showCardFrom',function(){ 
              var roomid = $(this).attr('data-roomId');
              var roomscoreid = $(this).attr('data-roomScoreId');
              var checkid = $(this).attr('data-checkid');
              var tableid = $(this).attr('data-tableid');
              var roomname = $(this).attr('data-roomName');
              var url = configs.twomarkcheck_url+"&tableid="+tableid+"&roomscoreid="+roomscoreid+"&roomname="+roomname+"&roomid="+roomid+"&checkid="+checkid;
              window.location.href = url; 

        })
 

        // 选择空房间 
        $(page).on('click','.showCard',function(){
             var roomid = $(this).attr('data-roomid');
             var roomname = $(this).attr('data-roomname');
             var checkid = $(this).attr('data-checkid');
             var tableid = $(this).attr('data-tableid');
             var url = configs.twomarkcheck_url+"&tableid="+tableid+"&roomname="+roomname+"&roomid="+roomid+"&checkid="+checkid;
             window.location.href = url; 
        })


  })

  //加载抽查打分 
  $(document).on("pageInit", "#useraccount_twomarkcheck", function(e, id, page) { 
      // 允许上传的图片类型  
      var allowTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/gif'];  
      // 1024KB，也就是 1MB  
      var maxSize = 5*1024 * 1024;  
      // 图片最大宽度  
      var maxWidth = 300;  
      // 最大上传图片数量  
      var maxCount = 6;  
      $('.js_file').on('change', function (event) {  
        var imgtype = $(this).attr('data-type');
 
         
          var files = event.target.files;  

          // 如果没有选中文件，直接返回  
          if (files.length === 0) {  
              return;  
          }  
    
          for (var i = 0, len = files.length; i < len; i++) {  
              var file = files[i];  
              var reader = new FileReader();  
    
              // 如果类型不在允许的类型范围内  
              if (allowTypes.indexOf(file.type) === -1) {  
                  $.weui.alert({text: '该类型不允许上传'});  
                  continue;  
              }  
    
              if (file.size > maxSize) {  
                  $.weui.alert({text: '图片太大，不允许上传'});  
                  continue;  
              }  
    
              if ($('.weui_uploader_file').length >= maxCount) {  
                  $.weui.alert({text: '最多只能上传' + maxCount + '张图片'});  
                  return;  
              }  
    
              reader.onload = function (e) {  
                  var img = new Image();  
                  img.onload = function () {  
                      // 不要超出最大宽度  
                      var w = Math.min(maxWidth, img.width);  
                      // 高度按比例计算  
                      var h = img.height * (w / img.width);  
                      var canvas = document.createElement('canvas');  
                      var ctx = canvas.getContext('2d');  
                      // 设置 canvas 的宽度和高度  
                      canvas.width = w;  
                      canvas.height = h;  
                      ctx.drawImage(img, 0, 0, w, h);  
                      var base64 = canvas.toDataURL('image/png');

                      var token = $('#token').val();
                      var adminid = $('#adminid').val();
                      var schoolcode = $('#schoolcode').val();
                      $.post(configs.server_url+configs.server_api, 
                      {
                        img:base64.replace('data:image/png;base64,', 'data:image/png;base64,/'),token:token,adminid:adminid,schoolcode:schoolcode,
                      }, function(data) 
                      { 
                            console.log(data);
                            if(data.code == 0)
                            {  
                                  imgid = data.data.fileId;
                                  if(imgtype == '0'){
                                    var safefileids = $('#safefileid').val();
                                    safefileids += data.data.fileId + ',';
                                     $('#safefileid').val(safefileids);  
                                  }else if(imgtype == '1'){
                                      var clearfileids = $('#clearfileid').val();
                                      clearfileids += data.data.fileId + ',';
                                      $('#clearfileid').val(clearfileids);
                                       
                                  }else{
                                      var perfileids = $('#perfileid').val();
                                      perfileids += data.data.fileId + ',';
                                      $('#perfileid').val(perfileids); 
                                  }


                                // 插入到预览区  
                                //var $preview = $('<li class="weui_uploader_file weui_uploader_status imgBox" style="background-image:url(' + base64 + ')"><i class="img-delete" data-imgid='+imgid+'>-</i><div class="weui_uploader_status_content">0%</div></li>');  
                                var $preview = $('<li class="weui_uploader_file weui_uploader_status"><i class="img-delete"  data-type='+imgtype+' data-imgid='+imgid+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+data.data.serverPath+' src='+data.data.serverPath+'><div class="weui_uploader_status_content">0%</div></li>');  
                                $('#weui_uploader_files'+imgtype).append($preview);  
                                var num = $('.weui_uploader_file').length;  
                                $('.js_counter').text(num + '/' + maxCount);  
              
                                // 然后假装在上传，可以post base64格式，也可以构造blob对象上传，也可以用微信JSSDK上传  
              
                                var progress = 0;   
                                function uploading() {
                                    $(".weui_uploader_file").find('.weui_uploader_status_content').text((++progress) + '%');  
                                    if (progress < 100) {  
                                        setTimeout(uploading, 30);  
                                    }  
                                    else {  
                                        // 如果是失败，塞一个失败图标  
                                        //$preview.find('.weui_uploader_status_content').html('<i class="weui_icon_warn"></i>');  
                                        $preview.removeClass('weui_uploader_status').find('.weui_uploader_status_content').remove();  
                                    }   
                                }  
                                setTimeout(uploading, 30); 
                            }
                            else
                            {
                                $.alert(data.msg);
                                return false;
                            } 

                    }, 'json');    
                  };  
    
                  img.src = e.target.result;    
              };  
              reader.readAsDataURL(file);  


          }  
      });  


      $(document).delegate('.imgBox','click',function(){ 
        
          var imgsrc = $(this).attr('data-src');
          $('.box').show();
          $('.box img').attr('src',imgsrc);
      })
 
      $('.box').click(function(){ 
        $('.box').hide()
      })
 
      $(document).delegate('.img-delete','click',function(){
        
              var arr= new Array();
              var imgid = $(this).attr('data-imgid');
              var type = $(this).attr('data-type');
              var ids = '';
              if (type == 1) {
                  ids = $('#safefileid').val();     
              }else if(type == 2){
                  ids = $('#clearfileid').val();   
              }else {
                  ids = $('#perfileid').val();   
              }
                       
              var ids = ids.substring(0,ids.length-1);  
              arr = ids.split(','); 
              console.log(arr);
              arr.splice($.inArray(imgid,arr),1);

              if (type == 1) {
                 $('#safefileid').val(arr);
              }else if(type == 2){
                 $('#clearfileid').val(arr);   
              }else{
                 $('#perfileid').val(arr);   
              }
              
              $(this).parent().remove();
      })



        var arrs = [];
        var itemidarr = [];
        var bedidarr = [];
        var scorearr = [];
        var scoreitemcopy = [];
        var scoreitemcopyid = [];
        var safescorelist= [];
        var clearscorelist = [];
        var parrs = [];// 修改时候用的

        var safeitemarr = [];
        var safebedarr = [];
        var safemark =[];
 
        var itemarr = [];
        var hygiene = [];
        var roomscoreid = $('#roomscoreid').val();
        var ndata = $.parseJSON($('#ndata').val()); 
        if (roomscoreid != '') {
            var data = $.parseJSON($('#data').val());
         
            $('#lbl_cleartotal').text(data.clearScore);

              
            roomClearItemList = data.roomClearItemList;
            for (var i = 0; i < roomClearItemList.length; i++) {
               $('#item_'+roomClearItemList[i].itemid).val(roomClearItemList[i].score);
               itemarr.push(roomClearItemList[i].itemid);
               hygiene.push(roomClearItemList[i].score);
               clearscorelist.push({itemid:roomClearItemList[i].itemid,score:roomClearItemList[i].score});                            
               $('#clearscorelist').val(JSON.stringify(clearscorelist));
            };

            imglist = data.picList;
            for (var i = 0; i < imglist.length; i++) {

              var path = imglist[i].savePath.split(',');
              var fileid = imglist[i].fileid.split(',');
              var imgmsg ='';
              for (var b = 0; b < path.length; b++) { 
                 imgmsg += '<li class="weui_uploader_file weui_uploader_status"><i class="img-delete" data-imgid='+fileid[b]+'>-</i><img style="width: 70px;height: 70px;" class="imgBox" data-src='+path[b]+' src='+path[b]+'></li>';    
               }; 

              if(imglist[i].picType == 2 || imglist[i].picType == 4){ 
               $('#clearfileid').val(imglist[i].fileid+',');
               $('#weui_uploader_files1').append(imgmsg);  
             }else if(imglist[i].picType == 3 || imglist[i].picType == 5){ 
               $('#perfileid').val(imglist[i].fileid+',');
               $('#weui_uploader_files2').append(imgmsg); 
             }                         

           }; 


            bedList = data.bedList;             
            for (var i = 0; i < bedList.length; i++) {
                var itemList = bedList[i].itemList;
                var totalscore = 0;
                var pick       = 0;
                for (var b = 0; b < itemList.length; b++) {
                   totalscore  += ($('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-fullmark')*1.0);
                   pick        += (itemList[b].score*1.0);
                   $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).val(itemList[b].score);

                   arrs.push(itemList[b].bedid+'_'+itemList[b].itemid);
                   itemidarr.push(itemList[b].itemid);
                   bedidarr.push(itemList[b].bedid);            
                   scorearr.push(itemList[b].score);
                   parrs.push(itemList[b].perscoreid);

                   $('#bed_'+itemList[b].bedid+'_'+itemList[b].itemid).attr('data-perscoreid',itemList[b].perscoreid);
                   
 
                   scoreitemcopyid.push({itemid:itemList[b].itemid,bedid:itemList[b].bedid,score:itemList[b].score,id:itemList[b].bedid+'_'+itemList[b].itemid});
                   scoreitemcopy.push({bedscoreid:itemList[b].perscoreid,itemid:itemList[b].itemid,bedid:itemList[b].bedid,score:itemList[b].score});

                    $('#scoreitem').val(JSON.stringify(scoreitemcopy));
                };
                $('#lbl_'+bedList[i].bedid).text(100 - (totalscore*1.0 - (pick*1.0)) );
            };
            

        }else{
            var peoplelist = $.parseJSON($('#peoplelist').val());            
            var scoreitem = $.parseJSON($('#scoreitem').val()); 
            for (var i = 0; i < peoplelist.length; i++) {
                for (var a = 0; a < scoreitem.length; a++) {
                     for (var n = 0; n < ndata['bedlist'].length; n++) {
                          if (peoplelist[i].bedId == ndata['bedlist'][n].bedid) {
                             arrs.push(peoplelist[i].bedId+'_'+scoreitem[a].itemId);
                             itemidarr.push(scoreitem[a].itemId);
                             bedidarr.push(peoplelist[i].bedId);
                             scorearr.push(scoreitem[a].fullMark);   
                             scoreitemcopyid.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark,id:peoplelist[i].bedId+'_'+scoreitem[a].itemId});
                             scoreitemcopy.push({itemid:scoreitem[a].itemId,bedid:peoplelist[i].bedId,score:scoreitem[a].fullMark});
                           
                             $('#scoreitem').val(JSON.stringify(scoreitemcopy) );
                          };
                     };
                    
                }; 
           
            };  

        }





       //保存
       $(page).on('click','.btn_twosave',function(){ 
              var adminid = $('#adminid').val(); 
          
              var checkid = $('#checkid').val();
              var roomid = $('#roomid').val();
              var tableid = $('#tableid').val();
 

              var clearscorelist = $('#clearscorelist').val();
              if(clearscorelist == ''){
                  clearscorelist = '[]';
              }
              var clearscore = $('#lbl_cleartotal').text();
              var clearfileid = $('#clearfileid').val();

              var scoreitem = $('#scoreitem').val();
              var perfileid = $('#perfileid').val();

              var roomscoreid = $('#roomscoreid').val();



              var flatId = $('#flatId').val();
              var flatname = $('#flatname').val();
              var liveareaid = $('#liveareaid').val();
              var areaname = $('#areaname').val();
              
              if (roomscoreid == '') {
                    $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForSpot&a=check_addsecondmothscore", 
                    {
                        checkid:checkid,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,clearscore:clearscore,clearfileid:clearfileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                          if(scoreitem != ''){
                               $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForSpot&a=check_add_secondperson_score", 
                                {
                                  checkid:checkid,roomid:roomid,tableid:tableid,scoreitem:scoreitem,perfileid:perfileid,adminid:adminid,
                                }, function(data) 
                                { 
                                    if(res.code == 0)
                                    { 
                                         $.alert('打分成功', function () {
                                            $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodormcheck&tableid="+tableid+"&areaname="+areaname+"&flatname="+encodeURIComponent(flatname)+"&checkid="+checkid+"&flatId="+flatId, true);
                                        }); 
                                    }
                                    else
                                    {
                                      $.alert(data.msg);
                                      return false;
                                    } 

                                }, 'json');
                          }else{
                              $.alert('打分成功', function () {
                                  $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodormcheck&tableid="+tableid+"&areaname="+areaname+"&flatname="+encodeURIComponent(flatname)+"&checkid="+checkid+"&flatId="+flatId, true);
                              }); 
                            }
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }else{

                  $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForSpot&a=check_updatesecondmothscore", 
                    {
                        checkid:checkid,roomid:roomid,tableid:tableid,clearscorelist:clearscorelist,clearscore:clearscore,clearfileid:clearfileid,adminid:adminid,
                    }, function(res) 
                    { 
                        if(res.code == 0)
                        { 
                          if(scoreitem != ''){
                             $.post(hqb.root+"/index.php?m=EvaluationMining&c=GradeForSpot&a=check_edit_secondperson_score", 
                              {
                                  checkid:checkid,roomid:roomid,tableid:tableid,scoreitem:scoreitem,perfileid:perfileid,adminid:adminid,
                              }, function(data) 
                              { 
                                  if(res.code == 0)
                                  { 
                                       $.alert('打分成功', function () {
                                         $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodormcheck&tableid="+tableid+"&areaname="+areaname+"&flatname="+encodeURIComponent(flatname)+"&checkid="+checkid+"&flatId="+flatId, true);
                                      }); 
                                  }
                                  else
                                  {
                                    $.alert(data.msg);
                                    return false;
                                  } 

                              }, 'json');
                          }else{
                                $.alert('打分成功', function () {
                                   $.router.load(hqb.root+"/index.php?m=EvaluationMining&c=Index&a=twodormcheck&tableid="+tableid+"&areaname="+areaname+"&flatname="+encodeURIComponent(flatname)+"&checkid="+checkid+"&flatId="+flatId, true);
                                }); 
                          }
                        }
                        else
                        {
                          $.alert(res.msg);
                          return false;
                        } 

                    }, 'json');

              }
 
       })


 
        

 
        $(page).on('change','.personal',function(){ 
              var roomscoreid = $('#roomscoreid').val();
              var bedid = $(this).attr('data-bedid');
              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var id = $(this).attr('data-id');
              var perscoreid = $(this).attr('data-perscoreid');
              var score = $(this).val();


              if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $(this).val(fullmark);
                $(this).focus();
                return false;
             }

              for (var i = 0; i < arrs.length; i++) {
                 if (arrs[i] == bedid+'_'+itemid) {
                    arrs.splice($.inArray(arrs[i],arrs),1); 
                    itemidarr.splice($.inArray(itemidarr[i],itemidarr),1); 
                    bedidarr.splice($.inArray(bedidarr[i],bedidarr),1); 
                    scorearr.splice($.inArray(scorearr[i],scorearr),1);
                    parrs.splice($.inArray(parrs[i],parrs),1);
                 }
              };

              arrs.push(bedid+'_'+itemid);
              itemidarr.push(itemid);
              bedidarr.push(bedid);            
              scorearr.push(score);
              parrs.push(perscoreid);

              scoreitemcopy = []; 
              for (var i = 0; i < itemidarr.length; i++) {
                if(roomscoreid ==''){
                    scoreitemcopy.push({itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }else{
                    scoreitemcopy.push({bedscoreid:parrs[i],itemid:itemidarr[i],bedid:bedidarr[i],score:scorearr[i]});
                }
                 
              };

              var counttotle = 0; 
              $(".personal").each(function(){ 　                     　　 
                   if ( bedid  ==  $(this).attr('data-bedid')) {
                      if($(this).val() != ''){
                        counttotle += (($(this).attr('data-fullmark') * 1.0) - ($(this).val() * 1.0 ));  
                      }                         
                   }; 
               }) 

              $('#lbl_'+bedid).text(100 - (counttotle * 1.0)  ); 
 
              $('#scoreitem').val(JSON.stringify(scoreitemcopy));  
        })

        var safescorelist = []; //安全检查
        var clearscorelist = []; //卫生检查
        var v = 0;
        $(page).on('change','.clear',function(){ 
             var itemid = $(this).attr('data-itemid');  
             var fullmark = $(this).attr('data-fullmark');        
             var score =  $('#item_'+itemid).val();  
             if((fullmark*1.0)<(score*1.0)){
                $.alert('不能超过设置的分数');
                $('#item_'+itemid).val(fullmark);
                $('#item_'+itemid).focus();
                //return false;
             }

             for (var i = 0; i < itemarr.length; i++) {
                 if (itemarr[i] == itemid) {
                    itemarr.splice($.inArray(itemarr[i],itemarr),1); 
                    hygiene.splice($.inArray(hygiene[i],hygiene),1); 
                 }
            }
 
           itemarr.push(itemid);
           hygiene.push(score);

           clearscorelist = [];
           for (var i = 0; i < itemarr.length; i++) { 
               clearscorelist.push({itemid:itemarr[i],score:hygiene[i]});
           }; 

           var counttotle = 0; 
           $(".clear").each(function(){ 　                     　　 
                 if ( $(this).val() != '') {
                      counttotle += (($(this).attr('data-fullmark') * 1.0) -($(this).val() * 1.0 ));
                 }; 
           }) 
           $('#lbl_cleartotal').text(100 - (counttotle * 1.0) );

           $('#clearscorelist').val(JSON.stringify(clearscorelist));
        })


        
        // 选择未归床号
        $(page).on('click','.rules-add',function(){ 
            var roomscoreid = $('#roomscoreid').val();
            var itemid = $(this).attr('data-itemid'); 
            var fullmark = $(this).attr('data-fullMark');
            var topnum = $(this).attr('data-topnum');
            var peoplelist = $.parseJSON($('#peoplelist').val());  
            var roomid = $('#roomid').val();
            var strjoin = [];

            for (var i = 0; i < peoplelist.length; i++) {
                strjoin.push({
                      text: peoplelist[i].bedNum,  
                      bedid:peoplelist[i].bedId,   
                      itemid:itemid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true, 
                      onClick: function() {    
                          var fulltotal = $('#lbl_total').text();//获取总分

                          $('#roomlist_'+this.itemid).append('<span data-bedid='+this.bedid+' data-fullmark='+this.fullmark+' data-itemid='+this.itemid+' class="break-room btn_remove">'+this.text+'</span>');  
                           var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值
                           
                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }
                          safescorelist.push({itemid:this.itemid,score:this.fullmark,bedid:this.bedid});
                           
                          $('#safescorelist').val(JSON.stringify(safescorelist)); 
                      }
                });
            }; 
            strjoin.push({
                      text: '寝室',  
                      bedId:'',  
                      itemid:itemid,  
                      roomid:roomid,
                      fullmark:fullmark,
                      topnum:topnum,
                      bold: true,
                      onClick: function() {    
                         
                          $('#roomlist_'+this.itemid).append('<span data-fullmark='+ this.fullmark+' data-itemid='+this.itemid+' data-roomid='+ this.roomid+' class="break-room btn_removeroom">'+this.text+'</span>'); 
                          var num = $('#roomlist_'+this.itemid).find('span').length; //多少个span 
                          $('#roomlist_'+this.itemid).attr('data-number',num); //把个数赋值
                          var fulltotal = $('#lbl_total').text();//获取总分
                          if((this.topnum *1.0) >= (num*1.0) ){
                            $('#lbl_total').text(fulltotal - (this.fullmark*1.0));
                          }
                          if ($('#lbl_total').text() <= 0) {
                              $('#lbl_total').text(0);
                          }

                        safescorelist.push({itemid:this.itemid,score:this.fullmark, roomid:this.roomid});    
 
                        $('#safescorelist').val(JSON.stringify(safescorelist));  
                      }
                });


 

            var buttons1 = strjoin;

            var buttons2 = [
              {
                text: '取消',
                bg: 'danger'
              }
            ];
            var groups = [buttons1, buttons2];
            $.actions(groups); 
        }) 

        $(page).on('click','.btn_removeroom',function(){ 　
              var roomid = $(this).attr('data-roomid');
              var fullmark = $(this).attr('data-fullmark');
              var itemid = $(this).attr('data-itemid');
              safescorelist = $.parseJSON($('#safescorelist').val());

              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');

              safescorelist.splice($.inArray(roomid,safescorelist),1); 
              var safetotle = $('#lbl_total').text(); 
              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
                 if ( (number*1.0) <= (topnum*1.0) ) {
                  $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
                };
              } 

              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();
              　
        })

      $(page).on('click','.btn_remove',function(){ 　
               
              var itemid = $(this).attr('data-itemid');
              var fullmark = $(this).attr('data-fullmark');
              var bedid = $(this).attr('data-bedid');
              safescorelist = $.parseJSON($('#safescorelist').val());

              var number = $('#roomlist_'+itemid).find('span').length;
              var topnum = $('#roomlist_'+itemid).prev().attr('data-topnum');
         
              safescorelist.splice($.inArray(bedid,safescorelist),1); 

              var safetotle = $('#lbl_total').text(); 

              if (safetotle >= 100) {
                $('#lbl_total').text(100);
              }else{
                if ( (number*1.0) <= (topnum*1.0) ) {
                  $('#lbl_total').text((safetotle*1.0) + (fullmark*1.0));
                };

              }  
              $('#safescorelist').val(JSON.stringify(safescorelist));   
              this.remove();　 　 
              　
        })
  })




