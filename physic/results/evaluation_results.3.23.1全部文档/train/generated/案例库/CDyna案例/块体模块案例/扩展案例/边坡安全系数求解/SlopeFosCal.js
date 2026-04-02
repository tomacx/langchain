setCurDir(getSrcDir());

dyna.Clear();

doc.clearResult();

// 设置重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 设置不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 导入网格文件
var msh1 = imesh.importGid("SlopeExcavate.msh");
blkdyn.GetMesh(msh1);

// 设置计算本构模型为线弹性
blkdyn.SetModel("linear");

// 设置材料参数：密度、弹性模量、泊松比、粘聚力、内摩擦角、张拉强度、接触刚度
blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

// 设置边界条件：固定左侧和底部的位移
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 设置监测点
dyna.Monitor("block","xdis", 8, 5, 0);
dyna.Monitor("block","xdis", 6.7683, 3.6442, 0);
dyna.Monitor("block","xdis", 6.2744, 2.4918, 0);

// 进行线弹性计算
dyna.Solve();

// 设置本构模型为软化Mohr-Coulomb模型
blkdyn.SetModel("SoftenMC");

// 继续进行非线性计算
dyna.Solve();

// 初始化位移条件
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 设置不同组的模型为无
for (var i = 2; i <= 5; i++) {
    blkdyn.SetModel("none", i);
    dyna.Solve();
}
