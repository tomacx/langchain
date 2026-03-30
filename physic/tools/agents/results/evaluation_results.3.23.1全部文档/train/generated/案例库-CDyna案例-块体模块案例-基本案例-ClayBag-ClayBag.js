setCurDir(getSrcDir());

// 清除几何边界数据
pargen.clearBound();

// 打开力学计算开关
dyna.Set("Mechanic_Cal 1");

// 设置不平衡率为1e-5
dyna.Set("UnBalance_Ratio 1e-5");

// 设置3个方向的重力加速度
dyna.Set("Gravity 0 -9.8 0");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 设置监测信息输出时步为100步
dyna.Set("Moniter_Iter 100");

// 打开虚拟质量计算开关
dyna.Set("If_Virtural_Mass 1");

// 设置虚拟质量计算时步0.5
dyna.Set("Virtural_Step 0.5");

// 打开接触更新计算开关
dyna.Set("If_Renew_Contact 1");

// 设置子空间更新时步为50步
dyna.Set("Renew_Interval 50");

// 设置接触容差为1mm
dyna.Set("Contact_Detect_Tol 1e-4");

// 绘制背景网格（红色）
mpm.DrawBackGrid(255, 0, 0);

// 创建刚性面，起到支撑作用
var fCoord = new Array();
fCoord[0] = new Array(-1.0, 0.0, -1);
fCoord[1] = new Array(1.5, 0.0, -1);
fCoord[2] = new Array(1.5, 0.0, 1);
fCoord[3] = new Array(-1.0, 0.0, 1);

rdface.Create(2, 3, 4, fCoord);

// 创建三维沙子块体
blkdyn.GenBrick3D(0.8, 0.2, 0.3, 40, 10, 20, 1);

// 将组号为1的单元的自由面设定为接触面
blkdyn.CrtBoundIFaceByGroup(1);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设置单元的模型为理想弹塑性模型
blkdyn.SetModel("MC");

// 设置单元参数（密度、弹性模量、泊松比、抗拉强度、抗压强度等）
blkdyn.SetMatByGroup(1900, 3e8, 0.35, 0.0, 0.0, 5.0, 0.0, 1);

// 设定所有接触面的本构为脆性断裂的Mohr-Coulomb本构
blkdyn.SetIModel("brittleMC");

// 接触面刚度从单元中获取
blkdyn.SetIStiffByElem(1.0);

// 接触面强度从单元中获取
blkdyn.SetIStrengthByElem();

// 从单元的外表面创建link单元
link.CreateFromElemByGroup(1, 10);

// 设置link单元材料参数
link.SetPropByGroup(0.001, 1e7, 1e7, 1e6, 1, 4);

// 设定link单元的模型为线弹性模型
link.SetModelByGroup("elastic");

// 计算弹簧边界条件
blkdyn.CalSpringBound();

// 绘制监测点位置（红色圆点）
DrawMonitorPos(0.2, 0, 0);
DrawMonitorPos(0.4, 0, 0);
DrawMonitorPos(0.6, 0, 0);
DrawMonitorPos(0.8, 0, 0);

// 配置监测典型测点的时程信息数据
dyna.Monitor("block", "xdis", 0.2, 0, 0);
dyna.Monitor("block", "xdis", 0.4, 0, 0);
dyna.Monitor("block", "xdis", 0.6, 0, 0);
dyna.Monitor("block", "xdis", 0.8, 0, 0);

// 执行求解步骤生成当前时步的物理场结果信息
dyna.Solve(5000);

// 调用PutStep接口将当前时步结果推送至Genvi平台展示
PutStep();

// 使用ExportGrid接口导出裂隙渗流网格文件供后续分析
fracsp.ExportGrid(1, "AnsysBlkDyn.dat");

// 调用OutputMonitorData接口将监测信息输出至Result文件夹
OutputMonitorData();

// 执行draw.commit命令提交绘图更改并结束脚本运行
draw.commit();
