setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 1");


dyna.Set("UnBalance_Ratio 2e-3");
dyna.Set("Gravity 0 -9.8 0");

dyna.Set("Large_Displace 1");

dyna.Set("Output_Interval 500");



dyna.Set("Moniter_Iter 100");

dyna.Set("If_Virtural_Mass 1");

dyna.Set("Virtural_Step 0.5");

dyna.Set("Renew_Interval 100");

dyna.Set("Contact_Detect_Tol 5e-3");

dyna.Set("If_Renew_Contact 1");



blkdyn.ImportGrid("ansys", "AntiDipRockSlope.dat");


blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(2500, 2e10, 0.25, 3e6, 1e6, 35.0, 10.0, 0,10000);


blkdyn.SetIModel("linear");

blkdyn.SetIMat(1e10, 1e10, 35.0, 1e6, 3e5);

blkdyn.SetIMat(1e10, 1e10, 20.0, 6e4, 1e4,  -1,-1);

blkdyn.FixVByCoord("x", 0.0, -1e10, 0.01, -1e10, 1e10, -1e10, 1e10);

blkdyn.FixVByCoord("x", 0.0, 119.99, 121, -1e10, 1e10, -1e10, 1e10);

blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -1e10, 0.01, -1e10, 1e10);

blkdyn.SetLocalDamp(0.8);

dyna.Monitor("block", "xdis", 30, 30, 0);	
dyna.Monitor("block", "xdis", 50, 70, 0);


dyna.Solve()


blkdyn.SetIModel("brittleMC");

blkdyn.SetLocalDamp(0.01);

dyna.Solve(100000);


print("Solution Finished");
