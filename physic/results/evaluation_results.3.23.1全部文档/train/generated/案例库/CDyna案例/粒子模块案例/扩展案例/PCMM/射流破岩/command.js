// 设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

// 清除dyna模块数据
dyna.Clear();

// 清除平台数据
doc.ClearResult();

// 设置结果的输出间隔为1000步
dyna.Set("Output_Interval 1000");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置3个方向的重力加速度为-9.8m/s^2（向下）
dyna.Set("Gravity 0 -9.8 0");

// 设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9 0.0 0.0 0.0");

// 创建规则排布的颗粒，组1，模拟水体
pdyna.RegularCreateByCoord(1, 1, 0.1, 0.1, 10, 0.1, 10, 0.1, 9.9);

// 导入刚性面（边界）
rdface.Import("ansys", "bound.dat");

// 设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
pdyna.SetMat(1000, 5e7, 0.25, 0.0, 0.0, 0.0001, 0.01, 0);

// 设置mpm背景网格，3维，单元尺寸为0.5
mpm.SetBackGrid(3, 0.5, [-0.5, -0.5, -0.5], [62, 42, 22]);

// 设置mpm的本构模型为理想弹塑性模型
mpm.SetModelByGroup("DP", 1, 2);

// 计算时间步长设置为0.2ms
dyna.Set("Time_Step 2.0e-4");

// 模拟溃坝过程，计算时间为20秒
dyna.DynaCycle(20);
