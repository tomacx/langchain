setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置重力加速度（初始掉落高度通过边界条件实现）
dyna.Set("Gravity 0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置输出间隔为500步
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

// 设置刚性面模型类型：2-板（线段）
dyna.Set("RdFace_MechModel 2");

// 导入三角形单元网格文件
blkdyn.ImportGrid("gid", "tri_elem.msh");

// 对组号为1的单元进行接触面切割生成
blkdyn.CrtIFace(1);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定三角形单元的材料参数：密度、弹性模量、泊松比、屈服强度等
// 参数顺序：密度、弹性模量、泊松比、屈服应力、硬化模量、初始应变等
blkdyn.SetMat(2500, 1e9, 0.3, 6e3, 3e3, 25.0, 10.0, 1, 100);

// 设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 设定接触面上的材料参数：单位面积法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(1e10, 1e10, 25.0, 0.0, 0.0);

// 设定全部节点的局部阻尼系数为0.01
blkdyn.SetLocalDamp(0.01);

// 导入刚性面（线段）
rdface.Import("gid", "rdface_2d.msh");

// 设置刚性面材料参数：泊松比、密度、弹性模量等
rdface.SetDeformMat(0.2, 2500, 3e10, 0.25, 3e6, 1e6, 35, 0.8);

// 设置刚性面边界条件：固定约束（X、Y方向速度限制）
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, -0.01, 0.01, -1e5, 1e5, -1e5, 1e5);

// 设置计算时步
dyna.Set("Time_Step 1e-4");

// 设置监测点：监测与(0,0,0)点最近的节点的X方向位移
dyna.Monitor("block", "xdis", 0.0, 0.0, 0.0);

// 设置监测点：监测刚性面接触力
dyna.Monitor("rdface", "rg_bxForce", 1, 1, 1);

// 设置监测点：监测系统断裂度
dyna.Monitor("gvalue", "gv_block_crack_ratio");

// 求解计算
dyna.Solve();
