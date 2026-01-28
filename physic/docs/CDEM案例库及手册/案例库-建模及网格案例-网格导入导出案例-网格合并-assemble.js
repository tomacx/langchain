setCurDir(getSrcDir());

var o1 = imesh.importGenvi("Block3D.gvx");
var o2 = imesh.importGenvi("Block3D2.gvx");

imesh.assemble(o1, o2);