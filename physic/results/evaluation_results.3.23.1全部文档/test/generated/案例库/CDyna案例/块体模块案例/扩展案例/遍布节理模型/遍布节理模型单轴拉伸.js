setCurDir(getSrcDir());

doc.clearResult();
dyna.Clear();
imeshing.clear();
igeo.clear();

// 创建几何模型
var f1 = igeo.genRect(0, 0, 0, 60, 40, 0, 2);
var f2 = igeo.genRect(27, 20, 0, 33, 24, 0, 0.5);

// 定义边界
var loop1 = [f1];
var loop2 = [f2];

// 创建表面并生成网格
igeo.genSurface(loop1, 1);
igeo.genSurface(loop2, 2);
imeshing.genMeshByGmsh(2);

// 设置计算参数
dyna.Set("Virtural_Step", 0.5);
dyna.Set("Output_Interval", 1000);

// 获取网格并设置模型和材料属性
blkdyn.GetMesh(imeshing);
blkdyn.SetModel("TransIso");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 15);

// 设置横观各向同性材料参数
var normal = new Array(1, 1, 0);
blkdyn.SetTransIsoMat(1, 3e10, 0.25, 1e10, 0.30, normal);
blkdyn.BindTransIsoMat(1, 1, 10);

// 施加约束
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", 59.99, 61);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

// 设置监测点
for (var i = 0; i < 11; i++) {
    dyna.Monitor("block", "ydis", 5 + i * 5, 40, 0);
}

// 计算并保存结果
dyna.Solve();
dyna.Save("elastic.sav");

// 初始化条件
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByGroup("displace", values, gradient, 1, 3);

// 设置模型为无
blkdyn.SetModel("none", 2);

// 计算并保存结果
dyna.Solve();
dyna.Save("excavation.sav");

// 再次初始化条件
blkdyn.InitConditionByGroup("displace", values, gradient, 1, 3);
