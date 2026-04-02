setCurDir(getSrcDir());

// 清除内存数据和结果数据
dyna.Clear();
doc.clearResult();

// 设置重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 设置输出间隔
dyna.Set("Output_Interval 100000");

// 导入网格文件并获取网格信息
var msh1 = imesh.importGid("SlopeExcavate.msh");
blkdyn.GetMesh(msh1);

// 设置模型为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼
blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

// 设置边界条件，固定x方向的左右两侧和y方向的底部
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 9.999, 10.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 设置监测点
dyna.Monitor("block","xdis", 8, 5, 0);
dyna.Monitor("block","xdis", 6.7683, 3.6442, 0);
dyna.Monitor("block","xdis", 6.2744, 2.4918, 0);

// 进行初始求解
dyna.Solve();

// 更改模型为软化模型并重新求解
blkdyn.SetModel("SoftenMC");
dyna.Solve();

// 清零控制范围内的位移
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 循环设置模型为无模型并求解
for (var i = 2; i <= 5; i++) {
    blkdyn.SetModel("none", i);
    dyna.Solve();
}
