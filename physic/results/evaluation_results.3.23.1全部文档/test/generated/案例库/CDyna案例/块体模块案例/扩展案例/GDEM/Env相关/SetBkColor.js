// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除GDEM-Env中的结果数据
doc.clearResult();

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置接触容差（该容差较大，便于找到紧密接触）
dyna.Set("Contact_Detect_Tol 1e-1");

// 设置求解不平衡率
dyna.Set("UnBalance_Ratio 5e-4");

// 导入gid格式的颗粒
pdyna.Import("pdyna", "par.dat");

// 设置颗粒接触模型为线弹性模量
pdyna.SetModel("linear");

// 设置组1及组2的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 1e10, 0.25, 1e6, 1e6, 35, 0.8, 0.0, 1);
pdyna.SetMat(2500, 1e9, 0.25, 1e4, 1e4, 10, 0.8, 0.0, 2);

// 模型左右两侧及底部法向约束
pdyna.FixV("xyz", 0.0, "x", -2, 3.0);
pdyna.FixV("xyz", 0.0, "x", 117, 121);
pdyna.FixV("xyz", 0.0, "y", -3, 3);

// 监测典型颗粒的水平位移
dyna.Monitor("particle", "pa_xdis", 32.3547, 65.9723, 0);
dyna.Monitor("particle", "pa_xdis", 39.0829, 52.8447, 0);
dyna.Monitor("particle", "pa_xdis", 42.4554, 44.3844, 0);
dyna.Monitor("particle", "pa_xdis", 52.9724, 23.6007, 0);
dyna.Monitor("particle", "pa_xdis", 60.3594, 12.3325, 0);

// 求解指定步数
dyna.Solve(20000);

// 打印信息
print("Solution is ok!");
