var z_index;
/**
 * [tree 树的折叠]
 * @param  {[int]}    index     [默认第几个]
 * @param  {[string]} last_node [倒数第二级的节点名]           
 */
function tree(index, last_node){
    index = 0;
    $(".branch").prepend('<i></i>'); //添加图标
    $(".page-tree li").removeClass('open'); //全部缩起
    var last_node = last_node; //最后一个点节名
    $(".branch").each(function(){ //展开除最后一级外的所有节点
        if(!$(this).hasClass(last_node)){
            $(this).parent('li').addClass('open')
        }
    });
    $(".page-tree li a").each(function(index){
        if($(this).hasClass("branch")){
            $(this).attr('data-index', index).attr('data-z-index', index);
        }else{
            $(this).attr('data-index', $(this).parents('ul:eq(0)').prev().attr('data-index')).attr('data-z-index', index);
        }
    });
    //点击图标
    $(".branch i").click(function(){ 
        if($(this).parents('li:eq(0)').hasClass('open')){ //缩起
            $(this).parents('li:eq(0)').removeClass('open');
        }else{ //展开
            $(".page-tree li").removeClass('open'); //全部缩起
            $(".branch").each(function(){ //展开除最后一级外的所有节点
                if(!$(this).hasClass(last_node)){
                    $(this).parent('li').addClass('open')
                }
            });
            $(this).parents('li').addClass('open'); //展开下级节点
        }
        return false;
    });
    var url     = location.href.split("#");
    z_index     = url[1];
    if(typeof(z_index) == 'undefined' || z_index == ''){
        z_index = '';
    }else{
        index = $("a[data-z-index='"+z_index+"']").attr('data-index');
    }
    if($("a[data-index='"+index+"']").hasClass(last_node)){
        $("a[data-index='"+index+"'] i").trigger('click');
    }
    $("a[data-z-index='"+z_index+"']").addClass('active');
    $(".page-tree").show();
}