setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

dyna.Set("Output_Interval 500");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Large_Displace 1");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Contact_Detect_Tol 1e-1");

rdface.Import("ansys","Bound.dat");

dyna.Set("If_Cal_EE_Contact 1");

igeo.genBrickV(450, 450, 310, 550,550,400, 10, 1);

imeshing.genMeshByGmsh(3);

//mesh.GenBrick3D("2",50,50,50,5,5,5,475,475, 300);

dyna.Set("Gravity 0 0 -9.8");

blkdyn.GetMesh(imeshing);


blkdyn.CrtIFace();
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(2500,5e8,0.3, 0,0,15,0);
blkdyn.SetIModel("brittleMC");
blkdyn.SetIMat(5e9, 5e9, 15, 0, 0);

blkdyn.SetLocalDamp(0.02);

dyna.TimeStepCorrect(0.6);

dyna.Solve(40000);
