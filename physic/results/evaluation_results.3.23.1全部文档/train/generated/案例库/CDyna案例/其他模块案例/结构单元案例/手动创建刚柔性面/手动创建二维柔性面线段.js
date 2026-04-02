// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为100步
dyna.Set("Moniter_Iter 100");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置子空间更新时步为100步
dyna.Set("Renew_Interval 100");

// 设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 1e-3");

// 打开save文件自动保存开关
dyna.Set("SaveFile_Out 1");

////RdFace_MechModel  1-普通刚性面，2-板，3-壳
dyna.Set("RdFace_MechModel 2");

// 导入patran格式的网格文件
blkdyn.ImportGrid("gid", "TriElem.msh");

// 对组号为1的单元进行接触面切割生成
blkdyn.CrtIFace(1);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 1e9, 0.3, 6e3, 3e3, 25.0, 10.0, 1, 100);

// 设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(1e10, 1e10, 25.0, 0.0, 0.0);

// 设定全部节点的局部阻尼系数为0.01
blkdyn.SetLocalDamp(0.01);

// 导入刚性面
rdface.Import ("gid","rdface2d.msh");

/// 设置材料参数
rdface.SetDeformMat(0.1, 2500, 3e8, 0.25, 3e6, 1e6, 35, 0.01);

/// 0-空模型，1-线弹性，2-脆断，3-理想弹塑性
rdface.SetModelByGroup(1,1,11);

// 设置边界条件
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, -1e5, 1e5, 5-0.01, 5+0.01, -1e5, 1e5);

// 设置计算时步
dyna.Set("Time_Step 1e-4");

// 求解至稳定
dyna.Solve();
