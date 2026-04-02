// 设置工作路径为脚本所在目录
setCurDir(getSrcDir());

// 清除BlockDyna内存数据
dyna.Clear();

// 设置结果输出时步间隔
dyna.Set("Output_Interval 500");

// 创建三维方形网格模型
blkdyn.GenBrick3D(10, 10, 10, 10, 10, 10, 1);

// 设定线弹性材料模型参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30, 10);

// 固定边界条件以模拟约束
blkdyn.FixV("xyz", 0, "y", -0.01, 0.001);

// 加载自定义动态链接库CustomModel
dyna.LoadUDF("CustomModel");

// 运行动态链接库中的自定义命令流函数
dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");
dyna.RunUDFCmd("PrintTotalVolume");

// 启用核心迭代中用户自定义函数功能
dyna.Set("If_Allow_UDF_Kernel 1");

// 求解
dyna.Solve();

// 释放动态链接库
dyna.FreeUDF();
