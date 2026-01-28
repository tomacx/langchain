//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//导入ansys网格
var omsh1 = imesh.importAnsys("ansys.dat");

//导入gid网格
var omsh2 = imesh.importGid("gid.msh");

//导入gmsh网格
var omsh3 = imesh.importGmsh("gmsh.msh");


//导入genvi网格
var omsh4 = imesh.importGenvi("genvi.gvx");

//导入genvi网格
var omsh5 = imesh.importGenvi("genvi2.gvx");


//导入二维多边形网格
var omsh6 = imesh.importGmshG("n1000-id2.geo");

//导入三维多面体网格
var omsh7 = imesh.importGmshG("n400-id1.geo");