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

// 创建点
var P0 = igeo.genPoint(TunnelBottomX, CircleY, 0.0, size1);

var P1 = igeo.genPoint(TunnelBottomX - BottomL * 0.5 - Thick1 - Thick2, TunnelBottomY, 0.0, size1);
var P2 = igeo.genPoint(TunnelBottomX - BottomL * 0.5 - Thick1        , TunnelBottomY, 0.0, size1);
var P3 = igeo.genPoint(TunnelBottomX + BottomL * 0.5+ Thick1      , TunnelBottomY, 0.0, size1);
var P4 = igeo.genPoint(TunnelBottomX + BottomL * 0.5 + Thick1 + Thick2, TunnelBottomY, 0.0, size1);

var P5 = igeo.genPoint(TunnelBottomX - BottomL * 0.5, TunnelBottomY + Thick1, 0.0, size1);
var P6 = igeo.genPoint(TunnelBottomX + BottomL * 0.5, TunnelBottomY + Thick1, 0.0, size1);

var P7 = igeo.genPoint(TunnelBottomX - BottomL * 0.5 - Thick1- Thick2, CircleY, 0.0, size1);
var P8 = igeo.genPoint(TunnelBottomX - BottomL * 0.5 - Thick1        , CircleY, 0.0, size1);
var P9 = igeo.genPoint(TunnelBottomX - BottomL * 0.5                , CircleY, 0.0, size1);
var P10 = igeo.genPoint(TunnelBottomX + BottomL * 0.5                , CircleY, 0.0, size1);
var P11 = igeo.genPoint(TunnelBottomX + BottomL * 0.5   + Thick1      , CircleY, 0.0, size1);

// 创建线
var L1 = igeo.genLine(P1, P2);
var L2 = igeo.genLine(P3, P4);
var L3 = igeo.genArc(P7, P8, Rad1);
var L4 = igeo.genArc(P9, P10, Rad2);

// 创建线环
var LL1 = igeo.genLineLoop([L1]);
var LL2 = igeo.genLineLoop([L2]);
var LL3 = igeo.genLineLoop([L3]);
var LL4 = igeo.genLineLoop([L4]);

// 创建面
var S1 = igeo.genSurface([LL1], 1);
var S2 = igeo.genSurface([LL2], 1);
var S3 = igeo.genSurface([LL3], 1);
var S4 = igeo.genSurface([LL4], 1);

// 创建面环
var SL1 = igeo.genSurfaceLoop([S1, S2, S3, S4]);

// 创建体
var V1 = igeo.genVolume([SL1], 1);

// 剖分网格
imeshing.genMeshByGmsh(3);
