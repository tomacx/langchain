// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 清除dyna模块数据
dyna.Clear();

// 清除平台数据
doc.ClearResult();

// 设置输出间隔为100步
dyna.Set("Output_Interval 100");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时间步为0.2ms
dyna.Set("Time_Step 2.0e-4");

// 设置颗粒计算模式为mpm模式
dyna.Set("Particle_Cal_Type 4");

// 创建规则颗粒
pdyna.RegularCreateByCoord(1, 2, 0.1, 0.1, 10, 0.1, 10, 0.1, 9.9);

// 导入刚性面
rdface.Import("ansys", "bound.dat");

// 设置颗粒与刚性面的接触模型为脆断模型
pdyna.SetModel("brittleMC");

// 设置颗粒材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2200, 5e7, 0.25, 0.0, 0.0, 0.0001, 0.01, 0);

// 设置mpm背景网格
mpm.SetBackGrid(3, 0.5, [-0.5, -0.5, -0.5], [62, 42, 22]);

// 设置mpm的本构模型
mpm.SetModelByGroup("DP", 1, 2);

// 设定TNT爆源参数
var apos = [0.8, 0.6-0.09, 0.0];
pdyna.SetJWLSource(1, 1630, 7e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.3, 20e9, 6930.0, apos, 0.0, 10.0);

// 绑定爆源
pdyna.BindJWLSource(1, 2, 2);

// 计算20秒
dyna.DynaCycle(20);
