# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-TunnelExcavation-Tunnel3D.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-TunnelExcavation-Tunnel3D，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

// 清除GDEM-Env中的结果数据
doc.clearResult();

// 设置重力加速度
dyna.Set("Gravity 0.0 -9.8 0.0");

// 设置求解不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时步
dyna.Set("Time_Step 1e-3");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 创建椭圆形隧道模型（高度40m，宽度60m，竖向半轴3m，水平半轴4m，底部距离10m）
// 网格尺寸：模型1.0m，隧道0.2m，包含衬砌ShellFlag=1，衬砌厚度0.3m
igeo.genEllipseTunnelS(40, 60, 3, 4, 10, 1.0, 0.2, 1, 0.3);

// 设置块体模块为线弹性模型
blkdyn.SetModel("linear");

// 设置围岩材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼）
// 组号1：外部围岩，组号2：内部围岩，组号3：衬砌
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 1e6, 5e5, 35, 0.8, 0.0);

// 固定模型底部边界（Z方向速度约束）
blkdyn.FixV("z", 0.0, "z", -1e10, 1e10);

// 固定模型左右两侧边界（X方向速度约束）
blkdyn.FixV("x", 0.0, "x", -1, 2.0);
blkdyn.FixV("x", 0.0, "x", 98, 101);

// 设置监测点：监测隧道顶部、中部和底部的竖向位移
dyna.Monitor("block", "ydis", 30, 4, 0);
dyna.Monitor("block", "ydis", 30, 20, 0);
dyna.Monitor("block", "ydis", 30, 36, 0);

// 设置监测点：监测隧道顶部、中部和底部的竖向应力
dyna.Monitor("block", "syy", 30, 4, 0);
dyna.Monitor("block", "syy", 30, 20, 0);
dyna.Monitor("block", "syy", 30, 36, 0);

// 计算前初始化
dyna.BeforeCal();

// 执行求解器进行计算
dyna.Solve();

// 将监测数据输出至Result文件夹
dyna.OutputMonitorData();

// 将模型结果存储为可导入格式
OutputModelResult();

// 结束仿真脚本运行
print("隧道开挖仿真完成，结果已输出至Result文件夹");
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//将系统不平衡率设定为1e-4，不平衡率达到该值，认为系统稳定，退出求解
dyna.Set("UnBalance_Ratio 1e-4");

//设置三个方向的重力加速度
dyna.Set("Gravity 0 0.0 -10.0");

//关闭大变形计算开关
dyna.Set("Large_Displace 0");

//设置云图的输出间隔为100步
dyna.Set("Output_Interval 100");

//设置监测内容的输出间隔为100步
dyna.Set("Moniter_Iter 100");

//打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为0.6
dyna.Set("Virtural_Step 0.6");

//导入Flac3D格式的网格，网格名为"tunnel.flac3d"
blkdyn.ImportGrid("flac3d", "tunnel.flac3d");

//设置所有单元为线弹性模型
blkdyn.SetModel("linear");

//设置底部材料参数
blkdyn.SetMatByCoord(2200,  3.0e9,  0.25,  50e3, 5e3, 20, 3, -1e4,1e4, -1e4, 1e4, -50, 25);

//设置顶部材料参数
blkdyn.SetMatByCoord(2200,  3.0e8,  0.3,   25e3,   0, 20, 0, -1e4,1e4, -1e4, 1e4, 25, 35);

//设置所有单元的局部阻尼为0.8
blkdyn.SetLocalDamp(0.8);

//对模型四周及底部进行法向约束
blkdyn.FixV("x", 0, "x", -0.01, 0.01);
blkdyn.FixV("x", 0, "x", 43.99, 44.01);
blkdyn.FixV("z", 0, "z", -40.1, -39.9);
blkdyn.FixV("y", 0, "y", -0.01, 0.01);
blkdyn.FixV("y", 0, "y", 50.9, 51.1);

//定义BaseValue（三个方向基础值）及Grad（三个方向梯度值）两个数组
var BaseValue = [-770e3, -385e3, -770e3];
var Grad      = [0, 0, 22000, 0, 0, 11000, 0, 0, 22000];

//对模型所有单元初始化地应力
blkdyn.InitConditionByCoord("stress", BaseValue, Grad,  -1e3,1e3, -1e3,1e3, -1e3,1e3);

//求解至稳定
dyna.Solve();

//保存弹性计算结果
dyna.Save("elastic.sav");

//将所有单元的本构模型设定为理想弹塑性模型
blkdyn.SetModel("MC");

//塑性求解至稳定
dyna.Solve();

//保存塑性信息
dyna.Save("plastic.sav");

//开挖组号为4的单元
blkdyn.SetModel("none",4);

//求解至稳定
dyna.Solve();

//保存开挖组4后的结果
dyna.Save("exca4.sav");

//开挖组号为5的单元
blkdyn.SetModel("none", 5);

//求解至稳定
dyna.Solve();

//保存开挖组5后的结果
dyna.Save("exca5.sav");

//开挖组号为7的单元
blkdyn.SetModel("none", 7);

//求解至稳定
dyna.Solve();

//保存开挖组7后的结果
dyna.Save("exca7.sav");

//打印信息
print("Solution Finished");

```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-基本案例-TunnelExcavation-Tunnel3D.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-基本案例-TunnelExcavation-Tunnel3D.js (generated)
@@ -1,100 +1,65 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//打开力学计算开关
-dyna.Set("Mechanic_Cal 1");
+// 清除GDEM-Pdyna计算核心中的内存数据
+dyna.Clear();
 
-//将系统不平衡率设定为1e-4，不平衡率达到该值，认为系统稳定，退出求解
+// 清除GDEM-Env中的结果数据
+doc.clearResult();
+
+// 设置重力加速度
+dyna.Set("Gravity 0.0 -9.8 0.0");
+
+// 设置求解不平衡率
 dyna.Set("UnBalance_Ratio 1e-4");
 
-//设置三个方向的重力加速度
-dyna.Set("Gravity 0 0.0 -10.0");
+// 关闭虚拟质量开关
+dyna.Set("If_Virtural_Mass 0");
 
-//关闭大变形计算开关
-dyna.Set("Large_Displace 0");
+// 设置计算时步
+dyna.Set("Time_Step 1e-3");
 
-//设置云图的输出间隔为100步
-dyna.Set("Output_Interval 100");
+// 设置结果输出间隔为500步
+dyna.Set("Output_Interval 500");
 
-//设置监测内容的输出间隔为100步
-dyna.Set("Moniter_Iter 100");
+// 创建椭圆形隧道模型（高度40m，宽度60m，竖向半轴3m，水平半轴4m，底部距离10m）
+// 网格尺寸：模型1.0m，隧道0.2m，包含衬砌ShellFlag=1，衬砌厚度0.3m
+igeo.genEllipseTunnelS(40, 60, 3, 4, 10, 1.0, 0.2, 1, 0.3);
 
-//打开虚质量计算开关
-dyna.Set("If_Virtural_Mass 1");
-
-//设置虚拟时步为0.6
-dyna.Set("Virtural_Step 0.6");
-
-//导入Flac3D格式的网格，网格名为"tunnel.flac3d"
-blkdyn.ImportGrid("flac3d", "tunnel.flac3d");
-
-//设置所有单元为线弹性模型
+// 设置块体模块为线弹性模型
 blkdyn.SetModel("linear");
 
-//设置底部材料参数
-blkdyn.SetMatByCoord(2200,  3.0e9,  0.25,  50e3, 5e3, 20, 3, -1e4,1e4, -1e4, 1e4, -50, 25);
+// 设置围岩材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼）
+// 组号1：外部围岩，组号2：内部围岩，组号3：衬砌
+blkdyn.SetMatByGroup(2500, 3e10, 0.25, 1e6, 5e5, 35, 0.8, 0.0);
 
-//设置顶部材料参数
-blkdyn.SetMatByCoord(2200,  3.0e8,  0.3,   25e3,   0, 20, 0, -1e4,1e4, -1e4, 1e4, 25, 35);
+// 固定模型底部边界（Z方向速度约束）
+blkdyn.FixV("z", 0.0, "z", -1e10, 1e10);
 
-//设置所有单元的局部阻尼为0.8
-blkdyn.SetLocalDamp(0.8);
+// 固定模型左右两侧边界（X方向速度约束）
+blkdyn.FixV("x", 0.0, "x", -1, 2.0);
+blkdyn.FixV("x", 0.0, "x", 98, 101);
 
-//对模型四周及底部进行法向约束
-blkdyn.FixV("x", 0, "x", -0.01, 0.01);
-blkdyn.FixV("x", 0, "x", 43.99, 44.01);
-blkdyn.FixV("z", 0, "z", -40.1, -39.9);
-blkdyn.FixV("y", 0, "y", -0.01, 0.01);
-blkdyn.FixV("y", 0, "y", 50.9, 51.1);
+// 设置监测点：监测隧道顶部、中部和底部的竖向位移
+dyna.Monitor("block", "ydis", 30, 4, 0);
+dyna.Monitor("block", "ydis", 30, 20, 0);
+dyna.Monitor("block", "ydis", 30, 36, 0);
 
-//定义BaseValue（三个方向基础值）及Grad（三个方向梯度值）两个数组
-var BaseValue = [-770e3, -385e3, -770e3];
-var Grad      = [0, 0, 22000, 0, 0, 11000, 0, 0, 22000];
+// 设置监测点：监测隧道顶部、中部和底部的竖向应力
+dyna.Monitor("block", "syy", 30, 4, 0);
+dyna.Monitor("block", "syy", 30, 20, 0);
+dyna.Monitor("block", "syy", 30, 36, 0);
 
-//对模型所有单元初始化地应力
-blkdyn.InitConditionByCoord("stress", BaseValue, Grad,  -1e3,1e3, -1e3,1e3, -1e3,1e3);
+// 计算前初始化
+dyna.BeforeCal();
 
-//求解至稳定
+// 执行求解器进行计算
 dyna.Solve();
 
-//保存弹性计算结果
-dyna.Save("elastic.sav");
+// 将监测数据输出至Result文件夹
+dyna.OutputMonitorData();
 
-//将所有单元的本构模型设定为理想弹塑性模型
-blkdyn.SetModel("MC");
+// 将模型结果存储为可导入格式
+OutputModelResult();
 
-//塑性求解至稳定
-dyna.Solve();
-
-//保存塑性信息
-dyna.Save("plastic.sav");
-
-//开挖组号为4的单元
-blkdyn.SetModel("none",4);
-
-//求解至稳定
-dyna.Solve();
-
-//保存开挖组4后的结果
-dyna.Save("exca4.sav");
-
-//开挖组号为5的单元
-blkdyn.SetModel("none", 5);
-
-//求解至稳定
-dyna.Solve();
-
-//保存开挖组5后的结果
-dyna.Save("exca5.sav");
-
-//开挖组号为7的单元
-blkdyn.SetModel("none", 7);
-
-//求解至稳定
-dyna.Solve();
-
-//保存开挖组7后的结果
-dyna.Save("exca7.sav");
-
-//打印信息
-print("Solution Finished");
+// 结束仿真脚本运行
+print("隧道开挖仿真完成，结果已输出至Result文件夹");
```
