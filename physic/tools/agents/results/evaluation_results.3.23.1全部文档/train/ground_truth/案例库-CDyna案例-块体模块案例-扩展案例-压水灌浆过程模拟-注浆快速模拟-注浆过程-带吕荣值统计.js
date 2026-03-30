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
dyna.Set("Output_Interval 10000000");

dyna.Set("Liquid_Seepage_Law 2");

dyna.Set("Seepage_Mode 4");

dyna.Set("Monitor_Iter 100");

dyna.Set("FS_CirInject_Width 1e-5");

fracsp.ImportGrid("Gmsh","GDEM-200new.msh");

//fracsp.ImportGrid("ansys","tri.dat");

//dyna.GetMesh();

fracsp.SetPropByGroup(1810.0,1e6,3.33333e-6,2e-4,1,11);


fracsp.SetSinglePropByGroup ("Strength", 11.75, 1, 11);



fracsp.RandomizeWidthByGroup("normal", 2e-4, 0.5e-4, 1,2,2);

fracsp.RandomizeWidthByGroup("normal", 2e-4, 0.5e-4, 2,2,2);

fracsp.RandomizeWidthByGroup("normal", 2e-4, 0.5e-4, 3,2,2);

fracsp.RandomizeWidthByGroup("normal", 2e-4, 0.5e-4, 4,2,2);


var nodeid =  fracsp.GetNodeID (5.0, 5.0, 5.0);

var fx = fracsp.GetNodeValue(nodeid, "Coord", 1);
var fy = fracsp.GetNodeValue(nodeid, "Coord", 2);
var fz = fracsp.GetNodeValue(nodeid, "Coord", 3);
var tol = 1e-5;

//var grad = new Array(0, 0, 0);
//fracsp.ApplyConditionByCoord("pp", 2e6, grad, fx - tol, fx + tol, fy - tol, fy + tol, fz - tol, fz + tol);





//注入点动力粘度
var aVisc = new Array(3);
aVisc[0] = [0, 7.5e-3];
aVisc[1] = [3e2, 3.1e-2];
aVisc[2] = [1e8, 3.1e-2];

//注入点流体剪切强度的变化
var aStre = new Array(3);
aStre[0] = [0, 0.26];
aStre[1] = [3e2, 11.75];
aStre[2] = [1e8, 11.75];

//注入点流体密度的变化
var aDens= new Array(3);
aDens[0] = [0, 1510];
aDens[1] = [3e2, 1810];
aDens[2] = [1e8, 1810];

var id3 = fracsp.SetJetProp (0.0, aVisc, aStre, aDens);


//fracsp. BindJetProp (id3, fx - tol, fx + tol, fy - tol, fy + tol, fz - tol, fz + tol);



var afValue = [0, 2e6, 1e6, 2e6];
var fArrayGrad = [0,0,0,0,0,0,0,0,0];
fracsp.ApplyDynaConditionByLine("pp",afValue, fArrayGrad, 5,5,2.5, 5, 5, 7.5);



fracsp.ElemConnection();

dyna.Monitor("fracsp", "sc_magvel", fx, fy, fz);
dyna.Monitor("fracsp", "sc_pp",  fx, fy, fz);
dyna.Monitor("fracsp", "sc_discharge",  fx, fy, fz);

dyna.Monitor("gvalue", "gv_fracsp_total_mass");

dyna.Monitor("gvalue", "gv_fracsp_eff_rad");


dyna.Set("Time_Step 2");

print("开始搜索吕荣相关单元! ");

fracsp.SetLvRongProp(0.1, 2.5, 7.5, 5.0, 10, 10);

print("吕荣性质施加完毕! ");

dyna.Solve(0);
dyna.Plot("FSNode","UserDefNodeValue");

for(var i = 1; i < 38; i++)
{
dyna.DynaCycle(500 * i);
dyna.Plot("FSNode","UserDefNodeValue");
}



//打印提示信息
print("Solution Finished");
