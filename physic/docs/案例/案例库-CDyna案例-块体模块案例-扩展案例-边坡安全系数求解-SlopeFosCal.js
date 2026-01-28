setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//设置系统收敛的不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-4");

//设置3个方向的重力加速度值
dyna.Set("Gravity 0 -9.8 0");

//打开大变形计算开关
dyna.Set("Large_Displace 0");

//设置计算结果的输出间隔为5000步
dyna.Set("Output_Interval 5000");

//设置监测结果的输出时步为100步
dyna.Set("Moniter_Iter 100");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为0.6（一般建议为0.3-0.6）
dyna.Set("Virtural_Step 0.6");

//导入当前目录下的GiD类型网格，网格名称为"Slope2D.msh"
var msh1 = imesh.importAnsys("SoilSlope2D.dat");

//将平台的网格加载到BlockDyna核心求解器
blkdyn.GetMesh(msh1);

//设置所有单元为线弹性模型
blkdyn.SetModel("linear");

//设置组1的材料参数，分别为密度，弹性模量，泊松比，粘聚力、抗拉强度、内摩擦角、剪胀角、组号
blkdyn.SetMatByGroup(2000, 3e8, 0.33, 5e4, 1e4, 25.0, 10.0, 1);

//X方向左侧法向约束
blkdyn.FixVByCoord("x", 0.0, -0.001,0.001, -1e10, 1e10, -1e10, 1e10);

//X方向右侧法向约束
blkdyn.FixVByCoord("x", 0.0, 34.99, 36, -1e10, 1e10, -1e10, 1e10);

//Y方向底部法向约束
blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);

//设置全部节点的局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

//监测典型测点的x方向的位移
dyna.Monitor("block", "xdis", 10, 10, 0);
dyna.Monitor("block", "xdis", 20, 15, 0);

//弹性计算
dyna.Solve();

//保存结果文件
dyna.Save("elastic.sav");


//将所有单元的计算模型设定为Mohr-Coulomb理想弹塑性模型
blkdyn.SetModel("MC");

//计算至稳定
dyna.Solve();

//保存结果文件
dyna.Save("plastic.sav");

var coord=new Array(15.0,20.0,0.0);
dyna.SolveFos(5000, 8, 1.0, coord, "plastic.sav");

//打印求解信息
print("Solution Finished");
