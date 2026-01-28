setCurDir(getSrcDir());

imesh.genSurfMesh("1","dispoint.txt",100, 100, "tri");

imesh.exportAnsys("Bound.dat");

