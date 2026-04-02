// 设置工作路径为脚本文件所在路径
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

// 固定边界条件，固定x方向的位移
blkdyn.FixV("xyz", 0, "y", -0.01, 0.001);

// 加载动态链接库
dyna.LoadUDF("CustomModel");

// 自定义材料参数，根据单元自定义本构中的参数设定
var avalue = [3e10, 0.25, 3e3, 1e3, 15, 10];
dyna.SetUDFValue(avalue);

// 重新设置单元本构为自定义本构
blkdyn.SetModel("custom");

// 设定局部阻尼系数为0.01
blkdyn.SetLocalDamp(0.01);

// 设置计算时步为1e-6秒
dyna.Set("Time_Step 1e-6");

// 求解5000步
dyna.Solve(5000);

// 显示单元本构模型
dyna.Plot("Elem", "Model");

// 释放动态链接库
dyna.FreeUDF();
