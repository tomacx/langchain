setCurDir(getSrcDir());

// 清除几何和网格数据
igeo.clear();
imeshing.clear();

// 创建二维砖块网格
imeshing.genBrick2D("f1", 1, 1, 500, 500);

// 根据bmp图片的颜色进行分组
imeshing.setGroupByImage2([0, 0, 0, 60], "rock.bmp");

// 导出网格数据到pdyna.dat文件中
imesh.exportPDyna(imeshing, "pdyna.dat");
