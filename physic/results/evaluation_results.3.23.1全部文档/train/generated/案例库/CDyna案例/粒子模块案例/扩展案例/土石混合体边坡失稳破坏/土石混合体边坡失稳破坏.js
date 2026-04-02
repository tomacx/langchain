setCurDir(getSrcDir());

// 清除旧数据
dyna.Clear();
doc.clearResult();

// 设置大位移开关
dyna.Set("Large_Displace 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置云图输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置虚拟时步为0.4
dyna.Set("Virtural_Step 0.4");

// 导入网格数据
blkdyn.ImportGrid("ansys", "groupcheck.dat");

// 不同组号交界面进行切割
blkdyn.CrtIFace(-1, -1);

// 更新接触面后的网格信息
blkdyn.UpdateIFaceMesh();

// 设置单元本构模型为线弹性模型
blkdyn.SetModel("linear");
blkdyn.SetMat(2000, 1e8, 0.3, 1e6, 1e6, 35, 35);

// 设置接触面本构模型为线弹性模型
blkdyn.SetIModel("linear");
blkdyn.SetIMat(1e9, 1e9, 15, 0, 0);

// 固定Y底部的Y方向位移
blkdyn.FixV("y", 0, "y", -1, 0.001);

// 求解至稳定状态
dyna.Solve();

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置接触面模型为脆性断裂模型
blkdyn.SetIModel("brittleMC");

// 设置局部阻尼为0.01
blkdyn.SetLocalDamp(0.01);

// 自动计算时步
dyna.TimeStepCorrect(0.8);

// 求解15000步
dyna.Solve(15000);

print("Solution is OK!");
