setCurDir(getSrcDir());

// ========== 1. 初始化仿真环境 ==========
dyna.Set("Mechanic_Cal 1");
dyna.Set("Config_Heat 1");
dyna.Set("Heat_Cal 1");
dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 500");
dyna.Set("Large_Displace 0");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Contact_Detect_Tol 0.001");

// ========== 2. 构建计算网格 ==========
var width = 0.5;
var height = 0.3;
var thickness = 0.1;
igeo.genBrickV(0, 0, 0, width, height, thickness, 1);

imeshing.genMeshByGmsh(3);
blkdyn.GetMesh(imeshing);

// ========== 3. 定义材料参数（热物理+力学） ==========
// 密度、弹性模量、泊松比、抗拉强度、抗压强度、初始温度
blkdyn.SetMat(2500, 6.5e9, 0.25, 1e6, 3e6, 20.0);

// 热传导材料参数：密度、初始温度、热导率、比热容、体膨胀系数
heatcd.SetPropByGroup(2500.0, 20.0, 2.5, 840, 1e-5, 1);

// ========== 4. 设置初始温度场（内部高温，表面低温） ==========
heatcd.SetNodeValue("temp", 300.0, [0, 0, 0], width - 0.001, height - 0.001, thickness - 0.001);

// ========== 5. 施加冷却边界条件（表面对流换热） ==========
heatcd.ApplyConditionByCoord("conv", 25.0, [0, 0, 0], width, height, thickness, 1);
heatcd.ApplyConditionByCoord("temp", 20.0, [0, 0, 0], width - 0.001, height - 0.001, thickness - 0.001, false);

// ========== 6. 配置接触定义（处理裂纹扩展分离） ==========
blkdyn.CrtIFace(1, 1);
blkdyn.UpdateIFaceMesh();
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(9e9, 9e9, 30, 3e6, 3e6, 1);

// ========== 7. 激活热应力耦合参数 ==========
blkdyn.SetLocalDamp(0.05);
blkdyn.SetIStiffByElem(1.0);

// ========== 8. 设置边界约束 ==========
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", width - 1e-3, width + 1e-3);

// ========== 9. 设置求解参数 ==========
dyna.Set("Time_Step 1e-5");
dyna.Set("UnBalance_Ratio 1e-4");

// ========== 10. 设置监测输出（裂纹扩展监测） ==========
dyna.Monitor("blkdyn", "sc_dmg", 5, 5, 0);
dyna.Monitor("blkdyn", "sc_stress", 5, 5, 0);

// ========== 11. 求解计算 ==========
dyna.Solve(20000);

// ========== 12. 后处理输出 ==========
print("***** 裂纹扩展模拟完成 *****");
print("温度场与应力耦合计算结束");
