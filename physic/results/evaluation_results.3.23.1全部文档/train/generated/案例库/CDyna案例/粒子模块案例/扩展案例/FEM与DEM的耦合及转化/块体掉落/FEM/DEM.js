setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 设置结果的输出间隔为500步
dyna.Set("Output_Interval", 500);

// 打开虚拟质量开关
dyna.Set("If_Virtural_Mass", 1);

// 设置重力加速度
dyna.Set("Gravity", [0.0, -9.8, 0.0]);

// 设置接触容差（该容差较大，便于找到紧密接触，形成致密连续介质颗粒体系）
dyna.Set("Contact_Detect_Tol", 1e-1);

// 设置求解不平衡率
dyna.Set("UnBalance_Ratio", 5e-4);

// 导入gid格式的块体模型
fem.ImportGrid("gid","Model.msh");

// 设置块体接触模型为线弹性模量
fem.SetModel("linear");

// 设置组1及组2的材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
fem.SetMat(2500, 3e9, 0.25, 3e4, 1e4, 15, 15);

// 设置块体阻尼
fem.SetLocalDamp(0.01);

// 模型左右两侧及底部法向约束
fem.FixV("xyz", 0.0, "x", -2, 3.0);
fem.FixV("xyz", 0.0, "x", 117, 121);
fem.FixV("xyz", 0.0, "y", -3, 3);

// 创建颗粒
pdyna.RegularCreateByCoord(1, 1, 0.01, -0.16, 1.16, -0.16, 1.1, 0.0, 0);
pdyna.RegularCreateByCoord(1, 1, 0.01, -0.16, -0.02, 1, 2, 0.0, 0);
pdyna.RegularCreateByCoord(1, 1, 0.01, 1.04, 1.16, 1, 2, 0.0, 0);

// 颗粒的左右两侧及底部固定
pdyna.FixV("xyz", 0, "x", -1, -0.001);
pdyna.FixV("xyz", 0, "x", 1.021, 2);
pdyna.FixV("xyz", 0, "y", -1, -0.001);

// 设置材料参数，依次为density, young, poisson, tension, cohesion, friction, localdamp, viscdamp
pdyna.SetMat(2000, 1e7, 0.35, 1e-3, 1e-3, 0.0, 0.8, 0);

// 创建耦合面
trff.CrtFace(2, 100);

// 设置耦合面模型为脆性断裂模型
trff.SetModel("brittleMC");

// 设置耦合参数
trff.SetMat(1e9, 1e9, 20, 0, 0, 1e8);

dyna.TimeStepCorrect(0.8);
dyna.Solve();
