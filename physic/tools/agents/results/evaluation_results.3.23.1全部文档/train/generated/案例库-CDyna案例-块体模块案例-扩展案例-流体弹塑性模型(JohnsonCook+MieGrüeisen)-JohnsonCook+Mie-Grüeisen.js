setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Output_Interval 500");
dyna.Set("Time_Step 1e-8");
dyna.Set("Gravity 0 -9.8 0");

// 创建计算域几何边界（立方体区域）
igeo.genCircle(0, 0, 0, 1.0, 0.1);
var lineLoopID = igeo.genLineLoop([1]);

// 生成块体网格
blkdyn.GenBrick3D(1.0, 1.0, 1.0, 20, 20, 20, 1);

// 设置单元模型为流体弹塑性（FEP）
blkdyn.SetModel("FEP");

// 定义线弹性背景材料参数（密度、杨氏模量、泊松比、张力、粘聚力、摩擦系数、局部阻尼、粘性阻尼）
blkdyn.SetMat(2500, 3e9, 0.25, 1e6, 1e6, 35, 15);

// 设置Johnson-Cook材料参数（序号、屈服强度、硬化强度、应变硬化指数、应变率系数、温度系数、参考温度、熔化温度、密度、失效因子）
blkdyn.SetJCMat(1, 324e6, 114e6, 0.42, 0.016, 1.34, 298, 877, 875, 1.0, true);

// 将Johnson-Cook材料绑定到单元组（组号范围1-总单元数）
var totalElem = blkdyn.GetElemCount();
blkdyn.BindJCMat(1, 1, totalElem);

// 设置Mie-Grueisen流体材料参数（序号、密度、声速、Lamuda、Gama、fa）
blkdyn.SetMGMat(2, 2703, 5350, 1.34, 1.97, 1.5);

// 将Mie-Grueisen材料绑定到单元组
blkdyn.BindMGMat(2, 1, totalElem);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 固定模型底部边界条件（Y方向）
blkdyn.FixV("y", -0.5, "y", -1, 0.001);

// 设置监测输出请求
dyna.Monitor("Elem_Stress", 1, 1, totalElem);
dyna.Monitor("Elem_Temp", 1, 1, totalElem);

// 执行求解
dyna.Solve();

// 打印求解完成信息
print("Fluid-Plasticity Simulation Finished");
