// 设置工作路径为脚本文件所在目录
SetCurDir(GetSrcDir());

// 清除dyna模块数据
dyna.Clear();

// 清除平台数据
doc.ClearResult();

// 设置输出间隔为100步
dyna.Set("Output_Interval 100");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时间步为5e-4秒
dyna.Set("Time_Step 5.0e-4");

// 设置颗粒计算模式为mpm模式
dyna.Set("Particle_Cal_Type 4");

// 设置颗粒与刚性面接触模型采用全局参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9  0.0 0.0 0.0");

// 创建规则颗粒
pdyna.RegularCreateByCoord(1, 1, 0.05, -0.5, 0.5, -0.5, 0.5, 0.0, 0);

// 导入刚性面
rdface.Import("ansys", "bound.dat");

// 设置颗粒与刚性面的接触模型为脆断模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2000, 1e7, 0.35, 1e6, 40e6, 35, 0.01, 0);

// 创建mpm背景网格
mpm.SetBackGrid(2, 0.1, [-0.6, -0.6, 0], [22, 22, 0]);

// 设置mpm的本构模型为理想弹塑性模型
mpm.SetModelByGroup("MC", 1, 2);

// 计算5秒
dyna.DynaCycle(5);
