setCurDir(getSrcDir());

// 清除之前的几何和网格数据
igeo.clear();
imeshing.clear();

// 创建参数化三维砖块网格
imeshing.genBrick3D("1", 5, 5, 3, 50, 50, 50);

// 导入地层信息文件以生成GdemGrid格式网格并进行分组处理
var fso = new ActiveXObject("Scripting.FileSystemObject");
var DynaP = fso.CreateTextFile("arrange.txt", true);
DynaP.WriteLine("4"); // 地层数量
DynaP.WriteLine("grid1.dat"); // 第一个地层网格文件名
DynaP.WriteLine("grid2.dat"); // 第二个地层网格文件名
DynaP.WriteLine("grid3.dat"); // 第三个地层网格文件名
DynaP.WriteLine("grid4.dat"); // 第四个地层网格文件名
DynaP.Close();

// 根据地层信息对网格进行分组处理
imeshing.setGroupByStratum("arrange.txt");

// 调用GetMesh方法从平台获取网格数据加载到求解器中
var msh1 = imesh.importAnsys("bar.dat");
bar.GetMesh(msh1);

// 参数化网格调整示例（例如，缩放）
imeshing.scale(0.5, 0.5, 0.5); // 缩小网格

// 输出最终的网格文件
imesh.exportPDyna(imeshing, "final_mesh.dat");
