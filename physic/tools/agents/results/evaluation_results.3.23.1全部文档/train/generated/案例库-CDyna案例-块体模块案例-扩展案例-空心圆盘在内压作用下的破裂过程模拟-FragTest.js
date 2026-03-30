setCurDir(getSrcDir());

// 清理环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ========== 1. 定义空心圆盘几何模型 ==========
var id_inner = igeo.genCircle(0, 0, 0, 0.2, 0.02); // 内圆半径0.2m，厚度0.02m
var id_outer = igeo.genCircle(0, 0, 0, 1.0, 0.05); // 外圆半径1.0m，厚度0.05m

// 生成空心圆盘表面（组号1为内圈，组号2为外圈）
var id_surface = igeo.genSurface([id_inner, id_outer], 1);

// ========== 2. 网格划分 ==========
imeshing.genMeshByGmsh(2);

// 获取网格
blkdyn.GetMesh(imeshing);

// 创建接触面并更新
blkdyn.CrtIFace(1, 2);
blkdyn.UpdateIFaceMesh();

// ========== 3. 设置仿真参数 ==========
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 500");
dyna.Set("Virtural_Step 0.3");
dyna.Set("UnBalance_Ratio 1e-4");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("If_Find_Contact_OBT 1");

// 包含裂隙渗流计算模块
dyna.Set("Config_FracSeepage 1");
dyna.Set("FracSeepage_Cal 1");
dyna.Set("FS_Solid_Interaction 1");

// ========== 4. 材料设置 ==========
blkdyn.SetModel("MC");
blkdyn.SetMatByGroup(2500, 6.5e9, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 接触面本构设置
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(9e9, 9e9, 30, 3e6, 3e6, 1);
blkdyn.SetIStiffByElem(1.0);

// 局部阻尼系数
blkdyn.SetLocalDamp(0.6);

// ========== 5. 裂隙渗流参数设置 ==========
fracsp.CreateGridFromBlock(2);

// 设置裂隙渗流基本参数：密度、体积模量、渗透系数、初始开度、组号范围
fracsp.SetPropByGroup(1000.0, 1e7, 1e-14, 1e-8, 1, blkdyn.GetElemCount());

// ========== 6. 初始化内压条件 ==========
// 使用 InitConditionByCylinder 在空心圆柱体内施加初始压力
var pressure = -1e8; // -100MPa 内压（负值表示拉应力）
InitConditionByCylinder("face_force", [0, 0, pressure],
                        [0, 0, 0, 0, 0, 0, 0, 0, 0],
                        0, 0, -1, 0, 0, 1, 0.19, 0.21, true);

// ========== 7. 设置吕荣参数（裂隙传播参数） ==========
SetLvRongProp(5e-3, 1, blkdyn.GetElemCount()); // 吕荣参数u=5e-3 kg，组号范围

// ========== 8. 设置时间步长和总时长 ==========
dyna.TimeStepCorrect(0.5);
dyna.DynaCycle(3e-3); // 总时长3秒

// ========== 9. 设置边界条件（固定外圆） ==========
blkdyn.FixV("x", 0, "x", -1.0, 1.0);
blkdyn.FixV("y", 0, "y", -1.0, 1.0);

// ========== 10. 设置监测点（关键应力位置） ==========
// 在圆盘中心区域设置主应力监测
var center_x = 0;
var center_y = 0;
var center_z = 0;

dyna.Monitor("block", "principal_stress_max", center_x, center_y, center_z);
dyna.Monitor("block", "principal_stress_min", center_x, center_y, center_z);
dyna.Monitor("block", "xdis", center_x, center_y, center_z);
dyna.Monitor("block", "ydis", center_x, center_y, center_z);

// ========== 11. 执行求解器 ==========
dyna.Solve(3000);

// ========== 12. 生成碎片统计分布（Mott分布） ==========
// 密度、破片数量、u值、起始质量、质量步长、组号范围
pfly.GenFragments(2500, 2000, 5e-3, 0.5e-3, 0.5e-3, 1, blkdyn.GetElemCount());

// ========== 13. 导出结果 ==========
blkdyn.ExportGradationCurveByGroup(1, 1); // 导出块度分布曲线
