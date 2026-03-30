setCurDir(getSrcDir());

doc.clearResult();
dyna.Clear();
imeshing.clear();
igeo.clear();

var f1 = igeo.genRect(0,0,0, 60, 40, 0, 2);

var f2 = igeo.genRect(27,20,0, 33, 24, 0, 0.5);

var loop = [f1, f2];

igeo.genSurface(loop, 1);

var loop = [f2];
igeo.genSurface(loop, 2);

imeshing.genMeshByGmsh(2);

///计算
dyna.Set("Virtural_Step 0.5");

dyna.Set("Output_Interval 1000");

blkdyn.GetMesh(imeshing);

blkdyn.SetModel("TransIso");

blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35, 15);


///定义各向同性面的法向,45°方向
var normal = new Array(1, 1, 0);

///设定全局材料号为1的横观各向同性材料参数
//各向同性面上的弹性模量、泊松比;垂直面上的弹性模量、泊松比
blkdyn.SetTransIsoMat(1, 3e10, 0.25, 1e10, 0.30, normal);

//blkdyn.SetTransIsoMat(1, 3e10, 0.25, 3e10, 0.25, normal);

//对组1-10的单元绑定横观各向同性材料号1
blkdyn.BindTransIsoMat(1, 1, 10);

//模型底部及四周法向约束
blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x",0, "x", 59.99, 61);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

for(var i = 0; i < 11; i++)
{
dyna.Monitor("block","ydis", 5 + i * 5, 40 ,0);
}

dyna.Solve();

dyna.Save("elastic.sav");

//定义三个方向基础值
var values = new Array(0.0,0.0, 0);
//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
//将组号1到3范围内的节点位移初始化为设定值
blkdyn.InitConditionByGroup("displace", values, gradient, 1, 3);

blkdyn.SetModel("none", 2);

dyna.Solve();
