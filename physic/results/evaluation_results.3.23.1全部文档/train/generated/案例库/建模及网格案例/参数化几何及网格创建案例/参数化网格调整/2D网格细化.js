setCurDir(getSrcDir());

// 创建一个二维矩形几何
igeo.genRectS(-1, -1, 0, 1, 1, 0, 0.3, 1);

// 使用Gmsh生成网格
imeshing.genMeshByGmsh(2);

// 定义选择器并细化网格区域
var refineArea = new SelElems(imeshing);
refineArea.box(-0.8, -0.8, 0, 0.8, 0.8, 0);
imeshing.refine(refineArea);
sleep(1000);

// 继续细化更小的区域
refineArea = new SelElems(imeshing);
refineArea.box(-0.6, -0.6, 0, 0.6, 0.6, 0);
imeshing.refine(refineArea);
sleep(1000);

// 继续细化更小的区域
refineArea = new SelElems(imeshing);
refineArea.box(-0.4, -0.4, 0, 0.4, 0.4, 0);
imeshing.refine(refineArea);
sleep(1000);

// 继续细化更小的区域
refineArea = new SelElems(imeshing);
refineArea.box(-0.2, -0.2, 0, 0.2, 0.2, 0);
imeshing.refine(refineArea);
sleep(1000);

// 继续细化更小的区域
refineArea = new SelElems(imeshing);
refineArea.box(-0.1, -0.1, 0, 0.1, 0.1, 0);
imeshing.refine(refineArea);
sleep(1000);

// 输出完成信息
print("Finished");
