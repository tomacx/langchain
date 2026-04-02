// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

// 设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 0.0 0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 设置结果输出时步为500步
dyna.Set("Output_Interval 1000");

// 监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

// 打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

// 设置接触容差为0.0
dyna.Set("Contact_Detect_Tol 0.0");

// 导入网格文件
blkdyn.ImportGrid("gmsh", "150mm150mm.msh");

// 创建接触面
blkdyn.CrtIFace();

// 更新接触面的网格信息
blkdyn.UpdateIFaceMesh();

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置固体单元的材料参数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 1e6, 30.0, 10.0, 1);

// 固定底部边界条件
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 应用顶部位移载荷
blkdyn.FixV("y", -2e-9, "y", 0.1499, 0.16);

// 设定所有接触面的本构模型为脆性断裂Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");

// 设定接触面上的材料参数，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIStiffByElem(10.0);

// 设置接触面的断裂能
blkdyn.SetIFracEnergyByCoord(100, 1000, -1E5, 1E5, -1E5, 1E5, -1E5, 1E5);

// 设置局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

// 监测y方向应力
dyna.Monitor("block", "syy", 0,     0.15, 0);
dyna.Monitor("block", "syy", 0.05,  0.15, 0);
dyna.Monitor("block", "syy", 0.075, 0.15, 0);
dyna.Monitor("block", "syy", 0.1,   0.15, 0);
dyna.Monitor("block", "syy", 0.15,  0.15, 0);

// 底部监测点
dyna.Monitor("block", "syy", 0,     0.0, 0);
