setCurDir(getSrcDir());

// 全局设置
dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("If_Cal_EE_Contact 1");
dyna.Set("Contact_Detect_Tol 1e-2");
dyna.Set("Renew_Interval 10");
dyna.Set("Gravity 0.0 -9.8 0.0");

// 创建底部刚性接触面
var fBotCoord = new Array();
fBotCoord[0] = new Array(-10.0, 0.0, 0.0);
fBotCoord[1] = new Array(10.0, 0.0, 0.0);
fBotCoord[2] = new Array(10.0, 10.0, 0.0);
fBotCoord[3] = new Array(-10.0, 10.0, 0.0);
rdface.Create(1, 1, 2, fBotCoord);

// 创建金字塔顶部面
var fPyramidTop = new Array();
fPyramidTop[0] = new Array(-3.0, -0.1, 10.0);
fPyramidTop[1] = new Array(3.0, -0.1, 10.0);
fPyramidTop[2] = new Array(3.0, -0.1, 8.0);
fPyramidTop[3] = new Array(-3.0, -0.1, 8.0);
rdface.Create(2, 10, 4, fPyramidTop);

// 创建金字塔侧面
var fPyramidSide1 = new Array();
fPyramidSide1[0] = new Array(-3.0, -0.1, 10.0);
fPyramidSide1[1] = new Array(3.0, -0.1, 10.0);
fPyramidSide1[2] = new Array(3.0, -0.1, 8.0);
rdface.Create(1, 1, 2, fPyramidSide1);

var fPyramidSide2 = new Array();
fPyramidSide2[0] = new Array(3.0, -0.1, 10.0);
fPyramidSide2[1] = new Array(3.0, -0.1, 8.0);
fPyramidSide2[2] = new Array(-3.0, -0.1, 8.0);
rdface.Create(1, 1, 2, fPyramidSide2);

var fPyramidSide3 = new Array();
fPyramidSide3[0] = new Array(-3.0, -0.1, 8.0);
fPyramidSide3[1] = new Array(-3.0, -0.1, 10.0);
fPyramidSide3[2] = new Array(-10.0, 5.0, 10.0);
fPyramidSide3[3] = new Array(-10.0, 5.0, 8.0);
rdface.Create(1, 1, 2, fPyramidSide3);

var fPyramidSide4 = new Array();
fPyramidSide4[0] = new Array(-10.0, 5.0, 10.0);
fPyramidSide4[1] = new Array(-10.0, 5.0, 8.0);
fPyramidSide4[2] = new Array(3.0, -0.1, 8.0);
fPyramidSide4[3] = new Array(3.0, -0.1, 10.0);
rdface.Create(1, 1, 2, fPyramidSide4);

// 创建IFace
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 模型与材料设置
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e9, 0.25, 3e3, 1e3, 10, 10);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIStiffByElem(0.5);
blkdyn.SetIStrengthByElem();

// 局部阻尼
blkdyn.SetLocalDamp(0.01);

// 固定底面
blkdyn.FixV("z", 0, "z", 0.0);

// 导出监测数据
var monitor = new Array();
monitor[0] = new Array("Elem_ID", "Elem_Velocity");
monitor[1] = new Array("Elem_ID", "Elem_Acceleration");
monitor[2] = new Array("Elem_ID", "Elem_Force");

// 求解
dyna.Solve(30000);
