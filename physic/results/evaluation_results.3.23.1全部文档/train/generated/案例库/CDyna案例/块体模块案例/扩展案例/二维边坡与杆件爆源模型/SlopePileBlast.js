setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

// 设置重力加速度
dyna.Set("Gravity", 0, -9.8, 0);

// 设置输出间隔
dyna.Set("Output_Interval", 100000);

// 导入网格模型
var msh1 = imesh.importGid("SlopeExcavate.msh");
blkdyn.GetMesh(msh1);

// 设置力学模型为线弹性
blkdyn.SetModel("linear");

// 设置材料属性
blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

// 固定边界条件
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 9.999, 10.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 监测位移
dyna.Monitor("block", "xdis", 8, 5, 0);
dyna.Monitor("block", "xdis", 6.7683, 3.6442, 0);
dyna.Monitor("block", "xdis", 6.2744, 2.4918, 0);

// 求解
dyna.Solve();

// 更改力学模型为软化Mohr-Coulomb模型
blkdyn.SetModel("SoftenMC");

// 再次求解
dyna.Solve();

// 清零控制范围内的位移
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 循环更改模型并求解
for (var i = 2; i <= 5; i++) {
    blkdyn.SetModel("none", i);
    dyna.Solve();
}
