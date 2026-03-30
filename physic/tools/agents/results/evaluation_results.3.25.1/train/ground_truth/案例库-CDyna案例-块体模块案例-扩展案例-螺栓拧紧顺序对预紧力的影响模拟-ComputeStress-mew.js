setCurDir(getSrcDir());
dyna.Clear();
doc.clearResult();

dyna.Set("Gravity 0 0 0");
dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("Virtural_Step 0.5");

dyna.Set("If_Renew_Contact 1");

//dyna.Set("Contact_Cal_Quantity 1");

dyna.Set("Output_Interval 1000");

blkdyn.ImportGrid("gmsh","plate.msh");

blkdyn.CrtBoundIFaceByCoord(-100,100,-100,100,-0.0001, 0.0001);
blkdyn.CrtBoundIFaceByCoord(-100,100,-100,100,0.0149999,0.0150001);
blkdyn.CrtIFace(1,2);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

//铝合金参数
blkdyn.SetMat(2702,72e9,0.3, 3e6,3e6,0,0,1);
//橡胶参数
blkdyn.SetMat(980,1.2e9,0.48, 3e6,3e6,0,0,2);
//螺栓
blkdyn.SetMat(7800,2.1e11,0.33, 3e6,3e6,0,0,3,100);

blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(1e11, 1e11, 10.0, 0, 0);
blkdyn.SetIStiffByElem(1.0);

dyna.Solve(1);



for(var i = 0; i < 3; i++)
{
var x1 = 0.1 + 0.1 * i;
var y1 = 0.1;
var z1 = 0.01;
dyna.Monitor("block","szz", x1, y1, z1);
}

for(var i = 0; i < 3; i++)
{
var x1 = 0.1 + 0.1 * i;
var y1 = 0.1;
var z1 = 0.005;
dyna.Monitor("block","szz", x1, y1, z1);
}


for(var i = 0; i < 4; i++)
{
var x1 = 0.05 + 0.1 * i;
var y1 = 0.1;
var z1 = 0.015 * 0.5;
dyna.Monitor("block","szz", x1, y1, z1);
}

blkdyn.SetModel("none",3,100);


//定义BaseValue（三个方向基础值）及Grad（三个方向梯度值）两个数组
var BaseValue = [0, 0, 1e6];
var BaseValue1 = [0, 0, -1e6];
var Grad      = [0, 0,0, 0, 0, 0, 0, 0, 0];

for(var i = 0; i < 3; i++)
{
var x1 = 0.1 + 0.1 * i;
var y1 = 0.1;
var z1 = 0.0;
var x2 = 0.1 + 0.1 * i;
var y2 = 0.1;
var z2 = 0.015;
var hh = 0.005;

blkdyn.SetModel("linear",4 + i * 2);


blkdyn.ApplyConditionByCylinder("face_force", BaseValue, Grad, x1, y1, z1 + 0.00499,x2, y2, z2 - 0.00499, 0.0, 0.007999, true);

dyna.Solve(10000);

blkdyn.ApplyConditionByCylinder("face_force", BaseValue1, Grad, x1, y1, z1 + 0.00499,x2, y2, z2 - 0.00499, 0.0, 0.007999, true);

blkdyn.SetModel("linear",3 + i * 2);

blkdyn.InitConditionByGroup("stress", BaseValue, Grad, 3 + i * 2, 3 + i * 2);

dyna.Solve(10000);

Iter = Math.round(dyna.GetValue("Iter_Now"));

dyna.Save("Iter" + Iter  + ".sav");
}
