setCurDir(getSrcDir());

// 初始化模块
dyna.Clear();
doc.clearResult();

// 设置计算控制参数
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Time_Step 1e-6");
dyna.Set("Gravity 0 0 -9.8");
dyna.Set("If_Virtural_Mass 0");

// 创建计算域几何模型（立方体块体）
blkdyn.GenBrick3D(2, 2, 2, 10, 10, 10, 1);

// 设置单元组号
blkdyn.SetGroupByCoord(1, 0, 2, 0, 2, 0, 2);

// 设置Mohr-Coulomb理想弹塑性模型（Model ID 3）
blkdyn.SetModel("MC");

// 设置材料参数：密度、弹性模量、泊松比、粘聚力、内摩擦角
// 参数顺序：density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
blkdyn.SetMat(2500, 3e9, 0.25, 1e6, 1e6, 30.0, 0.0, 0.1);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.2);

// 固定底部边界（z=0面）
blkdyn.FixV("z", 0, "z", -0.0001, 0.0001);

// 固定侧面边界（x=0和x=2面）
blkdyn.FixV("x", 0, "x", -0.0001, 0.0001);
blkdyn.FixV("x", 2, "x", -0.0001, 0.0001);

// 固定侧面边界（y=0和y=2面）
blkdyn.FixV("y", 0, "y", -0.0001, 0.0001);
blkdyn.FixV("y", 2, "y", -0.0001, 0.0001);

// 在顶部中心施加准静态位移载荷（模拟压缩）
blkdyn.FixV("z", 2, "z", 0.0, 0.001);

// 设置监测点：监测顶部中心节点的位移和应力
dyna.Monitor("block", "u_z", 1.0, 1.0, 2.0);
dyna.Monitor("block", "s_zz", 1.0, 1.0, 2.0);
dyna.Monitor("block", "s_xx", 1.0, 1.0, 2.0);
dyna.Monitor("block", "s_yy", 1.0, 1.0, 2.0);

// 设置区域监测（可选）
RegionMonitor("block", "all", 0, 2, 0, 2, 0, 2);

// 输出监测数据至Result文件夹
dyna.OutputMonitorData();

// 输出模型结果为标准格式
dyna.OutputModelResult();

// 求解计算（根据材料参数和时间步长，设置合理步数）
dyna.Solve(100000);
