setCurDir(getSrcDir());

doc.clearResult();
dyna.Clear();
imeshing.clear();
igeo.clear();

var f1 = igeo.genRect(0,0,0, 10, 10, 0, 0.2);

var f2 = igeo.genCircle(5, 5, 0, 0.1, 0.01);

var loop = [f1, f2];

igeo.genSurface(loop, 1);

var loop = [f2];
igeo.genSurface(loop, 2);

imeshing.genMeshByGmsh(2);

///计算
dyna.Set("If_Virtural_Mass 0");

dyna.Set("Gravity 0 0 0");

dyna.Set("Output_Interval 200");
dyna.Set("If_Cal_Rayleigh 1");

blkdyn.GetMesh(imeshing);

blkdyn.SetModel("TransIso",1 );
blkdyn.SetModel("Landau",2 );

blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 15);


///定义各向同性面的法向,45°方向
var normal = new Array(1, 1, 0);

///设定全局材料号为1的横观各向同性材料参数
//各向同性面上的弹性模量、泊松比;垂直面上的弹性模量、泊松比
blkdyn.SetTransIsoMat(1, 3e10, 0.25, 1e10, 0.30, normal);

//对组1的单元绑定横观各向同性材料号1
blkdyn.BindTransIsoMat(1, 1, 1);


///设置起爆点位置
var pos = new Array(5.0, 5.0, 0.0);
///设置序号为1的朗道参数
blkdyn.SetLandauSource(1, 1150, 5600, 3.4e6, 3.0, 1.3333, 9e9, pos, 0.0, 1);

//组2与朗道炸药关联
blkdyn.BindLandauSource(1, 2, 2);

dyna.TimeStepCorrect(0.5);

blkdyn.SetLocalDamp(0.0);


blkdyn.SetRayleighDamp(3e-7, 0.0);

dyna.DynaCycle(1e-3);
