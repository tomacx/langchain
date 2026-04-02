//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");
print("ok");
//开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -10.0 0.0");

//将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

//监测结果输出时步间隔设定为100步
dyna.Set("Moniter_Iter 100");

print("ok");

//导入patran格式的网格
blkdyn.ImportGrid("patran", "RecDam.out");
print("ok");
//定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-10, 1e-10, 1e-10);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

//定义梯度1
var fArrayGrad1 = new Array(0, -1e4, 0);

//定义梯度2
var fArrayGrad2 = new Array(0.0, 0.0, 0.0);

//设定模型四周的水压力边界条件
poresp.ApplyConditionByCoord("pp", 10e4, fArrayGrad1, 8.99, 9.01, -1, 10, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 2e4, fArrayGrad1, -0.01, 0.01, -1, 2.0, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad2, 8.99, 9.01, 10.01, 200, -500, 500, false);
poresp.ApplyConditionByCoord("pp", 0, fArrayGrad2, -0.01, 0.01, 2.001, 200, -500, 500, false);

//对典型位置的孔隙压力进行监测
dyna.Monitor("block", "fpp", 0, 5, 0);
dyna.Monitor("block", "fpp", 2, 5, 0);
dyna.Monitor("block", "fpp", 4, 5, 0);
dyna.Monitor("block", "fpp", 6, 5, 0);
dyna.Monitor("block", "fpp", 8, 5, 0);
dyna.Monitor("block", "fpp", 10, 5, 0);

//设定计算时步为100s
dyna.Set("Time_Step 100");

//迭代2万步
dyna.Solve(20000);

//打印提示信息
print("Solution Finished");
