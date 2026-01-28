//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度，均为0
dyna.Set("Gravity 0 -9.8 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为1000步
dyna.Set("Output_Interval 1000");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚质量时步为0.5
dyna.Set("Virtural_Step 0.5");

//设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

//关闭接触更新计算开关
dyna.Set("If_Renew_Contact 1");

//设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");


//包含裂隙渗流计算模块，开辟相应内存
dyna.Set("Config_FracSeepage 1");

//关闭裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 0");

//关闭裂隙渗流与固体耦合开关（孔隙渗流无此开关）
dyna.Set("FS_Solid_Interaction 0");

//创建长100m，高50m的矩形
blkdyn.ImportGrid("gid","RockSlope.msh");

//组号1,2之前切割形成接触面
blkdyn.CrtIFace(1,2);

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

//设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 5e10, 0.25, 3e6, 1e6, 30.0, 15.0, 1, 100);

//设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("linear");

blkdyn.SetIMat(5e11,5e11,35,3e6, 1e6);
blkdyn.SetIMat(5e11,5e11,20,2e5, 2e5,1,2);

//设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.8);

//固定模型四周的法向速度，为0.0
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 19.99,101);
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);




//从固体单元接触面创建裂隙单元
fracsp.CreateGridFromBlock (2);

//设置裂隙渗流参数，依次为密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0,1e7,12e-7,12e-5,1,11);

//定义三个方向梯度值
var fArrayGrad = [0.0, 0.0, 0.0];

//左侧中间裂隙入口处指定入口单宽流量2e-3
fracsp.ApplyConditionByCoord("source", 1e-5, fArrayGrad, 11.99, 12.01, 9.99, 10.01, -1e5, 1e5);
fracsp.ApplyConditionByCoord("pp", 0.0, fArrayGrad, 8.337, 8.3372, 4.3163, 4.3165, -1e5, 1e5);
//求解至稳定
dyna.Solve();

//将接触面模型切换至脆性断裂的Mohr-Coulomb模型
blkdyn.SetIModel("brittleMC");

//求解至稳定
dyna.Solve();

//监测入口处测点Y方向的位移
dyna.Monitor("block", "xdis", 7.9, 2.4, 0);
dyna.Monitor("block", "xdis", 12, 10, 0);

//设置计算时步
dyna.Set("Time_Step 2e-3");


//打开裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

//打开裂隙渗流与固体耦合开关
dyna.Set("FS_Solid_Interaction 1");

dyna.Set("FS_MaxWid 1e-3");

dyna.Set("SeepElem_Kill_Disp 0.1");

blkdyn.SetLocalDamp(0.005);

//计算20万步
dyna.Solve(40000);

//打印提示信息
print("Solution Finished");





