// 设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 设置输出的间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置三个方向的全局重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开单元接触更新开关
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0.01m
dyna.Set("Contact_Detect_Tol 1e-2");

// 导入网格文件
var msh1 = imesh.importGmsh("example.msh");
blkdyn.GetMesh(msh1);

// 创建接触面
blkdyn.CrtIFace(1, 1);
blkdyn.UpdateIFaceMesh();

// 设置所有单元的本构为线弹性模型
blkdyn.SetModel("MC");

// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、抗剪强度、内摩擦角、局部阻尼系数
blkdyn.SetMatByGroup(2500, 6.5e9, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 设置所有接触面的本构为线弹性模型
blkdyn.SetIModel("brittleMC");

// 设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

// 固定边界条件，例如固定x方向和y方向位移
blkdyn.FixV("xyz", 0.0, "z", -1e-2, 1e-2);
blkdyn.FixV("xyz", 0.0, "z", 2.51, 2.53);

// 设置监测信息，例如y方向位移
dyna.Monitor("block", "ydis", 0.64, 1.007, 0);
dyna.Monitor("block", "ydis", 1.14, 1.007, 0);

// 设置计算时步为5e-5
dyna.Set("Time_Step 5e-5");

// 开始模拟
dyna.Solve();
