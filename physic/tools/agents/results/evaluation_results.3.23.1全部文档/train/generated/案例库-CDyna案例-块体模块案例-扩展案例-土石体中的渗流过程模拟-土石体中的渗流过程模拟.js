setCurDir(getSrcDir());

// 清理环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关（纯渗流分析）
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置三个方向的重力加速度（重力向下）
dyna.Set("Gravity 0.0 -10.0 0.0");

// 将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

// 计算时步
dyna.Set("Time_Step 0.001");

// 瞬态可压缩液体渗流模式
dyna.Set("Seepage_Mode 1");

// 牛顿流体模型
dyna.Set("Liquid_Seepage_Law 1");

// 截止开度，达到该值流体停止进入
dyna.Set("PS_CirInject_Width 1e-6");

// 设置整体模型的最小孔隙开度
dyna.Set("Pore_Min_Width 1.4e-4");

// 不更新孔隙率
dyna.Set("If_Renew_Porosity 0");

// 创建网格（矩形区域）
blkdyn.GenBrick2D(10, 0.5, 50, 1, 1);

// 获取网格
blkdyn.GetMesh(imeshing);

// 定义X、Y、Z三个方向的渗透系数（各向同性）
var arrayK = new Array(1e-9, 1e-9, 1e-9);

// 指定坐标控制范围内的孔隙渗流参数
// 依次为：流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1810.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义梯度（用于边界条件）
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 设定模型底部的水压力边界条件（1MPa）
poresp.ApplyConditionByCoord("pp", 1e6, fArrayGrad, -0.5, 0.5, -1e5, 1e5, -1e5, 1e5, true);

// 设定模型顶部的自由面边界条件（压力为0）
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad, -0.5, 0.5, 49.5, 50.5, -1e5, 1e5, false);

// 设定模型侧面的自由面边界条件（压力为0）
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad, -0.01, 0.01, -500, 500, -1e5, 1e5, false);

// 对典型位置的孔隙压力进行监测
dyna.Monitor("block", "fpp", 2, 5, 0);
dyna.Monitor("block", "fpp", 4, 5, 0);
dyna.Monitor("block", "fpp", 6, 5, 0);

// 获取节点ID用于后续监测
var id1 = poresp.GetNodeID(2.5, 5, 0);
var id2 = poresp.GetNodeID(4.5, 5, 0);

// 使用 InitConditionByCoord 初始化初始压力及饱和度分布
poresp.InitConditionByCoord(-500, 500, -500, 500, -500, 500, 1e5, 0.3);

// 求解器迭代计算
dyna.Solve(50000);

// 获取关键监测节点的孔隙压力与饱和度信息
var pressure1 = poresp.GetNodeValue(id1, "Pressure");
var saturation1 = poresp.GetNodeValue(id1, "Saturation");
var pressure2 = poresp.GetNodeValue(id2, "Pressure");
var saturation2 = poresp.GetNodeValue(id2, "Saturation");

// 打印提示信息
print("Solution Finished");
print("Monitoring Node 1 Pressure: " + pressure1);
print("Monitoring Node 1 Saturation: " + saturation1);
print("Monitoring Node 2 Pressure: " + pressure2);
print("Monitoring Node 2 Saturation: " + saturation2);

// 后处理导出渗流演化数据与应力耦合结果
doc.ExportResult();
