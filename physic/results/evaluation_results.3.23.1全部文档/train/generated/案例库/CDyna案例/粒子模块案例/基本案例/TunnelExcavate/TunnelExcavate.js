setCurDir(getSrcDir());

// 清除之前的计算结果和文档结果
dyna.Clear();
doc.clearResult();

// 设置重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 设置结果输出间隔步数
dyna.Set("Output_Interval 100000");

// 导入网格文件并设置模型和材料参数
var msh1 = imesh.importGid("SlopeExcavate.msh");
blkdyn.GetMesh(msh1);

blkdyn.SetModel("linear");
blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

// 对模型底部进行全约束
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 9.999, 10.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 设置监测点
dyna.Monitor("block","xdis", 8, 5, 0);
dyna.Monitor("block","xdis", 6.7683, 3.6442, 0);
dyna.Monitor("block","xdis", 6.2744, 2.4918, 0);

// 求解至稳定
dyna.Solve();

// 更改模型类型并再次求解
blkdyn.SetModel("SoftenMC");
dyna.Solve();

// 将控制范围内的位移清零
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 循环设置模型类型并求解
for(var i = 2; i <= 5; i++) {
    blkdyn.SetModel("none", i);
    dyna.Solve();
}
