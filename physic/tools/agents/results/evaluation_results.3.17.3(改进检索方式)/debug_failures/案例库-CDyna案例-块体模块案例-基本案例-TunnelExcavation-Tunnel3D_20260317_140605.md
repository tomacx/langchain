# Failure Analysis: 案例库-CDyna案例-块体模块案例-基本案例-TunnelExcavation-Tunnel3D.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-TunnelExcavation-Tunnel3D，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 清除dyna模块数据和平台数据
dyna.Clear();
doc.clearResult();

// 设置计算参数
dyna.Set("Gravity 0 -9.8 0");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Output_Interval 500");
dyna.Set("Moniter_Iter 100");
dyna.Set("If_Virtural_Mass 0");

// 创建椭圆形隧道模型
// 参数：模型高度、模型宽度、椭圆竖向半轴长、椭圆水平半轴长、隧道底部到模型底部距离、模型网格尺寸、隧道网格尺寸、是否包含衬砌、衬砌厚度、原点坐标
igeo.genEllipseTunnelS(30, 40, 3, 4, 10, 1.0, 0.2, 1, 0.3, [0, 0, 0]);

// 获取网格并分配给块体模块
var msh = imesh.importGid("tunnel.msh");
blkdyn.GetMesh(msh);

// 设置实体单元为线弹性模型
blkdyn.SetModel("linear");

// 设置围岩材料参数（组号1）：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 1e6, 40, 0.8, 0.0, 1);

// 设置衬砌材料参数（组号3）：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 1e6, 40, 0.8, 0.0, 3);

// 设置模型边界条件：固定底部y方向速度
blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);

// 设置左右两侧x方向约束
blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
blkdyn.FixV("x", 0.0, "x", 39.999, 40.01);

// 设置前后z方向约束
blkdyn.FixV("z", 0.0, "z", -0.001, 0.001);
blkdyn.FixV("z", 0.0, "z", 29.999, 30.01);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.8);

// 配置监测点：隧道拱顶、拱底、侧墙位置
dyna.Monitor("block", "ydis", 20, 15, 0);      // 拱顶竖向位移
dyna.Monitor("block", "ydis", 20, 15, 30);     // 拱底竖向位移
dyna.Monitor("block", "xdis", 16, 15, 0);      // 左侧墙水平位移
dyna.Monitor("block", "xdis", 24, 15, 0);      // 右侧墙水平位移
dyna.Monitor("block", "syy", 20, 15, 0);       // 拱顶竖向应力
dyna.Monitor("block", "syy", 20, 15, 30);      // 拱底竖向应力

// 在视图中绘制监测点位置
dyna.DrawMonitorPos();

// 计算前初始化
dyna.BeforeCal();

// 第一阶段：初始地应力平衡
for(var i = 0; i < 5000; i++) {
    blkdyn.CalBlockForce();
    var unbal = blkdyn.CalNodeMovement();
    
    if(i % 100 == 0) {
        print("不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}

// 第二阶段：隧道开挖（将隧道内部围岩组号设为none）
blkdyn.SetModel("none", 2);
dyna.Solve();

// 第三阶段：施作衬砌（恢复衬砌组号）
blkdyn.SetModel("linear", 3);
dyna.Solve();

// 第四阶段：继续计算至稳定
for(var i = 0; i < 10000; i++) {
    blkdyn.CalBlockForce();
    var unbal = blkdyn.CalNodeMovement();
    
    if(i % 100 == 0) {
        print("不平衡率：" + unbal);
        dyna.PutStep(1, i, 0.1);
    }
}

// 输出监测数据
dyna.OutputMonitorData();

// 输出模型结果
dyna.OutputModelResult();

// 绘制位移云图
dyna.Plot("displacement");

// 绘制应力云图
dyna.Plot("stress");

print("隧道开挖仿真完成！");
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
@@ -1,100 +1,101 @@
-//设置当前工作路径为JavaScript脚本文件所在路径
 setCurDir(getSrcDir());
 
-//打开力学计算开关
-dyna.Set("Mechanic_Cal 1");
+// 清除dyna模块数据和平台数据
+dyna.Clear();
+doc.clearResult();
 
-//将系统不平衡率设定为1e-4，不平衡率达到该值，认为系统稳定，退出求解
-dyna.Set("UnBalance_Ratio 1e-4");
+// 设置计算参数
+dyna.Set("Gravity 0 -9.8 0");
+dyna.Set("UnBalance_Ratio 1e-5");
+dyna.Set("Output_Interval 500");
+dyna.Set("Moniter_Iter 100");
+dyna.Set("If_Virtural_Mass 0");
 
-//设置三个方向的重力加速度
-dyna.Set("Gravity 0 0.0 -10.0");
+// 创建椭圆形隧道模型
+// 参数：模型高度、模型宽度、椭圆竖向半轴长、椭圆水平半轴长、隧道底部到模型底部距离、模型网格尺寸、隧道网格尺寸、是否包含衬砌、衬砌厚度、原点坐标
+igeo.genEllipseTunnelS(30, 40, 3, 4, 10, 1.0, 0.2, 1, 0.3, [0, 0, 0]);
 
-//关闭大变形计算开关
-dyna.Set("Large_Displace 0");
+// 获取网格并分配给块体模块
+var msh = imesh.importGid("tunnel.msh");
+blkdyn.GetMesh(msh);
 
-//设置云图的输出间隔为100步
-dyna.Set("Output_Interval 100");
-
-//设置监测内容的输出间隔为100步
-dyna.Set("Moniter_Iter 100");
-
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
+// 设置实体单元为线弹性模型
 blkdyn.SetModel("linear");
 
-//设置底部材料参数
-blkdyn.SetMatByCoord(2200,  3.0e9,  0.25,  50e3, 5e3, 20, 3, -1e4,1e4, -1e4, 1e4, -50, 25);
+// 设置围岩材料参数（组号1）：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
+blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 1e6, 40, 0.8, 0.0, 1);
 
-//设置顶部材料参数
-blkdyn.SetMatByCoord(2200,  3.0e8,  0.3,   25e3,   0, 20, 0, -1e4,1e4, -1e4, 1e4, 25, 35);
+// 设置衬砌材料参数（组号3）：密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数
+blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 1e6, 40, 0.8, 0.0, 3);
 
-//设置所有单元的局部阻尼为0.8
+// 设置模型边界条件：固定底部y方向速度
+blkdyn.FixV("y", 0.0, "y", -0.001, 0.001);
+
+// 设置左右两侧x方向约束
+blkdyn.FixV("x", 0.0, "x", -0.001, 0.001);
+blkdyn.FixV("x", 0.0, "x", 39.999, 40.01);
+
+// 设置前后z方向约束
+blkdyn.FixV("z", 0.0, "z", -0.001, 0.001);
+blkdyn.FixV("z", 0.0, "z", 29.999, 30.01);
+
+// 设置局部阻尼
 blkdyn.SetLocalDamp(0.8);
 
-//对模型四周及底部进行法向约束
-blkdyn.FixV("x", 0, "x", -0.01, 0.01);
-blkdyn.FixV("x", 0, "x", 43.99, 44.01);
-blkdyn.FixV("z", 0, "z", -40.1, -39.9);
-blkdyn.FixV("y", 0, "y", -0.01, 0.01);
-blkdyn.FixV("y", 0, "y", 50.9, 51.1);
+// 配置监测点：隧道拱顶、拱底、侧墙位置
+dyna.Monitor("block", "ydis", 20, 15, 0);      // 拱顶竖向位移
+dyna.Monitor("block", "ydis", 20, 15, 30);     // 拱底竖向位移
+dyna.Monitor("block", "xdis", 16, 15, 0);      // 左侧墙水平位移
+dyna.Monitor("block", "xdis", 24, 15, 0);      // 右侧墙水平位移
+dyna.Monitor("block", "syy", 20, 15, 0);       // 拱顶竖向应力
+dyna.Monitor("block", "syy", 20, 15, 30);      // 拱底竖向应力
 
-//定义BaseValue（三个方向基础值）及Grad（三个方向梯度值）两个数组
-var BaseValue = [-770e3, -385e3, -770e3];
-var Grad      = [0, 0, 22000, 0, 0, 11000, 0, 0, 22000];
+// 在视图中绘制监测点位置
+dyna.DrawMonitorPos();
 
-//对模型所有单元初始化地应力
-blkdyn.InitConditionByCoord("stress", BaseValue, Grad,  -1e3,1e3, -1e3,1e3, -1e3,1e3);
+// 计算前初始化
+dyna.BeforeCal();
 
-//求解至稳定
+// 第一阶段：初始地应力平衡
+for(var i = 0; i < 5000; i++) {
+    blkdyn.CalBlockForce();
+    var unbal = blkdyn.CalNodeMovement();
+    
+    if(i % 100 == 0) {
+        print("不平衡率：" + unbal);
+        dyna.PutStep(1, i, 0.1);
+    }
+}
+
+// 第二阶段：隧道开挖（将隧道内部围岩组号设为none）
+blkdyn.SetModel("none", 2);
 dyna.Solve();
 
-//保存弹性计算结果
-dyna.Save("elastic.sav");
-
-//将所有单元的本构模型设定为理想弹塑性模型
-blkdyn.SetModel("MC");
-
-//塑性求解至稳定
+// 第三阶段：施作衬砌（恢复衬砌组号）
+blkdyn.SetModel("linear", 3);
 dyna.Solve();
 
-//保存塑性信息
-dyna.Save("plastic.sav");
+// 第四阶段：继续计算至稳定
+for(var i = 0; i < 10000; i++) {
+    blkdyn.CalBlockForce();
+    var unbal = blkdyn.CalNodeMovement();
+    
+    if(i % 100 == 0) {
+        print("不平衡率：" + unbal);
+        dyna.PutStep(1, i, 0.1);
+    }
+}
 
-//开挖组号为4的单元
-blkdyn.SetModel("none",4);
+// 输出监测数据
+dyna.OutputMonitorData();
 
-//求解至稳定
-dyna.Solve();
+// 输出模型结果
+dyna.OutputModelResult();
 
-//保存开挖组4后的结果
-dyna.Save("exca4.sav");
+// 绘制位移云图
+dyna.Plot("displacement");
 
-//开挖组号为5的单元
-blkdyn.SetModel("none", 5);
+// 绘制应力云图
+dyna.Plot("stress");
 
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
+print("隧道开挖仿真完成！");
```
