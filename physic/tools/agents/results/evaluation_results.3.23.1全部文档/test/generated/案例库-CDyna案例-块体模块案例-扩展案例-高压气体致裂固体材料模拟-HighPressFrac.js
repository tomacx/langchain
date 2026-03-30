setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

// 创建矩形块体几何模型（模拟固体材料）
igeo.genRectS(0, 0, 0, 2.0, 1.0, 0.5, 0.1, 0.1);

// 网格划分
imeshing.genMeshByGmsh(2);

// 获取块体网格
blkdyn.GetMesh(imeshing);

// 创建接触面以支持破裂传播
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置模型为线性弹性模型
blkdyn.SetModel("linear");

// 设置固体材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
blkdyn.SetMat(2500, 3e10, 0.25, 1e6, 1e6, 35, 15);

// 设置脆性断裂模型
blkdyn.SetIModel("brittleMC");

// 设置单元刚度由单元控制
blkdyn.SetIStiffByElem(1);

// 设置单元强度由单元控制（允许破裂）
blkdyn.SetIStrengthByElem();

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 设置简单水力压裂模式参数
// IDNo=1, BoundType=1(压力边界), fBoundV1=注入压力(Pa), fBoundV2=每米压力衰减值(Pa/m)
var fC = new Array(0.5, 0.5, 0.25); // 注入点坐标（块体中心）
blkdyn.SetSimpleHyFracPram(1, 1, 1e7, 9e6, fC, true);

// 设置裂隙渗流计算模块
dyna.Set("Config_FracSeepage 1");
dyna.Set("Seepage_Mode 2"); // 气体渗流模式
dyna.Set("FracSeepage_Cal 1");

// 打开裂隙渗流与固体破裂耦合开关
dyna.Set("FS_Solid_Interaction 1");

// 设置重力加速度（无重力或自定义）
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开大变形开关
dyna.Set("Large_Displace 1");

// 更新接触检测
dyna.Set("If_Renew_Contact 1");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 0.0");

// 初始化裂隙压力（可选）
fracsp.InitConditionByCoord("pp", 1e5, [0, 0, 0], -1e6, 1e6, -1e6, 1e6, -1e6, 1e6);

// 设置气体注入条件
var ID = Math.round(fracsp.GetNodeID(0.5, 0.5, 0.25));
var fx = fracsp.GetNodeValue(ID, "Coord", 1);
var fy = fracsp.GetNodeValue(ID, "Coord", 2);
fracsp.ApplyConditionByCoord("source", 1e-2, [fx, fy, 0.25], fx - 1e-3, fx + 1e-3, fy - 1e-3, fy + 1e-3, -1, 1);

// 设置裂隙渗流参数：密度、体积模量、渗透率、初始裂纹宽度、下摩擦系数、上摩擦系数
fracsp.SetPropByGroup(1.293, 1e7, 7e-9, 1e-6, 1, 11);

// 设置计算时步（确保气体绝热膨胀模型稳定性）
dyna.Set("Time_Step 1e-5");

// 设置输出请求：监测应力、应变及裂纹扩展路径
dyna.Monitor("blkdyn", "stress", 1, 1, 0);
dyna.Monitor("blkdyn", "strain", 1, 1, 0);
dyna.Monitor("blkdyn", "damage", 1, 1, 0);

// 设置结果导出参数（破片信息及密度统计）
blkdyn.ExportGradationCurveByGroup(1, 1);

// 执行仿真计算
dyna.Solve(5000);

// 输出破裂块度信息
blkdyn.ExportGradationCurveByGroup(1, 1);
