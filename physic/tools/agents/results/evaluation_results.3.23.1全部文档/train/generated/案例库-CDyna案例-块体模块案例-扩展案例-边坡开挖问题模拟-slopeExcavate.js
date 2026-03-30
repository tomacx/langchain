setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Clear();
doc.clearResult();

// 设置全局参数
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Output_Interval 10000");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0");

// 创建边坡几何（梯形坡体）
var aCoord = new Array(6);
acoord[0] = [0, 0, 0, 2.0];
acoord[1] = [40, 0, 0, 2.0];
acoord[2] = [40, 25, 0, 2.0];
acoord[3] = [20, 25, 0, 2.0];
acoord[4] = [10, 10, 0, 2.0];
acoord[5] = [0, 10, 0, 2.0];

igeo.genPloygenS(acoord, 1);

// 划分网格
imeshing.genMeshByGmsh(2);

// 获取网格到块体模块
blkdyn.GetMesh(imeshing);

// 设置计算模型为线性弹性
blkdyn.SetModel("linear");

// 设置材料参数（密度、弹性模量、泊松比、粘聚力、内摩擦角）
blkdyn.SetMat(2200, 1e9, 0.3, 2e4, 2e4, 25, 15);

// 设置边界约束（底部和两侧固定）
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", 39.99, 41);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

// 设置监测点（位移监测）
dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 20, 25, 0);

// 执行初始状态求解
dyna.Solve();

// 设置软化模型参数（用于模拟开挖后材料软化）
blkdyn.SetModel("SoftenMC");
blkdyn.SetBlockSofteningValue(3e-3, 9e-3);

// 执行软化阶段求解
dyna.Solve();

// 定义开挖区域（X方向15-25m，Y方向10-20m）
var excaCoord = new Array(4);
excaCoord[0] = [15, 10, 0];
excaCoord[1] = [25, 10, 0];
excaCoord[2] = [25, 20, 0];
excaCoord[3] = [15, 20, 0];

// 创建开挖路径并执行开挖操作
var afPath = new Array(4);
afPath[0] = [15, 10, 0];
afPath[1] = [25, 10, 0];
afPath[2] = [25, 20, 0];
afPath[3] = [15, 20, 0];

imeshing.advExtrude(afPath, 2.0, 1, 0);

// 重新划分网格以适配开挖后的几何
imeshing.genMeshByGmsh(2);
blkdyn.GetMesh(imeshing);

// 设置开挖后材料参数（降低强度模拟软化）
blkdyn.SetMat(2200, 5e8, 0.3, 1e4, 1e4, 20, 10);

// 重新执行求解
dyna.Solve();

// 初始化位移条件（将控制范围内位移清零）
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 执行后续时间步求解
for (var i = 2; i <= 5; i++) {
    blkdyn.SetModel("none", i);
    dyna.Solve();
}

// 导出地形数据（滑床文件）
blkdyn.ExportTerrainData(0.0, 40.0, 0.0, 30.0, 200, 200, "Cdem_zbed.dat");

// 保存结果文件
dyna.Save("SlopeExcavate_Result.sav");
