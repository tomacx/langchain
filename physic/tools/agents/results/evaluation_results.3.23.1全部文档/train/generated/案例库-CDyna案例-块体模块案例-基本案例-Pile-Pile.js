setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Clear();
doc.clearResult();

// 设置计算参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("If_Cal_Bar 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 0");
dyna.Set("Output_Interval 500");
dyna.Set("Bar_Out 1");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Virtural_Step 0.5");
dyna.Set("Time_Step 5e-4");

// 清除几何模型
igeo.drawclear();

// ========== 定义材料参数 ==========
// 桩体材料参数：直径、密度、弹性模量、泊松比、抗拉强度、抗压强度、粘聚力、内摩擦角、刚度、局部阻尼、刚度阻尼
var BarProp = [1.0, 7850.0, 2e10, 0.3, 400e6, 400e6, 1e6, 30, 1e9, 0.8, 0.0];

// 土体材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼
var SoilProp = [2200.0, 5e7, 0.35, 0.0, 0.0, 0.001, 0.01, 0];

// ========== 创建第一根桩（左侧固定桩）==========
var coord1 = [0, 0, 0];
var coord2 = [10, 0, 0];
bar.CreateByCoord("pile1", coord1, coord2, 40);

// 设置桩单元为线弹性模型
bar.SetModelByID("linear", 1, 100);

// 施加桩体材料参数
bar.SetPropByID(BarProp, 1, 10, 1, 100);

// 固定左侧节点
var fixArray = [true, true, true];
var velArray = [0.0, 0.0, 0.0];
bar.FixVelByID(fixArray, velArray, 1, 10, 1, 1);
bar.FixRotateVelByID(fixArray, velArray, 1, 10, 1, 1);

// ========== 创建第二根桩（右侧碰撞桩）==========
var coord3 = [25, 0, 0];
var coord4 = [35, 0, 0];
bar.CreateByCoord("pile2", coord3, coord4, 40);

// 设置第二根桩为线弹性模型
bar.SetModelByID("linear", 1, 100);

// 施加材料参数
bar.SetPropByID(BarProp, 1, 10, 1, 100);

// 对右侧节点施加初始速度（模拟碰撞）
var forceArray = [0.0, -5e6, 0.0];
bar.ApplyForceByID(forceArray, 1, 10, 41, 41);

// ========== 创建土体介质颗粒 ==========
var soilCoord1 = [-2, -2, 0];
var soilCoord2 = [37, 2, 0];
pdyna.CreateByCoord(10000, 1, 1, 0.005, 0.02, 0, soilCoord1, soilCoord2);

// 设置土体接触模型
pdyna.SetModel("brittleMC");

// 设置土体材料参数
pdyna.SetMat(2200, 5e7, 0.35, 0.0, 0.0, 0.001, 0.01, 0);

// ========== 创建底部刚性面边界 ==========
var boundCoord = [];
boundCoord[0] = [-2, -2, 0];
boundCoord[1] = [37, -2, 0];
rdface.Create(1, 1, 2, boundCoord);

boundCoord[0] = [37, -2, 0];
boundCoord[1] = [37, 2, 0];
rdface.Create(1, 2, 2, boundCoord);

boundCoord[0] = [37, 2, 0];
boundCoord[1] = [-2, 2, 0];
rdface.Create(1, 3, 2, boundCoord);

boundCoord[0] = [-2, 2, 0];
boundCoord[1] = [-2, -2, 0];
rdface.Create(1, 4, 2, boundCoord);

// ========== 关联LeeTarver材料源 ==========
blkdyn.BindLeeTarverSource(1, 1, 100);

// ========== 可视化关键几何元素 ==========
igeo.pick("line", 1, 10);
igeo.pick("line", 101, 140);

// ========== 放置监测点位置 ==========
DrawMonitorPos([25, 0, 0]);
DrawMonitorPos([15, 0, 0]);

// ========== 配置输出设置 ==========
dyna.Monitor("bar", "a_ydis", 20, 0, 0);
dyna.Monitor("pdyna", "u_x", 37, 0, 0);

// ========== 执行求解器 ==========
dyna.Solve(10000);

// ========== 生成结果云图与打印信息 ==========
Plot("bar", "stress");
Plot("pdyna", "velocity");

print("*****Pile-Pile仿真求解成功!******");
