// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

// 创建面
var id1 = igeo.genBall(0,0,0,1.0,0.1,1);
var id2 = igeo.genBall(0,0,0,0.8,0.1,2);

// 创建体
var loop  = [id1, id2];
igeo.genVolume(loop,3);

// 借助Gmsh剖分网格
imeshing.genMeshByGmsh(3);

// 清除几何信息和网格信息
igeo.clear();
imeshing.clear();

// 创建参数化网格
imeshing.genParRegularByCoord (3, "1",0.01, 0,2,0,2,0,2);

for(var i = 0; i < 18; i++)
{
    let sel = new SelElems(imeshing);

    sel.sphere(0,0,0, 3.6 - (i + 1 )* 0.2, 3.6 - i * 0.2 );

    var iGrp = i + 1;
    var strGrp = iGrp.toString();

    imeshing.setGroup(strGrp, sel);
}

// 导出PDyna格式的网格文件
imesh.exportPDyna(imeshing, "pdyna.dat");

//// 设置脚本路径为当前工作路径
setCurDir(getSrcDir());

//// 导入地层散点数据，产生GdemGrid格式的栅格文件
/////"test1.txt"  ~  "test4.txt" 为地层散点数据
imeshing.genSurfMesh ( "rock1", "test1.txt", 100,100,"quad","invdist1", "grid1.dat");
imeshing.genSurfMesh ( "rock2", "test2.txt", 100,100,"quad","invdist1", "grid2.dat");
imeshing.genSurfMesh( "rock3", "test3.txt", 100,100,"quad","invdist1", "grid3.dat");
imeshing.genSurfMesh ( "rock4", "test4.txt", 10,10,"quad","invdist1", "grid4.dat");

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

// 设置工作目录为脚本文件所在目录
setCurDir(getSrcDir());

// 清除几何信息
igeo.clear();

// 清除网格信息
imeshing.clear();

// 基于点云数据产生表面网格
imeshing.genSurfMesh("fc","coord.txt",100,100,"tri");

// 对imeshing模块中的所有单元执行投影拉伸操作
imeshing.projExtrude(0,0,0,0,0,1,10);
