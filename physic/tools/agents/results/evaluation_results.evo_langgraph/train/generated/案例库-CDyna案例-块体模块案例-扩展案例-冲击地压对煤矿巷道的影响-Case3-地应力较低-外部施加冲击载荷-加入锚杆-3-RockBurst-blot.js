setCurDir(getSrcDir());

// 清除所有模块数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 全局计算设置
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 10");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");

// 打开杆件计算开关
dyna.Set("If_Cal_Bar 1");
dyna.Set("Bar_Out 1");

// 巷道几何建模
var loopid1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);
igeo.genSurface([loopid1, loopid2], 1);
igeo.genSurface([loopid2], 2);

// 生成网格
imeshing.genMeshByGmsh(2);

// 网格导入BlockDyna
blkdyn.GetMesh(imeshing);

// 创建接触面
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 单元本构设置
blkdyn.SetModel("linear");
blkdyn.SetIModel("linear");

// 锚杆材料参数设置（11个分量）
var barvars = new Array(0.01, 7850, 2e11, 0.3, 150e6, 150e6, 1e8, 10.0, 1e10, 0.05, 0.0);
bar.SetPropByGroup(barvars, 1, 10);

// 岩石材料参数设置
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 锚杆接触面参数设置
blkdyn.SetIMat(1e11, 1e11, 35.0, 1e8, 1e8);

// 接触面断裂能设置
blkdyn.SetIFracEnergyByGroupInterface(0.0, 0.0, 1, 1);

// 设置锚杆单元参数
var barGroup = [1, 10];
bar.SetPropByCoord(barvars, 1, 10);

// 边界条件设置
blkdyn.SetFreeFieldBound3DColumn();

// 施加冲击波载荷（炸药质量，爆心坐标，起爆时间，声速，衰减指数，坐标范围）
blkdyn.ApplyShockWaveByCoord(10.0, [5.0, 5.0, 0.0], 0.01, 340.0, 1.2, 20.0, 20.0, -1, 21.0, 0.0, 21.0);

// 设置地应力
blkdyn.SetStress([2e6, 2e6, 1e6]);

// 设置监测点
var monitorPoints = new Array([0, 1, 0], [10, 10, 0], [0, 10, 0], [10, 0, 0], [15, 5, 0], [5, 5, 0]);
for (var i = 0; i < monitorPoints.length; i++) {
    dyna.Monitor("bloc", monitorPoints[i][0], monitorPoints[i][1], monitorPoints[i][2]);
}

// 求解器设置
dyna.Set("SOLVER 1");
dyna.Set("NumTimeStep 1e-7");

// 运行计算
dyna.Run();
