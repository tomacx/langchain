// 设置工作路径为JS文件所在路径
setCurDir(getSrcDir());

// 清楚PDyna中内存数据
dyna.Clear();

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 创建规则排布的颗粒
pdyna.RegularCreateByCoord(2, 1, 0.5, -10, 10, -10, 10, 0, 0);

// 设置颗粒模型为线弹性模型
pdyna.SetModel("linear");

// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e10, 0.25, 0, 0, 45, 0.8, 0.0);

// 固定模型底部速度
pdyna.FixV("xyz", 0.0, "y", -11, -9);

// 加载动态链接库
dyna.LoadUDF("CustomModel");

// 运行动态链接库中的函数，自定义命令流
dyna.RunUDFCmd("CalDist 0 0 0 10 10 0");

// 打开允许用户在核心迭代中加入自定义函数功能
dyna.Set("If_Allow_UDF_Kernel 1");

// 求解
dyna.Solve();

// 设置自定义参数，分别为弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角
var avalue = [3e10, 0.25, 0, 0, 45];
dyna.SetUDFValue(avalue);

// 设置用户自定义模型，示例中的自定义模型为脆性断裂模型
pdyna.SetModel("custom");

// 求解
dyna.Solve();

// 释放动态链接库
dyna.FreeUDF();
