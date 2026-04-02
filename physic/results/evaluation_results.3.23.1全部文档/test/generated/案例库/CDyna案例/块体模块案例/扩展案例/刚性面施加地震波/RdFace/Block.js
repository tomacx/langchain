// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 0.0 0.0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置子空间更新时步为100步
dyna.Set("Renew_Interval 100");

// 设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 2e-3");

// 刚性面创建
var fCoord = new Array();
fCoord[0] = new Array(-5, -5, 0);
fCoord[1] = new Array(5, -5, 0);
rdface.Create (1, 1, 2, fCoord);

// 导入网格文件
blkdyn.ImportGrid("gid", "block.msh");

// 对所有单元的接触面进行切割
blkdyn.CrtIFace();

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

// 设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 3e8, 0.25, 3e6, 1e6, 40.0, 10.0);

// 设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(5e10, 5e10, 10.0, 0.0, 0.0);

// 设定全部节点的局部阻尼系数为0.01
blkdyn.SetLocalDamp(0.01);

// 设置计算时步
dyna.Set("Time_Step 2e-5");

// 计算5万步
for (var i = 0; i < 50000; i++) {
    dyna.Solve();
}
