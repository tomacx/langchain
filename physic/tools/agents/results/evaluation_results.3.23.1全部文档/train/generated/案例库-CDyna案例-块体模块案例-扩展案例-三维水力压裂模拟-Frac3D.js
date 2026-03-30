setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Clear();
doc.ClearResult();

// 设置输出间隔为500步
dyna.Set("Output_Interval 500");

// 关闭虚拟质量开关
dyna.Set("If_Virtural_Mass 0");

// 设置计算时间步为0.2ms
dyna.Set("Time_Step 2.0e-4");

// 设置满足稳定条件的系统不平衡率
dyna.Set("UnBalance_Ratio 1e-4");

// 关闭接触更新计算开关
dyna.Set("If_Renew_Contact 0");

// 设置接触容差为0
dyna.Set("Contact_Detect_Tol 0.0");

// 打开裂隙渗流计算模块
dyna.Set("Config_FracSeepage 1");

// 裂隙渗流计算开关
dyna.Set("FracSeepage_Cal 1");

// 开启简单流固耦合计算
dyna.Set("FS_Solid_Interaction 1");

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置三个方向的重力加速度，Z向为9.8m/s²
dyna.Set("Gravity 0 0.0 9.8");

// 关闭大变形计算开关
dyna.Set("Large_Displace 0");

// ==================== 2. 创建几何模型 ====================
// 创建立方体岩石块（10m x 10m x 10m）
igeo.GenerateBox([0, 0, 0], [10, 10, 10]);

// 导入接触面定义文件（预定义裂隙界面）
blkdyn.ImportIFace("bound.dat");

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// ==================== 3. 设置材料属性 ====================
// 设定所有单元的本构为线弹性本构
blkdyn.SetModel("MC");

// 岩石材料参数：密度、杨氏模量、泊松比、粘聚力、抗拉强度、内摩擦角、局部阻尼
blkdyn.SetMatByGroup(2500, 6.5e9, 0.25, 3e6, 3e6, 30.0, 10.0, 1);

// 设定所有接触面的本构为线弹性模型
blkdyn.SetIModel("brittleMC");

// 接触面刚度需要为块体刚度的1-10倍
blkdyn.SetIMat(9e9, 9e9, 30, 3e6, 3e6, 1);

// 设接触面刚度为单元特征刚度的1倍
blkdyn.SetIStiffByElem(1.0);

// 设定全部节点的局部阻尼系数为0.8
blkdyn.SetLocalDamp(0.6);

// ==================== 4. 创建裂隙网格 ====================
// 从固体单元接触面创建裂隙单元，只有弹簧的位置才加渗流
fracsp.CreateGridFromBlock(2);

// ==================== 5. 设置裂隙渗流参数 ====================
// 设置裂隙渗流参数：密度、体积模量、渗透系数、裂隙初始开度、组号下限及组号上限
fracsp.SetPropByGroup(1000.0, 1e7, 1e-14, 1e-8, 1, 1);

// ==================== 6. 设置简单水力压裂参数 ====================
// 指定施加点坐标（注入点位于中心）
var fC = new Array(5.0, 5.0, 5.0);

// 指定简单水力压裂参数：
// 1=开启，1=开启，1e6=注入压力(Pa)，0.9=压力衰减系数(m^-1)
blkdyn.SetSimpleHyFracPram(1, 1, 1e6, 0.9, fC, true);

// ==================== 7. 设置流体自由表面 ====================
// 设置流体液位文件（水位面Z坐标为8m，水底面Z坐标为0m）
blkdyn.SetFluidLevel("fluid_level.dat", 1000.0, 9.8, 1, 1);

// ==================== 8. 调整自然碎片形状 ====================
// 在进行自然碎片飞行计算前，修正自然碎片的形状
pfly.FragShapeCorrect(5.0, 3.0, 1.0, 4);

// ==================== 9. 执行计算循环 ====================
// 计算20秒（时间步长0.2ms）
dyna.DynaCycle(20);

// ==================== 10. 监测与输出结果 ====================
// 计算节点压力及饱和度
fracsp.CalNodePressure();

// 动态单元流速、流量（Darcy定律）
fracsp.CalElemDischarge();

// 计算与固体破裂的耦合
fracsp.CalIntSolid();

// 计算与孔隙渗流的耦合
fracsp.CalIntPoreSp();

// 计算几何相交但不共节点裂隙单元间的流量透传
fracsp.CalPipeDischarge();

// 计算注入点材料性质的空间输运
fracsp.CalJetConvection();

// 核心迭代步中，裂隙渗流求解器
fracsp.Solver();

// 运行用户自定义命令流（可选）
dyna.RunUDFCmd("CalDist 0.0 0.0 0.0 10.0 10.0 0.0");

// 导出结果文件
doc.SaveResult("Frac3D_Result.dat");

// 保存图片（可选）
for (var i = 0; i < 360; i++) {
    view.rotate(1, 0, 0, 1);
    var oss = "0";
    if (i < 10) {
        oss = "000";
    } else if (i < 100) {
        oss = "00";
    }
    view.saveJpeg(oss + i + ".jpg");
    sleep(40);
}

// 释放动态链接库（可选）
dyna.FreeUDF();
