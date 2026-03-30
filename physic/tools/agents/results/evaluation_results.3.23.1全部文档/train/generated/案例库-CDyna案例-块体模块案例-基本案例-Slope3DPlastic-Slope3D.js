setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置系统收敛的不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

// 设置3个方向的重力加速度值（Z轴负方向）
dyna.Set("Gravity 0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测结果的输出时步为100步
dyna.Set("Moniter_Iter 100");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚拟时步为0.6
dyna.Set("Virtural_Step 0.6");

// 导入当前目录下的GiD类型网格，网格名称为"Slope3D.msh"
blkdyn.ImportGrid("GiD", "Slope3D.msh");

// 将所有单元的组号设定为组号1
blkdyn.SetGroupByCoord(1, -1e10, 1e10, -1e10, 1e10, -1e10, 1e10);

// 设置所有单元为塑性模型（SoftenMC）
blkdyn.SetModel("SoftenMC");

// 设置组1的材料参数：密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2000, 3e8, 0.33, 1e4, 3e2, 25.0, 10.0, 1);

// X方向左侧法向约束
blkdyn.FixVByCoord("x", 0.0, -1e10, -9.99, -1e10, 1e10, -1e10, 1e10);

// X方向右侧法向约束
blkdyn.FixVByCoord("x", 0.0, 29.99, 31, -1e10, 1e10, -1e10, 1e10);

// Y方向底部法向约束
blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);

// Z方向后侧法向约束
blkdyn.FixVByCoord("z", 0.0, -1e10, 1e10, -1e10, 1e10, -1e10, 0.001);

// Z方向前侧法向约束
blkdyn.FixVByCoord("z", 0.0, -1e10, 1e10, -1e10, 1e10, 9.99, 10.01);

// 设置全部节点的局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

// 监测典型测点的x方向的位移
dyna.Monitor("block", "xdis", 0, 10, 0);
dyna.Monitor("block", "xdis", 12.5, 15, 0);
dyna.Monitor("block", "xdis", 15, 20, 0);

// 求解
dyna.Solve();

// 保存结果文件
dyna.Save("Slope3DPlastic.sav");

// 定义观察点坐标用于安全系数计算
var coord = new Array(10.0, 10.0, 0.0);

// 调用SolveFosByCriDisp函数计算安全系数
var fos = dyna.SolveFosByCriDisp(6000, 1e-3, coord, "Slope3DPlastic.sav");

// 输出安全系数结果
print("安全系数: " + fos);
