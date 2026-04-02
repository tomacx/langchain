// 设置工作路径为JS文件所在路径
setCurDir(getSrcDir());

// 清楚BlockDyna内存数据
dyna.Clear();

// 创建三维方形网格
blkdyn.GenBrick3D(10, 10, 10, 10, 10, 10, 1);

// 设置基础材料参数
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30, 10);

// 加载用户自定义的动态链接库文件CustomModel.dll
dyna.LoadUDF("CustomModel");

// 设置自定义材料参数
var avalue = [3e10, 0.25, 3e3, 1e3, 15, 10];
dyna.SetUDFValue(avalue);

// 将单元本构模型设置为'custom'
blkdyn.SetModel("custom");

// 固定边界条件以确保模拟环境稳定
blkdyn.FixV("xyz", 0, "y", -0.01, 0.001);

// 执行求解过程并计算结果
dyna.Solve();

// 显示单元本构模型
dyna.Plot("Elem", "Model");

// 释放动态链接库
dyna.FreeUDF();
