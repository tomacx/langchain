setCurDir(getSrcDir());

// 设置大位移参数
dyna.Set("Large_Displace 1");

// 设置输出间隔
dyna.Set("Output_Interval 500");

// 禁用虚拟质量
dyna.Set("If_Virtural_Mass 0");

// 导入网格文件
blkdyn.ImportGrid("gid", "Model.msh");

// 设置模型类型为线性
blkdyn.SetModel("linear");

// 设置材料参数
blkdyn.SetMat(2500, 3e9, 0.25, 3e4, 1e4, 15, 15);

// 设置局部阻尼系数
blkdyn.SetLocalDamp(0.01);

// 固定特定组的节点
blkdyn.FixVByGroupInterface("xyz", 0.0, 1, 1);

// 创建耦合面
trff.CrtFace(2, 100);

// 设置耦合面模型为脆性断裂模型
trff.SetModel("brittleMC");

// 设置耦合参数
trff.SetMat(1e9, 1e9, 20, 0, 0, 1e8);

// 调整时间步长以确保稳定性
dyna.TimeStepCorrect(0.8);

// 开始求解
dyna.Solve();
