// 设置当前工作路径为脚本文件所在路径
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 设置结果输出时步为500步
dyna.Set("Output_Interval 500");

// 监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

// 导入GiD格式的巷道网格文件
blkdyn.ImportGrid("GiD", "Tunnel.msh");

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置固体单元的材料参数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e1, 1e1, 25.0, 10.0, 1);

// 对模型的底部进行全约束
blkdyn.FixVByCoord("xyz", -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);

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

// 开始计算
dyna.Solve();
