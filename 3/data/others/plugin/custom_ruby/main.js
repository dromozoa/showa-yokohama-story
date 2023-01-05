(function($) {

	(function(){
		tyrano.plugin.kag.tmp.custom_ruby = {

			scale      : tyrano.plugin.kag.stat.mp.scale      || "0.5",
			x          : tyrano.plugin.kag.stat.mp.x          || "0",
			y          : tyrano.plugin.kag.stat.mp.y          || "0",
			spacing    : tyrano.plugin.kag.stat.mp.spacing    || tyrano.plugin.kag.config.defaultPitch,
			color      : tyrano.plugin.kag.stat.mp.color      || "",
			background : tyrano.plugin.kag.stat.mp.background || "",
			bold       : tyrano.plugin.kag.stat.mp.bold       || "",
			italic     : tyrano.plugin.kag.stat.mp.italic     || "",
			face       : tyrano.plugin.kag.stat.mp.face       || "",
			reverse    : tyrano.plugin.kag.stat.mp.reverse    || "false"

		}
		if (tyrano.plugin.kag.stat.mp.spacing === 0) {
			tyrano.plugin.kag.tmp.custom_ruby.spacing = 0;
		}
	})();


	tyrano.plugin.kag.tag.ruby.start = function(pm) {
	    var custom_ruby = this.kag.tmp.custom_ruby;

		var ruby_scale;
		var ruby_x;
		var ruby_y;
		var ruby_spacing;
		var ruby_color;
		var ruby_background;
		var ruby_bold;
		var ruby_italic;
		var ruby_face;
		var ruby_reverse;

		if (pm.scale === undefined) {
			ruby_scale = custom_ruby.scale;
		} else {
			ruby_scale = pm.scale;
		}

		if (pm.x === undefined) {
			ruby_x = custom_ruby.x;
		} else {
			ruby_x = pm.x;
		}

		if (pm.y === undefined) {
			ruby_y = custom_ruby.y;
		} else {
			ruby_y = pm.y;
		}

		if (pm.spacing === undefined) {
			ruby_spacing = custom_ruby.spacing;
		} else {
			ruby_spacing = pm.spacing;
		}

		if (pm.color === undefined) {
			ruby_color = custom_ruby.color;
		} else {
			ruby_color = pm.color;
		}

		if (pm.background === undefined) {
			ruby_background = custom_ruby.background;
		} else {
			ruby_background = pm.background;
		}

		if (pm.bold === undefined) {
			ruby_bold = custom_ruby.bold;
		} else {
			ruby_bold = pm.bold;
		}

		if (pm.italic === undefined) {
			ruby_italic = custom_ruby.italic;
		} else {
			ruby_italic = pm.italic;
		}

		if (pm.face === undefined) {
			ruby_face = custom_ruby.face;
		} else {
			ruby_face = pm.face;
		}

		if (pm.reverse === undefined) {
			ruby_reverse = custom_ruby.reverse;
		} else {
			ruby_reverse = pm.reverse;
		}

		var text = String(pm.text);
		if ( text.length >= 1 ) {
		
			var start = (text.length / 2 * -1) - 1;
			var end = text.length / 2 * -1;
			var defaultPitch = this.kag.config.defaultPitch;
			var isVertical = String(this.kag.stat.vertical);

			//字間設定されていた場合
			var spacing = 0;
			if ( parseFloat(ruby_spacing) != 0 ){
				spacing = (text.length - 1) * ruby_spacing / 2;
				text = text.slice( 0, -1 ) + "<ruby style='letter-spacing: 0px; display: inline;'>" + text.slice( -1 ) + "</ruby>"
				start = "calc(" + start + "em - " + spacing + "px)";
				end = "calc(" + end + "em - " + spacing + "px)";
			} else {
				start = start + "em";
				end = end + "em";
			}
			
			var str = "";

			if ( isVertical != "true" ) {
				//字間設定があった場合は補正する
				ruby_x = parseFloat(parseFloat(ruby_x) - parseFloat(defaultPitch));
				
				//safariだけ横書き時上方向にズレるから補正する getBrowser関数がないことを一応考慮
				try{
					if ($.getBrowser() == "safari") {
						ruby_y = parseFloat(ruby_y) + 4;
					}
				} catch(e){}
				str = "</rt></ruby><ruby style='position: relative; display: inline;'><ruby class='custom_ruby' style='position: absolute; transform: translate(" + ruby_x + "px," + ruby_y + "px) scale(" + ruby_scale + "); left:" + start + "; right:" + end + ";";
			} else {
				//縦書き時
				ruby_y = parseFloat(parseFloat(ruby_y) - parseFloat(defaultPitch));
				str = "</rt></ruby><ruby style='position: relative ; writing-mode: initial; -webkit-writing-mode: initial; width: 1em; height: 0px; display: inline;'><ruby class='custom_ruby_rl' style='position: absolute; transform: translate(" + ruby_x + "px," + ruby_y + "px) scale(" + ruby_scale + "); top:" + start + "; bottom:" + end + ";";
			}

			if ( parseFloat(ruby_spacing) != 0 ){
				str += "letter-spacing: " + ruby_spacing + "px;";
			} else if ( parseFloat(defaultPitch) != 0) {
				//defaultPitchを0以外、ruby_spacingを0で設定した場合
				str += "letter-spacing: 0px;";
			}

		    if (ruby_color != "" && ruby_color !== undefined){
				try{
			    	ruby_color = ruby_color.replace("0x", "#");
					str += "color:" + ruby_color + ";";
				} catch(e){}
			}

		    if (ruby_background != "" && ruby_background !== undefined){
				try{
			    	ruby_background = ruby_background.replace("0x", "#");
					str += "background-color:" + ruby_background + ";";
				} catch(e){}
			}
		    
		    if (String(ruby_bold) == "true"){
				str += "font-weight: bold;";
			} else if (String(ruby_bold) == "false") {
				str += "font-weight: normal;";
			}

		    if (String(ruby_italic) == "true"){
				str += "font-style: italic;";
			} else if (String(ruby_italic) == "false") {
				str += "font-style: normal;";
			}

		    if (ruby_face != ""){
				str += "font-family:\"" + ruby_face + "\";";
			}

		    if (String(ruby_reverse) == "true"){
				if (isVertical != "true") {
					str += "transform-origin: top center; bottom:calc(-1em + 4px);";
				} else {
					str += "transform-origin: top center; left:-1em;";
				}
			}

			//divだとロード時におかしくなって、spanだと余計な処理が入る
			str += "'>" +  text + "</ruby></ruby>";
			
		    //ここに文字が入っている場合、ルビを設定してから、テキスト表示する
		    this.kag.stat.ruby_str = str;
		}

	    this.kag.ftag.nextOrder();

	}

})(jQuery);
