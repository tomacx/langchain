//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//清除之前的几何对象和网格数据
igeo.clear();
imeshing.clear();

//定义点的位置及大小
var size = 0.1;
var id1 = igeo.genPoint(0, 0, 0, size);
var id2 = igeo.genPoint(0.5, 0.2, 0, size);
var id3 = igeo.genPoint(1.0, 0.5, 0, size);
var id4 = igeo.genPoint(1.5, 1.0, 0, size);
var id5 = igeo.genPoint(2.0, 0.2, 0, size);
var id6 = igeo.genPoint(3.0, 0.0, 0, size);
var id7 = igeo.genPoint(1.0, -0.5, 0, size);
var id8 = igeo.genPoint(2.0, -1.0, 0, size);

//定义样条曲线
var lineid1 = [id1, id2, id3, id4, id5, id6];
var lineid2 = [id1, id7, id8, id6];
var lid1 = igeo.genCurvedLine(lineid1, "spline");
var lid2 = igeo.genCurvedLine(lineid2, "spline");

//定义线环
var loop1 = [lid1, lid2];
var loopid = igeo.genLineLoop(loop1);

//创建面
var loop2 = [loopid];
var fid = igeo.genSurface(loop2, 1);

//设置网格剖分方式为Frontal，适用于二维模型
imeshing.setValue("MeshType2D", 6);

//使用Gmsh进行网格剖分
imeshing.genMeshByGmsh(2);
