setCurDir(getSrcDir());


dyna.Set("Mechanic_Cal 1");


dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 -9.8 0");

dyna.Set("Large_Displace 1");

dyna.Set("Output_Interval 500");



dyna.Set("Moniter_Iter 100");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("Virtural_Step 0.6");

dyna.Set("Renew_Interval 100");

dyna.Set("Contact_Detect_Tol 1e-3");

dyna.Set("If_Renew_Contact 1");

dyna.Set("If_Cal_EE_Contact 1");



blkdyn.ImportGrid("ansys", "ThreeBContact.dat");



var x = new Array(-1e10, 1e10);
var y = new Array(-1e10, 1e10);
var z = new Array(-1e10, 1e10);



blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 1);
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 2);
blkdyn.SetMatByGroup(2500, 1e9, 0.3, 6e4, 3e4, 25.0, 10.0, 3);

blkdyn.SetIMat(1e10, 1e10, 3.0, 0.0, 0.0);


blkdyn.FixVByCoord("xyz", 0.0, -1e10, 1e10, -1e10, 0.01, -1e10, 1e10);

blkdyn.SetLocalDamp(0.01);

dyna.Monitor("block", "xdis", 0, 10, 0);	
dyna.Monitor("block", "xdis", 12.5, 15, 0);
dyna.Monitor("block", "xdis", 15, 20, 0);
dyna.Monitor("gvalue", "gv_spring_crack_ratio");


dyna.Set("Time_Step 2e-4");

blkdyn.SetIModel("brittleMC");

dyna.Solve(20000);



print("Solution Finished");