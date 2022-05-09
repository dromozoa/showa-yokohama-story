【glinkをfixボタンにできるプラグイン】


■できること
glinkをfixボタン、roleボタンとして利用できるようにします。


■使い方
このテキストが入っているフォルダごと「data/others/plugin」フォルダに置きます。
それからfirst.ksとかに以下のように記述してください。

[plugin name=glink_ex]
指定可能属性
なし

記述した時点から、[glink]に通常のパラメータに加えて以下のパラメータを指定可能になります。

fix         ：「true」指定でglinkをfixボタンにする
role        ：glinkをロールボタンにする。指定可能な値はbuttonタグのroleパラメータ参照
auto_next   ：fixまたはroleパラメータ指定時、glinkクリック時に次のタグに進ませない

fixまたはroleパラメータを指定したglinkボタンを消すときは、[clearfix]タグを使用してください。


■注意事項
このプラグインを使用したことで生じたあらゆる問題について、製作者は責任を負いません。
不具合報告等は歓迎しております。製作者Twitterまでどうぞ。


■製作者
さくた（@skt_tyrano）
https：//skt-pnt.netlify.app


■更新履歴
2022/04/23  ver.1.0.0公開
・正式版公開
