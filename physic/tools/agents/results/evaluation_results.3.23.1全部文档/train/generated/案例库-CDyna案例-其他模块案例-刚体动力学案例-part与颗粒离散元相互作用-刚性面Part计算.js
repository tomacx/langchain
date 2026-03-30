setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
imeshing.clear();

// 求解器控制参数设置
dyna.Set("Time_Step 1e-3");
dyna.Set("Output_Interval 100");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Gravity 0 0 -9.8");
dyna.Set("Contact_Detect_Tol 3e-3");

// 创建刚性面几何（示例：创建一个矩形板作为刚性面）
var fCoord = new Array();
fCoord[0] = new Array(-1, -1, 0);
fCoord[1] = new Array(1, -1, 0);
fCoord[2] = new Array(1, 1, 0);
fCoord[3] = new Array(-1, 1, 0);

// 导入刚性面模型（或根据几何创建）
rdface.Import("gid", "GidGrp.msh");

// 自动创建刚体部件
var nTotal = rdface.CrtPartAuto("geo");

// 设置刚体部件属性（密度、质心坐标、转动惯量等）
rdface.SetPartProp(8910, [0.5, 0.5, 0], [0, 0, 0], "rigid_plate");

// 设置刚性面局部阻尼
rdface.SetPartLocalDamp(0.01, 0.01);

// 创建颗粒体系（在刚性面上方生成）
var xRange = [-0.5, 0.5];
var yRange = [-0.5, 0.5];
var zRange = [0.02, 0.4];

pdyna.CreateByCoord(1000, 2, 2, 0.01, 0.01, 0.01, xRange, yRange, zRange);

// 设置颗粒本构模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼）
pdyna.SetMat(2500, 1e8, 0.25, 0, 0, 30, 0.01, 0);

// 设置颗粒与刚性面接触参数（法向刚度、切向刚度、摩擦角等）
dyna.Set("If_Search_PBContact_Adavance 1");

// 设置监测变量：刚体部件速度、位移
dyna.Monitor("rdface", "rg_PartVelZ", nTotal, 0, 0);
dyna.Monitor("rdface", "rg_PartDisZ", nTotal, 0, 0);

// 设置颗粒位置监测
dyna.Monitor("pdyna", "rg_NodeDisX", 1, 0, 0);
dyna.Monitor("pdyna", "rg_NodeDisY", 1, 0, 0);
dyna.Monitor("pdyna", "rg_NodeDisZ", 1, 0, 0);

// 时间步长修正
dyna.TimeStepCorrect(1.0);

// 执行求解（迭代次数根据仿真时长调整）
dyna.Solve(50000);
