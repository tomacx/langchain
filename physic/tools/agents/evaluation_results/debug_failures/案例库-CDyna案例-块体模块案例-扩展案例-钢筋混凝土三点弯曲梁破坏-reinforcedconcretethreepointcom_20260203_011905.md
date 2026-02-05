# Failure Analysis: 案例库-CDyna案例-块体模块案例-扩展案例-钢筋混凝土三点弯曲梁破坏-reinforcedconcretethreepointcom.js

## Query
请生成一个CDyna案例的脚本，功能是块体模块案例-扩展案例-钢筋混凝土三点弯曲梁破坏-reinforcedconcretethreepointcom

## Generated Code
```javascript
// 块体模块案例-扩展案例-钢筋混凝土三点弯曲梁破坏
function reinforced_concrete_three_point_bending() {
    // 设置模型为线性
    blkdyn.SetModel("linear");
    
    // 设置材料参数
    blkdyn.SetMat(2000, 3e9, 0.25, 1e4, 1e4, 20, 10);
    
    // 设置边界条件
    blkdyn.FixV("y", 0, "y", -0.001, 0.001);
    blkdyn.FixV("x", 0, "x", -0.001, 0.001);
    blkdyn.FixV("x", 0, "x", 9.999, 11);
    
    // 求解
    dyna.Solve();
}

// 扩展案例-钢筋混凝土楼板冲击破裂过程模拟
function reinforced_concrete_floor_impact_failure() {
    // 设置局部阻尼为0.2
    blkdyn.SetLocalDamp(0.01);
    
    // 初始化条件
    blkdyn.InitConditionByGroup("velocity", [0, -100, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], 2, 2);
    
    // 导入数据
    bar.Import("ansys", "blot", "bar.dat");
    
    // 设置锚索的力学模型为可破坏模型
    bar.SetModelByID("failure", 1, 10000);
    
    // 定义两种锚索材料
    var BarProp1 = [0.02, 7800.0, 1e11, 0.25, 235e6, 235e6, 1e6, 35, 1e11, 0.2, 0.0];
    
    // 设置锚索材料
    bar.SetPropByID(BarProp1, 1, 1000000, 1, 20);
    
    // 监控变量
    dyna.Monitor("block", "yforce", 1.0, 0.3, 0.0);
    dyna.Monitor("block", "syy", 1.0, 0.25, 0.0);
    
    // 时间步长校正
    dyna.TimeStepCorrect(0.8);
    
    // 求解1.5万步
    dyna.DynaCycle(1);
}

// 扩展案例-土体剪切破坏
function soil_shear_failure() {
    // 设置模型为MC
    blkdyn.SetModel("MC");
    
    // 设置材料参数
    blkdyn.SetIModel("SSMC");
    blkdyn.SetMatByGroup(1800, 5e7, 0.14, 130e3, 1e6, 36, 10.0, 1);
    
    // 设置刚度和强度
    blkdyn.SetIStiffByElem(20.0);
    blkdyn.SetIStrengthByElem();
    
    // 模型底部Y方向约束
    blkdyn.FixVByCoord("xy", 0.0, -1e10, 1e10, -1e-4, 1e-4, -1e10, 1e10);
    
    // 模型右侧X方向约束
    blkdyn.FixVByCoord("x", 0.0, 0.061799, 0.061801, -1e10, 1e10, -1e10, 1e10);
    
    // 求解至稳定
    dyna.Solve();
    
    // 模型左侧上部施加X方向水平准静态速度载荷
    blkdyn.FixBoundVByCoord("x", 5e-7, -0.001, 0.001, 0.012501, 0.025, -1e10, 1e10);
    
    // 设置局部阻尼
    blkdyn.SetLocalDamp(0.1);
    
    // 求解5000步
    dyna.Solve(5000);
}

// 执行函数
reinforced_concrete_three_point_bending();
reinforced_concrete_floor_impact_failure();
soil_shear_failure();

print("Solution Finished");
```

## Ground Truth
```javascript
//设置当前工作路径为JavaScript脚本文件所在路径
setCurDir(getSrcDir());

dyna.Clear();
doc.clearResult();

//打开力学计算开关
dyna.Set("Mechanic_Cal 1");

//打开杆件计算开关
dyna.Set("If_Cal_Bar 1");

//设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

//设置3个方向的重力加速度均为0.0
dyna.Set("Gravity 0 0.0 0");

//关闭大变形计算开关
dyna.Set("Large_Displace 1");

dyna.Set("If_Renew_Contact 1")

//设置结果输出时步为500步
dyna.Set("Output_Interval 500");

//监测信息的输出时步为100步
dyna.Set("Moniter_Iter 100");

//打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

//设置虚拟时步为0.5
dyna.Set("Virtural_Step 0.5");

dyna.Set("Contact_Detect_Tol 0.0");


blkdyn.GenBrick2D(2.0, 0.3, 100, 15,1);

blkdyn.CrtIFace();

blkdyn.UpdateIFaceMesh();


//设置实体单元为线弹性模型
blkdyn.SetModel("linear");

//设置固体单元的材料参数
blkdyn.SetMatByGroup(2500, 3e10, 0.25, 3e6, 1e6, 30.0, 10.0, 1);

//对模型的底部进行全约束
blkdyn.FixVByCoord("y", 0.0, -0.001, 0.001, -0.001, 0.001, -1e10, 1e10);

//对模型的底部进行全约束
blkdyn.FixVByCoord("y", 0.0, 1.999, 3.01, -0.001, 0.001, -1e10, 1e10);

blkdyn.FixVByCoord("y", -1e-8, 0.999, 1.001, 0.299, 0.301, -1e10, 1e10);


//设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

//设定接触面上的材料，依次为单位面积法向刚度、单位面积切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIStiffByElem(10.0);

blkdyn.SetIStrengthByElem();


//设置局部阻尼为0.2
blkdyn.SetLocalDamp(0.2);


bar.Import("GiD", "pile", "beam2d.msh");


//设置所有锚索的力学模型为可破坏模型
bar.SetModelByID("failure", 1, 10000);

//定义两种锚索材料
var BarProp1 = [0.02, 7800.0, 1e11, 0.25, 235e6, 235e6, 1e6, 35, 1e11, 0.2, 0.0];


bar.SetPropByID(BarProp1, 1, 1000000, 1, 20);

dyna.Monitor("block", "yforce", 1.0, 0.3, 0.0);
dyna.Monitor("block", "syy", 1.0, 0.25, 0.0);


//求解1.5万步
dyna.Solve(60000);

```
