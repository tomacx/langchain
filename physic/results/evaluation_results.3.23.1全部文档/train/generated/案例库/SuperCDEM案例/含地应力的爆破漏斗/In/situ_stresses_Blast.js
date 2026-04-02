setCurDir(getSrcDir());

scdem.outputInterval = 1000;
scdem.monitorIter = 10;

scdem.set("isLargeDisplace", 1);

scdem.gravity = [0, 0, -9.8];

scdem.isVirtualMass = 0;

scdem.set("ubr", 1e-4);
scdem.set("RayleighDamp", 5e-7, 0);

var msh = imesh.importGmsh("example.msh");
scdem.getMesh(msh);

scdem.setModel("linear");

scdem.setMat([2500, 5e10, 0.25, 30e6, 15e6, 45.0, 10.0]);

var pos = [0.5, 0.5, 0.5];
scdem.setJWLBlastSource(1, 931, 2.484e9, 49.46e9, 1.891e6, 3.907, 1.118, 0.333, 5.15e9, 4160, 0.0, 1e-2, pos);

scdem.setIModel("FracE");
scdem.setContactFractureEnergy(10, 100);

scdem.timeStep = 1e-7;
scdem.dynaSolveGpu(0.004);

print("finish!");
