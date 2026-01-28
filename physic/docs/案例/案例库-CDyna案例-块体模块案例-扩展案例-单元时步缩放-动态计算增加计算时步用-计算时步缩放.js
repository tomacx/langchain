//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置3个方向的重力加速度值(均为0)
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 10");

//设置监测结果的输出时步为10步
dyna.Set("Moniter_Iter 10");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//导入gid格式网格
var msh1=imesh.importGid("model2.msh");
blkdyn.GetMesh(msh1);


//设置所有单元为线弹性模型
blkdyn.SetModel("linear");

//设置组1的材料参数，分别为密度，弹性模量，泊松比，粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2000, 1e10, 0.2, 3e6, 1e6, 30.0, 10.0, 1);

//X方向右侧法向约束
blkdyn.FixV("x", 0.0, "x", 9.99, 10.01);

//设置全部节点的局部阻尼为0.01
blkdyn.SetLocalDamp(0.01);


//监测典型测点的x方向的速度
dyna.Monitor("block", "xvel",  2, 5, 0);
dyna.Monitor("block", "xvel", 5,5, 0);
dyna.Monitor("block", "xvel", 8, 5, 0);

//监测典型测点的x方向的应力
dyna.Monitor("block", "sxx",  2, 5, 0);
dyna.Monitor("block", "sxx", 5,5, 0);
dyna.Monitor("block", "sxx", 8, 5, 0);


//********************************************************************
//动态面力施加

//设定三个方向载荷系数
var coeff=new Array(1,0,0)
//x方向下限及上限
var x= new Array(-0.001,0.001)
//y方向下限及上限
var y= new Array(-100.0,100.0)
//z方向下限及上限
var z= new Array(-100.0,100.0)
//设定动态正弦面力边界（半个周期，幅值1MPa、周期5ms）
blkdyn.ApplyDynaSinVarByCoord ("face_force",false,coeff,0.0,1e6,0.005,0,0,0.0025,x,y,z);

//********************************************************************

////为解决局部单元尺寸过小导致时步过小，采用缩放单元时步策略
dyna.ScaleTimeStep(2e-5, 1, 1);

dyna.Set("Time_Step 2e-5");


//动力计算0.03秒
dyna.DynaCycle(2.5e-2);

