setCurDir(getSrcDir());

// 清除数据，便于直接进行重新计算
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

// ==================== 1. 初始化仿真环境 ====================
// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度（岩体密度约2500kg/m³，考虑自重）
dyna.Set("Gravity 0 -9.8 0");

// 关闭大变形计算开关（小变形假设）
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为100步
dyna.Set("Output_Interval 100");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.5");

// 设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭接触更新计算开关
dyna.Set("If_Renew_Contact 0");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 设置仅依靠拓扑寻找接触容差，加速接触检索
dyna.Set("If_Find_Contact_OBT 1");

// 设置接触面拉伸断裂及剪切断裂位移
dyna.Set("Interface_Soften_Value 1e-5 1e-5");

// ==================== 2. 包含裂隙渗流计算模块 ====================
// 包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 设置裂隙渗流模型为快速渗流模式
dyna.Set("Seepage_Mode 4");

// 关闭裂隙渗流计算开关（初始状态）
dyna.Set("FracSeepage_Cal 0");

// 关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 0");

// 打开仅接触面破裂或接触面为预设面时进行压力传递及更新开度
dyna.Set("FS_Frac_Start_Cal 1");

// ==================== 3. 创建几何模型 ====================
// 创建岩体矩形区域（长20m，宽20m，厚1m）
var faceid = igeo.genRectS(0, 0, 0, 20, 20, 0, 1, 1);

// 设置硬线，便于加水压（在岩体中心位置创建裂隙）
var pid1 = igeo.genPoint(9.5, 10, 0, 0.1);
var pid2 = igeo.genPoint(10.5, 10, 0, 0.1);
var lid = igeo.genLine(pid1, pid2);
igeo.setHardLineToFace(lid, faceid);

// 设置硬线，天然裂隙（模拟初始裂隙网络）
var pid3 = igeo.genPoint(5, 8, 0, 0.1);
var pid4 = igeo.genPoint(15, 8, 0, 0.1);
var lid2 = igeo.genLine(pid3, pid4);
igeo.setHardLineToFace(lid2, faceid);

// ==================== 4. 划分网格 ====================
// 使用Gmsh进行网格划分
imeshing.genMeshByGmsh(2);

// 下载网格至blkdyn模块
blkdyn.GetMesh(imeshing);

// 切割形成接触面（沿裂隙位置）
blkdyn.CrtIFace(1, 1);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// ==================== 5. 设置材料参数 ====================
// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定岩体材料参数（密度、弹性模量、泊松比、抗拉强度、抗压强度）
// 组号1-100：岩体材料
blkdyn.SetMat(2500, 3e9, 0.25, 3e6, 1e7, 1, 100);

// 设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("linear");

// 设定接触面材料参数（法向刚度、切向刚度）
blkdyn.SetIMat(5e11, 5e11, 35, 3e6, 1e6);

// ==================== 6. 设置裂隙渗流参数 ====================
// 从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock(2);

// 设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
// 密度1000kg/m³, 体积模量1e7 Pa, 渗透系数1.2e-9 m/s, 初始开度1.2e-5 m
fracsp.SetPropByGroup(1000.0, 1e7, 1.2e-9, 1.2e-5, 1, 11);

// ==================== 7. 设置边界条件 ====================
// 固定模型四周的法向速度（x方向）
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 19.99, 20.001);

// 固定模型四周的法向速度（y方向）
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// ==================== 8. 开启SimpleFSI并设置水位面 ====================
// 开启简单流固耦合计算开关
dyna.Set("SimpleFSI 1");

// 设置水位面坐标（Z=20m，模拟地下水位）
fracsp.SetNodeValue(0, "Coord", 3, 20.0);

// 设置水底面坐标（Z=0m）
fracsp.SetNodeValue(0, "Coord", 3, 0.0);

// ==================== 9. 施加水压力边界条件 ====================
// 在裂隙表面施加初始水压力（通过节点值设置）
var pressure = 1e5; // 1个大气压
fracsp.SetNodeValue(0, "Pressure", 0, pressure);

// ==================== 10. 启动渗流计算 ====================
// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// ==================== 11. 设置监测点 ====================
// 获取裂隙中心节点ID用于监测
var centerNode = fracsp.GetNodeID(10, 10, 0);

// 设置监测点记录裂隙开度、节点压力及饱和度
fracsp.SetNodeValue(centerNode, "Monitor", 1);

// ==================== 12. 执行耦合计算 ====================
// 在核心迭代步中计算渗流与固体破裂的耦合效应
fracsp.CalIntSolid();

// 计算渗流动态边界
poresp.CalDynaBound();

// ==================== 13. 运行二次开发程序进行整体计算流程控制 ====================
// 启动计算循环（通过RunUDFCmd调用用户自定义命令）
dyna.RunUDFCmd("Start_Calculation");

// ==================== 14. 提取计算结果并保存 ====================
// 获取裂隙开度演化数据
var fractureAperture = fracsp.GetElemValue(0, "Aperture", 0);

// 获取节点压力数据
var nodePressure = fracsp.GetNodeValue(centerNode, "Pressure", 0);

// 获取饱和度数据
var saturation = fracsp.GetNodeValue(centerNode, "Saturation", 0);

// 保存仿真输出文件
doc.SaveResult();

// 生成分析报告（通过文档接口）
doc.WriteReport("岩体破裂与渗流耦合分析报告.txt");
