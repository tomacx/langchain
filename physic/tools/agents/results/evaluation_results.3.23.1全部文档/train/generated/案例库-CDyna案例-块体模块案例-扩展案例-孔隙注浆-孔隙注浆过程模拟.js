setCurDir(getSrcDir());

// 清除所有模块数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 关闭力学计算（纯渗流分析）
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal 1");

// 设置三个方向的重力加速度（注浆过程通常忽略重力或设为0）
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置结果输出时步间隔为500步
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

// 计算时步设为0.001秒
dyna.Set("Time_Step 0.001");

// 瞬态可压缩液体渗流模式（注浆浆液）
dyna.Set("Seepage_Mode 1");

// 牛顿流体模型
dyna.Set("Liquid_Seepage_Law 1");

// 截止开度，达到该值流体停止进入
dyna.Set("PS_CirInject_Width 1e-6");

// 设置整体模型的最小孔隙开度
dyna.Set("Pore_Min_Width 1.4e-4");

// 创建二维网格（注浆区域）
blkdyn.GenBrick2D(10, 0.5, 10, 1, 1);

// 定义X、Y、Z三个方向的渗透系数（各向同性）
var arrayK = new Array(1e-7, 1e-7, 1e-7);

// 指定坐标控制范围内的孔隙渗流参数
// 依次为：流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByGroup(1810.0, 1e6, 0.0, 0.01, arrayK, 1.0, 1);

// 单独指定剪切强度
poresp.SetSinglePropByGroup("Strength", 11.75, 1);

// 定义梯度（无梯度）
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 设定模型四周的水压力边界条件（外部压力）
poresp.ApplyConditionByCoord("pp", 5e5, fArrayGrad, -0.5, 0.5, -1e5, 1e5, -1e5, 1e5, true);

// 在模型中心区域施加注浆压力边界条件（圆柱形注入）
var centerNode = blkdyn.GetNodeID(0.0, 0.0, 0.0);
var injectPressure = 8e5; // 注浆压力 8MPa
poresp.ApplyDynaConditionByCylinder("pp", injectPressure, fArrayGrad, -0.1, 0.1, -0.1, 0.1, true);

// 初始化中心区域初始压力条件
poresp.InitConditionByCoord(5e5, fArrayGrad, -0.2, 0.2, -0.2, 0.2, -0.2, 0.2);

// 求解器执行迭代计算
dyna.Solve(10000);

// 获取关键节点压力值进行监测
var monitorNode = blkdyn.GetNodeID(0.0, 0.0, 0.0);
var pressureValue = poresp.GetNodeValue(monitorNode, "Pressure");
print("中心节点注浆压力: ", pressureValue);

// 获取饱和度分布信息
var saturationValue = poresp.GetNodeValue(monitorNode, "Saturation");
print("中心节点浆液饱和度: ", saturationValue);

// 打印提示信息
print("Solution Finished");
