//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//清除数据，便于直接进行重新计算
dyna.Clear();
igeo.clear();
imeshing.clear();
doc.clearResult();

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval  100");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.5");

//设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

//关闭接触更新计算开关
dyna.Set("If_Renew_Contact 0");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

//设置仅依靠拓扑寻找接触容差，加速接触检索
dyna.Set("If_Find_Contact_OBT 1");

//设置接触面拉伸断裂及剪切断裂位移
dyna.Set("Interface_Soften_Value 1e-5 1e-5")

//包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//设置裂隙渗流模型为快速渗流模式
dyna.Set("Seepage_Mode 4");

//关闭裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 0");

//关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 0");

//打开仅接触面破裂或接触面为预设面时进行压力传递及更新开度
dyna.Set("FS_Frac_Start_Cal 1");

///创建几何
var faceid = igeo.genRectS(0,0,0,10,10,0,0.2,1);

//设置硬线，便于加水压
var pid1 = igeo.genPoint(4.9, 5,0, 0.1);
var pid2 = igeo.genPoint(5.1, 5, 0, 0.1);
var lid = igeo.genLine(pid1, pid2);
igeo.setHardLineToFace(lid, faceid);

//设置硬线，天然裂隙
var pid3 = igeo.genPoint(3, 6, 0, 0.1);
var pid4 = igeo.genPoint(7, 6, 0, 0.1);
var lid2 = igeo.genLine(pid3, pid4);
igeo.setHardLineToFace(lid2, faceid);

var pid3 = igeo.genPoint(6, 1, 0, 0.1);
var pid4 = igeo.genPoint(6, 5,0, 0.1);
var lid2 = igeo.genLine(pid3, pid4);
igeo.setHardLineToFace(lid2, faceid);


//划分网格
imeshing.genMeshByGmsh(2);

//下载网格至blkdyn模块
blkdyn.GetMesh(imeshing);

//切割形成接触面
blkdyn.CrtIFace(1,1);

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

//设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 5e10, 0.25, 5e6, 5e6, 30.0, 15.0, 1, 100);

//设定所有接触面的本构为应变软化模型
blkdyn.SetIModel("SSMC");

//设置接触面刚度及强度
blkdyn.SetIStrengthByElem();

//设置天然裂隙强度
blkdyn.SetIMatByLine(1e11, 1e11, 25, 2e5, 2e5, [3, 6, 0], [7, 6, 0], 1e-4);
blkdyn.SetIMatByLine(1e11, 1e11, 25, 2e5, 2e5, [6, 1, 0], [6, 5, 0], 1e-4);

blkdyn.SetIStiffByElem(1.0);

//设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);


//从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock (2);

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e7,12e-11,12e-7,1,11);

//设置压力衰减，每米2*100Pa
fracsp.SetSinglePropByGroup("Strength", 1.0e2, 1,11);


//定义三个方向梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

//设置压力边界
fracsp.ApplyConditionByCoord("pp", 5.5e6, fArrayGrad,  4.91 , 5.09, 4.99, 5.01, -1, 1);

//设置预设裂隙面，注入点
blkdyn.SetPreIFaceByCoord(1,   4.91 , 5.09, 4.99, 5.01, -1, 1);

//设置预设裂隙面，天然裂隙
blkdyn.SetPreIFaceByCoord(1,   3, 7, 5.99, 6.01, -1, 1);
blkdyn.SetPreIFaceByCoord(1,   5.99, 6.01,1, 5,  -1, 1);

//设置计算时步
dyna.Set("Time_Step 1e-1");


//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//打开裂隙渗流与固体耦合开关
dyna.Set("FS_Solid_Interaction 1");

//设置局部阻尼为0.1
blkdyn.SetLocalDamp(0.1);

//计算1千步
dyna.Solve(1000);

//打印提示信息
print("Solution Finished");
