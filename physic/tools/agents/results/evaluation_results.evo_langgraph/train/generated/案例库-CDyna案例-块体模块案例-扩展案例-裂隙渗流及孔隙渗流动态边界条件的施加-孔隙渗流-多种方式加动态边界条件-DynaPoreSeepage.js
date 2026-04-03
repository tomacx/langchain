setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

// 关闭力学计算，专注孔隙渗流
dyna.Set("Mechanic_Cal 0");

// 包含孔隙渗流计算功能
dyna.Set("Config_PoreSeepage 1");

// 开启孔隙渗流计算
dyna.Set("PoreSeepage_Cal 1");

// 设置重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 导入网格
blkdyn.ImportGrid("Gid", "pore-model.msh");

// 定义X、Y、Z三个方向的渗透系数 (m/s)
var arrayK = new Array(1e-8, 1e-8, 1e-8);

// 指定坐标控制范围内的孔隙渗流参数
// 依次：流体密度(kg/m^3)、体积模量(Pa)、饱和度(0-1)、孔隙率、渗透系数数组、比奥系数
// 范围：X、Y、Z坐标范围
poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -250, 250, -250, 250, -250, 250);

// 设置初始压力分布
var initPressure = new Array();
initPressure[0] = [0, 100000];    // X=0处压力
initPressure[1] = [100, 150000];  // X=100处压力
initPressure[2] = [200, 200000];  // X=200处压力
initPressure[3] = [300, 250000];  // X=300处压力

// 通过坐标初始化压力边界
for (var i = 0; i < initPressure.length; i++) {
    poresp.InitConditionByCoord(initPressure[i].pop(), 0, initPressure[i][0], initPressure[i][1]);
}

// 定义梯度场
var fArrayGrad = [0.0, 0.0, 0.0];

// 方式1：通过圆柱施加动态压力及流量边界
// 参数：名称，压力数组，梯度，半径，高度，起点，终点
poresp.ApplyDynaConditionByCylinder("pump1", initPressure, fArrayGrad, 0.5, 0.5, -1, 0.5, 0.5, 1, 0.19, 0.21, true);

// 方式2：通过球体施加动态边界条件
// 参数：名称，压力数组，梯度，半径，起点
poresp.ApplyDynaConditionBySphere("inject1", initPressure, fArrayGrad, 0.5, 0.5, 0, 0.19, 0.21, true);

// 方式3：通过坐标范围施加边界条件
poresp.ApplyDynaConditionByCoord("boundary1", initPressure, fArrayGrad, 4.99, 5.01, 4.99, 5.01, -1, 1, false);

// 方式4：通过法向施加动态边界条件
poresp.ApplyDynaBoundCondition("surface1", initPressure, fArrayGrad, 0, 0, 1, 0.1);

// 设置监测变量
// fpp: 流体压力
// magfvel: 流体速度模量
// discharge: 流量
dyna.Monitor("block", "fpp", 5, 5, 0);
dyna.Monitor("block", "magfvel", 5, 5, 0);
dyna.Monitor("block", "discharge", 5, 5, 0);

// 自动计算时步
dyna.TimeStepCorrect();

// 设置时间步长
dyna.Set("Time_Step 0.005");

// 求解
dyna.Solve(100000);

// 打印完成信息
print("Solution Finished");
