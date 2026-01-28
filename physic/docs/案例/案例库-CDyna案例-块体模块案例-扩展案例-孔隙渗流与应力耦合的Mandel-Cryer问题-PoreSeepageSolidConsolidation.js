//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//设置计算结果的输出间隔为1000步
dyna.Set("Output_Interval 500");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.4");

//设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

//包含孔隙渗流计算模块，开辟相应内存
dyna.Set("Config_PoreSeepage 1");

//关闭孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal 0");

//导入gid格式的网格
blkdyn.ImportGrid("gid", "semi-ball-fine.msh");

//设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

//设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 1e6, 0.25, 8e6, 3e6, 40.0, 15.0, 1, 100);

//设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

//固定模型四周的法向速度，为0.0
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
blkdyn.FixV("z", 0.0, "z", -0.001, 0.001);



//监测典型测点的裂隙压力
dyna.Monitor("block", "fpp", 0, 0, 0);

//*******************************************外侧施加100KPa压应力

//设置施加的三个基础值
var values = new Array(0, 0,  -1e5);

//设置9个变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

///对球心坐标为(0,0,0)，球半径为1m的面施加面力
blkdyn.ApplyConditionBySphere("face_force", values, gradient, 0.0, 0.0, 0.0, 0.099, 0.12 , true);

//*******************************************外侧施加100KPa压应力



//设置渗透系数
var k = new Array(1e-8, 1e-8, 1e-8);

//设置孔隙渗流材料参数
poresp.SetPropByCoord(1000, 1e6, 2.0, 0.1, k, 1.0, -10, 10, -10, 10, -10, 10);

var grad = new Array(0, 0, 0); //变化梯度
poresp.InitConditionByCoord("pp", 1e5, grad, -10, 10, -10, 10, -10, 10, false);


dyna.Solve();



var grad = new Array(0, 0, 0); //变化梯度
poresp.ApplyConditionBySphere("pp", 0.0, grad, 0.0, 0.0, 0.0, 0.099, 0.12, true);


//打开孔隙渗流计算开关
dyna.Set("PoreSeepage_Cal 1");

//打开孔隙渗流与固体耦合的比奥固结计算开关
dyna.Set("If_Biot_Cal 1");


dyna.Set("If_Virtural_Mass 0");

dyna.Set("Time_Now 0");

dyna.Set("Time_Step 2e-5");

dyna.DynaCycle(0.5);


//打印提示信息
print("Solution Finished");

print("******** Analytical Solution ********");

run("Analytical Solution.js");





