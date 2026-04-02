setCurDir(getSrcDir());

// 设置重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 关闭大变形计算开关
dyna.Set("Large_Displace 1");

// 允许自动在Result文件夹下输出Save文件
dyna.Set("SaveFile_Out 1");

// 设置虚质量时步为0.4
dyna.Set("Virtural_Step 0.4");

// 打开允许块体变为颗粒的开关，设置阈值为30
dyna.Set("If_Allow_Block_To_Particles 1 30");

// 导入gid格式的网格文件
blkdyn.ImportGrid("gid", "example.msh");

// 设置所有单元为MC理想弹塑性模型
blkdyn.SetModel("MC");

// 设置组1的材料参数，分别为密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 5e6, 2e6, 40.0, 10.0, 1);

// 设置局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

// Y方向底部法向约束
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 监测典型测点的x位移
dyna.Monitor("block", "xdis", 0.0, 0.4, 0);
