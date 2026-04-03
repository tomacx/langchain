setCurDir(getSrcDir());

// 清除计算核心和结果数据
dyna.Clear();
doc.clearResult();

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置重力加速度 (标准重力)
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差
dyna.Set("Contact_Detect_Tol 5e-3");

// 设置边界框
dyna.Set("Bounding_Box 1 1.0");

// 创建底部刚性面 (-4.0,-2.0,0.0) 到 (4.0,-2.0,0.0)
var fCoord = new Array();
fCoord[0] = new Array(-4.0, -2.0, 0.0);
fCoord[1] = new Array(4.0, -2.0, 0.0);
rdface.Create(1, 1, 2, fCoord);

// 导入颗粒几何模型
pdyna.Import("gid", "D2mCircel.msh");

// 设置颗粒接触模型为考虑应变软化的 Mohr-Coulomb 模型
pdyna.SetModel("SSMC");

// 设置颗粒材料参数: 密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(2500, 1e8, 0.25, 1e6, 5e6, 30, 0.0, 0.1);

// 设置动态计算时步
dyna.Set("Time_Step 5e-5");

// 将接触容差设为0 (找到初始接触后)
dyna.Set("Contact_Detect_Tol 0.0");

// 添加监测点
var monitorPoint = new Array(0, 0, 0);
dyna.Monitor(monitorPoint);

// 计算3万步
dyna.Solve(10000);

// 输出监测数据
dyna.OutputMonitorData();

// 输出结果
dyna.OutputModelResult();
