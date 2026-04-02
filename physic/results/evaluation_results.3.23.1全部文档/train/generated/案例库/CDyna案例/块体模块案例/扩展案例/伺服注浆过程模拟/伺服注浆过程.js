//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

dyna.Clear();
doc.clearResult();

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含裂隙计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//设置3个方向的重力加速度
dyna.Set("Gravity 0.0 0.0 -9.8");

//设置结果输出时步
dyna.Set("Output_Interval 5000");

//设置渗流模式和边界条件参数
dyna.Set("Liquid_Seepage_Law 2");
dyna.Set("Seepage_Mode 4");
dyna.Set("Monitor_Iter 10");
dyna.Set("FS_CirInject_Width 1e-4");

fracsp.ImportGrid("Gmsh","GDEM.msh");

//设置裂隙渗流参数
fracsp.SetPropByGroup(1810.0, 1e6, 1.66667e-7, 2e-4, 1, 1);

//单独指定剪切强度
fracsp.SetSinglePropByGroup("Strength", 11.75, 1);

//随机化裂隙宽度
fracsp.RandomizeWidthByGroup("normal", 2e-4, 2e-4, 1);
fracsp.RandomizeWidthByGroup("normal", 2e-4, 2e-4, 2);
fracsp.RandomizeWidthByGroup("normal", 2e-4, 2e-4, 3);

//调整裂隙宽度
fracsp.AdjustWidth(6e-5, 20, 20, 17.5, 20, 20, 22.5);

var nodeid = fracsp.GetNodeID(20.0, 20.0, 20.0);
var fx = fracsp.GetNodeValue(nodeid, "Coord", 1);
var fy = fracsp.GetNodeValue(nodeid, "Coord", 2);
var fz = fracsp.GetNodeValue(nodeid, "Coord", 3);

//伺服注浆参数设置
var fQOpti = 20.0 * 1e-3 / 60.0;
var fQLimt = 30.0 * 1e-3 / 60.0;
var str = "FS_Servo_PQ 1 1e6 0.001e6 " + fQOpti + " " + fQLimt + " 200";
dyna.Set(str);

//应用边界条件
var afValue = [0, 2e6, 1e6, 2e6];
var fArrayGrad = [0, 0, 0, 0, 0, 0, 0, 0, 0];
fracsp.ApplyDynaCondi("pp", afValue, fArrayGrad);

//开始计算
dyna.Solve(50000);

print("Solution Finished");
