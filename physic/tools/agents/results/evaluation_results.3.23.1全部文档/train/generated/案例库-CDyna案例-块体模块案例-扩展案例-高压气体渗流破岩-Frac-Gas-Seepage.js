setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

// 创建几何域 - 矩形区域表示裂隙网络
var rect = igeo.genRectS(0, 0, 0, 10, 10, 0, 0.5, 1);

// 生成网格
imeshing.genMeshByGmsh(2);

// 关闭力学计算（仅关注渗流）
dyna.Set("Mechanic_Cal 0");

// 开启大变形选项
dyna.Set("Large_Displace 1");

// 更新接触检测
dyna.Set("If_Renew_Contact 1");

// 设置接触检测容差
dyna.Set("Contact_Detect_Tol 0.0");

// 包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

// 设置渗流模式为气体渗流（2-瞬态可压缩气体渗流）
dyna.Set("Seepage_Mode 2");

// 打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 设置重力加速度（无重力影响）
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置结果输出时步间隔
dyna.Set("Output_Interval 500");

// 打开裂隙渗流与固体破裂耦合开关
dyna.Set("FS_Solid_Interaction 1");

// 获取网格并创建接触面
blkdyn.GetMesh(imeshing);
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置材料模型参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 15);

// 定义裂隙断裂能（拉伸和剪切）
var coord1 = new Array(0, 0, 0);
var coord2 = new Array(10, 10, 0);
blkdyn.SetIFracEnergyByLine(100, 2000, coord1, coord2, 1e-3);

// 创建裂隙网格
fracsp.CreateGridFromBlock(2);

// 设置裂隙渗流参数：密度、体积模量、渗透系数、初始开度、内聚力下限、内聚力上限
// 对于气体渗流，体积模量不起作用但必须填写
fracsp.SetPropByInterCoh(1.293, 1e7, 7e-9, 1e-6, 5e6, 6e6);

// 初始化裂隙压力场（初始压力为0）
fracsp.InitConditionByCoord("pp", 0, [0, 0, 0], -10, 10, -10, 10, -10, 10);

// 定义注入点位置
var injectPoint = new Array(5, 5, 0);

// 设置气体注入边界条件（压力源）
fracsp.ApplyConditionByCoord("source", 1e6, injectPoint, 4.9, 5.1, 4.9, 5.1, -1, 1);

// 定义排出点位置
var drainPoint = new Array(9, 9, 0);

// 设置气体排出边界条件（压力汇）
fracsp.ApplyConditionByCoord("pp", 1e5, [0, 0, 0], 8.9, 9.1, 8.9, 9.1, -1, 1);

// 设置自动计算时步
dyna.TimeStepCorrect();

// 设置总计算时长（秒）
dyna.Set("Time_Step 100");

// 设置迭代次数
dyna.Set("Iter_Count 5000");

// 设置收敛判据
dyna.Set("Converge_Tol 1e-6");

// 配置监测点 - 记录关键节点的压力和位移数据
var monitorPoint = new Array(5, 5, 0);
dyna.Monitor("fracsp", "sc_pp", monitorPoint[0], monitorPoint[1], monitorPoint[2]);
dyna.Monitor("fracsp", "sc_discharge", monitorPoint[0], monitorPoint[1], monitorPoint[2]);

// 绘制监测点位置（可选）
DrawMonitorPos(monitorPoint);

// 执行仿真求解
dyna.Solve(5000);

// 打印提示信息
print("Solution Finished");

// 输出当前时步的监测信息到Result文件夹
OutputMonitorData();

// 输出模型结果到其他软件可导入格式
OutputModelResult();
