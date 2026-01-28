//建立实体模型，通过初试化应力，实现预应力
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();


var id1 = igeo.genCylinderV(0,0,0,1.0,0.0, 0.0, 0.15, 0.5,0.1, 0.1, 1);

var id2 = igeo.genCylinderV(-0.1,0,0, 0,0,0, 0.0, 0.3, 0.05, 0.05, 2);

var id3 = igeo.genCylinderV(1.0 ,0,0, 1.1, 0, 0, 0.0, 0.3, 0.05, 0.05, 2);

var id4 = igeo.genCylinderV(0.0 ,0, 0, 1, 0, 0, 0.0, 0.1, 0.02, 0.02, 3);

igeo.glue("volume",id2, id4);

igeo.glue("volume",id3, id4);

imeshing.genMeshByGmsh(3);



dyna.Set("If_Cal_Bar 1");

dyna.Set("Output_Interval 500");

dyna.Set("Gravity 0 0 0");

blkdyn.GetMesh(imeshing);

blkdyn.CrtBoundIFaceByCoord(-0.001,0.001,-100,100,-100,100);
blkdyn.CrtBoundIFaceByCoord(0.999,1.01,-100,100,-100,100);

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMat(2500,3e10,0.25,10e6, 5e6,35,10,1);

blkdyn.SetMat(2000,1e10,0.25,10e6, 5e6,35,10,2,3);

blkdyn.SetIModel("brittleMC");

blkdyn.SetIMat(1e12, 1e12, 10.0, 0.0, 0.0);

//blkdyn.FixV("xyz", 0.0, "x", 0.999, 1.01);

//定义三个方向基础值
var values = new Array(1e6,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将组号1到3范围内的节点速度初始化为设定值
blkdyn.InitConditionByGroup("stress", values, gradient, 3,3);


dyna.Monitor("block","sxx",  0.3, 0,0);
dyna.Monitor("block","sxx",  0.6, 0,0);
dyna.Monitor("block","sxx",  0.9, 0,0);
dyna.Solve(5000);

