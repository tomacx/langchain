setCurDir(getSrcDir());


dyna.Set("Mechanic_Cal 1");


dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 0 -9.8");

dyna.Set("Large_Displace 1");

dyna.Set("Output_Interval 500");



dyna.Set("Moniter_Iter 100");

dyna.Set("If_Virtural_Mass 1");

dyna.Set("Virtural_Step 0.4");

dyna.Set("Renew_Interval 2");

dyna.Set("Contact_Detect_Tol 1e-3");

dyna.Set("If_Renew_Contact 10");

dyna.Set("If_Cal_EE_Contact 1");



blkdyn.ImportGrid("ansys", "wood.dat");



var x = new Array(-1e10, 1e10);
var y = new Array(-1e10, 1e10);
var z = new Array(-1e10, 1e10);



blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMat(2000, 1e8, 0.3, 6e4, 3e4, 25.0, 10.0);


blkdyn.SetIMat(5e9, 5e9, 3.0, 0.0, 0.0);



//rdface.Create (<itype, igroup, TotalPoint, fCoord[]>);

rdface.Create (2, 1, 4, [-0.5,-0.5,0,0.6,-0.5,0,0.6,0.6,0,-0.5,0.6,0]);


blkdyn.SetIModel("brittleMC");

dyna.Solve();


blkdyn.SetModel("none", 27);


dyna.Set("If_Virtural_Mass 0");
blkdyn.SetLocalDamp(0.05);



dyna.TimeStepCorrect(0.5);

blkdyn.SetIModel("brittleMC");

dyna.Solve();



print("Solution Finished");