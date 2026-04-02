// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 加载并使用自定义的力学计算库
dyna.Set("Mechanic_Cal 1");

// 关闭大变形计算开关，适用于线性弹性模型
dyna.Set("Large_Displace 0");

// 设置计算结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开虚质量计算开关，并设置虚质量时步为0.6
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.6");

// 创建一个二维矩形单元，尺寸为长0.1m、高0.2m，网格划分50x100个单元
blkdyn.GenBrick2D(0.1, 0.2, 50, 100, 1);

// 设置所有单元的材料模型为线弹性模型，并设置其材料参数
blkdyn.SetModel("linear");
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 对底部节点施加Y方向的法向约束
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 在顶部节点施加准静态竖直向下的速度载荷
blkdyn.FixV("y", -1e-9, "y", 0.199, 0.201);

// 设置全部节点的局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

// 监测典型测点的Y方向应力
dyna.Monitor("block", "syy", 0.05, 0.2, 0);
dyna.Monitor("block", "syy", 0.05, 0.1, 0);

// 计算120000步，并保存结果
dyna.Solve(120000);
dyna.Save();

// 卸载自定义力学计算库，释放资源
dyna.Set("Mechanic_Cal 0");
