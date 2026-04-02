setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

doc.clearResult();
dyna.clear();

igeo.genRectS(0, 0, 0, 1, 0.1, 0, 0.05, 1);

imeshing.genMeshByGmsh(2);

dyna.set("Creep_Cal", 1);
dyna.set("Creep_G_Inherit", 1);
dyna.set("Auto_Creep_Time", 0);
dyna.set("Element_Plastic_Creep", 0);
dyna.set("Output_Interval", 500);
dyna.set("Gravity", 0, 0, 0);
dyna.set("Large_Displacement", 0);

blkdyn.getMesh(imeshing);

blkdyn.setModel("burger");
blkdyn.setMaterial(2000, 3e9, 0.3, 8e6, 5e6, 30, 10);

blkdyn.setCreepMaterial(1, 3e12, 3e9, 1e11, 3e9);
blkdyn.bindCreepMaterial(1, 1, 1);

blkdyn.fixVelocity("x", 0.0, "x", -0.01, 0.001);

var values = [1e6, 0, 0];
var gradient = [0, 0, 0, 0, 0, 0, 0, 0, 0];

blkdyn.applyConditionByCoord("face_force", values, gradient, 0.999, 1.01, -1, 1, -1, 1, false);

dyna.monitor("block", "xdis", 0.2, 0, 0);
dyna.monitor("block", "xdis", 0.4, 0, 0);
dyna.monitor("block", "xdis", 0.6, 0, 0);
dyna.monitor("block", "xdis", 0.8, 0, 0);
dyna.monitor("block", "xdis", 1.0, 0, 0);

dyna.monitor("block", "sxx", 0.2, 0, 0);
dyna.monitor("block", "sxx", 0.4, 0, 0);
dyna.monitor("block", "sxx", 0.6, 0, 0);
dyna.monitor("block", "sxx", 0.8, 0, 0);
dyna.monitor("block", "sxx", 1.0, 0, 0);

dyna.set("Time_Step", 36.0);

dyna.solve(50000);
