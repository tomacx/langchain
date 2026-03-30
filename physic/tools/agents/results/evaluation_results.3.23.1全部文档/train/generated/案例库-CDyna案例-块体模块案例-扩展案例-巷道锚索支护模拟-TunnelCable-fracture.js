setCurDir(getSrcDir());

// ========== 1. 初始化仿真环境 ==========
dyna.Set("Mechanic_Cal 1");
dyna.Set("If_Cal_Bar 1");
dyna.Set("Bar_Out 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");

// ========== 2. 创建巷道围岩块体网格 ==========
var loopid1 = igeo.genRect(0, 0, 0, 30, 20, 0, 1.0);
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);
igeo.genSurface([loopid1, loopid2], 1);
igeo.genSurface([loopid2], 2);

imeshing.genMeshByGmsh(2);

blkdyn.GetMesh(imeshing);
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// ========== 3. 定义围岩材料属性参数 ==========
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e4, 1e4, 25.0, 10.0, 1);

// ========== 4. 插入锚索支护单元 ==========
var fArrayCoord1 = [14, 13, 0];
var fArrayCoord2 = [14, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

var fArrayCoord3 = [15, 13, 0];
var fArrayCoord4 = [15, 18, 0];
bar.CreateByCoord("cable", fArrayCoord3, fArrayCoord4, 20);

var fArrayCoord5 = [16, 13, 0];
var fArrayCoord6 = [16, 18, 0];
bar.CreateByCoord("cable", fArrayCoord5, fArrayCoord6, 20);

// ========== 5. 施加开挖边界条件及初始应力场 ==========
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 29.99, 30.01);

// 初始地应力场（模拟水平应力）
blkdyn.InitConditionByCoord("stress", [0, 0, 0], [1e6, 1e6, 0], 0, 0, 0, 30, 20);

// ========== 6. 设置裂隙渗流参数 ==========
fracsp.SetPropByCoord(1e-12, 1e7, 0.5, [0, 0, 0], [30, 20, 0]);
fracsp.SetPropByGroup(1e-12, 1e7, 0.5);

// ========== 7. 配置监测点 ==========
dyna.Monitor("block", "syy", 15, 13, 0);
dyna.Monitor("block", "syy", 15, 16, 0);
dyna.Monitor("block", "syy", 15, 19, 0);
dyna.Monitor("cable", "strain", 1, 0);
dyna.Monitor("cable", "strain", 2, 0);
dyna.Monitor("cable", "strain", 3, 0);

// ========== 8. 动态渗流边界条件设置 ==========
fracsp.CalDynaBound();
fracsp.CalNodePressure();
fracsp.CalElemDischarge();
fracsp.CalIntSolid();

// ========== 9. 配置求解器参数 ==========
dyna.Set("Solver_Type 1");
dyna.Set("Max_Iter 1000");
dyna.Set("Converge_Tol 1e-6");

// ========== 10. 执行仿真循环并输出结果 ==========
var step = 0;
while (step < 5000) {
    blkdyn.Solve();
    fracsp.Solver();
    step++;
}

blkdyn.ExportResult("result.dat");
fracsp.ExportResult("fracture_flow.dat");
