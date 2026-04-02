setCurDir(getSrcDir());

// 清除之前的几何和网格数据
igeo.clear();
imeshing.clear();

// 创建一个参数化矩形面
igeo.genRectS(0, 0, 0, 10, 10, 0, 0.5, 1);

// 创建一个参数化圆形面
igeo.genCircleS(20, 0, 0, 5, 0.5, 2);

// 根据几何生成网格
imeshing.genMeshByGmsh(2);

// 将面单元拉伸成体单元，沿着Z轴方向拉伸5个单位，重复10次
imeshing.extrude(0, 0, 5, 10);
