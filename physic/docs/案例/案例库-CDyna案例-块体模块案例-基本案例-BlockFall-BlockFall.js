//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置三个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 1");

//设置计算结果的输出间隔为500步
dyna.Set("Output_Interval 500");

//关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

//打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

//设置子空间更新时步为10步
dyna.Set("Renew_Interval 10");

//打开棱-棱接触检测开关
dyna.Set("If_Cal_EE_Contact 1");

//设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 2e-3");

//打开save文件自动保存开关
dyna.Set("SaveFile_Out 0");

//从当前文件夹下导入patran格式的网格文件
blkdyn.ImportGrid("gid", "BlockSlopeFall.msh");

//对组号为2的单元进行接触面切割生成
blkdyn.CrtIFace(2);

//将组号为1的单元的自由面设定为接触面
blkdyn.CrtBoundIFaceByGroup(1);

//设置组号1所对应的单元为刚性单元，仅提供支撑，不计算力
blkdyn.SetRigidElemByGroup(1);

//更新接触面网格
blkdyn.UpdateIFaceMesh();

//设定所有单元的本构为线弹性本构
blkdyn.SetModel("linear");

//设定组号为1-100之间的材料参数
blkdyn.SetMat(2500, 2e9, 0.25, 8e6, 2e6, 40.0, 10.0, 1, 100);

//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(3e10, 3e10, 10.0, 0.0, 0.0);

//设定全部节点的局部阻尼系数为0.05
blkdyn.SetLocalDamp(0.05);

//设置计算时步
dyna.Set("Time_Step 2e-4");

//计算5万步
dyna.Solve(50000);

//打印提示信息
print("Solution Finished");


