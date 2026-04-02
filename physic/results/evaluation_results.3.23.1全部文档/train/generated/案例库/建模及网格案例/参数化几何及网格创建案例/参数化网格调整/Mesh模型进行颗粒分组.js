setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

// 创建参数化网格
imeshing.genBrick3D("1", 5, 5, 3, 50, 50, 50);

// 导入地层散点数据，产生GdemGrid格式的栅格文件
imeshing.genSurfMesh("rock1", "test1.txt", 100, 100, "quad", "invdist1", "grid1.dat");
imeshing.genSurfMesh("rock2", "test2.txt", 100, 100, "quad", "invdist1", "grid2.dat");
imeshing.genSurfMesh("rock3", "test3.txt", 100, 100, "quad", "invdist1", "grid3.dat");
imeshing.genSurfMesh("rock4", "test4.txt", 10, 10, "quad", "invdist1", "grid4.dat");

// 创建"arrange.txt"文件
var fso = new ActiveXObject("Scripting.FileSystemObject"); // 创建FileSystemObject对象
var DynaP = fso.CreateTextFile("arrange.txt", true);

DynaP.WriteLine("4");
DynaP.WriteLine("grid1.dat");
DynaP.WriteLine("grid2.dat");
DynaP.WriteLine("grid3.dat");
DynaP.WriteLine("grid4.dat");

DynaP.Close();

// 根据地层信息进行分组
imeshing.setGroupByStratum("arrange.txt");

// 导出PDyna文件
imesh.exportPDyna(imeshing, "pdyna.dat");
