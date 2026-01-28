setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

dyna.Set("Output_Interval 500");

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含热传导计算模块，开辟相应内存
dyna.Set("Config_Heat 1");

//打开热传导计算开关
dyna.Set("Heat_Cal 1");

imeshing.genCircle("1", 1, 5, 50, 120);

blkdyn.GetMesh(imeshing);

//设置热传导材料参数，依次为固体密度、初始温度、热传导系数、比热容、体膨胀系数
heatcd.SetPropByGroup (2700.0, 20.0, 3.125, 1000, 1e-3, 1);

//定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

//固定模型中间空心区域的当前温度，自由面选项为真（只有自由面才固定温度）
heatcd.ApplyConditionByCylinder("temp", 50.0, fArrayGrad, 0,0,1, 0,0,-1, 0.99, 1.01, true);


//设置计算步长为500s
dyna.Set("Time_Step 500");

//计算1万步
//dyna.Solve(10000);

dyna.BeforeCal();
for(var i = 0; i < 10000; i++)
{
var fUnBal = heatcd. CalNodeTemperature ();
heatcd.CalElemHeatTransfer ();

if(i % 100 == 0)
{
var str = "Iter  = " + i  + "  UnBal = " + fUnBal ;
print(str );
dyna.PutStep();
}
}

//打印提示信息
print("Solution Finished");