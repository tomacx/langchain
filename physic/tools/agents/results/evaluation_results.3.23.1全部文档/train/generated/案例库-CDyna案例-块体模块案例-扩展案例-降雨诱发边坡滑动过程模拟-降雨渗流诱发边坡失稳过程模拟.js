setCurDir(getSrcDir());

// 清理环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ==================== 1. 创建边坡几何模型 ====================
var acoord = new Array(6);
var size = 1.0;
acoord[0] = [0, 0, 0, size];
acoord[1] = [40, 0, 0, size];
acoord[2] = [40, 25, 0, size];
acoord[3] = [20, 25, 0, size];
acoord[4] = [10, 10, 0, size];
acoord[5] = [0, 10, 0, size];

igeo.genPloygenS(acoord, 1);

imeshing.genMeshByGmsh(2);

// ==================== 2. 设置求解器基本参数 ====================
dyna.Set("Output_Interval 1000");
dyna.Set("Gravity 0 -9.8 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 初始关闭孔隙渗流计算（先进行纯力学分析）
dyna.Set("PoreSeepage_Cal 0");

blkdyn.GetMesh(imeshing);

blkdyn.SetModel("linear");
blkdyn.SetMat(2200, 1e9, 0.3, 2e4, 2e4, 25, 15);

// ==================== 3. 设置孔隙渗流材料参数 ====================
// 定义X、Y、Z三个方向的渗透系数（各向同性）
var arrayK = new Array(1e-4, 1e-4, 1e-4);

// 指定坐标控制范围内的孔隙渗流参数
// 依次为：流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// ==================== 4. 设置边界条件（固定） ====================
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", 39.99, 41);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

// ==================== 5. 设置监测点 ====================
dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 14.2, 16.3, 0);
dyna.Monitor("block", "xdis", 20, 25, 0);

// ==================== 6. 第一阶段：初始力学平衡分析 ====================
dyna.Solve();

// ==================== 7. 设置软化参数并重新分析 ====================
blkdyn.SetModel("SoftenMC");
dyna.Set("Block_Soften_Value 3e-3 9e-3");
dyna.Solve();

// ==================== 8. 初始化渗流场条件（初始地下水位） ====================
blkdyn.InitConditionByGroup("displace", [0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 1, 1);

// ==================== 9. 开启孔隙渗流计算 ====================
dyna.Set("PoreSeepage_Cal 1");
dyna.Set("If_Biot_Cal 1");
dyna.Set("Time_Now 0");
dyna.TimeStepCorrect(1.0);

// ==================== 10. 设置降雨边界条件（动态施加） ====================
// 初始地下水位压力（Pa）
var initialWaterPressure = 2.156e5;
poresp.ApplyConditionByCoord("pp", initialWaterPressure, [0, -9800, 0], -100, 40, 0, 40, 25);

// ==================== 11. 设置降雨强度（动态更新） ====================
// 峰值降雨强度：50mm/12小时 ≈ 4.17e-6 m/s
var rainfallRate = 4.17e-6;

// 在表面节点施加降雨边界条件（通过法向矢量）
poresp.ApplyDynaBoundCondition("rain", [0, 1, 0], rainfallRate);

// ==================== 12. 执行时间步循环计算 ====================
var totalSteps = 5000;
var stepSize = 1.0;

for (var i = 0; i < totalSteps; i++) {
    // 动态更新降雨边界条件（模拟降雨过程）
    poresp.CalDynaBound();

    // 计算节点压力及饱和度
    poresp.CalNodePressure();

    // 计算与固体破裂的耦合
    poresp.CalIntSolid();

    // 求解器迭代
    dyna.Solve(stepSize);
}

// ==================== 13. 提取结果数据 ====================
var resultData = [];
for (var j = 0; j < totalSteps; j++) {
    var nodeVal = poresp.GetNodeValue(10, 10, 0, "pp");
    var satVal = poresp.GetNodeValue(10, 10, 0, "sat");
    resultData.push({step: j, pressure: nodeVal, saturation: satVal});
}

// ==================== 14. 输出最终报告 ====================
doc.WriteResult("slope_stability_report.txt", resultData);
doc.WriteResult("displacement_curve.dat", dyna.GetMonitorData());

dyna.FreeUDF();
