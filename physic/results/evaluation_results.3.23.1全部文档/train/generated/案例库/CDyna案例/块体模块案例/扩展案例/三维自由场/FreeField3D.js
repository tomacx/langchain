// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 清除dyna模块数据
dyna.Clear();

// 清除平台数据
doc.ClearResult();

// 设置输出间隔为1000步
dyna.Set("Output_Interval 1000");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时间步为0.2ms
dyna.Set("Time_Step 2.0e-4");

// 设置颗粒计算模式为mpm模式
dyna.Set("Particle_Cal_Type 4");

// 设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9  0.0 0.0 0.0");

// 创建规则排列的颗粒系统
pdyna.RegularCreateByCoord(1, 2, 0.1, 0.1, 10, 0.1, 10, 0.1, 9.9);

// 导入刚性面边界
rdface.Import("ansys", "bound.dat");

// 设置颗粒与刚性面的接触模型为脆断模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2200, 5e7, 0.25, 0.0, 0.0, 0.0001, 0.01, 0);

// 设置mpm背景网格
mpm.SetBackGrid(3, 0.5, [-0.5, -0.5, -0.5], [62, 42, 22]);

// 设置mpm的本构模型
mpm.SetModelByGroup("DP", 1, 2);

// 计算20秒
dyna.DynaCycle(20);
