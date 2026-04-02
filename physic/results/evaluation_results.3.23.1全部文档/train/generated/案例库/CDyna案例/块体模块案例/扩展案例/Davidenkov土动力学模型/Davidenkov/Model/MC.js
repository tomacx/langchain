// 设置工作路径为当前脚本文件所在目录
setCurDir(getSrcDir());

// 清除核心模块和结果数据
dyna.Clear();
doc.clearResult();

// 开启大变形开关，设置输出间隔为500步
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");

// 启用虚拟质量计算，并设定虚拟时步为0.5
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");

// 创建一个三维长方体模型，尺寸为0.1m x 0.01m x 0.01m，网格划分20x2x2
blkdyn.GenBrick3D(0.1, 0.01, 0.01, 20, 2, 2, 1);

// 设置单元本构模型为MR（Mooney-Rivlin）模型，并设定基础材料参数
blkdyn.SetModel("MR");
blkdyn.SetMat(1100, 2e7, 0.485, 1e6, 1e6, 35, 15);

// 定义并设置橡胶的特定参数，包括C10和C01
var MRMat = [0.8073, 0.1689, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 10.0, 0.0];
blkdyn.SetMRMat(1, MRMat);
blkdyn.BindMRMat(1, 1, 100);

// 对模型进行边界条件设置：左侧固定，右侧施加准静态拉伸载荷
blkdyn.FixV("x", 0, "x", -0.0001, 0.0001);
blkdyn.FixV("x", 3e-7, "x", 0.099, 0.101);

// 设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.2);

// 监测特定位置的正应变和应力，以及静水压力P
dyna.Monitor("block","soxx", 0.04, 0.0125, 0.0);
dyna.Monitor("block","sxx", 0.04, 0.0125, 0.0);
dyna.Monitor("block","General_P5", 0.04, 0.0125, 0.0);

// 执行计算，共进行14万步
dyna.Solve(140000);
