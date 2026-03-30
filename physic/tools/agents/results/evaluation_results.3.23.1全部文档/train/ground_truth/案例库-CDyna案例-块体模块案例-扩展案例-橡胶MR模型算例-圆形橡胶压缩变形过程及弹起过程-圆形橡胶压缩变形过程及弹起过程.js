setCurDir(getSrcDir());

dyna.Clear();
imeshing.clear();
igeo.clear();
doc.clearResult();


igeo.genCircleS(0,0.5,0, 1.0, 0.05, 3);

imeshing.genMeshByGmsh(2);


dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Gravity 0 -9.8 0");

dyna.Set("If_Renew_Contact 1");

dyna.Set("Renew_Interval 10");

dyna.Set("Contact_Detect_Tol 0.001");

//设置单元与刚性面接触模型为3
dyna.Set("Block_Rdface_Contact_Scheme 3");

blkdyn.GetMesh(imeshing);
blkdyn.CrtBoundIFaceByGroup(3);
blkdyn.UpdateIFaceMesh();

blkdyn.SetModel("MR");

blkdyn.SetMat(1100, 2e9, 0.485, 1e6, 1e6, 35,15);

///设置MR材料参数
var MRMat = [0.352, 0.027, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 0.0];


blkdyn.SetIModel("brittleMC");

blkdyn.SetIMat(5e11, 5e11, 0, 0, 0);

blkdyn.SetMRMat(1, MRMat);

blkdyn.BindMRMat(1, 1, 100);


blkdyn.SetLocalDamp(0.00);

dyna.TimeStepCorrect(0.1);

dyna.Set("Time_Step 2e-6");

dyna.Set("Virtural_Step 0.5");

dyna.Monitor("block","soyy",0, 1.5, 0.0);
dyna.Monitor("block","soyy", 0, 1.0, 0.0);
dyna.Monitor("block","soyy", 0, 0.5, 0.0);
dyna.Monitor("block","soyy", 0, 0.0, 0.0);
dyna.Monitor("block","soyy", 0, -0.5, 0.0);

dyna.Monitor("block","syy",0, 1.5, 0.0);
dyna.Monitor("block","syy", 0, 1.0, 0.0);
dyna.Monitor("block","syy", 0, 0.5, 0.0);
dyna.Monitor("block","syy", 0, 0.0, 0.0);
dyna.Monitor("block","syy", 0, -0.5, 0.0);



dyna.Set("If_Cal_Rayleigh 1");
blkdyn.SetRayleighDamp(1e-6, 0);


//rdface.Create (<itype, igroup, TotalPoint, fCoord[]>);
rdface.Create (1,1, 2,[-3,0,0, -1,0,0]);
rdface.Create (1,1, 2,[-1,0,0, -0.5,-0.5,0]);
rdface.Create (1,1, 2,[-0.5,-0.5,0, 0.5,-0.5,0]);
rdface.Create (1,1, 2,[0.5,-0.5,0, 1,0,0]);
rdface.Create (1,1, 2,[1,0,0, 3,0,0]);

rdface.Create (1,2, 2,[-3,1.5,0, 3,1.5,0]);

rdface.ApplyVelocityByGroup ([0, -20, 0], 2, 2);


dyna.Solve(18000);


rdface.SetModelByGroup(0, 2, 2);

dyna.Solve(60000);
