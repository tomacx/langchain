setCurDir(getSrcDir());

// 设置结果输出间隔
dyna.Set("Output_Interval 1000");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置重力加速度 (x, y, z)
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");

// 设置底部刚性面
var fCoord = [-1.0, 0.0, 0.0, 1.0, 0.0, 0.0];
rdface.Create(1, 1, 2, fCoord);

var fCoord2 = [-1.0, 0.0, 0.0, -1.0, 1.0, 0.0];
var fCoord3 = [1.0, 0.0, 0.0, 1.0, 1.0, 0.0];
rdface.Create(1, 1, 2, fCoord2);
rdface.Create(1, 1, 2, fCoord3);

// 创建第一个多面体颗粒 (立方体形状)
var Coord1 = [0, 0, 0.5, 1, 0, 0.5, 1, 1, 0.5, 0, 1, 0.5];
var FaceNodeSum1 = [4, 4, 4, 4];
var FaceNode1 = [0, 3, 2, 1, 4, 7, 6, 5, 0, 4, 7, 3, 1, 2, 6, 5];
pdyna.CrtPolyhedronPart(1, Coord1, FaceNodeSum1, FaceNode1, 0.05);

// 创建第二个多面体颗粒 (四面体形状)
var Coord2 = [-1, -1, 4, 1, -1, 4, 1, 1, 4, 1, -1, 6];
var FaceNodeSum2 = [3, 3, 3, 3];
var FaceNode2 = [0, 1, 2, 0, 2, 3, 0, 3, 1, 1, 3, 2];
pdyna.CrtPolyhedronPart(2, Coord2, FaceNodeSum2, FaceNode2, 0.05);

// 创建第三个多面体颗粒 (不规则形状)
var Coord3 = [2, -2, 2, 3, -2, 2, 2.5, 2, 2, 2.5, 0, 4];
pdyna.CrtPolyhedronPart(3, Coord3, FaceNodeSum1, FaceNode1, 0.05);

// 设置颗粒材料参数 (密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部平动阻尼、局部转动阻尼、粘性阻尼系数)
pdyna.SetPartMat(2500, 1e9, 0.25, 1e6, 5e6, 30, 0.01, 0.1, 0.1);

// 设置颗粒接触模型为考虑应变软化的Mohr-Coulomb模型
pdyna.SetModel("brittleMC");

// 设置动态计算时步
dyna.Set("Time_Step 2e-4");

// 设置自动输出数据到主机
dyna.Set("Auto_Put_Data_To_Host 1");

// 监测颗粒位移历史数据
dyna.Monitor("particle", "pa_zdis", 5, 5, 5);
dyna.Monitor("particle", "pa_zdis", 1, 1, 1);

// 启动求解器计算
dyna.Solve(100000);

// 释放动态链接库
dyna.FreeUDF();
