setCurDir(getSrcDir());


dyna.Set("Mechanic_Cal 1");

dyna.Set("UnBalance_Ratio 1e-2");

dyna.Set("Gravity 0.0 -9.8 0.0");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");


dyna.Set("If_Cal_EE_Contact 1");

dyna.Set("Output_Interval 5000");

dyna.Set("Moniter_Iter 100");

dyna.Set("Contact_Detect_Tol 5.0e-3");

dyna.Set("Renew_Interval 100");

dyna.Set("If_Virtural_Mass 1");

dyna.Set("Virtural_Step 0.5");

dyna.Set("If_Cal_Bar 0");




///////////创建刚性面/////////////////////////////////////

var fCoord=new Array();
fCoord[0]=new Array(-40, 8, 0);
fCoord[1]=new Array(-40, 8, 69);
fCoord[2]=new Array(-0.2, 8, 69);
fCoord[3]=new Array(-0.2, 8, 0);
rdface.Create (2, 1, 4, fCoord);

var fCoord=new Array();
fCoord[0]=new Array(43, 8, -0.2);
fCoord[1]=new Array(43, 8, -40);
fCoord[2]=new Array(-40, 8, -40);
fCoord[3]=new Array(-40, 8, -0.2);
rdface.Create(2, 1, 4, fCoord);

var fCoord=new Array();
fCoord[0]=new Array(-40, 8, 69.2);
fCoord[1]=new Array(-40, 8, 109);
fCoord[2]=new Array(43, 8, 109);
fCoord[3]=new Array(43, 8, 69.2);
rdface.Create (2, 1, 4, fCoord);




///////////导入模型/////////////////////////////////////

blkdyn.ImportGrid("ansys", "Model.dat");

blkdyn.CrtIFace (1, 1);
blkdyn.CrtIFace (-1,-1);

blkdyn.CrtBoundIFaceByCoord(0.001, 42.99, 7.999, 10000, 0.001, 68.999);

blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMat(3200,  6.0e10,  0.25,  36e6, 12e6, 40, 10);

blkdyn.SetIModel("linear");


blkdyn.SetIStrengthByElem();
blkdyn.SetIStiffByElem(1);

blkdyn.SetLocalDamp(0.8);


blkdyn.FixVByCoord("y", 0.0, -1e4, 1e4, -0.001, 0.001, -1e4, 1e4);
blkdyn.FixVByCoord("x", 0.0, -0.001, 0.001, -1e4, 1e4, -1e4, 1e4);
blkdyn.FixVByCoord("x", 0.0, 42.9, 43.1, -1e4, 1e4, -1e4, 1e4);
blkdyn.FixVByCoord("z", 0.0, -1e4, 1e4, -1e4, 1e4, -0.01, 0.01);
blkdyn.FixVByCoord("z", 0.0, -1e4, 1e4, -1e4, 1e4, 68.9, 71);


///////////创建杆件/////////////////////////////////////

bar.CreateByCoord("BlastHole1", 14.5, 5, 15, 14.5, 13.5, 15, 30);
bar.CreateByCoord("BlastHole1", 14.5, 5, 21.5, 14.5, 13.5, 21.5, 30);
bar.CreateByCoord("BlastHole1", 14.5, 5, 28, 14.5, 13.5, 28, 30);
bar.CreateByCoord("BlastHole1", 14.5, 5, 34.5, 14.5, 13.5, 34.5, 30);
bar.CreateByCoord("BlastHole1", 14.5, 5, 41, 14.5, 13.5, 41, 30);
bar.CreateByCoord("BlastHole1", 14.5, 5, 47.5, 14.5, 13.5, 47.5, 30);
bar.CreateByCoord("BlastHole1", 14.5, 5, 54, 14.5, 13.5, 54, 30);

bar.CreateByCoord("BlastHole1", 21, 5, 15, 21, 13.5, 15, 30);
bar.CreateByCoord("BlastHole1", 21, 5, 21.5, 21, 13.5, 21.5, 30);
bar.CreateByCoord("BlastHole1", 21, 5, 28, 21, 13.5, 28, 30);
bar.CreateByCoord("BlastHole1", 21, 5, 34.5, 21, 13.5, 34.5, 30);
bar.CreateByCoord("BlastHole1", 21, 5, 41, 21, 13.5, 41, 30);
bar.CreateByCoord("BlastHole1", 21, 5, 47.5, 21, 13.5, 47.5, 30);
bar.CreateByCoord("BlastHole1", 21, 5, 54, 21, 13.5, 54, 30);

bar.CreateByCoord("BlastHole1", 27.5, 5, 15, 27.5, 13.5, 15, 30);
bar.CreateByCoord("BlastHole1", 27.5, 5, 21.5, 27.5, 13.5, 21.5, 30);
bar.CreateByCoord("BlastHole1", 27.5, 5, 28, 27.5, 13.5, 28, 30);
bar.CreateByCoord("BlastHole1", 27.5, 5, 34.5, 27.5, 13.5, 34.5, 30);
bar.CreateByCoord("BlastHole1", 27.5, 5, 41, 27.5, 13.5, 41, 30);
bar.CreateByCoord("BlastHole1", 27.5, 5, 47.5, 27.5, 13.5, 47.5, 30);

bar.CreateByCoord("BlastHole1", 27.5, 5, 54, 27.5, 13.5, 54, 30);


var value1 = [0.25, 1150, 1.0e10, 0.3, 235e1, 235e1, 3e6, 35, 1e9, 0.8, 0];
bar.SetPropByID(value1, 1, 20000, 1, 150);


var Pos1 = [14.5, 5, 15];
blkdyn.SetLandauSource(1, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos1, 0, 1.5e-2);

var Pos2 = [14.5, 5, 21.5];
blkdyn.SetLandauSource(2, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos2, 4.2e-2, 1.5e-2);

var Pos3 = [14.5, 5, 28];
blkdyn.SetLandauSource(3, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos3, 0.084, 1.5e-2);

var Pos4 = [14.5, 5, 34.5];
blkdyn.SetLandauSource(4, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos4, 1.26e-1, 1.5e-2);

var Pos5 = [14.5, 5, 41];
blkdyn.SetLandauSource(5, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos5, 0.168, 1.5e-2);

var Pos6 = [14.5, 5, 47.5];
blkdyn.SetLandauSource(6, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos6, 0.21, 1.5e-2);

var Pos7 = [14.5, 5, 54];
blkdyn.SetLandauSource(7, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos7, 0.252, 1.5e-2);

var Pos8 = [21, 5, 15];
blkdyn.SetLandauSource(8, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos8, 6.5e-2, 1.5e-2);

var Pos9 = [21, 5, 21.5];
blkdyn.SetLandauSource(9, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos9, 0.107, 1.5e-2);

var Pos10 = [21, 5, 28];
blkdyn.SetLandauSource(10, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos10, 0.149, 1.5e-2);

var Pos11 = [21, 5, 34.5];
blkdyn.SetLandauSource(11, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos11, 0.191, 1.5e-2);

var Pos12 = [21, 5, 41];
blkdyn.SetLandauSource(12, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos12, 0.233, 1.5e-2);

var Pos13 = [21, 5, 47.5];
blkdyn.SetLandauSource(13, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos13, 0.275, 1.5e-2);

var Pos14 = [21, 5, 54];
blkdyn.SetLandauSource(14, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos14, 0.317, 1.5e-2);

var Pos15 = [27.5, 5, 15];
blkdyn.SetLandauSource(15, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos15, 0.13, 1.5e-2);

var Pos16 = [27.5, 5, 21.5];
blkdyn.SetLandauSource(16, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos16, 0.172, 1.5e-2);

var Pos17 = [27.5, 5, 28];
blkdyn.SetLandauSource(17, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos17, 0.214, 1.5e-2);

var Pos18 = [27.5, 5, 34.5];
blkdyn.SetLandauSource(18, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos18, 0.256, 1.5e-2);

var Pos19 = [27.5, 5, 41];
blkdyn.SetLandauSource(19, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos19, 0.298, 1.5e-2);

var Pos20 = [27.5, 5, 47.5];
blkdyn.SetLandauSource(20, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos20, 0.340, 1.5e-2);

var Pos21 = [27.5, 5, 54];
blkdyn.SetLandauSource(21, 1150, 5600, 3.4e6, 3, 1.3333, 2.95e10, Pos21, 0.382, 1.5e-2);


for(var i = 1; i <=21; i++)
{
bar.BindLandauSource(i, i, i);
}


dyna.Monitor("block", "magvel", 7.8, 30, 0);
dyna.Monitor("block", "magvel", 83, 42, 0);

dyna.Monitor("block", "average_normal_stress", 11.69, 17.09, 0);
dyna.Monitor("block", "average_normal_stress", 81.3, 20.3, 0);

dyna.Monitor("gvalue", "gv_spring_broken_ratio");
dyna.Monitor("gvalue", "gv_spring_crack_ratio");
dyna.Monitor("gvalue", "gv_block_broken_ratio");


///////////静态计算/////////////////////////////////////


dyna.Solve();

dyna.Save("Elastic.sav");

blkdyn.SetModel("MC");

blkdyn.SetIModel("brittleMC");

dyna.Solve();

dyna.Save("Plastic.sav");


blkdyn.FreeVByCoord("y", -1e4, 1e4, -0.001, 0.001, -1e4, 1e4);
blkdyn.FreeVByCoord("x", -0.001, 0.001, -1e4, 1e4, -1e4, 1e4);
blkdyn.FreeVByCoord("x", 42.9, 43.1, -1e4, 1e4, -1e4, 1e4);
blkdyn.FreeVByCoord("z", -1e4, 1e4, -1e4, 1e4, -0.001, 0.001);
blkdyn.FreeVByCoord("z", -1e4, 1e4, -1e4, 1e4, 68.9, 71);


blkdyn.SetQuietBoundByCoord(-1e4, 1e4, -0.001, 0.001, -1e4, 1e4);
blkdyn.SetQuietBoundByCoord(-0.001, 0.001, -1e4, 1e4, -1e4, 1e4);
blkdyn.SetQuietBoundByCoord(42.9, 43.1, -1e4, 1e4, -1e4, 1e4);
blkdyn.SetQuietBoundByCoord(-1e4, 1e4, -1e4, 1e4, -0.001, 0.001);
blkdyn.SetQuietBoundByCoord(-1e4, 1e4, -1e4, 1e4, 68.9, 71);


var value1 = [0.0, 0.0, 0.0];
var gradient1 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
blkdyn.InitConditionByCoord("displace", value1, gradient1, -10000, 10000, -10000, 10000, -10000, 10000);


dyna.Set("If_Virtural_Mass 0");

dyna.Set("Time_Now 0");

blkdyn.SetLocalDamp(0.01);

dyna.Set("Time_Step 1e-6");

dyna.Set("If_Cal_Bar 1");


bar.SetModelByID("linear", 1, 21);

dyna.DynaCycle(10);
