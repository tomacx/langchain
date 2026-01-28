//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0 0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟质量时步
dyna.Set("Virtural_Step 0.5");

//关闭接触更新计算开关
dyna.Set("If_Renew_Contact 0");

//设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 0.0");

//包含热传导计算模块，开辟相应内存
dyna.Set("Config_Heat 1");

//打开热传导计算开关
dyna.Set("Heat_Cal 1");

//从当前文件夹下导入gmsh格式的网格文件
blkdyn.ImportGrid("gmsh", "rock.msh");

//对组号为1的单元进行接触面切割生成
blkdyn.CrtIFace(1);

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

//设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 35.0, 15.0, 1, 100);

//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

//接触面刚度从单元中获取
blkdyn.SetIStiffByElem(10.0);

//接触面强度从单元中获取
blkdyn.SetIStrengthByElem();

//设定全部节点的局部阻尼系数为0.1
blkdyn.SetLocalDamp(0.1);

//设置热传导材料参数，依次为固体密度、初始温度、热传导系数、比热容、体膨胀系数
heatcd.SetPropByGroup (2500.0, 100.0, 3.125, 1000, 3e-5, 1);

//定义梯度
var fArrayGrad = new Array(0.0, 0.0, 0.0);

//固定模型四周的温度为-20°
heatcd.ApplyConditionByCoord("temp", -20.0, fArrayGrad, -10, 0.0001,-100, 100, -100, 100, true);
heatcd.ApplyConditionByCoord("temp", -20.0, fArrayGrad, 0.0999, 11,-100, 100, -100, 100, true);
heatcd.ApplyConditionByCoord("temp", -20.0, fArrayGrad, -100, 100, -10, 0.0001,-100, 100, true);
heatcd.ApplyConditionByCoord("temp", -20.0, fArrayGrad, -100, 100, 0.0999, 11,-100, 100, true);

//打开接触面透传热量开关，设置透传刚度因子为4.0
dyna.Set("If_Contact_Transf_Heat 1 4.0")

//设置热传导计算步长为0.03s
dyna.Set("Time_Step 0.03");

//计算1万步
dyna.Solve(20000);

//打印提示信息
print("Solution Finished");
