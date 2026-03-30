setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

//geo.GenRectS(0,0,0,1,1,0,0.025,1);

//mesh.GenMeshByGmsh(2);

imeshing.genBrick2D("f1",1,1,50,50);

dyna.Set("Large_Displace 1");


dyna.Set("Output_Interval 500");

dyna.Set("If_Virtural_Mass 0");

blkdyn.GetMesh(imeshing);


blkdyn.SetModel("Landau");

blkdyn.SetMat(1150,3e8, 0.2, 3e5,3e5,30, 15);

var apos = [0.2, 0.2, 0, 0.8, 0.2, 0, 0.8, 0.8 ,0, 0.2, 0.8, 0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 21e9, apos, 0.0, 10);
blkdyn.BindLandauSource(1, 1, 1);
blkdyn.SetModel("Landau", 1);


//blkdyn.SetJWLSource(1, 1630, 7.0e9, 371.2e9, 3.2e9, 4.2, 0.95, 0.30, 21e9, 6930, apos, 0.0, 15e-3 );
//blkdyn.BindJWLSource(1, 1, 1);
//blkdyn.SetModel("JWL", 1);


blkdyn.SetLocalDamp(0.01);


dyna.Set("Time_Step 1e-8");

dyna.Solve(10000);
