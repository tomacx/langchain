setCurDir(getSrcDir());

// 加载自定义动态链接库
dyna.LoadUDF("CustomModel.dll");

// 设置允许用户在核心迭代中加入自定义函数功能
dyna.Set("If_Allow_UDF_Kernel 1");

// 设置输出间隔为200步
dyna.Set("Output_Interval 200");

// 设置重力方向
dyna.Set("Gravity  0 0.0 -9.8");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 关闭虚拟质量开关（根据需求可以调整）
dyna.Set("If_Virtural_Mass 0");

// 创建规则颗粒
pdyna.RegularCreateByCoord(2, 1, 0.5, -10, 10, -10, 10, 0, 0);

// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e10, 0.25, 0, 0, 45, 0.8, 0.0);

// 运行动态链接库中的函数，自定义命令流
dyna.RunUDFCmdAdv("CalDist", [0, 0, 0, 10, 10 ,0]);

// 求解7000步
dyna.Solve(7000);

// 释放动态链接库
dyna.FreeUDF();
