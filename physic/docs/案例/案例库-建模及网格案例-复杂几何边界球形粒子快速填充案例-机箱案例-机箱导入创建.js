setCurDir(getSrcDir());

pargen.importBoundSTL("box1.stl", "box2.stl", "box3.stl");

///半径是0.2mm
pargen.gen(0.0002);