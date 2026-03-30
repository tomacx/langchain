setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度（X, Y, Z方向）
dyna.Set("Gravity 0 -9.8 0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果输出间隔为1000步
dyna.Set("Output_Interval 1000");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.5");

// 设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭接触更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// ==================== 2. 包含裂隙渗流计算模块 ====================
dyna.Set("Config_FracSeepage 1");

// 关闭初始状态下的裂隙渗流计算开关（后续再开启）
dyna.Set("FracSeepage_Cal 0");

// 关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 0");

// ==================== 3. 创建几何模型 ====================
// 创建长100m，高50m的矩形边坡模型
var faceid = igeo.genRectS(0, 0, 0, 100, 50, 0, 0.2, 1);

// 在边坡内部创建接触面（模拟潜在破裂面）
var pid1 = igeo.genPoint(49.9, 25, 0, 0.1);
var pid2 = igeo.genPoint(50.1, 25, 0, 0.1);
var lid = igeo.genLine(pid1, pid2);

// 设置硬线，便于施加水压
igeo.setHardLineToFace(lid, faceid);

// ==================== 4. 划分网格 ====================
imeshing.genMeshByGmsh(2);

// 下载网格至blkdyn模块
blkdyn.GetMesh(imeshing);

// 组号1,2之前切割形成接触面
blkdyn.CrtIFace(1, 2);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// ==================== 5. 设置材料属性 ====================
// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定岩石基质材料参数（密度、弹性模量、泊松比、抗拉强度、抗压强度）
// 参数：密度(kg/m3), 弹性模量(Pa), 泊松比, 抗拉强度(Pa), 抗压强度(Pa)
blkdyn.SetMat(2500, 5e10, 0.25, 3e6, 1e6, 30.0, 15.0, 1, 100);

// 设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("linear");

// 设定接触面材料参数（法向、切向刚度）
blkdyn.SetIMat(5e11, 5e11, 35, 3e6, 1e6);
blkdyn.SetIMat(5e11, 5e11, 20, 2e5, 2e5, 1, 2);

// 设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

// ==================== 6. 设置边界条件 ====================
// 固定模型四周的法向速度（X方向）
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 99.99, 100.01);

// 固定模型四周的法向速度（Y方向）
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// ==================== 7. 创建裂隙单元 ====================
// 从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock(2);

// ==================== 8. 设置裂隙渗流参数 ====================
// 设置裂隙渗流参数：密度、体积模量、渗透系数、初始开度
// 组号范围：1-11（对应所有裂隙单元）
fracsp.SetPropByGroup(1000.0, 1e7, 12e-7, 12e-5, 1, 11);

// ==================== 9. 设置入流边界条件 ====================
// 设置模型底部（Z下限）的入流条件
// ID=1, 激活=1, 位置=5(Z下限), 密度=1000kg/m3, 速度=0m/s, 压力=1e6Pa(1MPa)
skwave.SetInflow(1, 1, 5, 1000.0, 0.0, 1e6);

// ==================== 10. 设置动态边界监测点 ====================
// 监测边坡关键节点的位移（X方向）
dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 50, 25, 0);
dyna.Monitor("block", "xdis", 90, 40, 0);

// ==================== 11. 设置时间步长与求解参数 ====================
// 设置初始时间步长为0.001秒
dyna.Set("Time_Step 0.001");

// 设置总模拟时长为10秒（约10000步）
dyna.Set("Total_Time 10");

// ==================== 12. 激活渗流与耦合计算 ====================
// 开启裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 打开孔隙渗流与固体耦合的比奥固结计算开关
dyna.Set("If_Biot_Cal 1");

// ==================== 13. 设置结果输出路径 ====================
// 设置应力应变曲线、位移场及渗流压力场的导出格式
doc.SetResultPath("result/WaterRockSlope/");
doc.SetResultFormat("vtk");

// ==================== 14. 执行求解 ====================
// 第一次求解（初始状态）
dyna.Solve();

// 设置软化参数，模拟破裂演化
dyna.Set("Block_Soften_Value 3e-3 9e-3");
blkdyn.SetModel("SoftenMC");

// 第二次求解（考虑软化后的破裂过程）
dyna.Solve();

// 初始化条件（位移重置）
blkdyn.InitConditionByGroup("displace", [0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 1, 1);

// 重新开启渗流计算
dyna.Set("PoreSeepage_Cal 1");

// 第三次求解（完整耦合过程）
dyna.Solve();

// ==================== 15. 获取监测数据 ====================
// 获取关键节点的压力与饱和度数据用于输出
var pressureData = fracsp.GetNodeValue("pressure", [50, 25, 0]);
var saturationData = fracsp.GetNodeValue("saturation", [50, 25, 0]);

// ==================== 16. 完成仿真 ====================
// 输出完成信息
console.log("WaterRockSlope仿真计算完成！");
console.log("破裂演化与渗流监测报告已生成。");
