$(function () { 

	//加载登陆页面
	$(document).on("pageInit","#useraccount_login",function(e ,id ,page){
		//登陆
		$('.btnConfirm').click(function(){
			var loginName = $('#loginName').val();
			var loginPwd  = $('#loginPwd').val();
            if(loginName == ''){
               $.alert('请输入账号');
               return false;
            }
            if (loginPwd == '') {
               $.alert('请输入密码');
               return false;
            }; 
            $.ajax({
                  type: 'POST',
                  url: configs.login_url,
                  data: {
                    loginName:loginName,loginPwd:loginPwd
                  },
                  success: function(data) { 
                      if(data.code  == 0){ 
                          if(configs.callback == ''){                           
                              location.href = configs.index_url;
                          }else{
                              location.href = configs.callback;
                          }
                          
                      }else{
                          $.alert(data.msg);
                      }
                      $.hideIndicator();    
                  } 
            });  
		}) 
	})

	 $(document).on("pageInit", "#useraccount_leavedetails", function(e, id, page) { 
			
			//同意  
			$('.agree').click(function(){
				   $.confirm('确定同意吗？', function () {	
				   		var id = $('#id').val(); 		   		
			            alivestudent_approval(id,1);
			       });
			}) 

			//拒绝  
			$('.refuseBtn').click(function(){
				$.confirm('确定拒绝吗？', function () {
					var id = $('#id').val();  
			        alivestudent_approval(id,2);
			    }); 
			}) 


			function alivestudent_approval(id,ispass){        
	             $.post(hqb.root+"/index.php?m=ExitManagement&c=StudentManageWX&a=alivestudent_approval", 
	             {
	             	id:id,ispass:ispass,
	             }, function(res) 
	             { 
	             	if(res.code == 0){ 
	             		$.alert('操作成功', function () {
	             			location.href = configs.leave_url;
	             		}) 
	             	}
	             	else
	             	{
	             		$.alert(res.msg);
	             		return false;
	             	} 

	             }, 'json'); 
			}
		})



	$(document).on("pageInit", "#useraccount_leave", function(e, id, page) {  
		 //待审核查看更多
		$('.reviewMore').click(function() {
			var ispass = $(this).attr('data-id');
			configs.epage = configs.epage + 1;
            $.ajax({
                  type:'get',
                  url:configs.page_url,
                  data:{epage:configs.epage, ispass:ispass},
                  success:function(data){ 

                    if (data.list.length == 0) {
                      $('.reviewMore').hide();
                      return false;
                    };
 
                      var html ='';
                      var list = data.list;
                      for(var i = 0; i < list.length; i++){                            
                           html += '<a class="leave_details">';
                           html += '<div class="content-block-left"><h5>'+list[i].name+'的请假申请</h5><p>'+list[i].addtime+'</p></div>';
                           html += '<span class="review">待审核</span></a> ';
                      } 
                      $('#div_review').append(html);
                      
                  }
              }); 
		})

		 //通过查看更多
		$('.adoptMore').click(function() {
			var ispass = $(this).attr('data-id');
			configs.epageadopt = configs.epageadopt + 1;
            $.ajax({
                  type:'get',
                  url:configs.page_url,
                  data:{epage:configs.epageadopt, ispass:ispass},
                  success:function(data){ 

                    if (data.list.length == 0) {
                      $('.adoptMore').hide();
                      return false;
                    };
 
                      var html ='';
                      var list = data.list;
                      for(var i = 0; i < list.length; i++){                            
                           html += '<a class="leave_details">';
                           html += '<div class="content-block-left"><h5>'+list[i].name+'的请假申请</h5><p>'+list[i].addtime+'</p></div>';
                           html += '<span class="adopt">通过</span></a> ';
                      } 
                      $('#div_adopt').append(html); 
                  }
              });
			 
		})

 		//未通过查看更多
		$('.notThroughMore').click(function() {
			var ispass = $(this).attr('data-id');
			configs.epage = configs.epage + 1;
            $.ajax({
                  type:'get',
                  url:configs.page_url,
                  data:{epage:configs.epage, ispass:ispass},
                  success:function(data){ 

                    if (data.list.length == 0) {
	                      $('.notThroughMore').hide();
	                      return false;
                    };
  
                      var html ='';
                      var list = data.list;
                      for(var i = 0; i < list.length; i++){                            
                           html += '<a class="leave_details">';
                           html += '<div class="content-block-left"><h5>'+list[i].name+'的请假申请</h5><p>'+list[i].addtime+'</p></div>';
                           html += '<span class="notThrough">待审核</span></a> ';
                      } 
                      $('#div_review').append(html);
                      
                  }
              });
			 
		})


		$('.leave_details').click(function(){
			  var data = $.parseJSON($(this).attr('data'));					  
			  location.href = configs.leavedetails_url+"&begintime="+data.begintime+"&endtime="+data.endtime+"&id="+data.id+"&name="+data.name+"&studentnumber="+data.studentnumber+"&status="+data.status+"&memo="+data.memo+"&addtime="+data.addtime+"&ispass="+data.ispass;
		})  
	})


	$(document).on("pageInit", "#useraccount_alarm", function(e, id, page) { 
		$('.earlytreatmentdetails').click(function(){
			 var id = $(this).attr('data-id');
			 location.href = configs.alarmdetails_url+"&id="+id;
		}) 
	})


	$(document).on("pageInit", "#useraccount_alarmdetails", function(e, id, page) { 

		$('.saveBtn').click(function(){
			 var id   = $('#id').val();
			 var memo = $('#memo').val(); 
			 $.confirm('确定要保存吗？', function () {
			 	 $.post(hqb.root+"/index.php?m=ExitManagement&c=StudentManageWX&a=update_alarmbyflat", 
	             {
	             	id:id,memo:memo,
	             }, function(res) 
	             { 
	             	if(res.code == 0){ 
	             		$.alert('操作成功', function () {
	             			location.href = configs.alarm_url;
	             		}) 
	             	}
	             	else
	             	{
	             		$.alert(res.msg);
	             		return false;
	             	} 

	             }, 'json'); 

			 }) 	 
		}) 
	})




	$(document).on("pageInit", "#useraccount_comprehensive", function(e, id, page) { 

	
		
			
 
		$('.selectboxweek').change(function(){
			var value=$(".selectboxweek").val();
			if(value=='1'){
				$('#viewOne').removeClass('hide');
				$('#viewTwo,#viewThree,#viewFour').addClass('hide');
			}
			if(value=='2'){
				$('#viewTwo').removeClass('hide');
				$('#viewOne,#viewThree,#viewFour').addClass('hide');  
			}
			if(value=='3'){
				$('#viewThree').removeClass('hide');
				$('#viewOne,#viewTwo,#viewFour').addClass('hide');
			}
			if(value=='4'){
				$('#viewFour').removeClass('hide');
				$('#viewOne,#viewTwo,#viewThree').addClass('hide'); 
				var alarm = $.parseJSON($('#weekalarm').val());
				 // 统计饼状图
				var myChart = echarts.init(document.getElementById('chat-pie'));
				getMap(alarm,myChart);
			}		
		}); 

		$('.selectboxmonth').change(function(){
			var value=$(".selectboxmonth").val();
			if(value=='1'){
				$('#viewOnemonth').removeClass('hide');
				$('#viewTwomonth,#viewThreemonth,#viewFourmonth').addClass('hide');
			}
			if(value=='2'){
				$('#viewTwomonth').removeClass('hide');
				$('#viewOnemonth,#viewThreemonth,#viewFourmonth').addClass('hide');
			}
			if(value=='3'){
				$('#viewThreemonth').removeClass('hide');
				$('#viewOnemonth,#viewTwomonth,#viewFourmonth').addClass('hide');
			}
			if(value=='4'){
				$('#viewFourmonth').removeClass('hide');
				$('#viewOnemonth,#viewTwomonth,#viewThreemonth').addClass('hide'); 

				var alarm = $.parseJSON($('#monthalarm').val());
				console.log(alarm);

				 // 统计饼状图
				var myChart = echarts.init(document.getElementById('chat-piemonth'));
				getMap(alarm,myChart);
			}		
		});




		function  getMap (alarm,myChart) {
			 var options = [];
			 	var value = []; 
			 	for (var i = 0; i < alarm.distributionCollege.length; i++) {
			 		 options.push(alarm.distributionCollege[i].collegeName);
			 		 value.push({value: alarm.distributionCollege[i].num, name: alarm.distributionCollege[i].collegeName});
			 	};
			 	var optiontitle = options;
			 	var collegedata = value;
				
				// 指定图表的配置项和数据
				var option = {
						title : {
							text: '预警总数'+alarm['alarmCount'],
							subtext: '',
							x:'center'
						},
						tooltip : {
							trigger: 'item',
							formatter: "{a} <br/>{b} : {c} ({d}%)"
						},
						legend: {
							orient: 'vertical',
							left: 'left',
							data: []
						},
						series : [
							{
								name: '访问来源',
								type: 'pie',
								radius : '50%',
								center: ['50%', '60%'],
								data:[],
								itemStyle: {
									emphasis: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									}
								}
							}
						],
						color:['rgba(239, 28, 37, 0.90)', 'rgba(252, 166, 29, 0.90)','rgba(255, 203, 6, 0.90)','rgba(157, 85, 156, 0.90)','rgba(2, 124, 197, 0.90)']  
					};
				// 使用刚指定的配置项和数据显示图表。
				 
				option.legend.data = optiontitle;
			 	option.series[0].data = collegedata;
				myChart.setOption(option);
		}
 
	})


	$(document).on("pageInit", "#useraccount_index", function(e, id, page) { 

		//出入管理综合一览跳转到 leave页面
		$('.viewoverall').click(function(){
			location.href = configs.comprehensive_url;
		})

		//出入管理个人请假跳转到 leave页面
		$('.personal_leave').click(function(){
			 location.href = configs.leave_url;
		})  

		//出入管理预警处理跳转到 alarm
		$('.earlytreatment').click(function(){
			location.href =  configs.alarm_url;
		}) 
	})

$.init();

})
 