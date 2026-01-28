//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//设置结果的输出间隔为500步
dyna.Set("Output_Interval 1000");

//关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

//设置重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8 ");

//设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");



//设置底部刚性面
rdface.Import("gid", "20m-20m-bound.msh");
dyna.Set("Auto_Put_Data_To_Host 0");

///设置多边形
var Coord = [0,0,1,  1,0,1,  1,1,2,  0,1,2, 0,0,3,  1,0,3,  1,1,3,  0,1,3];
var FaceNodeSum = [4, 4, 4, 4, 4, 4];
var FaceNode = [0,3,2,1, 4,5,6,7, 0,4,7,3, 1,2,6,5, 0,1,5,4, 2,3,7,6];

pdyna.CrtPolyhedronPart(1, Coord, FaceNodeSum, FaceNode, 0.05);

var Coord = [-1,-1,4,1,-1,4,1,1,4,1,-1,6];
var FaceNodeSum = [3, 3, 3, 3];
//var FaceNode = [0,2,1, 0,3,2, 0,1,3, 1,2,3];
var FaceNode = [0,1,2, 0,2,3, 0,3,1, 1,3,2];
pdyna.CrtPolyhedronPart(2, Coord, FaceNodeSum, FaceNode, 0.05);

dyna.Set("Auto_Put_Data_To_Host 1");

var Coord = [2,-2,2,3,-2,2, 2.5,2,2,2.5,0,4];
pdyna.CrtPolyhedronPart(3, Coord, FaceNodeSum, FaceNode, 0.05);

//设置颗粒的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetPartMat(2500, 1e9, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

//设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

dyna.Monitor("particle","pa_zdis", 5,5,5);
dyna.Monitor("particle","pa_zdis", 1,1,1);



//设置动态计算时步为1e-4秒
dyna.Set("Time_Step 2e-4");

dyna.Set("Contact_Detect_Tol 5e-3");

//计算3万步
dyna.Solve(100000);
