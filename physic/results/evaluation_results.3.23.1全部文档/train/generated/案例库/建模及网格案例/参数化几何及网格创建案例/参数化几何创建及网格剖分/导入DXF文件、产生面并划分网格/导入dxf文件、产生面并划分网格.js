setCurDir(getSrcDir());

// 清除之前的几何和网格信息
igeo.clear();
imeshing.clear();

// 导入DXF文件并生成表面
var filename = "Drawing1.dxf";
igeo.import("dxf", filename);

// 自动产生面，最多由15条线组成
igeo.genSurfAuto(15);

// 设置休眠时间以确保操作完成
sleep(2000);

// 设置几何大小
igeo.setSize("surface", 10, 1, 111111);

// 使用Gmsh进行网格划分
imeshing.genMeshByGmsh(2);

// 再次设置休眠时间以确保操作完成
sleep(5000);
