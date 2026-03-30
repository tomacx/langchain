setCurDir(getSrcDir());

// ==================== 1. 初始化CDyna仿真环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-4");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 5000");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.6");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 5e-3");

// ==================== 2. 定义反倾岩质边坡几何网格模型参数（60-50规格） ====================
// 创建矩形区域：长60m，高50m，宽20m
var msh1 = imesh.importMidas("RockSlope_60x50.msh");
blkdyn.GetMesh(msh1);

// 组间切割形成接触面（模拟节理）
blkdyn.CrtIFace(1, 2);
blkdyn.UpdateIFaceMesh();

// ==================== 3. 设置岩石基体材料参数 ====================
// 密度(kg/m³), 弹性模量(Pa), 泊松比, 抗拉强度(Pa), 抗压强度(Pa), 摩擦角(度), 粘聚力(Pa)
blkdyn.SetMat(2600, 1e10, 0.25, 3e6, 1e7, 35.0, 1e6, 1, 100);

// ==================== 4. 配置接触面断裂模型（节理破裂） ====================
blkdyn.SetIModel("linear");
blkdyn.SetIMat(1e11, 1e11, 35.0, 8e5, 8e5, -1, -1);

// 设置组间结构面材料参数（节理面）
blkdyn.SetIMat(1e10, 1e10, 25, 5e4, 1e5, -1, -1);

// ==================== 5. 施加地震加速度时程荷载 ====================
// 设置底部边界条件（固定X方向，允许Y方向位移）
blkdyn.FixV("x", 0.0, "x", -1e-2, 1e-2);
blkdyn.FixV("x", 0.0, "x", 59.99, 60.01);
blkdyn.FixV("y", 0.0, "y", -1e-2, 1e-2);

// 设置地震加速度时程（通过用户自定义命令流）
dyna.RunUDFCmd("SetEarthquakeAccel 0.2 0.5");

// ==================== 6. 配置裂隙渗流模块 ====================
dyna.Set("Config_FracSeepage 1");
dyna.Set("FracSeepage_Cal 1");
dyna.Set("FS_Solid_Interaction 1");

// 从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock(2);

// 设置裂隙渗流参数：密度、体积模量、渗透系数、初始开度
fracsp.SetPropByGroup(1000.0, 1e7, 12e-7, 12e-5, 1, 11);

// ==================== 7. 动态施加渗流压力及流量边界条件 ====================
var fracspBound = [0.0, 0.0, 0.0, 0.0]; // 压力边界条件
fracsp.CalDynaBound(fracspBound);

// ==================== 8. 定义关键监测点 ====================
dyna.Monitor("block", "xdis", 30, 30, 0);   // X方向位移监测
dyna.Monitor("block", "ydis", 30, 30, 0);   // Y方向位移监测
dyna.Monitor("block", "stress", 30, 30, 0); // 应力监测
dyna.Monitor("block", "strain", 30, 30, 0); // 应变监测

// ==================== 9. 配置输出文件路径与结果保存参数 ====================
dyna.Set("SaveFile_Out 1");
dyna.Set("Result_File_Path ./output/");

// ==================== 10. 执行求解循环 ====================
// 初始平衡步
dyna.Solve();

// 进入动力学计算循环（模拟地震过程）
var totalSteps = 50000;
var currentStep = 0;

while (currentStep < totalSteps) {
    // 动态施加渗流边界条件（每一步执行）
    fracsp.CalDynaBound(fracspBound);

    // 计算节点压力及饱和度（每一步执行）
    fracsp.CalNodePressure();

    // 计算单元流速、流量（每一步执行）
    fracsp.CalElemDischarge();

    // 计算与固体破裂的耦合（每一步执行）
    fracsp.CalIntSolid();

    // 计算与孔隙渗流的耦合（每一步执行）
    fracsp.CalIntPoreSp();

    currentStep++;
}

// ==================== 11. 导出最终结果 ====================
print("Solution Finished");
print("Rupture process simulation completed successfully.");
