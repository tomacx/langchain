setCurDir(getSrcDir());

// 初始化环境并清除内存数据
dyna.Clear();

// 设置结果输出时步
dyna.Set("Output_Interval 500");

// 创建三维块体网格 (10x10x10个单元，每个单元尺寸10m)
blkdyn.GenBrick3D(10, 10, 10, 10, 10, 10, 1);

// 设置模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数 (密度, 弹性模量, 泊松比, 屈服应力, 断裂能, 内摩擦角, 剪胀角)
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30, 10);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 设置无反射边界条件 (坐标范围: x[-1e5, 1e5], y[-0.01, 0.01], z[-1e5, 1e5])
pdyna.ApplyQuietBoundByCoord(-1e5, 1e5, -0.01, 0.01, -1e5, 1e5);

// 设置耦合面模型 (模拟碰撞与破碎)
trff.CrtFace(2, 100);
trff.SetModel("brittleMC");
trff.SetMat(1e9, 1e9, 20, 0, 0, 1e8);

// 设置大变形选项
dyna.Set("Large_Displace 1");

// 设置虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置时间步长修正因子
dyna.TimeStepCorrect(0.8);

// 求解计算
dyna.Solve();

// 导出颗粒材料参数及边界条件信息
pdyna.ExportInfo();

// 释放动态链接库 (如有加载)
dyna.FreeUDF();
