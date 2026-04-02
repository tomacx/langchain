// 设置当前工作路径为脚本文件所在路径
setCurDir(getSrcDir());

// 清除力学计算模块数据
dyna.Clear();

// 清除平台结果数据
doc.clearResult();

// 设置重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 设置输出间隔步数为100000
dyna.Set("Output_Interval 100000");

// 导入GiD格式的网格文件
var msh1 = imesh.importGid("SlopeExcavate.msh");
blkdyn.GetMesh(msh1);

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数：密度、杨氏模量、泊松比、拉伸强度、剪切强度、摩擦角、局部阻尼
blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

// 对模型底部进行全约束
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 9.999, 10.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 设置监测点
dyna.Monitor("block","xdis", 8, 5, 0);
dyna.Monitor("block","xdis", 6.7683, 3.6442, 0);
dyna.Monitor("block","xdis", 6.2744, 2.4918, 0);

// 进行力学计算
dyna.Solve();

// 设置实体单元为软化模型
blkdyn.SetModel("SoftenMC");

// 再次进行力学计算
dyna.Solve();

// 初始化控制范围内的位移清零
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 循环设置模型为无约束并进行计算
for(var i = 2; i <= 5; i++) {
    blkdyn.SetModel("none", i);
    dyna.Solve();
}
