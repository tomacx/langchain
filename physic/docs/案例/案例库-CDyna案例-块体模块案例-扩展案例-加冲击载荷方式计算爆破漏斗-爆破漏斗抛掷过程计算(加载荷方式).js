setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
doc.clearResult();
dyna.Clear();


var Length = 15;
var Height = 5;
var CenterX = Length / 2.0;
var CenterY = 3.0;
var Rad = 0.75;
var Size1 = 0.4;
var Size2 = 0.2;

igeo.genRect(0,0,0, Length, Height, 0,Size1);

igeo.genCircle(CenterX, CenterY, 0.0, Rad, Size2);

igeo.genSurface([1,2], 1);


imeshing.genMeshByGmsh(2);

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Contact_Detect_Tol 1e-3");

//设置计算结果的输出间隔为100步
dyna.Set("Output_Interval 2000");

//设置监测信息输出时步为10步
dyna.Set("Moniter_Iter 10");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

dyna.Set("Elem_Kill_Option 1 1 1 1 1");


dyna.Set("If_ContFrac_Reduced_Mat 1 1.0 1.0 0.57");

dyna.Set("SaveFile_Out 1");

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace(1,1);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(2000, 1e10, 0.28, 8.19e6, 8.11e6, 56.2, 15);

blkdyn.SetIModel("linear");
blkdyn.SetIStiffByElem(1.0);
blkdyn.SetIStrengthByElem();
blkdyn.SetIMat(3e12, 3e12, 0, 0, 0, 1,2);


blkdyn.FixV("x", 0,"x",-0.0001, 0.0001);
blkdyn.FixV("x", 0,"x",Length -0.0001, Length  + 0.0001);
blkdyn.FixV("y", 0,"y",-0.0001, 0.0001);

//监测块体破坏度及破裂度
dyna.Monitor("gvalue","gv_block_broken_ratio");
dyna.Monitor("gvalue","gv_block_crack_ratio");

dyna.Monitor("gvalue","gv_spring_broken_ratio");
dyna.Monitor("gvalue","gv_spring_crack_ratio");

dyna.Solve();
dyna.Save("Stage1.sav");

blkdyn.SetModel("linear");
blkdyn.SetIModel("brittleMC");
dyna.Set("Interface_Soften_Value 1e-5 1e-4");
dyna.Solve();
dyna.Save("Stage2.sav");




//初始化位移
var value = [0.0, 0.0, 0.0];
var gradient = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
blkdyn.InitConditionByCoord("displace", value, gradient, -1000, 1000, -1000, 1000, -1000, 1000);

blkdyn.InitialBlockState();


//打开大变形计算开关
dyna.Set("Large_Displace 1");


dyna.Set("If_Virtural_Mass 0");

dyna.Set("Time_Now 0.0");

//将局部阻尼设置为0.0
blkdyn.SetLocalDamp(0.00);

dyna.Set("If_Cal_Rayleigh 1")

//将刚度阻尼系数设置为5e-7，质量阻尼系数设置为0.0
blkdyn.SetRayleighDamp(5e-7, 0.0);


dyna.TimeStepCorrect(0.8);


blkdyn.FreeV("x", "x",-0.0001, 0.0001);
blkdyn.FreeV("x", "x",Length -0.0001, Length  + 0.0001);
blkdyn.FreeV("y", "y",-0.0001, 0.0001);

blkdyn. SetQuietBoundByCoord (-0.0001, 0.0001, -1e5, 1e5, -1e5, 1e5);
blkdyn. SetQuietBoundByCoord (Length -0.0001, Length  + 0.0001, -1e5, 1e5, -1e5, 1e5);
blkdyn. SetQuietBoundByCoord ( -1e5, 1e5, -0.0001, 0.0001,-1e5, 1e5);

//设定三个方向载荷系数
var coeff=new Array(0.0, 0.0, -1.0)
//定义圆柱端点1的坐标
var end1= new Array(CenterX, CenterY, -0.1);
//定义圆柱端点2的坐标
var end2= new Array(CenterX, CenterY, 0.1);
//在半径为1m的圆柱面上施加动态法向面力边界
blkdyn.ApplyDynaVarFromFileByCylinder("face_force", true ,coeff, "appliedData.txt",end1, end2, Rad - 8e-3, Rad + 8e-3);

dyna.DynaCycle(3);
dyna.Save("Stage3.sav");



blkdyn.ExportGradationCurveByGroup(1, 1);

//打印提示信息
print("Solution Finished");
