// 设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时步
dyna.Set("Time_Step 2e-6");

// 导入有限体积网格单元
blkdyn.ImportGrid("gid", "boreblast.msh");

// 材料模型为Young模型
blkdyn.SetModel("Young", 1);
blkdyn.SetMat(2500, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 1);

// 设置Landau炸药模型
blkdyn.SetModel("Landau", 2);
blkdyn.SetMat(1150, 8e10, 0.3, 3.7e7, 1e7, 35.0, 15.0, 2);

// 设置炸药参数
var apos = [10.0, 10.0, 0.0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 10);

// 绑定炸药模型
blkdyn.BindLandauSource(1, 2, 2);

// 设置局部阻尼和瑞利阻尼
blkdyn.SetLocalDamp(0.0);
blkdyn.SetRayleighDamp(1e-6, 0.0);

// 监控指定单元的应力分量
dyna.Monitor("block", "sxx", 11, 10, 0);
dyna.Monitor("block", "sxx", 13, 10, 0);
dyna.Monitor("block", "sxx", 16, 10, 0);

// 求解指定时间
dyna.DynaCycle(4e-3);

print("Solution Finished");
