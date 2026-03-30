setCurDir(getSrcDir());

// 清除内存数据
dyna.Clear();

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 创建三维砖形单元网格模型 (10x10x10个单元，尺寸10x10x10)
blkdyn.GenBrick3D(10, 10, 10, 10, 10, 10, 1);

// 设置基础线弹性材料参数 (密度、弹性模量、泊松比、抗拉强度、抗压强度、内摩擦角、粘聚力)
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30, 10);

// 固定边界条件 (约束x,y方向，z方向允许微小位移)
blkdyn.FixV("xyz", 0, "y", -0.01, 0.001);

// 加载自定义动态链接库文件
dyna.LoadUDF("CustomModel");

// 设置自定义本构所需参数数组 (弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角)
var avalue = [3e10, 0.25, 3e3, 1e3, 15, 10];
dyna.SetUDFValue(avalue);

// 将单元本构模型类型切换为Custom
blkdyn.SetModel("custom");

// 设定局部阻尼系数
blkdyn.SetLocalDamp(0.01);

// 启动求解器进行核心计算
dyna.Solve();

// 绘制单元本构模型图
dyna.Plot("Elem", "Model");

// 释放动态链接库资源
dyna.FreeUDF();
