setCurDir(getSrcDir());

var msh1 = imesh.importStl("qiche1.stl");
var msh2 = imesh.importStl("qiche2.stl");
var msh3 = imesh.importStl("qiche3.stl");
var msh4 = imesh.importStl("qiche4.stl");
var msh5 = imesh.importStl("qiche5.stl");
var msh6 = imesh.importStl("qiche6.stl");

pargen.addBound(msh1, msh2, msh3, msh4, msh5, msh6);

///半径是1m
pargen.gen(0.005);
