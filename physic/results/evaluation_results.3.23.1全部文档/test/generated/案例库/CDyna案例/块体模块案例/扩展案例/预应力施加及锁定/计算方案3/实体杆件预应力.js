// 设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 关闭杆件计算开关
dyna.Set("If_Cal_Bar 0");

// 设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

// 设置重力加速度为(0, -9.8, 0)
dyna.Set("Gravity 0 -9.8 0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

// 打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

// 导入GiD格式的巷道网格文件
blkdyn.ImportGrid("GiD", "Tunnel.msh");

// 设置虚拟接触面，所有单元进行离散
blkdyn.CrtIFace();

// 更新单元拓扑信息
blkdyn.UpdateIFaceMesh();

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置固体单元的材料参数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e4, 1e4, 25.0, 10.0, 1);

// 设置接触面模型为线弹性模型
blkdyn.SetIModel("linear");

// 接触面刚度从单元当中继承，是单元特征刚度的1倍
blkdyn.SetIStiffByElem(1.0);
// 接触面强度从单元中继承
blkdyn.SetIStrengthByElem();

// 对模型的底部及左右两侧进行法向约束
blkdyn.FixV("y", 0.0, "y", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0.0, "x", 29.99, 30.01);

// 设置局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

// 监测典型测点的竖向应力
dyna.Monitor("block", "syy", 15, 13, 0);
dyna.Monitor("block", "syy", 15, 16, 0);
dyna.Monitor("block", "syy", 15, 19, 0);

// 创建第1根锚索
var fArrayCoord1 = [14,13,0];
var fArrayCoord2 = [14,18,0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

// 创建第2根锚索
var fArrayCoord3 = [16,13,0];
var fArrayCoord4 = [16,18,0];
bar.CreateByCoord("cable", fArrayCoord3, fArrayCoord4, 20);

// 指定自由段的锚索材料参数
var BarPropFree = [1.0, 7800.0, 2e10, 0.25, 235e6, 235e6, 0.0, 0.0, 1e9, 0.4, 0.0];
bar.SetPropByID(BarPropFree, 1, 10, 1, 10);

// 指定锚固段的锚索材料参数
var BarPropAnchor = [1.0, 7800.0, 2e10, 0.25, 235e6, 235e6, 1e6, 35, 1e9, 0.4, 0.0];
bar.SetPropByID(BarPropAnchor, 1, 10, 11, 20);

// 求解至稳定
dyna.Solve();

// 打印信息
print("**************求解成功!**************");
