setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

var Rad1 = 2.25;
var Rad2 = 2.55;
var Rad3 = 2.65;
var Thick1 = 0.3;
var Thick2 = 0.1;
var BottomL = 4.5;
var Height = 6.0;

var ModelL= 96.0;
var ModelH = 100.0;

var TunnelBottomX = ModelL / 2.0;
var TunnelBottomY = 46.0;
var CircleY = TunnelBottomY + 0.3 + 6;

var size1 = 0.1;
var size2 = 1.0;

var P0 = igeo.genPoint(TunnelBottomX, CircleY,0.0, size1);

var P1 = igeo.genPoint(TunnelBottomX - BottomL * 0.5 - Thick1 - Thick2, TunnelBottomY,0.0, size1);
var P2 = igeo.genPoint(TunnelBottomX - BottomL * 0.5 - Thick1        , TunnelBottomY,0.0, size1);
var P3 = igeo.genPoint(TunnelBottomX + BottomL * 0.5+ Thick1      , TunnelBottomY,0.0, size1);
var P4 = igeo.genPoint(TunnelBottomX + BottomL * 0.5 + Thick1 + Thick2, TunnelBottomY,0.0, size1);

var P5 = igeo.genPoint(TunnelBottomX - BottomL * 0.5, TunnelBottomY + Thick1, 0.0, size1);
var P6 = igeo.genPoint(TunnelBottomX + BottomL * 0.5, TunnelBottomY + Thick1, 0.0, size1);

var P7 = igeo.genPoint(TunnelBottomX - BottomL * 0.5 - Thick1- Thick2, CircleY, 0.0, size1);
var P8 = igeo.genPoint(TunnelBottomX - BottomL * 0.5 - Thick1        , CircleY, 0.0, size1);
var P9 = igeo.genPoint(TunnelBottomX - BottomL * 0.5                , CircleY, 0.0, size1);
var P10 = igeo.genPoint(TunnelBottomX + BottomL * 0.5                , CircleY, 0.0, size1);
var P11 = igeo.genPoint(TunnelBottomX + BottomL * 0.5   + Thick1     , CircleY, 0.0, size1);
var P12 = igeo.genPoint(TunnelBottomX + BottomL * 0.5   + Thick1  + Thick2   , CircleY, 0.0, size1);

var P13 = igeo.genPoint(TunnelBottomX , CircleY + Rad1, 0.0, size1);
var P14 = igeo.genPoint(TunnelBottomX , CircleY + Rad2, 0.0, size1);
var P15 = igeo.genPoint(TunnelBottomX , CircleY + Rad3, 0.0, size1);

///水平
var H1 = igeo.genLine(P1, P2);
var H2 = igeo.genLine(P2, P3);
var H3 = igeo.genLine(P3, P4);
var H4 = igeo.genLine(P5, P6);

///竖直
var V1 =  igeo.genLine(P1, P7);
var V2 =  igeo.genLine(P8, P2);
var V3 =  igeo.genLine(P9, P5);
var V4 =  igeo.genLine(P10, P6);
var V5 =  igeo.genLine(P11, P3);
var V6 =  igeo.genLine(P12, P4);

///圆弧
var ArcIn1 = igeo.genArc(P9, P0, P13);
var ArcIn2 = igeo.genArc(P13, P0, P10);
var ArcMid1 = igeo.genArc(P8, P0, P14);
var ArcMid2 = igeo.genArc(P14, P0, P11);
var ArcOut1 = igeo.genArc(P7, P0, P15);
var ArcOut2 = igeo.genArc(P15, P0, P12);

var LineLoop1 = igeo.genLineLoop(  [V3,H4,V4, ArcIn1,  ArcIn2]  );
var LineLoop2 = igeo.genLineLoop(  [V2,H2,V5, ArcMid1, ArcMid2]   );
var LineLoop3 = igeo.genLineLoop(  [V1,H1,V2,ArcMid1, ArcMid2,V5,H3,V6, ArcOut2, ArcOut1]  );

igeo.genSurface([LineLoop2, LineLoop1], 1);
igeo.genSurface([LineLoop3], 2);

var LineLoop4 = igeo.genLineLoop(  [V1, H1, H2, H3,V6, ArcOut2, ArcOut1]  );
var LineLoop5 = igeo.genRect(0,0,0, ModelL, ModelH, 0, size2);
igeo.genSurface([LineLoop5, LineLoop4], 3);

imeshing.genMeshByGmsh(2);
