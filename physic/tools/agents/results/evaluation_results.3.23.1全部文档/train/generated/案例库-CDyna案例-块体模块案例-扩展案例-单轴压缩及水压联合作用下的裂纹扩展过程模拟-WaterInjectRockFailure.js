setCurDir(getSrcDir());

// ==================== 初始化环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 0.0 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.3");
dyna.Set("UnBalance_Ratio 1e-4");
dyna.Set("If_Renew_Contact 0");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("If_Find_Contact_OBT 1");

// ==================== 裂隙渗流模块初始化 ====================
dyna.Set("Config_FracSeepage 1");
dyna.Set("FracSeepage_Cal 1");
dyna.Set("FS_Solid_Interaction 1");
dyna.Set("SimpleFSI 1");
dyna.Set("FS_Frac_Start_Cal 1");

// ==================== 创建几何模型 ====================
var faceid = igeo.genRectS(0, 0, 0, 2.0, 2.0, 0, 0.2, 1);

// 设置硬线用于加水压（水位面）
var pid1 = igeo.genPoint(1.0, 1.0, 0.0, 0.1);
var pid2 = igeo.genPoint(1.0, 1.0, 0.2, 0.1);
var lid = igeo.genLine(pid1, pid2);
igeo.setHardLineToFace(lid, faceid);

// 设置硬线用于天然裂隙（预设裂纹）
var pid3 = igeo.genPoint(0.5, 1.0, 0.0, 0.1);
var pid4 = igeo.genPoint(1.5, 1.0, 0.0, 0.1);
var lid2 = igeo.genLine(pid3, pid4);
igeo.setHardLineToFace(lid2, faceid);

// ==================== 网格划分 ====================
var msh1 = imesh.importGmsh("1.msh");
blkdyn.GetMesh(msh1);

// 更新接触面网格
blkdyn.CrtIFace(1, 1);
blkdyn.UpdateIFaceMesh();

// ==================== 材料属性设置 ====================
// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("MC");

// 岩体材料参数：弹性模量、泊松比、密度等
blkdyn.SetMatByGroup(2500, 6.5e9, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("brittleMC");

// 接触面刚度需要为块体刚度的1-10倍
blkdyn.SetIMat(9e9, 9e9, 30, 3e6, 3e6, 1);

// 设定全部节点的局部阻尼系数
blkdyn.SetLocalDamp(0.8);

// ==================== 裂隙单元创建与渗流参数设置 ====================
// 从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock(2);

// 设置裂隙渗流参数：密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e7, 1e-14, 1e-8, 1, 1);

// ==================== 水位坐标设置（用于SimpleFSI计算水压力） ====================
// 水位面坐标 (X, Y, Z)
dyna.Set("SimpleFSI_2 0.0");
dyna.Set("SimpleFSI_3 0.0");
dyna.Set("SimpleFSI_4 0.2");

// 水底面坐标 (X, Y, Z)
dyna.Set("SimpleFSI_5 0.0");
dyna.Set("SimpleFSI_6 0.0");
dyna.Set("SimpleFSI_7 0.0");

// ==================== 边界条件设置（单轴压缩） ====================
// 顶部施加压缩位移
blkdyn.ApplyDisplacementByFace(1, 0, 0, -0.01);

// 底部固定约束
blkdyn.ApplyConstraintByFace(2, 0, 0, 0, 0, 0);

// ==================== 裂隙单元连接 ====================
fracsp.ElemConnection();

// ==================== 输出监测设置 ====================
// 监测固体应力分布
dyna.Monitor("solid", "sc_stress", 5, 5, 0);

// 监测位移
dyna.Monitor("solid", "sc_displacement", 5, 5, 0);

// 监测裂隙开度
dyna.Monitor("fracsp", "sc_aperture", 5, 5, 0);

// 监测渗流压力
dyna.Monitor("fracsp", "sc_pp", 5, 5, 0);

// 监测流量
dyna.Monitor("fracsp", "sc_discharge", 5, 5, 0);

// ==================== 求解设置 ====================
// 自动计算时步
dyna.TimeStepCorrect();

// 设置时间步长
dyna.Set("Time_Step 0.01");

// 求解（根据收敛情况调整步数）
dyna.Solve(50000);

// ==================== 完成提示 ====================
print("Solution Finished");
