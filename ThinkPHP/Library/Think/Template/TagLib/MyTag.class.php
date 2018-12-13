<?php    
namespace Think\Template\TagLib;
use Think\Template\TagLib;
defined('THINK_PATH') or exit();

class MyTag extends TagLib {
	protected $tags   =  array(
		// 定义标签
		'include'   =>     array('attr'=>'file', 'close'=>0),
		'css'		=>	   array('attr'=>'file, id', 'close'=>0),
		'js'		=>	   array('attr'=>'file', 'close'=>0),
		'parse'		=>	   array('attr'=>''),
		'greet'		=>	   array('attr'=>'', 'close'=>0),	// 问候(早上好、中午好、晚上好)
	);

	public function _include($tag, $content)   {
		$file = templateContentReplace( $tag['file'] );
		$str = file_get_contents( $file );
		return templateContentReplace( $str );
	}

	public function _css($tag, $contnet) {
		if ( $fileStr = templateContentReplace( $tag['file'] ) ) {
				
			$idStr = isset($tag['id']) ? $tag['id'] : '';
			
			$files = explode(',', str_replace(' ', '', $fileStr) );
			$ids = explode(',', str_replace(' ', '', $idStr) );

			$html = "";
			foreach ($files as $k=>$file) {
				
				$_files = explode('#', $file);
				$_count = count($_files);

				if ( $_count == 1 ) {
					$html .= "<link rel=\"stylesheet\" href=\"{$file}\"";
					if ( isset($ids[$k]) and !empty($ids[$k]) ) {
						$html .= " id=\"{$ids[$k]}\"";
					}
				} else if ( $_count == 2 ) {
					$html .= "<link rel=\"stylesheet\" href=\"{$_files[0]}\"";
					if ( isset($_files[1]) and !empty($_files[1]) ) {
						$html .= " id=\"{$_files[1]}\"";
					}
				}

				$html .= ">";

			}
			
			return $html;

		}
	}

	public function _js($tag, $contnet) {
		if ( $fileStr = templateContentReplace( $tag['file'] ) ) {
			$files = explode(',', str_replace(' ', '', $fileStr) );
			$html = "";
			foreach ($files as $file) {
				$html .= "<script src=\"{$file}\"></script>";
			}
			return $html;
		}
	}

	public function _parse($tag, $content) {
		return templateContentReplace( $content );
	}

	public function _greet($tag, $content) {
		$str = '';

		$ntime=date("G"); //取得现在的时间
		if($ntime>=0 and $ntime<11){ 
			$str = "早上好";
		} else if($ntime>=11 and $ntime<14){
			$str = "中午好";
		} else if($ntime>=14 and $ntime<18){
			$str = "下午好";
		} else if($ntime>=18 and $ntime<24){
			$str = "晚上好";
		}

		return $str;
	}
}