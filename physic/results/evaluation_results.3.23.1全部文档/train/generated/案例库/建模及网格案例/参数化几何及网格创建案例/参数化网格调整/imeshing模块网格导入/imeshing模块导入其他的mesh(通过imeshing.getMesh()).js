// 设置脚本路径为当前工作路径
setCurDir(getSrcDir());

// 定义参数化网格模型并使用imeshing.genMesh()进行网格剖分
igeo.clear();
imeshing.clear();

// 示例：创建一个简单的矩形几何体，并生成网格
igeo.genRectS(-1, -1, 0, 1, 1, 0, 0.3, 1);
imeshing.genMeshByGmsh(2);

// 导入其他mesh文件到imesh模块中
sleep(1000);
imesh.importGid("gidmesh.msh");

// 获取导入的网格并设置为当前网格
var cMesh = imesh.getMeshes();
imeshing.setMesh(cMesh[0]);

// 将imesh中的网格传递给其他模块进行处理，例如PDyna或Brick等
sleep(1000);
var meshForPdyna = imeshing.getMesh();
pdyna.importMesh(meshForPdyna);

// 输出信息以确认脚本执行完毕
console.log("Script execution completed.");
