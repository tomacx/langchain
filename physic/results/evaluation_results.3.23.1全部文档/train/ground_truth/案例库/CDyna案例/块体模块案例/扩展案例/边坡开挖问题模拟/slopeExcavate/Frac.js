setCurDir(getSrcDir());

dyna.Clear();

doc.clearResult();

dyna.Set("Gravity 0 -9.8 0");

dyna.Set("Output_Interval 1000");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Contact_Detect_Tol 0");

var msh1=imesh.importGid("SlopeExcavate.msh");
blkdyn.GetMesh(msh1);

///创建虚拟界面
blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

//blkdyn.SetMat(2000, 3e8, 0.3, 3e4, 1e4, 15, 10);

blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

//设置虚拟界面模型及参数
blkdyn.SetIModel("linear");

//虚拟界面的接触刚度从单元中继承
blkdyn.SetIStiffByElem(1);

//虚拟界面的强度从单元中继承
blkdyn.SetIStrengthByElem();

blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);

blkdyn.FixV("x", 0.0, "x", 9.999, 10.01);

blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

dyna.Monitor("block","xdis", 8, 5, 0);

dyna.Monitor("block","xdis", 6.7683, 3.6442, 0);

dyna.Monitor("block","xdis", 6.2744, 2.4918, 0);

dyna.Solve();

//blkdyn.SetModel("SoftenMC");

blkdyn.SetIModel("brittleMC");

dyna.Solve();

blkdyn.InitialBlockState ();

blkdyn.SetIStrengthByElem();


//定义三个方向基础值
var values = new Array(0.0,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将控制范围内的位移清零
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);


for(var i = 2; i <= 5; i++)
{
blkdyn.SetModel("none", i);

dyna.Solve();

dyna.Save( "ExcGroup_" + i + ".sav" );
}
