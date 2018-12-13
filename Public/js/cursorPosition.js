(function($){
	$.fn.extend({
		// 获取当前光标位置的方法
		getCurPos:function() {
			var curCurPos = '';
			var all_range = '';
			if (navigator.userAgent.indexOf("MSIE") > -1) { //IE

				if( $(this).get(0).tagName == "TEXTAREA" ){ 
					// 根据body创建textRange
					all_range = document.body.createTextRange();
					// 让textRange范围包含元素里所有内容
					all_range.moveToElementText($(this).get(0));
				} else {
					// 根据当前输入元素类型创建textRange
					all_range = $(this).get(0).createTextRange();
				}

				// 输入元素获取焦点
				$(this).focus();

				// 获取当前的textRange,如果当前的textRange是一个具体位置而不是范围,textRange的范围从start到end.此时start等于end
				var cur_range = document.selection.createRange();

				// 将当前的textRange的end向前移"选中的文本.length"个单位.保证start=end
				cur_range.moveEnd('character',-cur_range.text.length)

				// 将当前textRange的start移动到之前创建的textRange的start处, 此时当前textRange范围变为整个内容的start处到当前范围end处
				cur_range.setEndPoint("StartToStart",all_range);

				// 此时当前textRange的Start到End的长度,就是光标的位置
				curCurPos = cur_range.text.length;
			} else {
				// 文本框获取焦点
				$(this).focus();
				// 获取当前元素光标位置
				curCurPos = $(this).get(0).selectionStart;
			}
			// 返回光标位置
			return curCurPos;
		},
		// 设置当前光标位置方法
		setCurPos:function(start,end) {
			if(navigator.userAgent.indexOf("MSIE") > -1){
				var all_range = '';

				if( $(this).get(0).tagName == "TEXTAREA" ){ 
					// 根据body创建textRange
					all_range = document.body.createTextRange();
					// 让textRange范围包含元素里所有内容
					all_range.moveToElementText($(this).get(0));
				} else {
					// 根据当前输入元素类型创建textRange
					all_range = $(this).get(0).createTextRange();
				}

				$(this).focus();

				// 将textRange的start设置为想要的start
				all_range.moveStart('character',start);

				// 将textRange的end设置为想要的end. 此时我们需要的textRange长度=end-start; 所以用总长度-(end-start)就是新end所在位置
				all_range.moveEnd('character',-(all_range.text.length-(end-start)));

				// 选中从start到end间的文本,若start=end,则光标定位到start处
				all_range.select();
			}else{
				// 文本框获取焦点
				$(this).focus();

				// 选中从start到end间的文本,若start=end,则光标定位到start处
				$(this).get(0).setSelectionRange(start,end);
			}
		},
	});
})(jQuery);