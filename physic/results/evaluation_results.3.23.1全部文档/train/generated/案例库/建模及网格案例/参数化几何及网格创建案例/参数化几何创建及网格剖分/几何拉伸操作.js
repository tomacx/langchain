//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//清除之前的几何信息和网格信息
igeo.clear();
imeshing.clear();

//创建一个矩形线环
var LineLoop1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1);

//基于该线环生成面
var Surface1 = igeo.genSurface(LineLoop1, 1);

//将面拉伸为体，指定拉伸方向和距离
var Volume1 = igeo.extrude("Surface", [Surface1], 0, 0, 10, 1, 1, 1);

//创建一个圆柱体
var Volume2 = igeo.genCylinderV(15, 10, 0, 15, 10, -4, 2, 4, 0.3, 0.3, 2);

//将两个体积进行粘接操作
var Volume3 = igeo.glue("Volume", Volume2, Volume1);

//设置三维网格划分方式为Gmsh默认方式
imeshing.setValue("MeshType3D", 5);

//借助Gmsh剖分网格
imeshing.genMeshByGmsh(3);
