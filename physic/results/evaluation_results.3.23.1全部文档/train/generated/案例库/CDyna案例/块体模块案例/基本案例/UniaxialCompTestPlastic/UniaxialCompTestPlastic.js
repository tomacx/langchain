setCurDir(getSrcDir());

// 清除核心模块及结果文件模块
dyna.Clear();
doc.clearResult();

// 设置大变形开关
dyna.Set("Large_Displace 1");

// 设置计算输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

// 设置重力加速度为零
dyna.Set("Gravity 0 0 0");

// 创建二维长方体模型，尺寸为(长度, 宽度)，网格划分数量为(20, 5)
blkdyn.GenBrick3D(0.1, 0.01, 0.01, 20, 5, 1);

// 设置单元本构模型
blkdyn.SetModel("LinearElastic");

// 设置材料参数：密度，弹性模量，泊松比，切线模量，屈服应力，内摩擦角，粘聚力
blkdyn.SetMat(7850, 2e11, 0.3, 0, 0, 0, 0);

// 左侧法向固定
blkdyn.FixV("x", 0, "x", -0.0001, 0.0001);

// 右侧施加准静态速度载荷，模拟单轴拉伸
blkdyn.FixV("x", 3e-7, "x", 0.099, 0.101);

// 设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.2);

// 监测X方向正应变
dyna.Monitor("block","soxx",0.04, 0.0125, 0.0);
dyna.Monitor("block","soxx",0.05, 0.0125, 0.0);

// 监测X方向正应力
dyna.Monitor("block","sxx",0.04, 0.0125, 0.0);
dyna.Monitor("block","sxx",0.05, 0.0125, 0.0);

// 计算步数为14万
dyna.Solve(140000);
