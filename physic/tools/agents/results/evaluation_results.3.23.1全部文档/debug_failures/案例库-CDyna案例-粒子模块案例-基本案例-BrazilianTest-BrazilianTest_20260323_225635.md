# Failure Analysis: 案例库-CDyna案例-粒子模块案例-基本案例-BrazilianTest-BrazilianTest.js

## Query
请编写一个CDyna仿真脚本，实现基本案例-BrazilianTest-BrazilianTest，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置系统不平衡率
dyna.Set("UnBalance_Ratio 1e-5");

// 设置重力加速度为负Y方向
dyna.Set("Gravity 0.0 -9.8 0.0");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// 计算结果输出间隔为2000步
dyna.Set("Output_Interval 2000");

// 关闭GiD结果输出开关
dyna.Set("GiD_Out 0");

// 将监测间隔设为100步
dyna.Set("Moniter_Iter 100");

// 打开虚质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 将虚拟时步设定为0.5
dyna.Set("Virtural_Step 0.5");

// 设置接触容差为0.0
dyna.Set("Contact_Detect_Tol 0.00");

// 关闭接触更新开关
dyna.Set("If_Renew_Contact 0");

// 关闭Save自动存储开关
dyna.Set("SaveFile_Out 0");

// 创建三维块体网格模拟巴西劈裂试验试样（圆柱体近似）
blkdyn.GenBrick3D(10, 10, 10, 20, 20, 20, 1);

// 将组号为1的单元交界面进行切割
blkdyn.CrtIFace(1, 1);

// 更新交界面网格信息
blkdyn.UpdateIFaceMesh();

// 设置单元模型为线弹性模型
blkdyn.SetModel("linear");

// 设置单元的材料参数（密度、弹性模量、泊松比等）
blkdyn.SetMatByGroup(2500, 1e10, 0.25, 10e6, 4e6, 40.0, 10.0, 1);

// 将横观各向同性材料关联到设定的单元组号范围
blkdyn.BindTransIsoMat(1, 1, 10);

// 设置交界面的模型为断裂模型
blkdyn.SetIModel("FracE");

// 设置交界面的一般材料参数，法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(5e13, 5e13, 40, 5e6, 1e6);

// 指定组1的断裂能参数，拉伸断裂能为50，剪切断裂能为500
blkdyn.SetIFracEnergyByGroupInterface(50.0, 500.0, 1, 1);

// 固定底部边界在X、Z方向的速度并限制Y方向位移
blkdyn.FixVByCoord("x", 0.0, -1e10, 1e10, -0.0201, -0.0199, -1e10, 1e10);
blkdyn.FixVByCoord("z", 0.0, -1e10, 1e10, -0.0201, -0.0199, -1e10, 1e10);

// 固定底部Y方向位移（限制）
blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -0.0201, -0.0199, -1e10, 1e10);

// 设置顶部加载点施加准静态速度载荷
blkdyn.FixVByCoord("y", -2e-9, -1e10, 1e10, 0.0199, 0.0201, -1e10, 1e10);

// 设置监测点位置及监测信息
dyna.Monitor("block", "ydis", 5.0, 10.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);

// 计算前初始化操作以准备求解
dyna.BeforeCal();

// 循环调用求解器并输出监测数据至结果文件夹
for (var i = 0; i < 100000; i++) {
    // 集成核心计算
    var unbal = blkdyn.Solver();

    // 计算单元变形力
    blkdyn.CalBlockForce();

    // 计算节点运动
    blkdyn.CalNodeMovement();

    // 输出监测信息
    dyna.OutputMonitorData();

    // 每隔100步推送信息
    if (i != 0 && i % 100 == 0) {
        // 推送文本信息
        print("不平衡率：" + unbal);

        // 推送结果信息至GDEM-Env
        dyna.PutStep(1, i, 0.1);
    }
}

// 打印提示信息
print("Solution Finished");
```

## Ground Truth
```javascript
//设置当前路径为JavaScript脚本所在的路径
setCurDir(getSrcDir());

//清除GDEM-Pdyna计算核心中的内存数据
dyna.Clear();

//清除GDEM-Env中的结果数据
doc.clearResult();

//设置输出的间隔为500步
dyna.Set("Output_Interval 500");

//打开虚拟质量开关
dyna.Set("If_Virtural_Mass 1");

//设置全局的重力加速度为0
dyna.Set("Gravity 0.0 0.0 0.0");

//设置颗粒间的接触容差为0.2mm
dyna.Set("Contact_Detect_Tol 2e-4");

//设置全局的刚性面模型及参数
dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9 0 0 0.0");

//设置颗粒与刚性面接触时，接触刚度是否采用设置值，0-不是（采用颗粒的刚度）
dyna.Set("If_Stiff_Use_Set_Value 0")

//创建上部刚性面
var fCoord = new Array();
fCoord[0]=new Array(-0.1,0.05,0.0);
fCoord[1]=new Array(0.1,0.05,0.0);
rdface.Create (1, 1, 2, fCoord);

//创建下部刚性面
fCoord[0]=new Array(-0.1,-0.05,0.0);
fCoord[1]=new Array(0.1,-0.05,0.0);
rdface.Create (1, 2, 2, fCoord);

//设置上部刚性面的加载速度
var FixV=[0.0, -2e-9, 0.0];
rdface.ApplyVelocityByGroup (FixV, 1,1);

//导入gid格式的颗粒
pdyna.Import("gid","Brazi.msh");

//设置颗粒模型为脆性断裂模型
pdyna.SetModel("brittleMC");

//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
pdyna.SetMat(2500, 3e10, 0.25, 1e6, 5e6, 30, 0.0, 0.2);

//监测刚性面上的竖向位移
dyna.Monitor("rdface","rg_yDis",2,2,0);

//监测刚性面上的竖向力
dyna.Monitor("rdface","rg_pyForce",2,2,0);
dyna.Monitor("rdface","rg_pyForce",1,1,0);

//计算3万步
dyna.Solve(30000);
```

## Unified Diff
```diff
--- 案例库-CDyna案例-粒子模块案例-基本案例-BrazilianTest-BrazilianTest.js (ground_truth)
+++ 案例库-CDyna案例-粒子模块案例-基本案例-BrazilianTest-BrazilianTest.js (generated)
@@ -1,60 +1,109 @@
-//设置当前路径为JavaScript脚本所在的路径
 setCurDir(getSrcDir());
 
-//清除GDEM-Pdyna计算核心中的内存数据
-dyna.Clear();
+// 打开力学计算开关
+dyna.Set("Mechanic_Cal 1");
 
-//清除GDEM-Env中的结果数据
-doc.clearResult();
+// 设置系统不平衡率
+dyna.Set("UnBalance_Ratio 1e-5");
 
-//设置输出的间隔为500步
-dyna.Set("Output_Interval 500");
+// 设置重力加速度为负Y方向
+dyna.Set("Gravity 0.0 -9.8 0.0");
 
-//打开虚拟质量开关
+// 关闭大变形计算开关
+dyna.Set("Large_Displace 0");
+
+// 计算结果输出间隔为2000步
+dyna.Set("Output_Interval 2000");
+
+// 关闭GiD结果输出开关
+dyna.Set("GiD_Out 0");
+
+// 将监测间隔设为100步
+dyna.Set("Moniter_Iter 100");
+
+// 打开虚质量计算开关
 dyna.Set("If_Virtural_Mass 1");
 
-//设置全局的重力加速度为0
-dyna.Set("Gravity 0.0 0.0 0.0");
+// 将虚拟时步设定为0.5
+dyna.Set("Virtural_Step 0.5");
 
-//设置颗粒间的接触容差为0.2mm
-dyna.Set("Contact_Detect_Tol 2e-4");
+// 设置接触容差为0.0
+dyna.Set("Contact_Detect_Tol 0.00");
 
-//设置全局的刚性面模型及参数
-dyna.Set("If_Contact_Use_GlobMat 1 2 1e9 1e9 0 0 0.0");
+// 关闭接触更新开关
+dyna.Set("If_Renew_Contact 0");
 
-//设置颗粒与刚性面接触时，接触刚度是否采用设置值，0-不是（采用颗粒的刚度）
-dyna.Set("If_Stiff_Use_Set_Value 0")
+// 关闭Save自动存储开关
+dyna.Set("SaveFile_Out 0");
 
-//创建上部刚性面
-var fCoord = new Array();
-fCoord[0]=new Array(-0.1,0.05,0.0);
-fCoord[1]=new Array(0.1,0.05,0.0);
-rdface.Create (1, 1, 2, fCoord);
+// 创建三维块体网格模拟巴西劈裂试验试样（圆柱体近似）
+blkdyn.GenBrick3D(10, 10, 10, 20, 20, 20, 1);
 
-//创建下部刚性面
-fCoord[0]=new Array(-0.1,-0.05,0.0);
-fCoord[1]=new Array(0.1,-0.05,0.0);
-rdface.Create (1, 2, 2, fCoord);
+// 将组号为1的单元交界面进行切割
+blkdyn.CrtIFace(1, 1);
 
-//设置上部刚性面的加载速度
-var FixV=[0.0, -2e-9, 0.0];
-rdface.ApplyVelocityByGroup (FixV, 1,1);
+// 更新交界面网格信息
+blkdyn.UpdateIFaceMesh();
 
-//导入gid格式的颗粒
-pdyna.Import("gid","Brazi.msh");
+// 设置单元模型为线弹性模型
+blkdyn.SetModel("linear");
 
-//设置颗粒模型为脆性断裂模型
-pdyna.SetModel("brittleMC");
+// 设置单元的材料参数（密度、弹性模量、泊松比等）
+blkdyn.SetMatByGroup(2500, 1e10, 0.25, 10e6, 4e6, 40.0, 10.0, 1);
 
-//设置颗粒材料参数，依次为密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、局部阻尼、粘性阻尼系数（临界阻尼比）
-pdyna.SetMat(2500, 3e10, 0.25, 1e6, 5e6, 30, 0.0, 0.2);
+// 将横观各向同性材料关联到设定的单元组号范围
+blkdyn.BindTransIsoMat(1, 1, 10);
 
-//监测刚性面上的竖向位移
-dyna.Monitor("rdface","rg_yDis",2,2,0);
+// 设置交界面的模型为断裂模型
+blkdyn.SetIModel("FracE");
 
-//监测刚性面上的竖向力
-dyna.Monitor("rdface","rg_pyForce",2,2,0);
-dyna.Monitor("rdface","rg_pyForce",1,1,0);
+// 设置交界面的一般材料参数，法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
+blkdyn.SetIMat(5e13, 5e13, 40, 5e6, 1e6);
 
-//计算3万步
-dyna.Solve(30000);
+// 指定组1的断裂能参数，拉伸断裂能为50，剪切断裂能为500
+blkdyn.SetIFracEnergyByGroupInterface(50.0, 500.0, 1, 1);
+
+// 固定底部边界在X、Z方向的速度并限制Y方向位移
+blkdyn.FixVByCoord("x", 0.0, -1e10, 1e10, -0.0201, -0.0199, -1e10, 1e10);
+blkdyn.FixVByCoord("z", 0.0, -1e10, 1e10, -0.0201, -0.0199, -1e10, 1e10);
+
+// 固定底部Y方向位移（限制）
+blkdyn.FixVByCoord("y", 0.0, -1e10, 1e10, -0.0201, -0.0199, -1e10, 1e10);
+
+// 设置顶部加载点施加准静态速度载荷
+blkdyn.FixVByCoord("y", -2e-9, -1e10, 1e10, 0.0199, 0.0201, -1e10, 1e10);
+
+// 设置监测点位置及监测信息
+dyna.Monitor("block", "ydis", 5.0, 10.0, 5.0);
+dyna.Monitor("block", "ydis", 5.0, 6.0, 5.0);
+dyna.Monitor("block", "ydis", 5.0, 2.0, 5.0);
+
+// 计算前初始化操作以准备求解
+dyna.BeforeCal();
+
+// 循环调用求解器并输出监测数据至结果文件夹
+for (var i = 0; i < 100000; i++) {
+    // 集成核心计算
+    var unbal = blkdyn.Solver();
+
+    // 计算单元变形力
+    blkdyn.CalBlockForce();
+
+    // 计算节点运动
+    blkdyn.CalNodeMovement();
+
+    // 输出监测信息
+    dyna.OutputMonitorData();
+
+    // 每隔100步推送信息
+    if (i != 0 && i % 100 == 0) {
+        // 推送文本信息
+        print("不平衡率：" + unbal);
+
+        // 推送结果信息至GDEM-Env
+        dyna.PutStep(1, i, 0.1);
+    }
+}
+
+// 打印提示信息
+print("Solution Finished");
```
