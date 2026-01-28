//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//设置结果输出时步为500步
dyna.Set("Output_Interval 500");

//监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

//打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

//导入GiD格式的巷道网格文件
blkdyn.ImportGrid("GiD", "Tunnel.msh");

//设置实体单元为线弹性模型
blkdyn.SetModel("linear");

//设置固体单元的材料参数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e1, 1e1, 25.0, 10.0, 1);

//对模型的底部进行全约束
blkdyn.FixVByCoord("xyz", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);

//设置局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

//监测典型测点的竖向应力
dyna.Monitor("block", "syy", 15, 13, 0);
dyna.Monitor("block", "syy", 15, 16, 0);
dyna.Monitor("block", "syy", 15, 19, 0);

//创建第1根锚索
var fArrayCoord1 = [14,13,0];
var fArrayCoord2 = [14,18,0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第2根锚索
var fArrayCoord1 = [15, 13, 0];
var fArrayCoord2 = [15, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第3根锚索
var fArrayCoord1 = [16, 13, 0];
var fArrayCoord2 = [16, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第4根锚索
var origin = [13,13,0];
var normal = [-1,1,0];
bar.CreateByDir("cable", origin, normal, 8, 20);

//创建第5根锚索
var origin = [17, 13, 0];
var normal = [1, 1, 0];
bar.CreateByDir("cable", origin, normal, 8, 20);

//创建第6根锚索
var fArrayCoord1 = [13, 12, 0];
var fArrayCoord2 = [8, 12, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第7根锚索
var fArrayCoord1 = [13, 11, 0];
var fArrayCoord2 = [8, 11, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第8根锚索
var fArrayCoord1 = [17, 12, 0];
var fArrayCoord2 = [22, 12, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

//创建第9根锚索
var fArrayCoord1 = [17, 11, 0];
var fArrayCoord2 = [22, 11, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);


//设置所有锚索的力学模型为可破坏模型
bar.SetModelByID("failure", 1, 100);

//定义两种锚索材料
var BarProp1 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.8, 0.0];
var BarProp2 = [1e-2, 7800.0, 1e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.8, 0.0];

//指定自由段的锚索材料
bar.SetPropByID(BarProp2, 1, 10, 1, 15);

//指定锚固段的锚索材料
bar.SetPropByID(BarProp1, 1, 10, 16, 20);

//在每根锚索的第一个节点上施加预应力，为10kN。
bar.ApplyPreTenForce(1e4, 1,11,1,1);

//求解1.5万步
dyna.Solve(15000);
