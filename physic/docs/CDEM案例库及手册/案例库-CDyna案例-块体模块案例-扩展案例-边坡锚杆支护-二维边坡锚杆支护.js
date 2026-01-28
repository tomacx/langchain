//设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

//设置网格尺寸
var size = 0.3;

//创建多边形面
var feng = new Array();
feng[0] = [0,0,0,size ];
feng[1] = [10,0,0,size];
feng[2] = [10,6,0,size];
feng[3] = [7,6,0,size];
feng[4] = [3,3,0,size];
feng[5] = [0,3,0,size];
igeo.genPloygenS(feng,1);


//划分二维网格
imeshing.genMeshByGmsh(2);


//从平台读取网格
blkdyn.GetMesh(imeshing);

blkdyn.SetModel("linear");

blkdyn.SetMat(2500,3e8,0.25,3e3,3e3,15,10);

blkdyn.FixV("x",0,"x",-0.01,0.001);
blkdyn.FixV("x",0,"x",9.99,10.01);
blkdyn.FixV("y",0,"y",-0.001,0.001);

//创建第1根锚索
var fArrayCoord1 = [4,3.75,0];
var fArrayCoord2 = [1,-0.694444444,0];
bar.CreateByDir("cable", fArrayCoord1, fArrayCoord2, 3,20);



//创建第2根锚索
var fArrayCoord1 = [5, 4.5, 0];
var fArrayCoord2 = [1,-0.694444444,0];
bar.CreateByDir("cable", fArrayCoord1, fArrayCoord2, 3,20);

//创建第3根锚索
var fArrayCoord1 = [6, 5.25, 0];
var fArrayCoord2 = [1,-0.694444444,0];
bar.CreateByDir("cable", fArrayCoord1, fArrayCoord2, 3,20);


//设置所有锚索的力学模型为可破坏模型
bar.SetModelByID("failure", 1, 100);

//定义两种锚索材料
var BarProp1 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];
var BarProp2 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.8, 0.0];

//指定自由段的锚索材料
bar.SetPropByID(BarProp2, 1, 10, 1, 15);

//指定锚固段的锚索材料
bar.SetPropByID(BarProp1, 1, 10, 16, 20);

//在每根锚索的第一个节点上施加预应力，为10kN。
bar.ApplyPreTenForce(1e4, 1,11,1,1);


//打开杆件计算开关
dyna.Set("If_Cal_Bar 0");

dyna.Solve();

blkdyn.SetModel("MC");

dyna.Set("If_Cal_Bar 1");

dyna.Solve();



