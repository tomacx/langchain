setCurDir(getSrcDir());

dyna.Set("Mechanic_Cal 1");

dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 0.0 0");

dyna.Set("Large_Displace 0");

dyna.Set("Output_Interval 200");

dyna.Set("GiD_Out 0");

dyna.Set("Msr_Out 0");

dyna.Set("Moniter_Iter 100");

dyna.Set("If_Virtural_Mass 1");

dyna.Set("Virtural_Step 0.5");

dyna.Set("Renew_Interval 100");

dyna.Set("Contact_Detect_Tol 0.00");

dyna.Set("If_Renew_Contact 0");

dyna.Set("SaveFile_Out 0");


blkdyn.ImportGrid("gmsh", "10cm-20cm.msh");

blkdyn.CrtIFace(1, 1);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");

blkdyn.SetMatByGroup(2500, 1e10, 0.25, 3e6, 3e6, 40.0, 10.0, 1);

blkdyn.SetIMat(5e13, 5e13, 30, 3e6, 1e6);
blkdyn.SetIModel("FracE");

blkdyn.FixVByCoord("y", 0.0,-1e10, 1e10, -1e-4,1e-4, -1e10, 1e10);

blkdyn.FixVByCoord("y", -2e-8, -1e10, 1e10, 0.1999, 0.21, -1e10, 1e10);

blkdyn.SetIModel("brittleMC");


dyna.Solve(20000);

print("Solution Finished");


