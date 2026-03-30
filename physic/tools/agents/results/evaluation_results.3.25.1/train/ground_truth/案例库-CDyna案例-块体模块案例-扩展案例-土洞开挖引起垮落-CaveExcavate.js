//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-4");

//设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 -9.8 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1")

//设置结果输出时步为1000步
dyna.Set("Output_Interval 1000");

//监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

//打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

dyna.Set("Contact_Detect_Tol 1e-5");

dyna.Set("Contact_Search_Method 2");

//导入Gmsh格式的巷道网格文件
blkdyn.ImportGrid("Gmsh", "171222-cave.msh");


blkdyn.CrtIFace();

blkdyn.UpdateIFaceMesh();


//设置实体单元为线弹性模型
blkdyn.SetModel("linear");

//设置固体单元的材料参数
blkdyn.SetMat(1800,70e6,0.3,25e3,3e3,25,15);


//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("linear");

//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIStiffByElem(1.0);

blkdyn.SetIStrengthByElem();

//底部法向约束
blkdyn.FixV("xy", 0.0, "y", -0.001, 0.001);

//左侧法向约束
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);

//右侧法向约束
blkdyn.FixV("x", 0.0, "x", 65.999, 66.7);

//设置局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);


//顶部竖直位移监测
for(var i = 0; i < 15; i++)
{
    var fvalue = 12 + 3 * i;
    dyna.Monitor("block","ydis",fvalue, 39, 0);
}

//顶部水平位移监测
for(var i = 0; i < 15; i++)
{
    var fvalue = 12 + 3 * i;
    dyna.Monitor("block","xdis",fvalue, 39, 0);
}


//中部竖直应力监测
for(var i = 0; i < 15; i++)
{
    var fvalue = 12 + 3 * i;
    dyna.Monitor("block","syy",fvalue, 6, 0);
}

//中部水平应力监测
for(var i = 0; i < 15; i++)
{
    var fvalue = 12 + 3 * i;
    dyna.Monitor("block","sxx",fvalue, 6, 0);
}

//系统破裂度监测
dyna.Monitor("gvalue","gv_spring_crack_ratio");

//求解至稳定
dyna.Solve();

dyna.Save("Initial.sav");


blkdyn.SetModel("MC");

blkdyn.SetIModel("FracE");

blkdyn.SetIFracEnergyByGroupInterface(100.0,500.0, 1,1);

//**************************************************初始化位移
//定义三个方向基础值
var values = new Array(0.0,0.0, 0);

//定义变化梯度
var gradient = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);

//将控制范围内的位移清零
blkdyn.InitConditionByCoord("displace", values, gradient, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);
//**************************************************初始化位移


//设置局部阻尼为0.01
blkdyn.SetLocalDamp(0.01);

//求解1.5w
dyna.Solve(15000);
