setCurDir(getDir());

// 清除Mesh模块几何数据和网格数据
igeo.clear();
imeshing.clear();

// 清除BlockDyna模型数据和Genvi平台数据
dyna.Clear();
doc.clearResult();

// 打开力学计算开关并设置重力加速度为0
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 0.0 0.0");

// 设置大变形计算开关、输出间隔和监测信息输出时步
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 10");

// 关闭虚质量计算开关并打开接触更新开关
dyna.Set("If_Virtural_Mass 0");
dyna.Set("If_Renew_Contact 1");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 创建矩形环和表面，生成二维网格
var loopid1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);
igeo.genSurface([loopid1, loopid2], 1);
igeo.genSurface([loopid2], 2);
imeshing.genMeshByGmsh(2);

// BlockDyna从平台下载网格并设置接触面
blkdyn.GetMesh(imeshing);
blkdyn.CrtIFace(2);
blkdyn.UpdateIFaceMesh();

// 设置模型和材料参数
blkdyn.SetModel("linear");
blkdyn.SetMat(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0);

// 将接触面模型设定为线弹性模型并设置虚拟界面的刚度和强度
blkdyn.SetIModel("linear");
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// 固定边界条件并添加监测点
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 添加监测点
dyna.Monitor("block","xdis", 8, 5, 0);
dyna.Monitor("block","xdis", 6.7683, 3.6442, 0);
dyna.Monitor("block","xdis", 6.2744, 2.4918, 0);

// 求解并保存结果
dyna.Solve();
blkdyn.InitialBlockState();

// 定义基础值和梯度，将控制范围内的位移清零
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 循环设置模型并求解
for (var i = 2; i <= 5; i++) {
    blkdyn.SetModel("none", i);
    dyna.Solve();
    dyna.Save("ExcGroup_" + i + ".sav");
}
