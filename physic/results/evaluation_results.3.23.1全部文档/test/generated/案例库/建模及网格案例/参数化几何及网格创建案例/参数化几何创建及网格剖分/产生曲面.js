//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

//创建点
var size = 0.01;
var id1 = igeo.genPoint(0,0,0,size);
var id2 = igeo.genPoint(0.5,0.2,0,size);
var id3 = igeo.genPoint(1.0,0.5,0,size);
var id4 = igeo.genPoint(1.5,1.0,0,size);
var id5 = igeo.genPoint(2.0,0.2,0,size);
var id6 = igeo.genPoint(3.0,0.0,0,size);
var id7 = igeo.genPoint(1.0,-0.5,0,size);
var id8 = igeo.genPoint(2.0,-1.0,0,size);

//创建两条样条曲线
var lineid1 = [id1, id2, id3, id4, id5, id6];
var lineid2 = [id1, id7, id8, id6];
var lid1 = igeo.genCurvedLine(lineid1, "spline");
var lid2 = igeo.genCurvedLine(lineid2, "spline");

//创建line loop
var loop1 = [lid1, lid2];
var loopid = igeo.genLineLoop(loop1);

//创建surface
var loop2 = [loopid];
var fid = igeo.genSurface(loop2,1);

//设置二维网格划分方式为Frontal
imeshing.setValue("MeshType2D", 6);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(2);
