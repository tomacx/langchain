setCurDir(getSrcDir());

var msh1 = imesh.importStl("gear1.stl");
var msh2 = imesh.importStl("gear2.stl");
var msh3 = imesh.importStl("gear3.stl");

pargen.addBound(msh1, msh2, msh3);

///半径是0.2mm
pargen.gen(0.0002);
