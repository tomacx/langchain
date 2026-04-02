setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

// 设置重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 设置输出间隔
dyna.Set("Output_Interval 1000");

// 启用大位移分析
dyna.Set("Large_Displace 1");

// 开启接触更新
dyna.Set("If_Renew_Contact 1");

// 设置接触检测容差
dyna.Set("Contact_Detect_Tol 0");

// 导入网格文件
var msh1 = imesh.importGid("SlopeExcavate.msh");
blkdyn.GetMesh(msh1);

// 创建虚拟界面并更新其网格信息
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

// 设置模型为线弹性
blkdyn.SetModel("linear");

// 设置材料参数：密度，弹性模量，泊松比，粘聚力，抗拉强度，内摩擦角，剪胀角
blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

// 设置虚拟界面模型为线弹性
blkdyn.SetIModel("linear");

// 虚拟界面的接触刚度从单元中继承
blkdyn.SetIStiffByElem(1);

// 虚拟界面的强度从单元中继承
blkdyn.SetIStrengthByElem();

// 施加边界条件：X方向左侧法向约束
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);

// X方向右侧法向约束
blkdyn.FixV("x", 0.0, "x", 9.999, 10.01);

// Y方向底部法向约束
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 监测典型点的位移变化
dyna.Monitor("block","xdis", 8, 5, 0);
dyna.Monitor("block","xdis", 6.7683, 3.6442, 0);
dyna.Monitor("block","xdis", 6.2744, 2.4918, 0);

// 执行计算
dyna.Solve();

// 设置虚拟界面模型为脆性材料模型
blkdyn.SetIModel("brittleMC");

// 再次执行计算
dyna.Solve();

// 初始化块体状态
blkdyn.InitialBlockState ();

// 更新虚拟界面强度参数
blkdyn.SetIStrengthByElem();

// 清零指定范围内的位移条件
var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 循环设置模型为无，模拟开挖过程
for(var i = 2; i <= 5; i++) {
    blkdyn.SetModel("none", i);
    dyna.Solve();
    dyna.Save( "ExcGroup_" + i + ".sav" );
}
