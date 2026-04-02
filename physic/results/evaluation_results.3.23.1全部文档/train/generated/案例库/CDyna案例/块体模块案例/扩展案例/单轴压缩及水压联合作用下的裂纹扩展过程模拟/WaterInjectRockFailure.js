// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getCurDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -10.0 0.0");

// 将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

// 监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

// 计算时步
dyna.Set("Time_Step 0.001");

// 瞬态可压缩液体渗流
dyna.Set("Seepage_Mode 1");

// 宾汉流模型
dyna.Set("Liquid_Seepage_Law 2");

// 截止开度, 达到该值流体停止进入
dyna.Set("PS_CirInject_Width 1e-6");

// 设置整体模型的最小孔隙开度，对应的是最小孔隙率，各个地层的开度根据孔隙率大小调整
dyna.Set("Pore_Min_Width 1.4e-4");

// 创建网格
blkGen = blkGen2D(10, 0.2, 50, 1, 1);

// 定义X、Y、Z三个方向的渗透系数
var arrayK1 = new Array(1.66667e-7, 1.66667e-7, 1.66667e-7);

// 指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByGroup(1810.0, 1e6, 0.0, 0.01, arrayK1, 1.0, 1);

// 单独指定剪切强度
poresp.SetSinglePropByGroup("Strength", 11.75, 1);

// 定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

// 设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 5e5, fArrayGrad, -0.5, 0.5, -1e5, 1e5, -1e5, 1e5, true);

dyna.Solve(50000);

// 打印提示信息
print("Solution Finished");
