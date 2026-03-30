////设置脚本路径为当前工作路径
setCurDir(getSrcDir());

////导入地层散点数据，产生GdemGrid格式的栅格文件
/////"test1.txt"  ~  "test4.txt" 为地层散点数据
imeshing. genSurfMesh ( "rock1", "test1.txt", 100,100,"quad","invdist1", "grid1.dat");
imeshing. genSurfMesh ( "rock2", "test2.txt", 100,100,"quad","invdist1", "grid2.dat");
imeshing. genSurfMesh( "rock3", "test3.txt", 100,100,"quad","invdist1", "grid3.dat");
imeshing. genSurfMesh ( "rock4", "test4.txt", 10,10,"quad","invdist1", "grid4.dat");


////////////////////////////////////////////////////////////
///////产生"arrange.txt"网格文件

var fso = new ActiveXObject("Scripting.FileSystemObject");//创建FileSystemObject对象
//1-仅读入，2-仅写，3-追加
var DynaP = fso.CreateTextFile("arrange.txt", true);

//////一共4个地层文件
DynaP.WriteLine("4");

/////每个地层文件名
DynaP.WriteLine("grid1.dat");
DynaP.WriteLine("grid2.dat");
DynaP.WriteLine("grid3.dat");
DynaP.WriteLine("grid4.dat");

DynaP.Close();

///////文件书写完毕
////////////////////////////////////////////////////////////


/////几何及网格清除
igeo.clear();
imeshing.clear();

/////创建参数化网格
imeshing.genBrick3D("1", 5,5,3, 50,50, 50);

///所有单元均进行地层分组
imeshing.setGroupByStratum("arrange.txt");
