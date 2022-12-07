(() => {
"use strict";

const D = globalThis.demeter ||= {};
if (D.jlreq) {
  return;
}
D.jlreq = {};

D.jlreq.canRubyOverhang = c => {
if(c<8218){
if(c<94){
if(c<47){
if(c<44){
return c>39&&c<42;
}else{
return c<45||c>45;
}
}else{
if(c<91){
return c>57&&c<60;
}else{
return c<92||c>92;
}
}
}else{
if(c<172){
if(c<125){
return c>122&&c<124;
}else{
return c<126||c>170;
}
}else{
if(c<8212){
return c>186&&c<188;
}else{
return c<8213||c>8215;
}
}
}
}else{
if(c<12314){
if(c<10631){
if(c<8229){
return c>8219&&c<8222;
}else{
return c<8231||c>10628;
}
}else{
if(c<12296){
return c>12288&&c<12291;
}else{
return c<12306||c>12307;
}
}
}else{
if(c<12342){
if(c<12319){
return c>12316&&c<12318;
}else{
return c<12320||c>12338;
}
}else{
if(c<12449){
return c>12352&&c<12439;
}else{
if(c<12784){
return c<12541;
}else{
return c<12800;
}
}
}
}
}
};

D.jlreq.isLineStartProhibited = c => {
if(c<12317){
if(c<8252){
if(c<93){
if(c<45){
if(c<41){
return c>32&&c<34;
}else{
return c<42||c>43;
}
}else{
if(c<58){
return c>45&&c<47;
}else{
if(c<63){
return c<60;
}else{
return c<64;
}
}
}
}else{
if(c<8209){
if(c<126){
return c<94||c>124;
}else{
if(c<188){
return c>186;
}else{
return c>8207;
}
}
}else{
if(c<8217){
return c>8210&&c<8212;
}else{
if(c<8221){
return c<8218;
}else{
return c<8222;
}
}
}
}
}else{
if(c<12300){
if(c<12289){
if(c<8266){
return c<8253||c>8262;
}else{
return c>10629&&c<10631;
}
}else{
if(c<12294){
return c<12291||c>12292;
}else{
if(c<12298){
return c>12296;
}else{
return c>12298;
}
}
}
}else{
if(c<12309){
if(c<12303){
return c>12300&&c<12302;
}else{
if(c<12305){
return c<12304;
}else{
return c<12306;
}
}
}else{
if(c<12312){
return c<12310||c>12310;
}else{
if(c<12314){
return c>12312;
}else{
return c>12315;
}
}
}
}
}
}else{
if(c<12445){
if(c<12361){
if(c<12354){
if(c<12347){
return c>12318&&c<12320;
}else{
return c<12348||c>12352;
}
}else{
if(c<12357){
return c>12354&&c<12356;
}else{
if(c<12359){
return c<12358;
}else{
return c<12360;
}
}
}
}else{
if(c<12422){
if(c<12388){
return c<12362||c>12386;
}else{
if(c<12420){
return c>12418;
}else{
return c>12420;
}
}
}else{
if(c<12430){
return c>12422&&c<12424;
}else{
if(c<12437){
return c<12431;
}else{
return c<12439;
}
}
}
}
}else{
if(c<12515){
if(c<12454){
if(c<12450){
return c<12447||c>12447;
}else{
if(c<12452){
return c>12450;
}else{
return c>12452;
}
}
}else{
if(c<12457){
return c>12454&&c<12456;
}else{
if(c<12483){
return c<12458;
}else{
return c<12484;
}
}
}
}else{
if(c<12527){
if(c<12518){
return c<12516||c>12516;
}else{
if(c<12520){
return c>12518;
}else{
return c>12525;
}
}
}else{
if(c<12539){
return c>12532&&c<12535;
}else{
if(c<12784){
return c<12543;
}else{
return c<12800;
}
}
}
}
}
}
};

D.jlreq.isLineEndProhibited = c => {
if(c<12297){
if(c<172){
if(c<92){
if(c<41){
return c>39;
}else{
return c>90;
}
}else{
if(c<124){
return c>122;
}else{
return c>170;
}
}
}else{
if(c<8221){
if(c<8217){
return c>8215;
}else{
return c>8219;
}
}else{
if(c<10630){
return c>10628;
}else{
return c>12295;
}
}
}
}else{
if(c<12305){
if(c<12301){
if(c<12299){
return c>12297;
}else{
return c>12299;
}
}else{
if(c<12303){
return c>12301;
}else{
return c>12303;
}
}
}else{
if(c<12311){
if(c<12309){
return c>12307;
}else{
return c>12309;
}
}else{
if(c<12313){
return c>12311;
}else{
return c>12316&&c<12318;
}
}
}
}
};

D.jlreq.isPrefixedAbbreviation = c => {
if(c<165){
if(c<37){
return c>34;
}else{
return c>162&&c<164;
}
}else{
if(c<8365){
return c<166||c>8363;
}else{
return c>8469&&c<8471;
}
}
};

D.jlreq.isPostfixedAbbreviation = c => {
if(c<13094){
if(c<8452){
if(c<177){
if(c<162){
return c>36&&c<38;
}else{
return c<163||c>175;
}
}else{
if(c<8242){
return c>8239&&c<8241;
}else{
return c<8244||c>8450;
}
}
}else{
if(c<13070){
if(c<13059){
return c>8466&&c<8468;
}else{
return c<13060||c>13068;
}
}else{
if(c<13080){
return c>13075&&c<13077;
}else{
if(c<13090){
return c<13081;
}else{
return c<13092;
}
}
}
}
}else{
if(c<13138){
if(c<13115){
if(c<13100){
return c<13096||c>13098;
}else{
return c>13109&&c<13111;
}
}else{
if(c<13131){
return c<13116||c>13128;
}else{
if(c<13134){
return c>13132;
}else{
return c>13136;
}
}
}
}else{
if(c<13215){
if(c<13198){
return c>13142&&c<13144;
}else{
return c<13200||c>13211;
}
}else{
if(c<13252){
return c>13216&&c<13218;
}else{
if(c<13259){
return c<13253;
}else{
return c<13260;
}
}
}
}
}
};

D.jlreq.isWesternCharacter = c => {
if(c<8218){
if(c<645){
if(c<403){
if(c<308){
if(c<273){
if(c<181){
if(c<127){
return c>32;
}else{
return c>159;
}
}else{
if(c<266){
return c>181;
}else{
return c>267&&c<272;
}
}
}else{
if(c<294){
if(c<280){
return c<276;
}else{
return c<286||c>291;
}
}else{
if(c<296){
return c>294;
}else{
return c>297&&c<300;
}
}
}
}else{
if(c<331){
if(c<319){
if(c<313){
return c<310;
}else{
return c<315||c>316;
}
}else{
if(c<325){
return c>320;
}else{
return c>326&&c<329;
}
}
}else{
if(c<358){
if(c<336){
return c<334;
}else{
return c<342||c>343;
}
}else{
if(c<370){
return c>361;
}else{
return c>376&&c<383;
}
}
}
}
}else{
if(c<506){
if(c<469){
if(c<461){
if(c<450){
return c<404;
}else{
return c<451;
}
}else{
if(c<464){
return c<463;
}else{
return c<467||c>467;
}
}
}else{
if(c<474){
if(c<471){
return c>469;
}else{
return c>471&&c<473;
}
}else{
if(c<476){
return c<475;
}else{
return c<477||c>503;
}
}
}
}else{
if(c<617){
if(c<604){
if(c<510){
return c>508;
}else{
return c>591&&c<603;
}
}else{
if(c<606){
return c<605;
}else{
return c<610||c>611;
}
}
}else{
if(c<633){
if(c<628){
return c>619;
}else{
return c>628&&c<630;
}
}else{
if(c<637){
return c<636;
}else{
return c<639||c>640;
}
}
}
}
}
}else{
if(c<796){
if(c<728){
if(c<669){
if(c<659){
if(c<655){
return c>647;
}else{
return c>655;
}
}else{
if(c<662){
return c>659;
}else{
return c>663&&c<665;
}
}
}else{
if(c<713){
if(c<673){
return c<670;
}else{
return c<675||c>710;
}
}else{
if(c<717){
return c>715;
}else{
return c>719&&c<722;
}
}
}
}else{
if(c<774){
if(c<735){
if(c<731){
return c<730;
}else{
return c<732||c>732;
}
}else{
if(c<746){
return c>740;
}else{
return c>767&&c<773;
}
}
}else{
if(c<781){
if(c<776){
return c<775;
}else{
return c<777||c>778;
}
}else{
if(c<784){
return c>782;
}else{
return c>791&&c<795;
}
}
}
}
}else{
if(c<938){
if(c<817){
if(c<809){
if(c<804){
return c<801;
}else{
return c<806;
}
}else{
if(c<812){
return c<811;
}else{
return c<813||c>814;
}
}
}else{
if(c<865){
if(c<821){
return c>819;
}else{
return c>824&&c<830;
}
}else{
if(c<913){
return c<866;
}else{
return c<930||c>930;
}
}
}
}else{
if(c<7744){
if(c<1040){
if(c<970){
return c>944;
}else{
return c>1024&&c<1026;
}
}else{
if(c<1105){
return c<1104;
}else{
return c<1106||c>7741;
}
}
}else{
if(c<8211){
if(c<8052){
return c>8047;
}else{
return c>8207&&c<8209;
}
}else{
if(c<8214){
return c<8213;
}else{
return c<8215||c>8215;
}
}
}
}
}
}
}else{
if(c<8812){
if(c<8678){
if(c<8463){
if(c<8242){
if(c<8227){
if(c<8222){
return c>8219;
}else{
return c>8223;
}
}else{
if(c<8231){
return c>8228;
}else{
return c>8239&&c<8241;
}
}
}else{
if(c<8259){
if(c<8254){
return c<8244;
}else{
return c<8256||c>8257;
}
}else{
if(c<8274){
return c>8272;
}else{
return c>8363&&c<8365;
}
}
}
}else{
if(c<8592){
if(c<8492){
if(c<8487){
return c<8464;
}else{
return c<8488||c>8490;
}
}else{
if(c<8502){
return c>8500;
}else{
return c>8530&&c<8534;
}
}
}else{
if(c<8645){
if(c<8598){
return c<8597;
}else{
return c<8602||c>8643;
}
}else{
if(c<8659){
return c>8657;
}else{
return c>8659&&c<8661;
}
}
}
}
}else{
if(c<8749){
if(c<8714){
if(c<8706){
if(c<8704){
return c<8682;
}else{
return c<8705;
}
}else{
if(c<8709){
return c<8708;
}else{
return c<8710||c>8710;
}
}
}else{
if(c<8730){
if(c<8716){
return c>8714;
}else{
return c>8721&&c<8724;
}
}else{
if(c<8733){
return c<8731;
}else{
return c<8737||c>8740;
}
}
}
}else{
if(c<8774){
if(c<8765){
if(c<8751){
return c>8749;
}else{
return c>8755&&c<8758;
}
}else{
if(c<8771){
return c<8766;
}else{
return c<8772||c>8772;
}
}
}else{
if(c<8800){
if(c<8777){
return c>8775;
}else{
return c>8785&&c<8787;
}
}else{
if(c<8806){
return c<8803;
}else{
return c<8808||c>8809;
}
}
}
}
}
}else{
if(c<9670){
if(c<9166){
if(c<8869){
if(c<8840){
if(c<8824){
return c>8821;
}else{
return c>8833;
}
}else{
if(c<8844){
return c>8841;
}else{
return c>8852&&c<8856;
}
}
}else{
if(c<8967){
if(c<8922){
return c<8870;
}else{
return c<8924||c>8964;
}
}else{
if(c<8979){
return c>8977;
}else{
return c>8983&&c<8985;
}
}
}
}else{
if(c<9632){
if(c<9332){
if(c<9251){
return c<9167;
}else{
return c<9252||c>9311;
}
}else{
if(c<9450){
return c>9423;
}else{
return c>9450&&c<9471;
}
}
}else{
if(c<9656){
if(c<9649){
return c<9634;
}else{
return c<9652||c>9653;
}
}else{
if(c<9662){
return c>9659;
}else{
return c>9663&&c<9666;
}
}
}
}
}else{
if(c<9794){
if(c<9728){
if(c<9684){
if(c<9675){
return c<9672;
}else{
return c<9676||c>9677;
}
}else{
if(c<9703){
return c>9701;
}else{
return c>9710&&c<9712;
}
}
}else{
if(c<9743){
if(c<9733){
return c<9732;
}else{
return c<9735||c>9741;
}
}else{
if(c<9759){
return c>9757;
}else{
return c>9791&&c<9793;
}
}
}
}else{
if(c<10102){
if(c<9840){
if(c<9824){
return c<9795;
}else{
return c<9832||c>9832;
}
}else{
if(c<10004){
return c>10002;
}else{
return c>10069&&c<10071;
}
}
}else{
if(c<10748){
if(c<10548){
return c<10112;
}else{
return c<10550||c>10745;
}
}else{
if(c<12896){
return c>12880;
}else{
return c>12976&&c<12992;
}
}
}
}
}
}
}
};

D.jlreq.isInseparable = c => {
if(c<8209){
if(c<91){
if(c<45){
if(c<40){
return c>32&&c<34;
}else{
return c<42||c>43;
}
}else{
if(c<58){
return c>45&&c<47;
}else{
if(c<63){
return c<60;
}else{
return c<64;
}
}
}
}else{
if(c<125){
if(c<94){
return c<92||c>92;
}else{
return c>122&&c<124;
}
}else{
if(c<172){
return c<126||c>170;
}else{
if(c<188){
return c>186;
}else{
return c>8207;
}
}
}
}
}else{
if(c<12289){
if(c<8222){
if(c<8216){
return c>8210&&c<8212;
}else{
return c<8218||c>8219;
}
}else{
if(c<8263){
return c>8251&&c<8253;
}else{
if(c<10629){
return c<8266;
}else{
return c<10631;
}
}
}
}else{
if(c<12318){
if(c<12306){
return c<12291||c>12295;
}else{
if(c<12314){
return c>12307;
}else{
return c>12315;
}
}
}else{
if(c<12448){
return c>12318&&c<12320;
}else{
if(c<12539){
return c<12449;
}else{
return c<12540;
}
}
}
}
}
};

})();
