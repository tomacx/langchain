//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1")

//设置结果输出时步为500步
dyna.Set("Output_Interval 500");

//监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

//打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 0");

//设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

dyna.Set("Contact_Detect_Tol 0.0");

dyna.Set("BB_Contact_GroupLU 2 2");

dyna.Set("Bar_Kill_Option 1 0.5 0.5");

dyna.Set("Bar_Couple_Type 3");

blkdyn.ImportGrid("ansys","ansys-mesh.dat");

blkdyn.CrtIFace(1);
blkdyn.CrtBoundIFaceByGroup(2);

blkdyn.UpdateIFaceMesh();


//设置实体单元为线弹性模型
blkdyn.SetModel("linear");

//设置楼板参数
blkdyn.SetMat(2500, 3e10, 0.25, 3e6, 1e6, 30.0, 10.0, 1);

//设置冲击球参数
blkdyn.SetMat(12800, 5e11, 0.27, 1e9, 1e9, 0.0, 0.0, 2);

//左右两侧全约束
blkdyn.FixV("xy", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("xy", 0.0, "x", 2.0-0.001, 2.0 + 0.001);


//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("SSMC");

//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIStiffByElem(10.0);

blkdyn.SetIStrengthByElem();


//设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.01);

//blkdyn.InitConditionByCoord(strCondition,fArrayVar[3], fArrayGrad[9], x0, x1, y0, y1, z0, z1);

blkdyn.InitConditionByGroup("velocity",[0,-100,0], [0,0,0,0,0,0,0,0,0], 2,2);


bar.Import("ansys", "blot", "bar.dat");


//设置所有锚索的力学模型为可破坏模型
bar.SetModelByID("failure", 1, 10000);

//定义两种锚索材料
var BarProp1 = [0.02, 7800.0, 1e11, 0.25, 235e6, 235e6, 1e6, 35, 1e11, 0.2, 0.0];


bar.SetPropByID(BarProp1, 1, 1000000, 1, 20);

dyna.Monitor("block", "yforce", 1.0, 0.3, 0.0);
dyna.Monitor("block", "syy", 1.0, 0.25, 0.0);


dyna.TimeStepCorrect(0.8);

//求解1.5万步
dyna.DynaCycle(1);
