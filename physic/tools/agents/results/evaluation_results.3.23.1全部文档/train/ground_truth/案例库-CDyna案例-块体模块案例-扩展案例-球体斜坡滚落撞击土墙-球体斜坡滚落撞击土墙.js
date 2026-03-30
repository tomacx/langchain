setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();
igeo.clear();
imeshing.clear();

igeo.genBallV(0,0,0,1.0,0.5,1);

igeo.genBrickV(4,-3,-2, 4.5,2,2, 0.5, 2);

imeshing.genMeshByGmsh(3);


dyna.Set("Output_Interval 500");

dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1");

dyna.Set("If_Virtural_Mass 0");

dyna.Set("If_Cal_EE_Contact 1");

dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9 0 0 0");

blkdyn.GetMesh(imeshing);

blkdyn.CrtIFace(2);
blkdyn.CrtBoundIFaceByGroup(1);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("linear");
blkdyn.SetMat(7800, 3e8, 0.3, 1e6, 1e6, 35, 5, 1);
blkdyn.SetMat(2500, 3e8, 0.25, 5e5, 5e5, 35, 5, 2);

blkdyn.SetIModel("brittleMC");
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

blkdyn.SetLocalDamp(0.01);

blkdyn.FixV("xyz", 0, "y", -3.01, -2.99);



rdface.Create (2, 3, 4, [2, -3, -4, 8, -3, -4, 8, -3, 4, 2, -3, 4] );

rdface.Create (2, 3, 4, [2, -3, -4, 2, -3, 4, -3, 1, 4, -3, 1, -4] );

dyna.TimeStepCorrect(0.5);

dyna.Solve(10000);
