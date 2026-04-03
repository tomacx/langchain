setCurDir(getSrcDir());

// 设置基本仿真参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Virtural_Step 0.6");
dyna.Set("Renew_Interval 100");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("If_Renew_Contact 1");
dyna.Set("If_Cal_EE_Contact 1");
dyna.Set("Time_Step 2e-4");

// 导入三块体碰撞网格
blkdyn.ImportGrid("ansys", "ThreeBContact.dat");

// 创建和更新接触面
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置单元模型为本构类型
blkdyn.SetModel("linear");

// 设置三块体的材料参数（密度、弹性模量、泊松比、粘聚力、抗拉强度、内摩擦角、剪胀角）
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 1);
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 2);
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 3);

// 设置界面接触材料参数（法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度）
blkdyn.SetIMat(1e10, 1e10, 3.0, 0.0, 0.0);

// 设置接触面本构为脆性断裂Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");

// 设置底部边界固定
var x = new Array(-1e10, 1e10);
var y = new Array(-1e10, 1e10);
var z = new Array(-1e10, 1e10);

blkdyn.FixVByCoord("xyz", 0.0, -1e10, 1e10, -1e10, 0.01, -1e10, 1e10);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 设置监测点（监测三块体在碰撞过程中的位移响应）
dyna.Monitor("block", "xdis", 0, 10, 0);
dyna.Monitor("block", "xdis", 12.5, 15, 0);
dyna.Monitor("block", "xdis", 15, 20, 0);
dyna.Monitor("gvalue", "gv_spring_crack_ratio");

// 求解
dyna.Solve(20000);

print("Solution Finished");
