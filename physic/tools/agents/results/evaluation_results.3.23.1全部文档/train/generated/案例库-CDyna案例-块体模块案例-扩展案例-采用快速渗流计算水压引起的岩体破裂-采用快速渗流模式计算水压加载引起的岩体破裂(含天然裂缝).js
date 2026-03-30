setCurDir(getSrcDir());

// 清除数据，便于直接进行重新计算
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
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

// 创建几何模型 - 矩形岩体
var faceid = igeo.genRectS(0, 0, 0, 20, 20, 0, 0.5, 1);

// 设置硬线，便于加水压（顶部边界）
var pid1 = igeo.genPoint(9.9, 10, 0, 0.1);
var pid2 = igeo.genPoint(10.1, 10, 0, 0.1);
var lid = igeo.genLine(pid1, pid2);
igeo.setHardLineToFace(lid, faceid);

// 设置硬线，天然裂隙（中部水平裂隙）
var pid3 = igeo.genPoint(5, 8, 0, 0.1);
var pid4 = igeo.genPoint(15, 8, 0, 0.1);
var lid2 = igeo.genLine(pid3, pid4);
igeo.setHardLineToFace(lid2, faceid);

// 划分网格
imeshing.genMeshByGmsh(2);

// 下载网格至blkdyn模块
blkdyn.GetMesh(imeshing);

// 切割形成接触面
blkdyn.CrtIFace(1, 1);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定岩体材料参数：密度、体积模量、泊松比、拉强度、压强度、抗剪强度、内聚力、摩擦角
blkdyn.SetMat(2500, 5e10, 0.25, 3e6, 1e6, 30.0, 15.0, 1);

// 设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("linear");

// 设定接触面材料参数
blkdyn.SetIMat(5e11, 5e11, 35, 3e6, 1e6);

// 从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock(2);

// 设置裂隙渗流参数：密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e7, 12e-7, 12e-5, 1, 11);

// 设置水位面坐标（顶部）与水底面坐标（底部）用于计算水压力
var waterLevelX = 0.0;
var waterLevelY = 20.0;
var waterLevelZ = 0.0;
var waterBottomX = 0.0;
var waterBottomY = 0.0;
var waterBottomZ = 0.0;

// 开启简单流固耦合计算开关
dyna.Set("SimpleFSI 1");

// 设置水位面坐标
dyna.Set("WaterLevelX " + waterLevelX);
dyna.Set("WaterLevelY " + waterLevelY);
dyna.Set("WaterLevelZ " + waterLevelZ);

// 设置水底面坐标
dyna.Set("WaterBottomX " + waterBottomX);
dyna.Set("WaterBottomY " + waterBottomY);
dyna.Set("WaterBottomZ " + waterBottomZ);

// 开启裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 动态施加压力及流量边界条件（用户自定义命令）
var cmd = "CalDynaBound";
dyna.RunUDFCmd(cmd);

// 计算节点压力及饱和度
fracsp.CalNodePressure();

// 动态单元流速、流量
fracsp.CalElemDischarge();

// 核心迭代步中，计算与固体破裂的耦合
fracsp.CalIntSolid();

// 设置监测变量：节点压力、饱和度及裂隙单元流速
dyna.Monitor("block", "fpp", 0, 5, 0);
dyna.Monitor("block", "fpp", 2, 5, 0);
dyna.Monitor("block", "fpp", 4, 5, 0);
dyna.Monitor("block", "fpp", 6, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);

// 运行仿真脚本
var runCmd = "Run";
dyna.RunUDFCmd(runCmd);

// 提取结果数据并生成报告
doc.ExportResult();
