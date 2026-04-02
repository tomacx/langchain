// 设置工作目录为脚本文件所在目录
setCurDir(getSrcDir());

// 清除几何信息和网格信息
igeo.clear();
imeshing.clear();

// 创建一个矩形面
igeo.genRectS(0, 0, 0, 10, 10, 0, 0.5, 1);

// 创建一个圆形面
igeo.genCircleS(20, 0, 0, 5, 0.5, 2);

// 使用Gmsh进行网格剖分，指定为二维网格
imeshing.genMeshByGmsh(2);

// 对生成的面单元执行拉伸操作，沿Z轴方向拉伸5个单位长度，共10段
imeshing.extrude(0, 0, 5, 10);
