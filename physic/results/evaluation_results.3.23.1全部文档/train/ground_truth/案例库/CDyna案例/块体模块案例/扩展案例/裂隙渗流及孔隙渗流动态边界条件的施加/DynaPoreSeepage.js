//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

//开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");


//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 0.0");

//设置结果输出时步
dyna.Set("Output_Interval 500");

var pid = igeo.genPoint(5,5,0,0.2);

var sid = igeo.genRectS(0,0,0,10,10,0,0.5,1);

igeo.setHardPointToFace(pid, sid);

imeshing.genMeshByGmsh(2);

blkdyn.ImportGrid("Gmsh","GDEM.msh");


//定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(1e-8, 1e-8, 1e-8);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.3, arrayK, 1.0, -500, 500, -500, 500, -500, 500);



var fArrayGrad = [0.0, 0.0, 0.0];
var aValue = new Array();
aValue[0] = [0,0];
aValue[1] = [50,1e4];
aValue[2] = [100,3e4];
aValue[3] = [150,5e4];
aValue[4] = [200,4e4];
aValue[5] = [300,3e4];

poresp.ApplyDynaConditionByCoord("pp",aValue, fArrayGrad, 4.99, 5.01,  4.99, 5.01, -1,1, false);


dyna.Monitor("block", "fpp", 5,5,0);
dyna.Monitor("block", "magfvel", 5,5,0);
dyna.Monitor("block", "discharge", 5,5,0);

//自动计算时步
dyna.TimeStepCorrect();

dyna.Set("Time_Step 0.05");

//求解10万步
dyna.Solve(100000);

//打印提示信息
print("Solution Finished");
