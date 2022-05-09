TYRANO.kag.tag.glink = {
    pm : {
        color : "black", //クラス名でいいよ
        font_color:"",
        storage : null,
        target : null,
        name : "",
        text : "",
        x : "auto",
        y : "",
        width : "",
        height : "",
        size : 30,
        graphic:"",
        enterimg:"",
        cm:"true",
        clickse:"",
        enterse:"",
        leavese:"",
        face:"",
        //追加分
        fix: "false",
        auto_next: "ues",
        role: "",
    },

    //イメージ表示レイヤ。メッセージレイヤのように扱われますね。。
    //cmで抹消しよう
    start : function(pm) {

        var that = TYRANO;
        var target_layer = null;
        
        //role が設定された時は自動的にfix属性になる
        if(pm.role !== ""){
            pm.fix = "true"
        }
        if (pm.fix == "false") {
            target_layer = this.kag.layer.getFreeLayer();
            target_layer.css("z-index", 999999);
        } else {
            target_layer = this.kag.layer.getLayer("fix");
        }
        
        var j_button = $("<div class='glink_button'>" + pm.text + "</div>");
        j_button.css("position", "absolute");
        j_button.css("cursor", "pointer");
        j_button.css("z-index", 99999999);
        j_button.css("font-size", pm.size + "px");
        
        if(pm.font_color !=""){
            j_button.css("color",$.convertColor(pm.font_color));
        }
        
        if (pm.height != "") {
            j_button.css("height", pm.height + "px");
        }

        if (pm.width != "") {
            j_button.css("width", pm.width + "px");
        }
        
        //graphic 背景画像を指定できます。
        if(pm.graphic !=""){
            
            //画像の読み込み
            
            j_button.removeClass("glink_button").addClass("button_graphic");
            var img_url = "./data/image/" + pm.graphic ;
            j_button.css("background-image","url("+img_url+")");
            j_button.css("background-repeat","no-repeat");
            j_button.css("background-position","center center");
            j_button.css("background-size","100% 100%");
            
        }else{
            j_button.addClass(pm.color);
        }
        
        if(pm.face !=""){
            j_button.css("font-family", pm.face);
        }else if(that.kag.stat.font.face !=""){
            j_button.css("font-family", that.kag.stat.font.face);
        }

        if (pm.x == "auto") {
            var sc_width = parseInt(that.kag.config.scWidth);
            var center = Math.floor(parseInt(j_button.css("width")) / 2);
            var base = Math.floor(sc_width / 2);
            var first_left = base - center;
            j_button.css("left", first_left + "px");

        } else if (pm.x == "") {
            j_button.css("left", TYRANO.kag.stat.locate.x + "px");
        } else {
            j_button.css("left", pm.x + "px");
        }

        if (pm.y == "") {
            j_button.css("top", TYRANO.kag.stat.locate.y + "px");
        } else {
            j_button.css("top", pm.y + "px");
        }

        if (pm.fix != "false") {
            j_button.addClass("fixlayer");
        }

        //オブジェクトにクラス名をセットします
        $.setName(j_button, pm.name);
        
        that.kag.event.addEventElement({
            "tag":"glink",
            "j_target":j_button, //イベント登録先の
            "pm":pm
        });
        this.setEvent(j_button,pm);

        target_layer.append(j_button);
        if (pm.fix == "false") {
            target_layer.show();
        }
        TYRANO.kag.ftag.nextOrder();

    },
    
    setEvent:function(j_button,pm){
        var that = TYRANO;
        (function() {
            var _target = pm.target;
            var _storage = pm.storage;
            var _pm = pm;
            var preexp = that.kag.embScript(pm.preexp);
            var button_clicked = false;

            j_button.click(function(e) {
                //fix指定のボタンは、繰り返し実行できるようにする
                if (button_clicked == true && _pm.fix == "false") {
                    return false;
                } 
                
                //Sタグに到達していないとクリッカブルが有効にならない fixの時は実行される必要がある
                if (that.kag.stat.is_strong_stop != true && _pm.fix == "false") {
                    return false;
                }

                button_clicked = true;

                if (_pm.exp != "") {
                    //スクリプト実行
                    that.kag.embScript(_pm.exp, preexp);
                }

                //画面効果中は実行できないようにする
                if(that.kag.layer.layer_event.css("display") =="none" && that.kag.stat.is_strong_stop != true){
                    return false;
                }

                if(pm.cm == "true" && pm.fix == "false"){
                    that.kag.ftag.startTag("cm", {});
                }
                
                //roleが設定されている場合は対応する処理を実行
                //指定できる文字列はsave(セーブ画面を表示します)。load(ロード画面を表示します)。title(タイトル画面に戻ります)。menu(メニュー画面を表示します)。message(メッセージウィンドウを非表示にします)。skip(スキップの実行)
                if (_pm.role != "") {
                    //roleがクリックされたら、skip停止 
                    that.kag.stat.is_skip = false; 
                    //オートは停止
                    if(_pm.role!="auto"){
                        that.kag.ftag.startTag("autostop", {next:"false"});
                    }
                    //文字が流れているときは、セーブ出来ないようにする。
                    if(_pm.role =="save" || 
                    _pm.role =="menu" || 
                    _pm.role=="quicksave"||  
                    _pm.role=="sleepgame"){
                        //テキストが流れているときとwait中は実行しない
                        if(that.kag.stat.is_adding_text == true || that.kag.stat.is_wait == true){
                            return false; 
                        }
                    }
                    switch(_pm.role) {
                        case "save":
                            that.kag.menu.displaySave();
                            break;
                        case "load":
                            that.kag.menu.displayLoad();
                            break;
                        case "window":
                            that.kag.layer.hideMessageLayers();
                            break;
                        case "title":
                            that.kag.backTitle();
                            break;
                        case "title-without-confirmation":
                            location.href = "./index.html";
                            break;
                        case "menu":
                            that.kag.menu.showMenu();
                            break;
                        case "skip":
                            that.kag.ftag.startTag("skipstart", {});
                            break;
                        case "backlog":
                            that.kag.menu.displayLog();
                            break;
                        case "fullscreen":
                            that.kag.menu.screenFull();
                            break;
                        case "quicksave":
                            that.kag.menu.setQuickSave();
                            break;
                        case "quickload":
                            that.kag.menu.loadQuickSave();
                            break;
                        case "auto":
                            if(that.kag.stat.is_auto==true){
                                that.kag.ftag.startTag("autostop", {next:"false"});
                            }else{
                                that.kag.ftag.startTag("autostart", {});
                            }
                            break;
                        case "sleepgame":
                            //押されたオブジェクトのマウスオーバーをsleepgame前に解除
                            j_button.trigger("mouseout");
                            if(that.kag.tmp.sleep_game != null){
                                return false;
                            }
                            //ready
                            that.kag.tmp.sleep_game = {};
                            _pm.next=false;
                            that.kag.ftag.startTag("sleepgame", _pm);
                            break;
                    }
                    //クリックされた時に音が指定されていたら
                    if (_pm.clickse != "") {
                        that.kag.ftag.startTag("playse", {
                            "storage" : _pm.clickse,
                            "stop" : true
                        });
                    }
                    //バグリングさせない
                    e.stopPropagation();
                    //ジャンプは行わない
                    return false;
                }

                //クリックされた時に音が指定されていたら
                if (_pm.clickse != "") {
                    that.kag.ftag.startTag("playse", {
                        "storage" : _pm.clickse,
                        "stop" : true
                    });
                }
                that.kag.layer.showEventLayer();

                //fixレイヤの場合はcallでスタックが積まれる
                if (_pm.role == "" && _pm.fix == "true") {
                    //メッセージ消去させない
                    TYRANO.kag.stat.flag_ref_page = false
                    //コールスタックが帰ってきてない場合は、実行しないようにする必要がある
                    //fixの場合はコールスタックに残る。
                    var stack_pm = that.kag.getStack("call"); //最新のコールスタックを取得
                    if(stack_pm == null){
                        //callを実行する
                        //fixから遷移した場合はリターン時にnextorderしない
                        //strong_stopの場合は反応しない
                        //今がstrong_stopかどうかは時々刻々と変化するので、毎回新しくチェックする必要がある
                        //_pmはpmの参照コピーであるため、_pm.auto_nextを直接書き換えるわけにはいかない
                        var _auto_next = _pm.auto_next;
                        if(that.kag.stat.is_strong_stop == true){
                            _auto_next = "stop";
                        }else{
                            //パラメータ初期値が入るようになる
                            //_auto_next = "yes";
                        }
                        that.kag.ftag.startTag("call", {
                            storage: _storage,
                            target: _target,
                            auto_next: _auto_next
                        });
                        //TYRANO.kag.stat.flag_ref_page = true
                    }else{
                        //スタックで残された
                        that.kag.log("callスタックが残っている場合、fixボタンは反応しません");
                        that.kag.log(stack_pm);
                        return false;
                    }
                } else {
                    //jumpを実行する
                    that.kag.ftag.startTag("jump", _pm);
                }
                //選択肢の後、スキップを継続するか否か
                if(that.kag.stat.skip_link=="true"){
                    e.stopPropagation();
                }else{
                    that.kag.stat.is_skip = false; 
                }
            });
            
            j_button.hover(function() {
                if (_pm.enterimg != "") {
                    var enterimg_url = "./data/image/" + _pm.enterimg;
                    j_button.css("background-image", "url(" + enterimg_url + ")");
                }
                //マウスが乗った時
                if (_pm.enterse != "") {
                    that.kag.ftag.startTag("playse", {
                        "storage" : _pm.enterse,
                        "stop" : true
                    });
                }
            }, 
            function() {
                if (_pm.enterimg != "") {
                    var img_url = "./data/image/" + _pm.graphic;
                    j_button.css("background-image", "url(" + img_url + ")");
                }
                //マウスが乗った時
                if (_pm.leavese != "") {
                    that.kag.ftag.startTag("playse", {
                        "storage" : _pm.leavese,
                        "stop" : true
                    });
                }
            }); 
        })();
    }
};
TYRANO.kag.ftag.master_tag.glink = TYRANO.kag.tag.glink
TYRANO.kag.ftag.master_tag.glink.kag = TYRANO.kag


var _return = TYRANO.kag.tag.return
TYRANO.kag.tag.return = $.extend(true, {}, _return, {
    start: function () {
        //returnで戻ってくる時にページ送りできるようにする
        TYRANO.kag.stat.flag_ref_page = true
        _return.start.apply(TYRANO, arguments)
    }.bind(TYRANO)
})
TYRANO.kag.ftag.master_tag.return = TYRANO.kag.tag.return
TYRANO.kag.ftag.master_tag.return.kag = TYRANO.kag
