setCurDir(getSrcDir());

// 清除BlockDyna内存数据
dyna.Clear();

// 设置结果输出时步间隔为500步
dyna.Set("Output_Interval 500");

// 创建三维方形网格模型（10x10x10单元，尺寸10x10x10）
blkdyn.GenBrick3D(10, 10, 10, 10, 10, 10, 1);

// 设置模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、剪胀角
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30, 10);

// 固定边界条件：约束y方向位移
blkdyn.FixV("xyz", 0, "y", -0.01, 0.001);

// 加载动态链接库
dyna.LoadUDF("CustomModel");

// 运行动态链接库中的自定义命令流
dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");
dyna.RunUDFCmd("PrintTotalVolume");

// 开启核心迭代中允许用户自定义函数的功能开关
dyna.Set("If_Allow_UDF_Kernel 1");

// 求解器进行单次迭代步求解及时间步累加计算
dyna.Solve();

// 释放动态链接库资源
dyna.FreeUDF();
