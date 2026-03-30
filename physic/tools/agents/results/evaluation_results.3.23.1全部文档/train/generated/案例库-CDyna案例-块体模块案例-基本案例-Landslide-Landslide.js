setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Renew_Interval 100");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("If_Renew_Contact 1");
dyna.Set("SaveFile_Out 0");

// 定义计算网格（使用defGrid创建基础网格）
defGrid.CreateBox(0, 20, 0, 15, -10, 10);

// 导入网格文件（模拟已有网格数据）
blkdyn.ImportGrid("ansys", "Landslide.dat");

// 在组间创建接触面
blkdyn.CrtIFace(1, 2);
blkdyn.CrtIFace(2, 2);
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.UpdateIFaceMesh();

// 设置模型为线弹性
blkdyn.SetModel("linear");

// 设置材料参数（密度、弹性模量、泊松比、抗拉强度、抗压强度、摩擦角、黏聚力）
blkdyn.SetMatByGroup(2500, 1e9, 0.25, 10e6, 8e6, 40.0, 10.0, 1);
blkdyn.SetMatByGroup(2500, 1e9, 0.25, 10e6, 8e6, 40.0, 10.0, 2);

// 设置接触面材料参数
blkdyn.SetIModel("linear");
blkdyn.SetIMat(5e9, 5e9, 10, 1e4, 1e4);

// 施加边界条件
// 底部全约束
blkdyn.FixVByCoord("xy", 0.0, -1e10, 1e10, -0.001, 0.001, -1e10, 1e10);
// 左右两侧法向约束
blkdyn.FixVByCoord("x", 0.0, -0.001, 0.001, -1e10, 1e10, -1e10, 1e10);
blkdyn.FixVByCoord("x", 14.99, -0.001, 0.001, -1e10, 1e10, -1e10, 1e10);

// 绘制监测点位置（在模型视图中用红色圆点表示）
DrawMonitorPos(5, 7.5, -5);
DrawMonitorPos(10, 7.5, -5);
DrawMonitorPos(15, 7.5, -5);

// 配置监测接口对指定测点的位移和速度时程信息进行监测
Monitor(5, "DispX", "DispY", "DispZ", "VelX", "VelY", "VelZ");
Monitor(10, "DispX", "DispY", "DispZ", "VelX", "VelY", "VelZ");
Monitor(15, "DispX", "DispY", "DispZ", "VelX", "VelY", "VelZ");

// 执行求解器计算并推进当前时步
dyna.Solve();

// 将关键时步的结果信息推送至Genvi平台进行展示
PutStep(1000);
PutStep(2000);
PutStep(3000);

// 将模型结果存储为其他软件可导入的格式
OutputModelResult("result.dat");

// 将监测信息输出至Result文件夹下的监测文件中
OutputMonitorData();
