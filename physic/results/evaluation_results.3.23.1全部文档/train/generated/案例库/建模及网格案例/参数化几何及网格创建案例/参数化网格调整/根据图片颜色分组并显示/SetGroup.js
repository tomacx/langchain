setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

// 创建二维砖块网格
imeshing.genBrick2D("horse",4,3,400,300);

// 根据图片颜色进行重新分组
imeshing.setGroupByImage(255, "horse.bmp");

// 获取网格并设置失效条件和绘制背景网格
blkdyn.GetMesh(imeshing);
mpm.SetModelByGroup("linear", 1, 11);
mpm.DrawBackGrid(255, 0, 0);

// 绘制元素分组信息
dyna.Plot("Elem","Group");
