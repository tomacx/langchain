setCurDir(getSrcDir());

imesh.importGid("2d.msh");

imesh.importGid("gidmesh.msh");

imesh.importGid("hex.msh");

sleep(1000);

imeshing.getMesh(cMesh[2]);

sleep(1000);

imeshing.getMesh(cMesh[3]);

sleep(1000);

imeshing.getMesh(cMesh[4]);

sleep(1000);