// 设置工作路径为JS文件所在路径
setCurDir(getSrcDir());

// 清除BlockDyna内存数据
dyna.Clear();

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 创建三维方形网格
blkdyn.GenBrick3D(10, 10, 10, 10, 10, 10, 1);

// 设置模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼系数
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30, 10);

// 固定边界条件，固定y轴方向在-0.01到0.001范围内的xyz速度
blkdyn.FixV("xyz", 0, "y", -0.01, 0.001);

// 加载动态链接库
dyna.LoadUDF("CustomModel");

// 设置自定义材料参数，包括弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角和剪胀角
var avalue = [3e10, 0.25, 3e3, 1e3, 15, 10];
dyna.SetUDFValue(avalue);

// 设置单元本构为自定义模型
blkdyn.SetModel("custom");

// 设定局部阻尼系数为0.01
blkdyn.SetLocalDamp(0.01);

// 运行动态链接库中的函数，执行自定义命令流
dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");
dyna.RunUDFCmd("PrintTotalVolume");

// 打开允许用户在核心迭代中加入自定义函数功能
dyna.Set("If_Allow_UDF_Kernel 1");

// 求解
dyna.Solve();

// 显示单元本构模型
dyna.Plot("Elem", "Model");

// 卸载动态链接库
dyna.FreeUDF();
