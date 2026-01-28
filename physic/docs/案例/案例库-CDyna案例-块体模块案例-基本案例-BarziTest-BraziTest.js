//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置系统不平衡率
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度为0
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//计算结果输出间隔为2000步
dyna.Set("Output_Interval 2000");

//关闭GiD结果输出开关
dyna.Set("GiD_Out 0");

//将监测间隔为100步
dyna.Set("Moniter_Iter 100");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//将虚拟时步设定为0.5
dyna.Set("Virtural_Step 0.5");


//设定接触容差为0.0
dyna.Set("Contact_Detect_Tol 0.00");

//关闭接触更新开关
dyna.Set("If_Renew_Contact 0");

//关闭Save自动存储开关
dyna.Set("SaveFile_Out 0");

//创建半径为2cm的圆盘
blkdyn.GenCircle(0.0, 0.02, 20,60, 1);

//将组号为1的单元交界面进行切割
blkdyn.CrtIFace(1, 1);

//更新交界面网格信息
blkdyn.UpdateIFaceMesh();

//设置单元模型为线弹性模量
blkdyn.SetModel("linear");

//设置单元的材料参数
blkdyn.SetMatByGroup(2500, 1e10, 0.25, 10e6, 4e6, 40.0, 10.0, 1);

//设置交界面的模型为断裂模型
blkdyn.SetIModel("FracE");

//设置交界面的一般材料参数，法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(5e13, 5e13, 40, 5e6, 1e6);

//指定组1的断裂能参数，拉伸断裂能为50，剪切断裂能为500
blkdyn.SetIFracEnergyByGroupInterface(50.0,500.0, 1,1);

//最底侧节点法向约束
blkdyn.FixVByCoord("y", 0.0,-1e10, 1e10, -0.0201,-0.0199, -1e10, 1e10);

//最顶侧节点施加2e-9的准静态速度载荷
blkdyn.FixVByCoord("y", -2e-9, -1e10, 1e10, 0.0199, 0.0201, -1e10, 1e10);

//计算10万步
dyna.Solve(100000);

//打印提示信息
print("Solution Finished");
