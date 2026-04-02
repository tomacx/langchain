//设置工作路径为当前路径
setCurDir(getSrcDir());

//几何及网格清零
igeo.clear();
imeshing.clear();

//产生二维砖块网格
imeshing.genBrick2D("f1",1,1,500,500);


//采用模式1利用bmp图片进行重新分组
//imeshing.setGroupByImage(20, "building.bmp");

//采用模式2利用bmp图片进行重新分组
//imeshing.setGroupByImage2([0,0,0,20], "building.bmp");
imeshing.setGroupByImage2([0,0,0,60], "rock.bmp");
