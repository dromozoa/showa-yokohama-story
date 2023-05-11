/* jshint esversion: 8 */
/* globals globalThis */
(() => {
"use strict";

if (!globalThis.demeter) {
  globalThis.demeter = {};
}
const D = globalThis.demeter;
if (D.voiceSprites) {
  return;
}

D.voiceSprites = [
{"1":[0,1579],"2":[1979,3520],"3":[5899,3574],"4":[9873,1763],},
{"1":[0,824],"2":[1224,3520],"3":[5144,3574],"4":[9118,1763],},
{"1":[0,1760],"2":[2160,3520],"3":[6080,3574],"4":[10054,1763],},
{"1":[0,2574],"2":[2974,3419],},
{"1":[0,3704],"2":[4104,3608],"3":[8112,2795],},
{"1":[0,3894],"2":[4294,4704],},
{"1":[0,4379],"2":[4779,4904],"3":[10083,3134],},
{"1":[0,3894],"2":[4294,2339],"3":[7033,3563],"4":[10995,3840],},
{"1":[0,2395],"2":[2795,3934],"3":[7128,1384],"4":[8912,2435],},
{"1":[0,2635],"2":[3035,3710],"3":[7144,1584],"4":[9128,4163],},
{"1":[0,2520],"2":[2920,3339],"3":[6659,2310],"4":[9368,3190],},
{"1":[0,6200],"2":[6601,3168],},
{"1":[0,3675],"2":[4075,5048],"3":[9523,4195],},
{"1":[0,8859],},
{"1":[0,3923],"2":[4323,3864],"3":[8587,4384],},
{"1":[0,1054],"2":[1454,1430],},
{"1":[0,2704],},
{"1":[0,3664],"2":[4064,4683],},
{"1":[0,1648],"2":[2048,3614],"3":[6062,3240],},
{"1":[0,2728],"2":[3128,2600],"3":[6128,3779],"4":[10307,3960],},
{"1":[0,3163],"2":[3563,7379],"3":[11342,3184],},
{"1":[0,4859],"2":[5259,5395],},
{"1":[0,5504],"2":[5904,2734],"3":[9038,2243],},
{"1":[0,1795],"2":[2195,2560],"3":[5155,2400],"4":[7955,2734],},
{"1":[0,3030],"2":[3430,5014],"3":[8843,2150],},
{"1":[0,2328],"2":[2728,2475],"3":[5603,1040],"4":[7043,688],},
{"1":[0,2550],"2":[2950,3208],"3":[6558,2350],},
{"1":[0,3555],"2":[3955,2624],"3":[6979,2819],"4":[10198,2534],},
{"1":[0,1800],"2":[2200,1395],"3":[3995,1875],},
{"1":[0,1744],"2":[2144,1110],"3":[3654,2030],"4":[6083,3600],},
{"1":[0,4470],"2":[4870,1243],"3":[6512,2704],},
{"1":[0,1854],"2":[2254,3155],"3":[5808,1168],"4":[7376,1179],},
{"1":[0,974],"2":[1374,694],"3":[2467,2168],},
{"1":[0,1859],},
{"1":[0,2163],"2":[2563,1139],"3":[4102,1720],},
{"1":[0,5144],"2":[5545,2280],"3":[8224,3414],},
{"1":[0,4363],},
{"1":[0,2464],"2":[2864,2064],},
{"1":[0,9200],},
{"1":[0,5019],"2":[5419,1123],"3":[6942,3595],},
{"1":[0,870],"2":[1270,1315],},
{"1":[0,1574],"2":[1974,2075],"3":[4448,2480],"4":[7329,2395],},
{"1":[0,6464],"2":[6865,1974],"3":[9238,2208],},
{"1":[0,8024],"2":[8424,2440],"3":[11264,744],},
{"1":[0,2320],"2":[2720,2134],"3":[5254,3195],"4":[8848,2208],},
{"1":[0,2664],"2":[3064,3024],"3":[6488,1400],"4":[8288,955],},
{"1":[0,1448],"2":[1848,1888],"3":[4136,2670],"4":[7206,1430],},
{"1":[0,4403],"2":[4803,2155],"3":[7358,3510],},
{"1":[0,2675],"2":[3075,2739],"3":[6214,2104],},
{"1":[0,2448],"2":[2848,3320],"3":[6568,3120],"4":[10088,2790],},
{"1":[0,3774],"2":[4174,2368],"3":[6942,5134],},
{"1":[0,2104],"2":[2504,4059],"3":[6963,4080],},
{"1":[0,3259],"2":[3659,2528],"3":[6587,5243],},
{"1":[0,2579],"2":[2979,3179],"3":[6558,870],"4":[7827,1355],},
{"1":[0,4443],"2":[4843,2294],"3":[7537,2283],},
{"1":[0,864],"2":[1264,4504],},
{"1":[0,2744],"2":[3144,4134],"3":[7678,5163],},
{"1":[0,3480],"2":[3880,4134],"3":[8414,5163],},
{"1":[0,2414],"2":[2814,2414],},
{"1":[0,1024],"2":[1424,1750],"3":[3574,1803],"4":[5776,1510],},
{"1":[0,3854],},
{"1":[0,944],"2":[1344,2270],"3":[4014,2859],},
{"1":[0,2075],"2":[2475,1534],"3":[4408,4824],},
{"1":[0,2339],"2":[2739,1240],"3":[4379,4664],"4":[9443,1600],},
{"1":[0,3664],"2":[4064,4683],},
{"1":[0,2414],"2":[2814,1275],"3":[4488,1363],"4":[6251,1824],},
{"1":[0,2619],},
{"1":[0,1328],"2":[1729,5584],"3":[7712,3750],},
{"1":[0,1294],"2":[1694,1288],"3":[3382,2163],},
{"1":[0,2128],"2":[2528,4275],"3":[7203,2070],"4":[9672,1235],},
{"1":[0,6515],"2":[6915,1795],"3":[9110,3480],},
{"1":[0,2624],"2":[3024,1640],},
{"1":[0,2363],},
{"1":[0,4624],},
{"1":[0,2899],},
{"1":[0,1459],"2":[1859,3688],},
{"1":[0,2830],"2":[3230,2320],"3":[5950,1800],"4":[8150,3019],},
{"1":[0,2848],"2":[3248,2550],"3":[6198,2814],},
{"1":[0,6240],},
{"1":[0,1664],"2":[2064,1664],"3":[4128,2840],},
{"1":[0,1520],"2":[1920,3760],},
{"1":[0,2880],"2":[3280,1910],"3":[5590,6248],},
{"1":[0,2923],"2":[3323,1664],"3":[5387,2315],"4":[8102,4824],},
{"1":[0,2739],"2":[3139,3323],"3":[6862,3459],"4":[10720,3950],},
{"1":[0,3608],"2":[4008,2534],},
{"1":[0,2680],"2":[3080,1750],"3":[5230,2755],},
{"1":[0,2630],"2":[3030,3120],"3":[6550,2779],},
{"1":[0,3643],},
{"1":[0,1280],"2":[1681,1075],"3":[3155,4163],"4":[7718,2424],},
{"1":[0,1454],"2":[1854,4163],"3":[6416,3035],"4":[9851,3064],},
{"1":[0,1539],},
{"1":[0,2910],"2":[3310,3888],"3":[7598,1443],"4":[9440,3475],},
{"1":[0,5328],"2":[5729,3120],},
{"1":[0,2814],"2":[3214,3888],"3":[7502,3750],},
{"1":[0,6088],"2":[6488,3179],},
{"1":[0,3350],"2":[3750,3995],"3":[8144,2560],"4":[11105,3040],},
{"1":[0,2744],"2":[3144,4080],"3":[7625,1979],},
{"1":[0,3619],},
{"1":[0,4110],"2":[4510,4659],"3":[9569,4750],"4":[14718,2579],},
{"1":[0,3430],"2":[3830,2160],},
{"1":[0,2974],"2":[3374,5608],"3":[9382,3600],},
{"1":[0,3328],"2":[3728,939],"3":[5067,1555],},
{"1":[0,2390],},
{"1":[0,2280],},
{"1":[0,2899],},
{"1":[0,1363],},
{"1":[0,6403],"2":[6803,8464],},
{"1":[0,3454],"2":[3854,4008],"3":[8262,5488],},
{"1":[0,3870],"2":[4270,2568],},
{"1":[0,4299],"2":[4699,4379],"3":[9478,3000],"4":[12878,3390],},
{"1":[0,4219],"2":[4619,3595],"3":[8614,1523],},
{"1":[0,4363],"2":[4763,3990],},
{"1":[0,1544],"2":[1944,1323],"3":[3667,1280],"4":[5347,2115],},
{"1":[0,3400],"2":[3800,4363],"3":[8563,2830],},
{"1":[0,3299],"2":[3699,1174],"3":[5272,1520],},
{"1":[0,2803],},
{"1":[0,894],"2":[1294,2008],},
{"1":[0,3974],},
{"1":[0,974],"2":[1374,6584],"3":[8358,1115],},
{"1":[0,3560],},
{"1":[0,1288],"2":[1689,2008],"3":[4096,2843],},
{"1":[0,2643],},
{"1":[0,1390],"2":[1790,3739],"3":[5929,1544],},
{"1":[0,2123],"2":[2523,2560],"3":[5483,2790],},
{"1":[0,2123],"2":[2523,2720],"3":[5643,2790],},
{"1":[0,2288],"2":[2688,1824],},
{"1":[0,2288],},
{"1":[0,1584],"2":[1984,2208],},
{"1":[0,1739],"2":[2139,1483],},
{"1":[0,1494],"2":[1894,2008],"3":[4302,1160],},
{"1":[0,3899],"2":[4299,1824],},
{"1":[0,3539],"2":[3939,1910],"3":[6248,1454],"4":[8102,1579],},
{"1":[0,3750],},
{"1":[0,2264],"2":[2664,1264],},
{"1":[0,1155],"2":[1555,2320],},
{"1":[0,1603],"2":[2003,3664],"3":[6067,2715],"4":[9182,2440],},
{"1":[0,12814],},
{"1":[0,13595],},
{"1":[0,2200],},
{"1":[0,6699],"2":[7099,3560],},
{"1":[0,1083],"2":[1483,1128],},
{"1":[0,7520],"2":[7920,4888],},
{"1":[0,5200],"2":[5601,2310],"3":[8310,2630],},
{"1":[0,1123],"2":[1523,3984],},
{"1":[0,3955],"2":[4355,3195],},
{"1":[0,3075],"2":[3475,1563],"3":[5438,2379],"4":[8217,2704],},
{"1":[0,1968],"2":[2368,2024],"3":[4792,5574],},
{"1":[0,2035],},
{"1":[0,2110],"2":[2510,1139],"3":[4048,2968],},
{"1":[0,1310],"2":[1710,1835],},
{"1":[0,3520],"2":[3920,4344],"3":[8664,3264],},
{"1":[0,5910],"2":[6310,2814],"3":[9523,3523],},
{"1":[0,1190],"2":[1590,2024],},
{"1":[0,1390],"2":[1790,1643],"3":[3833,1768],},
{"1":[0,1104],"2":[1504,888],"3":[2792,4248],},
{"1":[0,3235],"2":[3635,3728],"3":[7763,2734],},
{"1":[0,1680],"2":[2080,1040],"3":[3520,1960],"4":[5881,1720],},
{"1":[0,939],"2":[1339,974],},
{"1":[0,835],"2":[1235,3099],"3":[4734,1819],},
{"1":[0,2254],"2":[2654,1374],},
{"1":[0,2830],"2":[3230,2160],"3":[5790,4115],},
{"1":[0,2763],},
{"1":[0,2075],"2":[2475,2400],},
{"1":[0,4480],},
{"1":[0,1803],"2":[2203,2168],},
{"1":[0,3803],},
{"1":[0,920],},
{"1":[0,2899],"2":[3299,5694],"3":[9393,3744],},
{"1":[0,2264],"2":[2664,3128],"3":[6192,1643],"4":[8235,2555],},
{"1":[0,1814],},
{"1":[0,2008],"2":[2408,3003],},
{"1":[0,1043],"2":[1443,3259],},
{"1":[0,3080],"2":[3480,2008],},
{"1":[0,1275],},
{"1":[0,835],"2":[1235,734],},
{"1":[0,1920],"2":[2320,1648],"3":[4368,3800],},
{"1":[0,2835],"2":[3235,1190],"3":[4824,1294],"4":[6518,1499],},
{"1":[0,3440],},
{"1":[0,2083],"2":[2483,7488],"3":[10371,4294],},
{"1":[0,6235],"2":[6635,1808],"3":[8843,3323],},
{"1":[0,4179],"2":[4579,1555],"3":[6534,2563],"4":[9496,3579],},
{"1":[0,1184],"2":[1584,2454],"3":[4438,3280],},
{"1":[0,3054],"2":[3454,3595],},
{"1":[0,2440],"2":[2840,2950],"3":[6190,955],},
{"1":[0,3155],"2":[3555,675],},
{"1":[0,2515],"2":[2915,4230],"3":[7545,4590],"4":[12534,1600],},
{"1":[0,3664],"2":[4064,4683],},
{"1":[0,3619],"2":[4019,4344],},
{"1":[0,4390],"2":[4790,2640],"3":[7830,2920],"4":[11150,2960],},
{"1":[0,2643],"2":[3043,3200],"3":[6643,2110],"4":[9153,4240],},
{"1":[0,4899],"2":[5299,2739],"3":[8438,2424],},
{"1":[0,2955],"2":[3355,2264],"3":[6019,1939],},
{"1":[0,1640],"2":[2040,2603],},
{"1":[0,1779],"2":[2179,920],},
{"1":[0,1590],"2":[1990,3115],"3":[5504,779],"4":[6683,2059],},
{"1":[0,2254],"2":[2654,1235],"3":[4288,1654],"4":[6342,2795],},
{"1":[0,1288],"2":[1689,1464],"3":[3552,1350],},
{"1":[0,1275],"2":[1675,1275],"3":[3350,1960],},
{"1":[0,4163],"2":[4563,1635],},
{"1":[0,3030],"2":[3430,3048],"3":[6878,3155],},
{"1":[0,1880],"2":[2280,2163],"3":[4843,1910],"4":[7152,3408],},
{"1":[0,4523],"2":[4923,2430],},
{"1":[0,2800],"2":[3200,2000],"3":[5600,7459],},
{"1":[0,1248],"2":[1649,3470],},
{"1":[0,2054],},
{"1":[0,3344],},
{"1":[0,1600],"2":[2000,1624],"3":[4024,6323],"4":[10747,2160],},
{"1":[0,2755],"2":[3155,3088],"3":[6643,3968],"4":[11011,2083],},
{"1":[0,1760],"2":[2160,1990],"3":[4550,1115],},
{"1":[0,2240],"2":[2640,1515],"3":[4555,2014],},
{"1":[0,3128],"2":[3528,3230],},
{"1":[0,2059],"2":[2459,2275],"3":[5134,3534],},
{"1":[0,3944],"2":[4344,2763],"3":[7507,1643],"4":[9550,2555],},
{"1":[0,1814],},
{"1":[0,2635],},
{"1":[0,763],"2":[1163,1424],"3":[2987,1710],"4":[5096,1430],},
{"1":[0,1379],"2":[1779,1403],"3":[3582,3235],},
{"1":[0,1464],"2":[1864,1843],},
{"1":[0,2328],"2":[2728,1403],"3":[4531,934],"4":[5865,1315],},
{"1":[0,3643],"2":[4043,2475],"3":[6918,2555],"4":[9873,1539],},
{"1":[0,835],"2":[1235,2350],"3":[3984,2280],"4":[6664,2608],},
{"1":[0,1403],"2":[1803,2904],"3":[5107,1819],"4":[7326,1955],},
{"1":[0,1600],"2":[2000,1555],"3":[3955,3374],"4":[7729,2614],},
{"1":[0,3888],"2":[4288,2144],"3":[6833,2704],"4":[9937,2283],},
{"1":[0,2880],"2":[3280,2715],"3":[6395,1699],"4":[8494,3659],},
{"1":[0,3000],"2":[3400,2920],"3":[6721,2643],},
{"1":[0,3510],"2":[3910,3275],"3":[7584,2430],"4":[10414,1859],},
{"1":[0,4499],},
{"1":[0,1643],},
{"1":[0,2595],"2":[2995,1315],},
{"1":[0,1744],"2":[2144,1928],"3":[4472,2283],},
{"1":[0,3115],"2":[3515,2579],},
{"1":[0,4160],"2":[4561,1950],"3":[6910,784],"4":[8094,2179],},
{"1":[0,1163],},
{"1":[0,2720],"2":[3120,2939],"3":[6459,1950],},
{"1":[0,1550],"2":[1950,1214],"3":[3563,2568],"4":[6531,2030],},
{"1":[0,2243],"2":[2643,1555],},
{"1":[0,1150],"2":[1550,1315],},
{"1":[0,2990],"2":[3390,2899],"3":[6689,4115],"4":[11203,3110],},
{"1":[0,2120],},
{"1":[0,3259],},
{"1":[0,4504],"2":[4904,2883],"3":[8187,2648],},
{"1":[0,2464],"2":[2864,1643],"3":[4907,3515],},
{"1":[0,2168],"2":[2568,3243],},
{"1":[0,2494],},
{"1":[0,1984],"2":[2384,1590],"3":[4374,1550],},
{"1":[0,880],},
{"1":[0,824],},
{"1":[0,1280],},
{"1":[0,1379],"2":[1779,2179],"3":[4358,2614],},
{"1":[0,955],"2":[1355,1723],},
{"1":[0,1934],"2":[2334,1054],"3":[3787,1979],"4":[6166,3048],},
{"1":[0,1230],"2":[1630,1099],"3":[3128,1240],},
{"1":[0,1803],"2":[2203,1099],"3":[3702,1894],},
{"1":[0,1670],"2":[2070,2835],"3":[5304,2400],"4":[8105,3483],},
{"1":[0,1363],},
{"1":[0,939],},
{"1":[0,1835],"2":[2235,1523],},
{"1":[0,1483],},
{"1":[0,1235],"2":[1635,1824],},
{"1":[0,1539],"2":[1939,2675],"3":[5014,2560],},
{"1":[0,1110],},
{"1":[0,2563],"2":[2963,1048],},
{"1":[0,1880],"2":[2280,1320],},
{"1":[0,3099],},
{"1":[0,840],},
{"1":[0,1619],"2":[2019,2550],"3":[4968,1200],},
{"1":[0,840],"2":[1240,2979],},
{"1":[0,3184],"2":[3584,2419],"3":[6403,2640],"4":[9443,1808],},
{"1":[0,1123],"2":[1523,1200],"3":[3123,1219],},
{"1":[0,5795],"2":[6195,1304],"3":[7899,1568],},
{"1":[0,1448],"2":[1848,2454],},
{"1":[0,2515],"2":[2915,4379],},
{"1":[0,2510],"2":[2910,3675],},
{"1":[0,4339],"2":[4739,4635],},
{"1":[0,1720],},
{"1":[0,2584],},
{"1":[0,2920],"2":[3320,2544],"3":[6264,1430],},
{"1":[0,1739],},
{"1":[0,1339],"2":[1739,1294],"3":[3432,1360],"4":[5192,1590],},
{"1":[0,1134],"2":[1534,1203],"3":[3136,1174],"4":[4710,2859],},
{"1":[0,2030],"2":[2430,4064],"3":[6894,3270],},
{"1":[0,715],"2":[1115,1115],"3":[2630,910],"4":[3939,888],},
{"1":[0,2574],},
{"1":[0,1600],"2":[2000,1184],"3":[3584,1760],},
{"1":[0,2080],"2":[2480,2384],"3":[5264,3704],},
{"1":[0,1555],},
{"1":[0,3483],"2":[3883,6843],"3":[11126,2603],},
{"1":[0,3675],},
{"1":[0,4899],},
{"1":[0,4640],},
{"1":[0,1694],"2":[2094,5504],"3":[7998,3075],},
{"1":[0,1968],"2":[2368,1960],},
{"1":[0,2630],"2":[3030,2974],"3":[6403,2603],"4":[9406,2830],},
{"1":[0,1134],"2":[1534,1203],"3":[3136,1174],},
{"1":[0,2208],"2":[2608,1939],},
{"1":[0,2203],"2":[2603,1939],},
{"1":[0,2470],"2":[2870,1894],},
{"1":[0,5283],"2":[5683,1763],},
{"1":[0,1939],"2":[2339,1360],},
{"1":[0,1710],"2":[2110,2590],"3":[5099,843],"4":[6342,614],},
{"1":[0,835],"2":[1235,734],"3":[2368,1283],"4":[4051,2774],},
{"1":[0,3035],"2":[3435,1675],"3":[5510,1680],"4":[7590,2155],},
{"1":[0,2934],"2":[3334,2915],"3":[6648,1430],"4":[8478,1464],},
{"1":[0,2739],"2":[3139,3139],"3":[6678,3310],},
{"1":[0,1910],"2":[2310,1254],"3":[3963,1875],"4":[6238,955],},
{"1":[0,3155],"2":[3555,675],},
{"1":[0,3864],"2":[4264,2968],},
{"1":[0,2344],"2":[2744,2299],},
{"1":[0,2499],"2":[2899,2190],},
{"1":[0,1443],"2":[1843,2248],"3":[4491,1275],"4":[6166,1614],},
{"1":[0,1264],"2":[1665,2128],},
{"1":[0,1624],"2":[2024,1960],},
{"1":[0,2000],"2":[2400,3603],"3":[6403,4395],},
{"1":[0,2240],"2":[2640,2510],"3":[5550,2694],},
{"1":[0,1168],},
{"1":[0,1024],},
{"1":[0,2555],"2":[2955,3344],"3":[6699,3819],"4":[10918,3144],},
{"1":[0,4374],"2":[4774,1688],"3":[6862,1384],},
{"1":[0,790],"2":[1190,2819],},
{"1":[0,824],"2":[1224,1910],},
{"1":[0,1395],"2":[1795,2195],"3":[4390,1419],},
{"1":[0,2488],"2":[2888,3584],"3":[6872,2510],},
{"1":[0,1683],"2":[2083,2259],},
{"1":[0,2984],"2":[3384,3030],"3":[6814,3563],"4":[10777,3883],},
{"1":[0,1203],"2":[1603,2064],"3":[4067,1448],"4":[5915,1379],},
{"1":[0,1024],"2":[1424,1355],"3":[3179,2094],"4":[5673,2184],},
{"1":[0,2739],"2":[3139,3110],"3":[6648,2950],},
{"1":[0,1139],"2":[1539,1203],"3":[3142,1240],},
{"1":[0,4259],"2":[4659,2435],"3":[7494,1760],},
{"1":[0,1955],"2":[2355,2339],"3":[5094,2488],"4":[7982,3608],},
{"1":[0,3974],"2":[4374,1384],"3":[6158,6488],},
{"1":[0,3934],"2":[4334,3520],"3":[8254,974],},
{"1":[0,3054],},
{"1":[0,1715],"2":[2115,694],"3":[3208,1955],"4":[5563,1408],},
{"1":[0,4048],},
{"1":[0,3035],"2":[3435,2848],"3":[6683,2675],},
{"1":[0,2563],"2":[2963,2710],"3":[6073,2710],"4":[9182,2640],},
{"1":[0,5259],},
{"1":[0,2419],"2":[2819,968],"3":[4187,1859],"4":[6446,960],},
{"1":[0,4704],"2":[5104,675],},
{"1":[0,2488],"2":[2888,3523],},
{"1":[0,1070],"2":[1470,2200],"3":[4070,2139],},
{"1":[0,4568],},
{"1":[0,1715],"2":[2115,3694],},
{"1":[0,1483],"2":[1883,1608],"3":[3891,3475],"4":[7766,3563],},
{"1":[0,1763],},
{"1":[0,1363],"2":[1763,2654],"3":[4817,2614],},
{"1":[0,2750],"2":[3150,5603],"3":[9153,3230],},
{"1":[0,5550],"2":[5950,2264],"3":[8614,3664],},
{"1":[0,3094],"2":[3494,675],},
{"1":[0,1384],"2":[1784,3739],"3":[5923,2990],},
{"1":[0,1395],"2":[1795,1728],"3":[3923,2459],},
{"1":[0,2408],"2":[2808,2640],},
{"1":[0,5534],},
{"1":[0,2475],"2":[2875,4304],"3":[7579,2624],"4":[10603,2104],},
{"1":[0,4243],"2":[4643,3470],},
{"1":[0,4174],"2":[4574,3875],},
{"1":[0,7534],"2":[7934,3643],},
{"1":[0,1350],"2":[1750,3184],"3":[5334,3808],"4":[9542,2355],},
{"1":[0,2168],},
{"1":[0,3374],},
{"1":[0,2243],},
{"1":[0,1480],},
{"1":[0,2424],},
{"1":[0,3464],"2":[3864,2390],"3":[6654,2808],},
{"1":[0,3464],"2":[3864,2928],"3":[7192,2243],},
{"1":[0,1294],"2":[1694,2134],"3":[4227,2643],"4":[7270,1875],},
{"1":[0,1840],"2":[2240,2944],"3":[5585,4270],},
{"1":[0,2904],"2":[3304,6294],"3":[9998,1304],},
{"1":[0,2150],"2":[2550,2344],"3":[5294,1395],},
{"1":[0,2464],"2":[2864,5323],"3":[8587,2699],},
{"1":[0,2459],"2":[2859,2470],"3":[5728,3419],},
{"1":[0,9200],"2":[9600,3923],},
{"1":[0,1259],},
{"1":[0,4379],"2":[4779,1928],},
{"1":[0,3040],"2":[3440,2848],"3":[6689,2048],},
{"1":[0,2470],"2":[2870,2384],"3":[5654,1104],},
{"1":[0,2723],"2":[3123,1579],},
{"1":[0,3248],"2":[3648,2203],"3":[6251,1123],},
{"1":[0,2259],"2":[2659,2054],"3":[5112,1299],},
{"1":[0,2334],"2":[2734,1144],},
{"1":[0,2334],"2":[2734,1144],},
{"1":[0,2475],"2":[2875,1144],},
{"1":[0,1664],"2":[2064,1648],},
{"1":[0,2464],"2":[2864,1014],},
{"1":[0,2475],"2":[2875,1014],},
{"1":[0,2603],"2":[3003,1014],},
{"1":[0,1710],"2":[2110,1934],"3":[4443,1763],"4":[6606,2054],},
{"1":[0,2480],"2":[2880,2979],"3":[6259,1224],},
{"1":[0,2480],"2":[2880,2979],"3":[6259,2403],},
{"1":[0,2304],"2":[2704,2950],"3":[6054,1944],},
{"1":[0,3128],},
{"1":[0,6523],"2":[6923,4355],"3":[11678,3328],},
{"1":[0,1744],"2":[2144,2083],"3":[4627,1494],},
{"1":[0,3350],"2":[3750,2760],},
{"1":[0,3350],"2":[3750,2750],},
{"1":[0,6048],},
{"1":[0,2104],"2":[2504,1883],"3":[4787,2224],},
{"1":[0,2104],"2":[2504,3259],"3":[6163,2915],},
{"1":[0,2083],"2":[2483,2494],"3":[5376,1160],},
{"1":[0,5944],},
{"1":[0,3350],"2":[3750,3304],},
{"1":[0,1043],"2":[1443,1174],},
];

})();
