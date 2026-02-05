//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//关闭力学计算开关
dyna.Set("Mechanic_Cal 0");

//包含热传导计算模块，开辟相应内存
dyna.Set("Config_Heat 1");

//打开热传导计算开关
dyna.Set("Heat_Cal 1");

//设置计算结果输出间隔为200
dyna.Set("Output_Interval 200");


//导入GiD形式的热传导网格
blkdyn.ImportGrid("GiD", "heatcond.msh");


//设置热传导材料参数，依次为固体密度、初始温度、热传导系数、比热容、体膨胀系数
heatcd.SetPropByGroup (2700.0, 20.0, 3.125, 1000, 1e-3, 1);

//定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

//固定模型中间空心区域的当前温度，自由面选项为真（只有自由面才固定温度）
heatcd.ApplyConditionByCoord("temp", 50.0, fArrayGrad, 3, 7, 3, 7, -100, 100, true);

//设置计算步长为500s
dyna.Set("Time_Step 500");

//计算1万步
dyna.Solve(10000);

//打印提示信息
print("Solution Finished");
