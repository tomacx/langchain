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
dyna.Set("Gravity 0.0 0.0 0.0");

//设置结果输出时步
dyna.Set("Output_Interval 500");

///2--宾汉流
dyna.Set("Liquid_Seepage_Law 2");


dyna.Set("Seepage_Mode 1");


dyna.Set("Monitor_Iter 100");


fracsp.ImportGrid("ansys","feng-tri.dat");

var fwidth = 1e-3;
var fvisc  = 1e-2;

fracsp.SetPropByGroup(1000.0,1e3, fwidth * fwidth / 12.0 / fvisc,fwidth,1,1);

fracsp.SetSinglePropByGroup ("Strength", 1.0, 1, 11);


var grad = new Array(0, 0, 0); 
fracsp.ApplyConditionByCoord("pp", 1e4, grad, -0.01,0.01,-100,100,-100,100);


dyna.Set("Time_Step 0.7");


//理论线
draw.setColor(125,125,125);
draw.line3d(5,-1,0, 5,11, 0);
draw.commit();

dyna.DynaCycle(1e5);

//打印提示信息
print("Solution Finished");
