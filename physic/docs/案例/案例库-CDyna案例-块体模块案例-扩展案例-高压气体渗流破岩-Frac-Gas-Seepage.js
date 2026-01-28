//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

igeo.genRectS(0,0,0,1,1,0,0.1,1);

imeshing.genMeshByGmsh(2);

//关闭力学计算开关
dyna.Set("Mechanic_Cal 1");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Contact_Detect_Tol 0.0");


//包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

dyna.Set("Seepage_Mode 2");

//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 0.0");

//设置结果输出时步
dyna.Set("Output_Interval 1000");

//打开裂隙渗流与固体破裂耦合开关
dyna.Set("FS_Solid_Interaction 1");

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 15);

blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e11, 1e11, 35, 3e6, 1e6);

//创建裂隙
fracsp.CreateGridFromBlock (2);

//设置裂隙渗流参数，fDensity, fBulk, fScK, fInitCrackWid, fFrictionL, fFrictionU
//对于气体渗流模式，体积模量不起作用
fracsp.SetPropByGroup(1.293,1e7,7e-9,1e-6,1,11);

//初始化压力
fracsp.InitConditionByCoord("pp", 1e5, [0,0,0], -1e6, 1e6, -1e6, 1e6, -1e6, 1e6);

var ID = Math.round (fracsp.GetNodeID (0.5, 0.5, 0) );

var fx = fracsp.GetNodeValue(ID, "Coord", 1);
var fy = fracsp.GetNodeValue(ID, "Coord", 2);
//加气
fracsp.ApplyConditionByCoord("source", 1e-2,  [0.0, 0.0, 0.0], fx - 1e-3, fx + 1e-3, fy - 1e-3, fy + 1e-3, -1, 1);

//自动计算时步
dyna.Set("Time_Step 1e-6");

//求解5万步
dyna.Solve(50000);

//打印提示信息
print("Solution Finished");
