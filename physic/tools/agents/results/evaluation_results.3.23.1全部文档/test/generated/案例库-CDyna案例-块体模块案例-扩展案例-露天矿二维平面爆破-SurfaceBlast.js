setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 10");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");
dyna.Set("UnBalance_Ratio 1e-2");
dyna.Set("If_Cal_EE_Contact 1");

// ==================== 2. 清除旧数据 ====================
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// ==================== 3. 几何建模 - 创建露天矿模型 ====================
var ModelL = 60.0;   // 模型长度(m)
var ModelH = 40.0;   // 模型高度(m)
var CaveL = 20.0;    // 采空区长度(m)
var CaveH = 15.0;    // 采空区高度(m)
var BaseH = 8.0;     // 基础高度(m)

// 创建外边界矩形环（左侧）
var iloop1 = igeo.genRect(-ModelL * 0.5, 0, 0, ModelL * 0.5, ModelH, 0, 2.0);

// 创建采空区边界矩形环
var iloop2 = igeo.genRect(-CaveL * 0.5, BaseH, 0, CaveL * 0.5, BaseH + CaveH, 0, 1.5);

// 创建表面网格（包含采空区）
igeo.genSurface([iloop1, iloop2], 1);

// ==================== 4. 生成二维网格 ====================
imeshing.genMeshByGmsh(2);

// ==================== 5. 获取网格到块体模块 ====================
blkdyn.GetMesh(imeshing);

// ==================== 6. 创建接触面 ====================
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// ==================== 7. 设置模型类型和材料参数 ====================
blkdyn.SetModel("linear");

// 岩石材料参数（密度、弹性模量、泊松比、屈服强度、断裂能等）
blkdyn.SetMat(2600, 5e10, 0.25, 30e6, 15e6, 40.0, 20.0);

// ==================== 8. 设置接触面属性 ====================
blkdyn.SetIModel("linear");
blkdyn.SetIStiffByElem(1.0);
blkdyn.SetIStrengthByElem();

// ==================== 9. 设置爆破参数 - 朗道爆源 ====================
var BlastTopC = [0, BaseH + CaveH + 25.0, 0]; // 炮孔中心位置

// 设置朗道爆源参数（ID, 起爆速度, 能量释放率, 密度, 指数等）
pdyna.SetLandauSource(1, 6000, 3.4e9, 1200, 3.0, 1.3333, 9e9, [BlastTopC[0], BlastTopC[1], BlastTopC[2]], 0.0, 1e-2);

// ==================== 10. 设置边界条件 - 自由表面 ====================
// 顶部自由面（不施加约束）
blkdyn.FixV("y", 0.0, "x", -ModelL * 0.5 - 1e-3, ModelL * 0.5 + 1e-3, ModelH - 1e-3, ModelH + 1e-3);

// 左右侧边界固定X方向位移
blkdyn.FixV("x", 0.0, "x", -ModelL * 0.5 - 1e-3, -ModelL * 0.5 + 1e-3, 0, ModelH);
blkdyn.FixV("x", 0.0, "x", ModelL * 0.5 - 1e-3, ModelL * 0.5 + 1e-3, 0, ModelH);

// ==================== 11. 设置初始地应力 ====================
blkdyn.ApplyConditionByCoord("face_force", [0, -2600 * 9.8, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], -ModelL * 0.5 - 1e-3, ModelL * 0.5 + 1e-3, -ModelH * 0.5 - 1e-3, ModelH * 0.5 + 1e-3, false);

// ==================== 12. 设置监测点 ====================
blkdyn.SetMonitor("stress", "x", [0, 0, 0], 100);
blkdyn.SetMonitor("velocity", "y", [0, 0, 0], 100);
blkdyn.SetMonitor("displacement", "all", [0, 0, 0], 100);

// ==================== 13. 设置计算时长和输出频率 ====================
dyna.Set("Total_Time 2.0");
dyna.Set("Output_Interval 500");

// ==================== 14. 执行求解器 ====================
blkdyn.Solve();

// ==================== 15. 导出结果 ====================
doc.ExportResult();
