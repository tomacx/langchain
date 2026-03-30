setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关（纯渗流分析）
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流计算
dyna.Set("PoreSeepage_Cal 1");

// 设置三个方向的重力加速度 (Y方向向下)
dyna.Set("Gravity 0.0 -9.8 0.0");

// 将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

// 计算时步
dyna.Set("Time_Step 0.001");

// 瞬态可压缩液体渗流模式
dyna.Set("Seepage_Mode 1");

// 创建二维矩形网格模型 (40x20单位)
igeo.genRectS(0, 0, 0, 40, 20, 0, 10, 1);

imeshing.genMeshByGmsh(2);

blkdyn.GetMesh(imeshing);

// 定义X、Y、Z三个方向的渗透系数 (各向同性)
var arrayK = new Array(1e-9, 1e-9, 1e-9);

// 指定坐标控制范围内的孔隙渗流参数
// 依次为:流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord(1000.0, 1e6, 0.5, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

// 定义压力边界梯度 (X方向)
var fArrayGradX = new Array(0.0, 0.0, 0.0);

// 定义压力边界梯度 (Y方向)
var fArrayGradY = new Array(0.0, 0.0, 0.0);

// 设定模型左侧边界的水压力边界条件 (高压入口)
poresp.ApplyConditionByCoord("pp", 5e5, fArrayGradX, -0.5, 0.5, -20, 20, -500, 500, false);

// 设定模型右侧边界的水压力边界条件 (低压出口)
poresp.ApplyConditionByCoord("pp", 1e5, fArrayGradX, -0.5, 0.5, 38, 42, -500, 500, false);

// 设定模型底部边界的水压力边界条件 (大气压)
poresp.ApplyConditionByCoord("pp", 1e5, fArrayGradY, -0.5, 0.5, -20, 20, 0, 2, true);

// 对典型位置的孔隙压力进行监测
dyna.Monitor("block", "fpp", 10, 10, 0);
dyna.Monitor("block", "fpp", 20, 10, 0);
dyna.Monitor("block", "fpp", 30, 10, 0);
dyna.Monitor("block", "fpp", 10, 5, 0);
dyna.Monitor("block", "fpp", 20, 5, 0);

// 获取典型节点ID用于后续监测
var id1 = fracsp.GetNodeID(10, 10, 0);
var id2 = fracsp.GetNodeID(30, 10, 0);

// 设置计算时间 (总时长)
dyna.Set("Time_Total 10.0");

// 执行求解
dyna.Solve();

// 打印提示信息
print("Solution Finished");

// 释放动态链接库
dyna.FreeUDF();
