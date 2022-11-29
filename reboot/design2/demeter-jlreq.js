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

D.jlreq.isInseparable = c => {
if(c<8229){
return c>8211&&c<8213;
}else{
if(c<12339){
return c<8231;
}else{
return c<12342;
}
}
};

D.jlreq.isPrefixedAbbreviation = c => {
if(c<164){
if(c<37){
return c>34;
}else{
return c>162;
}
}else{
if(c<166){
return c>164;
}else{
return c>8363&&c<8365;
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

})();
