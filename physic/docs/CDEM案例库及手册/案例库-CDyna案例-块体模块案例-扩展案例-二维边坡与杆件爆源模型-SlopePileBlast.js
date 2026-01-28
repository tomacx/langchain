//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度均为0
dyna.Set("Gravity 0.0 -9.8 0.0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

//设置计算结果的输出间隔为100步
dyna.Set("Output_Interval 500");

//设置监测信息输出时步为10步
dyna.Set("Moniter_Iter 10");

dyna.Set("If_Cal_Bar 0");

//打开杆件输入开关
dyna.Set("Bar_Out 1");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//从当前文件夹导入Gmsh格式的网格
blkdyn.ImportGrid("gid", "2dslope.msh");

//所有单元边界创建接触面
blkdyn.CrtIFace();

//接触面生成后，更新网格
blkdyn.UpdateIFaceMesh();

//指定组1的单元本构为线弹性本构
blkdyn.SetModel("linear", 1);

//指定组1-2的材料参数
blkdyn.SetMat(2500, 5e10, 0.25, 15e6, 10e6, 40.0, 10.0);

//设置接触面为线弹性模量
blkdyn.SetIModel("linear");

//设置接触面的刚度从单元中获得
blkdyn.SetIStiffByElem(1.0);

//设置接触面的强度从单元中获得
blkdyn.SetIStrengthByElem();

//固定左右两侧及底部的法向速度
blkdyn.FixV("x",0.0,"x", -0.001,0.001);
blkdyn.FixV("x",0.0,"x", 19.99,20.01);
blkdyn.FixV("y",0.0,"y", -0.001, 0.001);

//求解
dyna.Solve();

//设置单元为Mohr-Coulomb理想弹塑性模型
blkdyn.SetModel("MC", 1);

//设置接触面为脆性断裂模型
blkdyn.SetIModel("brittleMC");

//求解至稳定
dyna.Solve();

//存储save文件
dyna.Save("initial.sav");

//解除模型左右两侧及底部法向速度约束
blkdyn.FreeV("x","x", -0.001,0.001);
blkdyn.FreeV("x","x", 19.99,20.01);
blkdyn.FreeV("y","y", -0.001,0.001);


//模型的左右两侧及底部设定为无反射边界（粘性边界）
blkdyn.SetQuietBoundByCoord(-0.001,0.001,-100,100,-100,100);
blkdyn.SetQuietBoundByCoord(19.99,20.01,-100,100,-100,100);
blkdyn.SetQuietBoundByCoord(-100,100,-0.01, 0.001,-100,100);



//创建第1个炮孔
var fArrayCoord1 = [10, 12, 0.0];
var fArrayCoord2 = [10, 6, 0.0];
bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);

//创建第2个炮孔
var fArrayCoord1 = [14, 12, 0.0];
var fArrayCoord2 = [14, 6,  0.0];
bar.CreateByCoord("BlastHole1", fArrayCoord1, fArrayCoord2, 10);

//设置杆件参数，如果炮孔模型，仅第一个参数起作用，即炮孔直径0.05m
var BarProp1 = [0.05, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];

//指定自由段的锚索材料
bar.SetPropByID(BarProp1, 1, 10, 1, 15);




//定义第一组全局朗道参数
var apos = [10, 6, 0.0];
blkdyn.SetLandauSource(1, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 0.0, 15e-3);

//定义第二组全局朗道参数
var apos = [14, 6, 0.0];
blkdyn.SetLandauSource(2, 1150, 5000, 3.1e6, 3.0, 1.3333, 7e9, apos, 25e-3, 15e-3);

//将朗道爆源参数与杆件ID号关联
bar.BindLandauSource(1, 1, 1);
bar.BindLandauSource(2, 2, 2);

//监测块体破坏度及破裂度
dyna.Monitor("gvalue","gv_block_broken_ratio");
dyna.Monitor("gvalue","gv_block_crack_ratio");

//将局部阻尼设置为0.0
blkdyn.SetLocalDamp(0.00);

//打开瑞利阻尼计算开关
dyna.Set("If_Cal_Rayleigh 1")

//将刚度阻尼系数设置为5e-6，质量阻尼系数设置为20.0
blkdyn.SetRayleighDamp(5e-6, 20.0);


var BaseValue = [0,0,0];
var Grad      = [0, 0, 0, 0, 0, 0, 0, 0, 0];

//对模型所有单元初始化地应力
blkdyn.InitConditionByCoord("displace", BaseValue, Grad,  -1e3,1e3, -1e3,1e3, -1e3,1e3);


//设置全局计算时步
dyna.Set("If_Virtural_Mass 0");

//设置计算时步
dyna.Set("Time_Step 1e-5");

//将当前时间设为0
dyna.Set("Time_Now 0.0");

//打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

//动力计算1ms
dyna.DynaCycle(0.1);

//打印提示信息
print("Solution Finished");
