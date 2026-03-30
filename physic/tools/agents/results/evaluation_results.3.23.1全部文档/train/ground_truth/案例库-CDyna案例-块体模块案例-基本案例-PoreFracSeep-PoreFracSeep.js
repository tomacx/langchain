//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含孔隙渗流计算功能，开辟渗流相关的内存
dyna.Set("Config_PoreSeepage 1");

//开启孔隙渗流开关
dyna.Set("PoreSeepage_Cal 1");

//包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//打开裂隙渗流与孔隙渗流的耦合开关
dyna.Set("FS_PoreS_Interaction 1")

//设置三个方向的重力加速度
dyna.Set("Gravity 0.0 -10.0 0.0");

//将结果输出时步设定为500步
dyna.Set("Output_Interval 500");

//导入gid格式的网格
blkdyn.ImportGrid("gid", "porefracgrid.msh");

//不同组号的交界面进行切割，生产接触面
blkdyn.CrtIFace(-1, -1);

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//定义X、Y、Z三个方向的渗透系数
var arrayK = new Array(8e-8, 8e-8, 8e-8);

//指定坐标控制范围内的孔隙渗流参数，依次为流体密度、体积模量、饱和度、孔隙率、渗透系数、比奥系数
poresp.SetPropByCoord (1000.0, 1e6, 0.0, 0.2, arrayK, 1.0, -500, 500, -500, 500, -500, 500);

//从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock (2);

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e6,8e-5,1e-2,1,11);

//定义三个方向梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

//右侧裂隙边界的渗流压力施加为50kpa（右侧裂隙只有一个渗流入口）
fracsp.ApplyConditionByCoord("pp", 5e4, fArrayGrad, 9.99, 11.0, -1e5, 1e5, -1e5, 1e5);

//设定计算时步为2ms
dyna.Set("Time_Step 0.0005");

//迭代10万步
dyna.Solve(100000);

//打印提示信息
print("Solution Finished");
