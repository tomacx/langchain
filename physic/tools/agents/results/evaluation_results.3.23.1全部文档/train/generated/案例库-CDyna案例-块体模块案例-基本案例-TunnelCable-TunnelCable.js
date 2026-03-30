setCurDir(getSrcDir());

// 初始化 CDyna 仿真环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("If_Cal_Bar 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0 0.0 0");
dyna.Set("Large_Displace 0");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.5");

// 导入隧道网格模型
blkdyn.ImportGrid("GiD", "Tunnel.msh");

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置固体单元的材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼）
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e4, 1e4, 25.0, 10.0, 1);

// 对模型底部进行全约束
blkdyn.FixVByCoord("xyz", 0.0, -1e10, 1e10, -1e10, 0.001, -1e10, 1e10);

// 设置局部阻尼为 0.8
blkdyn.SetLocalDamp(0.8);

// 监测典型测点的竖向应力
dyna.Monitor("block", "syy", 15, 13, 0);
dyna.Monitor("block", "syy", 15, 16, 0);
dyna.Monitor("block", "syy", 15, 19, 0);

// 绘制监测点位置
DrawMonitorPos();

// 创建第 1 根锚索
var fArrayCoord1 = [14, 13, 0];
var fArrayCoord2 = [14, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

// 创建第 2 根锚索
var fArrayCoord1 = [15, 13, 0];
var fArrayCoord2 = [15, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

// 创建第 3 根锚索
var fArrayCoord1 = [16, 13, 0];
var fArrayCoord2 = [16, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

// 创建第 4 根锚索
var origin = [13, 13, 0];
var normal = [-1, 1, 0];
bar.CreateByDir("cable", origin, normal, 20);

// 创建第 5 根锚索
var fArrayCoord1 = [17, 13, 0];
var fArrayCoord2 = [17, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

// 创建第 6 根锚索
var fArrayCoord1 = [18, 13, 0];
var fArrayCoord2 = [18, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

// 创建第 7 根锚索
var fArrayCoord1 = [19, 13, 0];
var fArrayCoord2 = [19, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

// 创建第 8 根锚索
var fArrayCoord1 = [20, 13, 0];
var fArrayCoord2 = [20, 18, 0];
bar.CreateByCoord("cable", fArrayCoord1, fArrayCoord2, 20);

// 关联全局 LeeTarver 材料库与特定单元组（将组号为 2-3 的单元的 LeeTarver 爆源模型序号设置为 1）
blkdyn.BindLeeTarverSource(1, 2, 3);

// 配置相交网格间的流量透传计算
fracsp.CalPipeDischarge();

// 设置接触面上的流量传递参数
poresp.CalContactFlowTransfer();

// 执行求解器步长以计算隧道电缆案例的时步结果
dyna.Solve();

// 输出当前时步的结果信息至 Result 文件夹
OutputModelResult();

// 导出当前时步的监测信息至监测文件
OutputMonitorData();
