setCurDir(getSrcDir());

// ==================== 1. 初始化环境 ====================
dyna.Set("Mechanic_Cal", "1");
dyna.Set("UnBalance_Ratio", "1e-5");
dyna.Set("Gravity", "0 -9.8 0");
dyna.Set("Large_Displace", "1");
dyna.Set("Output_Interval", "200");
dyna.Set("Monitor_Iter", "100");
dyna.Set("If_Virtural_Mass", "0");
dyna.Set("Virtural_Step", "0.5");
dyna.Set("If_Find_Contact_OBT", "1");
dyna.Set("Contact_Detect_Tol", "0.00");
dyna.Set("Block_Soften_Value", "1e-5 3e-5");
dyna.Set("If_Renew_Contact", "0");
dyna.Set("SaveFile_Out", "1");

// ==================== 2. 创建半圆盘几何 ====================
// 使用 genCircle 创建外圆（半径0.1m）和切槽内圆（半径0.05m）
var outerLoop = igeo.genCircle(0, 0, 0, 0.1, 0.005);
var innerLoop = igeo.genCircle(0, 0, 0, 0.05, 0.005);

// 创建圆环面（半圆盘）
var diskSurface = igeo.genSurface([outerLoop, innerLoop], 1);

// 生成网格
imeshing.genMeshByGmsh(2);

// 获取网格
var msh = imeshing.getMesh();
blkdyn.GetMesh(msh);

// ==================== 3. 创建切槽几何 ====================
// 在圆盘上创建切槽（通过切割交界面实现）
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// ==================== 4. 设置材料属性 ====================
// 半圆盘材料参数：密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘聚力
blkdyn.SetModel("linear");
blkdyn.SetMatByGroup(1, 2500, 3e10, 0.25, 1e6, 1e6, 30, 10, 1);

// ==================== 5. 设置交界面模型 ====================
// 设置交界面为断裂模型
blkdyn.SetIModel("FracE");
blkdyn.SetIMat(1e14, 1e14, 40, 10e6, 5e6);

// ==================== 6. 创建撞击体 ====================
// 创建撞击体圆盘（半径0.03m）
var impactorLoop = igeo.genCircle(0, 0, 0.02, 0.03, 0.005);
var impactorSurface = igeo.genSurface([impactorLoop], 2);

// 生成撞击体网格
imeshing.genMeshByGmsh(3);
var mshImpactor = imeshing.getMesh();
blkdyn.GetMesh(mshImpactor);

// 设置撞击体材料
blkdyn.SetMatByGroup(2, 2500, 3e10, 0.25, 1e6, 1e6, 30, 10, 1);

// ==================== 7. 施加边界条件 ====================
// 固定半圆盘底部（Z=0平面）
blkdyn.FixV("xyz", "z", -0.05, 0.05, 0, 0, 0);
blkdyn.FixV("xyz", "x", -0.1, 0.1, -0.05, 0.05, 0);
blkdyn.FixV("xyz", "y", -0.1, 0.1, -0.05, 0.05, 0);

// ==================== 8. 设置撞击体初始速度 ====================
// 给撞击体施加向下的初始速度（模拟冲击）
blkdyn.ApplyVelocityByGroup(2, [0, 0, -50]);

// ==================== 9. 设置接触对 ====================
// 自动检测接触
dyna.Set("If_Find_Contact_OBT", "1");

// ==================== 10. 设置监测输出 ====================
// 监测半圆盘中心点位移
dyna.Monitor("block", "xdis", 0, 0, 0);
dyna.Monitor("block", "ydis", 0, 0, 0);
dyna.Monitor("block", "zdis", 0, 0, 0);

// 监测应力
dyna.Monitor("block", "sx", 0, 0, 0);
dyna.Monitor("block", "sy", 0, 0, 0);
dyna.Monitor("block", "sz", 0, 0, 0);

// 监测能量
dyna.Monitor("gvalue", "gv_block_strain_energy");
dyna.Monitor("gvalue", "gv_block_kinetic_energy");
dyna.Monitor("gvalue", "gv_block_gravity_energy");

// ==================== 11. 执行求解 ====================
// 设置计算时间步（根据冲击速度估算，约0.01s）
dyna.TimeStepCorrect(0.5);
dyna.Solve(3000);

// ==================== 12. 输出结果 ====================
blkdyn.ExportGradationCurveByGroup(1, 1);
