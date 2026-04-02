// 设置工作路径为脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 关闭虚拟质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

// 设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 0.0 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

// 设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

// 设置接触检测容差
dyna.Set("Contact_Detect_Tol 0.0");

// 导入网格数据
blkdyn.ImportGrid("ansys","ansys-mesh.dat");

// 创建内部面和边界内部面
blkdyn.CrtIFace(1);
blkdyn.CrtBoundIFaceByGroup(2);

// 更新内部面网格
blkdyn.UpdateIFaceMesh();

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置楼板参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30.0, 10.0, 1);

// 设置冲击球参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
blkdyn.SetMat(12800, 5e11, 0.27, 1e9, 1e9, 0.0, 0.0, 2);

// 左右两侧全约束
blkdyn.FixV("xy", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("xy", 0.0, "x", 2.0-0.001, 2.0 + 0.001);

// 设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("SSMC");

// 设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIStiffByElem(10.0);
blkdyn.SetIStrengthByElem();

// 设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.01);

// 求解步数
dyna.Solve(5000);
