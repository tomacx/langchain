setCurDir(getSrcDir());

// 清除之前的几何和网格信息
igeo.clear();
imeshing.clear();

// 创建一个参数化的二维砖块网格
imeshing.genBrick2D("砂岩", 1, 10, 5, 5);

// 使用SelElems选择单元
var esel = new SelElems(imeshing);
var n = esel.box(-5, -0.3, -1, 5, 0.3, 1);
print(n);

// 复制选中的网格并移动到指定位置
imeshing.copy(5, 0, 0, 1, esel);
