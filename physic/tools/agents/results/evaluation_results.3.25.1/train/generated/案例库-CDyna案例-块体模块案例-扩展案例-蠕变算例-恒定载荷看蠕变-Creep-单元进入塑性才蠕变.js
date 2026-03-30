setCurDir(getSrcDir());
igeo.clear();
imeshing.clear();
doc.clearResult();
dyna.Clear();

igeo.genRectS(0,0,0,1,0.1,0,0.05,1);
imeshing.genMeshByGmsh(2);

dyna.Set("Creep_Cal 1");
dyna.Set("Creep_G_Inherit 1");
dyna.Set("Auto_Creep_Time 0");
dyna.Set("Elem_Plastic_Cal_Creep 1");
dyna.Set("Output_Interval 500");
dyna.Set("Gravity 0 0 0");
dyna.Set("Large_Displace 0");

blkdyn.GetMesh(imeshing);
blkdyn.SetModel("burger");
blkdyn.SetMat(2000,3e9, 0.3, 8e6, 5e6, 30, 10);

blkdyn.SetCreepMat(1, 3e12, 3e9, 1e11, 3e9);
blkdyn.BindCreepMat(1, 1, 1);

blkdyn.FixV("x",0.0, "x", -0.01, 0.001);

var values = new Array(1e6, 0, 0);
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

blkdyn.ApplyConditionByCoord("face_force", values, gradient, 0.999, 1.01, -1, 1, -1, 1, false);

dyna.Monitor("block","xdis", 0.2, 0, 0);
dyna.Monitor("block","xdis", 0.4, 0, 0);
dyna.Monitor("block","xdis", 0.6, 0, 0);
dyna.Monitor("block","xdis", 0.8, 0, 0);
dyna.Monitor("block","xdis", 1.0, 0, 0);

dyna.Monitor("block","sxx", 0.2, 0, 0);
dyna.Monitor("block","sxx", 0.4, 0, 0);
dyna.Monitor("block","sxx", 0.6, 0, 0);
dyna.Monitor("block","sxx", 0.8, 0, 0);
dyna.Monitor("block","sxx", 1.0, 0, 0);

dyna.Set("Time_Step 36.0")

dyna.Solve(50000);
