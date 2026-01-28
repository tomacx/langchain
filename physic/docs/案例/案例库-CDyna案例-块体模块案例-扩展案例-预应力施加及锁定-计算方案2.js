//先在钢筋上加载荷，拉拔（不反压混凝土），然后扯掉拉力，将钢筋第一个节点与混凝土粘接强度增强

setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();


var id1 = igeo.genBrickV(0,0,0,1.0,0.3, 0.3, 0.05, 1);

var id2 = igeo.genCylinderV(-0.1,0.15,0.15,0,0.15,0.15,0.0, 0.1, 0.02, 0.02, 2);

igeo.glue("volume",id1, id2);

imeshing.genMeshByGmsh(3);

dyna.Set("If_Cal_Bar 1");

dyna.Set("Output_Interval 500");

dyna.Set("Gravity 0 0 0");

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace(1,2);

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMat(2500,3e10,0.25,10e6, 5e6,35,10,1);

blkdyn.SetMat(2000,1e10,0.25,10e6, 5e6,35,10,2);

blkdyn.SetIModel("brittleMC");

blkdyn.SetIMat(1e12, 1e12, 10.0, 0.0, 0.0);

blkdyn.FixV("xyz", 0.0, "x", 0.999, 1.01);

//创建第1根锚索
var fArrayCoord1 = [-0.095,0.15, 0.15];
var fArrayCoord2 = [0.8,0.15,0.15];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 30);


//设置所有锚索的力学模型为可破坏模型
bar.SetModelByID("failure", 1, 100);

//定义两种锚索材料
var BarProp1 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.4, 0.0];
var BarProp2 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.4, 0.0];

//指定自由段的锚索材料
bar.SetPropByID(BarProp2, 1, 10, 1, 23);

//指定锚固段的锚索材料
bar.SetPropByID(BarProp1, 1, 10, 24, 30);

//施加x方向力，为1kN。
bar.ApplyForceByID([-1e3, 0.0, 0.0], 1,11,1,1);


dyna.Monitor("bar","a_normal_force",  0, 0.15, 0.15);
dyna.Monitor("bar","a_normal_force",  0.2, 0.15, 0.15);
dyna.Monitor("bar","a_normal_force",  0.4, 0.15, 0.15);
dyna.Monitor("bar","a_normal_force",  0.6, 0.15, 0.15);
dyna.Monitor("bar","a_normal_force",  0.8, 0.15, 0.15);

dyna.Solve(5000);

//反向施加1Kn力，抵消。
bar.ApplyForceByID([1e3, 0.0, 0.0], 1,11,1,1);

//第一点强度增高
bar.SetPropByID(BarProp1, 1, 10, 1, 1);

dyna.Solve(5000);
