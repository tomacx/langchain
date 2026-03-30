setCurDir(getSrcDir());

// 清除模块数据
dyna.Clear();
doc.clearResult();

// 打开固体计算开关
dyna.Set("Mechanic_Cal 1");

// 设置系统不平衡率
dyna.Set("UnBalance_Ratio 1e-5");

// 设置重力加速度（煤矿地下开采）
dyna.Set("Gravity 0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置输出间隔
dyna.Set("Output_Interval 500");

// 保存结果文件
dyna.Set("SaveFile_Out 1");

// 创建围岩几何结构（长400m，高200m）
blkdyn.GenBrick2D(400, 200, 50, 25, 1);

// 将煤层区域设置为组2（便于开挖）
blkdyn.SetGroupByCoord(2, 80, 320, 24, 40, -1, 1);

// 创建接触面离散
blkdyn.CrtIFace(1, 2);

// 更新接触拓扑
blkdyn.UpdateIFaceMesh();

// 设置围岩为弹塑性材料（Mohr-Coulomb模型）
blkdyn.SetModel("MC");

// 设置围岩材料参数（密度，弹性模量，泊松比，粘聚力，内摩擦角，抗拉强度，抗压强度）
blkdyn.SetMat(2500, 1e10, 0.25, 1e6, 8e5, 40.0, 10.0);

// 设置接触模型为线弹性
blkdyn.SetIModel("linear");

// 从单元中继承接触参数
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 设置液压支架材料参数（SetIHydroSupportMat）
setIHydroSupportMat(2e9, 0.3, 5e6, 1e8, 1e7, 0.0);

// 将支架材料与接触面关联绑定
bindIHydroSupportMatByGroupInterface(1, 2);

// 配置流固耦合参数
dyna.Set("SimpleFSI 1");
dyna.Set("FS_Frac_Start_Cal 1");
dyna.Set("FS_WaterLevel_X 0.0");
dyna.Set("FS_WaterLevel_Y 0.0");
dyna.Set("FS_WaterLevel_Z 200.0");
dyna.Set("FS_WaterBottom_X 0.0");
dyna.Set("FS_WaterBottom_Y 0.0");
dyna.Set("FS_WaterBottom_Z 195.0");

// 设置边界约束
blkdyn.FixVByCoord("y", 0.0, -0.1, 0.1, 0, 400.1, -0.1, 0.1);
blkdyn.FixVByCoord("x", 0.0, -0.1, 0.1, 0, 200.1, -0.1, 0.1);
blkdyn.FixVByCoord("x", 0.0, 399.9, 400.1, 0, 200.1, -0.1, 0.1);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.8);

// 定义采掘过程（移除煤体单元）
blkdyn.RemoveGroup(2);

// 施加边界位移载荷模拟开采动作
blkdyn.ApplyDisplacement("x", 0.0, 400.0, 10.0, 0.0, 0.0);

// 设置监测点（应力、位移、支架受力）
dyna.Monitor("coalmine", "sxx", 200, 150, 0);
dyna.Monitor("coalmine", "syy", 200, 150, 0);
dyna.Monitor("coalmine", "szz", 200, 150, 0);
dyna.Monitor("coalmine", "ux", 200, 150, 0);
dyna.Monitor("coalmine", "uy", 200, 150, 0);
dyna.Monitor("support", "sp_ndis", 8, 1, 0);
dyna.Monitor("support", "sp_nstress", 8, 1, 0);

// 配置求解器参数
dyna.Set("Moniter_Iter 100");
dyna.Set("Contact_Detect_Tol 5.0e-3");
dyna.Set("Renew_Interval 100");

// 执行求解
dyna.Solve();

// 导出结果文件（破裂面分布、水压变化曲线、支架应力云图）
doc.ExportResult("coalmining_result.dat");
