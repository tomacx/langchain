setCurDir(getSrcDir());

var msh1 = imesh.importStl("box1.stl");
var msh2 = imesh.importStl("box2.stl");
var msh3 = imesh.importStl("box3.stl");

pargen.addBound(msh1, msh2, msh3);

///半径是0.2mm
pargen.gen(0.0002);