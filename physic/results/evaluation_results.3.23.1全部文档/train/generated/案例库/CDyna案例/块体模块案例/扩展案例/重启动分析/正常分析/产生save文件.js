setCurDir(getSrcDir());

// 清除内存数据和结果数据
dyna.Clear();
doc.clearResult();

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 创建一个3D砖块模型
blkdyn.GenBrick3D(10, 10, 10, 5, 5, 5, 1);

// 设置线性弹性模型和材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2200, 3e8, 0.3, 1e4, 1e4, 15, 15);

// 固定底部法向约束
blkdyn.FixV("xyz", 0, "y", -0.001, 0.001);

// 进行线性弹性求解并保存结果
dyna.Solve();
dyna.Save("Elastic.sav");

// 设置局部阻尼系数和模型为Mohr-Coulomb模型
blkdyn.SetLocalDamp(0.01);
blkdyn.SetModel("MC");

// 继续进行塑性求解并保存结果
dyna.Solve(1000);
dyna.Save("Plastic.sav");
