// 设置当前工作路径为脚本文件所在目录
setCurDir(getSrcDir());

// 清除核心模块及结果文件模块数据
dyna.Clear();
doc.clearResult();

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚拟质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 创建三维长方体模型，尺寸为0.1x0.01x0.01，网格数为20x2x2
blkdyn.GenBrick3D(0.1, 0.01, 0.01, 20, 2, 2);

// 设置单元本构模型为MR（Mooney-Rivlin）模型
blkdyn.SetModel("MR");

// 设置基础材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼系数
blkdyn.SetMat(1100, 2e7, 0.485, 1e6, 1e6, 35, 15);

// 设置MR模型参数，C10=0.8073MPa，C01=0.1689MPa，D=100MPa
var MRMat = [0.8073, 0.1689, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 10.0, 0.0];
blkdyn.SetMRMat(1, MRMat);
blkdyn.BindMRMat(1, 1, 100);

// 左侧法向固定
blkdyn.FixV("x", 0, "x", -0.0001, 0.0001);

// 右侧施加准静态速度载荷
blkdyn.FixV("x", 3e-7, "x", 0.099, 0.101);

// 设置局部阻尼系数为0.2
blkdyn.SetLocalDamp(0.2);

// 监测正应变和应力
var monitorPoints = [0.04, 0.05, 0.06];
monitorPoints.forEach(function(x) {
    dyna.Monitor("block", "soxx", x, 0.0125, 0);
    dyna.Monitor("block", "sxx", x, 0.0125, 0);
    dyna.Monitor("block", "General_P5", x, 0.0125, 0);
});

// 计算14万步
dyna.Solve(140000);
