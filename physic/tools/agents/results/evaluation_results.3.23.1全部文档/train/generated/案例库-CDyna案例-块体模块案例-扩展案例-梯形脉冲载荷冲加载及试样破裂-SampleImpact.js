setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 设置全局参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 0.0 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Renew_Interval 100");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("If_Renew_Contact 1");
dyna.Set("If_Cal_EE_Contact 1");
dyna.Set("Config_Crack_Show 1");

// 创建试样几何（立方体）
var point1 = igeo.GeneratePoint([0, 0, 0]);
var point2 = igeo.GeneratePoint([0.1, 0, 0]);
var point3 = igeo.GeneratePoint([0, 0.1, 0]);
var point4 = igeo.GeneratePoint([0.1, 0.1, 0]);
var point5 = igeo.GeneratePoint([0, 0, 0.1]);
var point6 = igeo.GeneratePoint([0.1, 0, 0.1]);
var point7 = igeo.GeneratePoint([0, 0.1, 0.1]);
var point8 = igeo.GeneratePoint([0.1, 0.1, 0.1]);

// 创建试样表面
var face1 = igeo.GenerateFace([point1, point2, point3, point4]);
var face2 = igeo.GenerateFace([point5, point6, point7, point8]);
var face3 = igeo.GenerateFace([face1, face2]);

// 创建冲击体几何（圆柱体）
var cylinderBase = igeo.genCircle(0.05, 0, 0, 0.02, 0.01);
var cylinderTop = igeo.genCircle(0.05, 0, 0.05, 0.02, 0.01);
var impactorFace = igeo.GenerateSurface([cylinderBase, cylinderTop], 1);

// 导入网格
blkdyn.ImportGrid("gmsh", "GDEMNew.msh");
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置模型类型
blkdyn.SetModel("linear");

// 设置试样材料参数（密度、弹性模量、泊松比、抗拉强度、抗压强度、粘聚力、内摩擦角）
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30.0, 10.0);

// 设置冲击体材料参数（高密度高模量刚性体）
blkdyn.SetMat(7800, 2e11, 0.3, 1e9, 1e9, 0.0, 0.0, 2);

// 设置接触面模型为脆性断裂Mohr-Coulomb本构
blkdyn.SetIModel("SSMC");

// 设置接触面刚度（单位面积法向/切向刚度）
blkdyn.SetIStiffByElem(50.0);

// 设置接触面强度参数（粘聚力、抗拉强度等）
blkdyn.SetIStrengthByElem();

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 设置梯形脉冲载荷函数
var trapezoidalPulse = new Array(0, 0, 0, 1e8, 0.005, 0.01, 1e8, 0.02, 0);
blkdyn.SetLoadFunc("trapezoidal", trapezoidalPulse);

// 应用冲击载荷到冲击体底部表面
var loadDir = new Array(0, 0, -1);
blkdyn.ApplyConditionByCylinder("face_force", loadDir, [0, 0, 0], 0, 0, -1, 0, 0, 1, 0.19, 0.21, true);

// 设置边界条件（试样底部固定）
blkdyn.FixV("xy", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("xy", 0.0, "y", -0.001, 0.001);

// 设置应力监测点（试样内部）
dyna.Monitor("block", "syy", 0.005, 0.025, 0);
dyna.Monitor("block", "syy", 0.010, 0.025, 0);
dyna.Monitor("block", "syy", 0.015, 0.025, 0);
dyna.Monitor("block", "syy", 0.020, 0.025, 0);

// 设置全局监测变量
dyna.Monitor("gvalue", "gv_spring_broken_ratio");
dyna.Monitor("gvalue", "gv_spring_crack_ratio");
dyna.Monitor("gvalue", "gv_block_strain_energy");
dyna.Monitor("gvalue", "gv_block_kinetic_energy");
dyna.Monitor("gvalue", "gv_contact_strain_energy");

// 设置接触面参数随机化（可选，用于不确定性分析）
blkdyn.RandomizeIMat("cohesion", 0.8, 1.2);
blkdyn.RandomizeIMat("tension", 0.9, 1.1);

// 求解计算
dyna.Solve(3000);

// 输出破裂块度信息
blkdyn.ExportGradationCurveByGroup(1, 1);

// 导出结果文件
doc.ExportResult();
