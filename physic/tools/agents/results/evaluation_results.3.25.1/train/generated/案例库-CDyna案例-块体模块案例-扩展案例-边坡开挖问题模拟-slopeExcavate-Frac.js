setCurDir(getSrcDir());
dyna.Clear();
doc.clearResult();
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("Output_Interval 1000");
dyna.Set("Large_Displace 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0");

var msh1 = imesh.importGid("SlopeExcavate.msh");
blkdyn.GetMesh(msh1);

blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(2000, 3e8, 0.3, 5e3, 3e3, 15, 10);

blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 9.999, 10.01);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

dyna.Monitor("block", "xdis", 8, 5, 0);
dyna.Monitor("block", "xdis", 6.7683, 3.6442, 0);
dyna.Monitor("block", "xdis", 6.2744, 2.4918, 0);

dyna.Solve();

blkdyn.SetModel("SoftenMC");
dyna.Solve();

blkdyn.InitialBlockState();

blkdyn.SetIStrengthByElem();

var values = new Array(0.0, 0.0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

for (var i = 2; i <= 5; i++) {
    blkdyn.SetModel("none", i);
    dyna.Solve();
    dyna.Save("ExcGroup_" + i + ".sav");
}

dyna.Set("PoreSeepage_Cal 1");
dyna.Set("If_Biot_Cal 1");
dyna.Set("Time_Now 0");
dyna.TimeStepCorrect(1.0);

var arrayK = new Array(1e-10, 1e-10, 1e-10);
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", 39.99, 41);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 14.2, 16.3, 0);
dyna.Monitor("block", "xdis", 20, 25, 0);

dyna.Solve();

dyna.Set("Block_Soften_Value 3e-3 9e-3");
blkdyn.SetModel("SoftenMC");
dyna.Solve();

blkdyn.InitConditionByGroup("displace", [0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 1, 1);

dyna.Set("PoreSeepage_Cal 1");
dyna.Set("If_Biot_Cal 1");
dyna.Set("Time_Now 0");
dyna.TimeStepCorrect(1.0);

var arrayK = new Array(1e-10, 1e-10, 1e-10);
poresp.SetPropByCoord(1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

blkdyn.FixV("x", 0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0, "x", 39.99, 41);
blkdyn.FixV("y", 0, "y", -0.001, 0.001);

dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 14.2, 16.3, 0);
dyna.Monitor("block", "xdis", 20, 25, 0);

dyna.Solve();
