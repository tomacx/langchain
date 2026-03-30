setCurDir(getSrcDir());

// 清理环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ========== 1. 几何模型：一维杆件 ==========
var length = 1.0;      // 杆件长度 (m)
var area = 0.01;       // 横截面积 (m^2)
var fsize = 0.005;     // 网格尺寸

// 生成一维杆件（使用两个立方体模拟一维杆）
igeo.genBrickV(0, 0, 0, length * 0.1, area, area, fsize, 1);
igeo.genBrickV(length * 0.9, 0, 0, length * 0.1, area, area, fsize, 1);

// ========== 2. 网格划分 ==========
imeshing.genMeshByGmsh(3);

// ========== 3. 全局设置 ==========
dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 1000");
dyna.Set("Mechanic_Cal 1");      // 开启力学计算以获取热应力
dyna.Set("Config_Heat 1");       // 包含热传导计算模块
dyna.Set("Heat_Cal 1");          // 开启热传导计算
dyna.Set("If_Contact_Transf_Heat 1"); // 启用接触面热量传递

// ========== 4. 材料属性设置 ==========
// 力学材料参数：密度、弹性模量、泊松比、屈服强度等
blkdyn.SetModel("linear");
blkdyn.SetMat(7800, 2.1e11, 0.25, 500e6, 500e6, 0, 0);

// 热传导材料参数：密度、初始温度、热导率、比热容、体膨胀系数
heatcd.SetPropByGroup(7800.0, 20.0, 3.125, 1000, 3e-5, 1);
heatcd.SetPropByGroup(7800.0, 20.0, 3.125, 1000, 3e-5, 2);

// ========== 5. 边界条件：温度载荷 ==========
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 左端施加初始温度 40°C
heatcd.ApplyConditionByCoord("temp", 40.0, fArrayGrad, -100, 100, -100, 100, -100, 100, false);

// 右端施加随时间升高的温度载荷（通过求解器循环实现）
heatcd.ApplyConditionByCoord("temp", 80.0, fArrayGrad, length - 1e-3, length + 1e-3, -100, 100, -100, 100, false);

// ========== 6. 力学约束 ==========
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);   // 左端固定 X 方向
blkdyn.FixV("x", 0.0, "x", length - 1e-3, length + 1e-3); // 右端固定 X 方向

// ========== 7. 网格获取 ==========
blkdyn.GetMesh(imeshing);

// ========== 8. 热传导求解器初始化 ==========
var unbal = heatcd.Solver();

// ========== 9. 设置时间步长与求解步数 ==========
dyna.Set("Time_Step 0.01");
var totalSteps = 5000;

// ========== 10. 循环计算与监测 ==========
for (var step = 0; step < totalSteps; step++) {
    // 调用热传导单元热流速计算
    heatcd.CalElemHeatTransfer();

    // 调用节点温度增量稳定性评估
    var tempUnbal = heatcd.CalNodeTemperature();

    // 监测节点温度（在杆件中间位置）
    dyna.Monitor("block", "temperature", length * 0.5, 0, 0);

    // 输出当前步信息
    if (step % 1000 === 0) {
        print("Step: " + step + ", TempUnbal: " + tempUnbal);
    }
}

// ========== 11. 求解并输出结果 ==========
dyna.Solve(totalSteps);

print("**************************************");
print("热应力-温度耦合仿真完成");
print("**************************************");
