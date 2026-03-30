setCurDir(getSrcDir());

// 清除核心数据及内存
dyna.Clear();

// 设置重力加速度（x, y方向）
dyna.Set("Gravity -9.8 -9.8 0");

// 设置结果输出间隔为500步
dyna.Set("Output_Interval 500");

// 打开大变形计算开关
dyna.Set("Large_Displace 1");

// 打开接触更新开关
dyna.Set("If_Renew_Contact 1");

// 加载自定义动态链接库
dyna.LoadUDF("CustomModel");

// 创建二维网格（10x10单元）
blkdyn.GenBrick2D(10, 10, 10, 10, 1);

// 创建所有单元的接触界面
blkdyn.CrtIFace();

// 更新接触界面网格
blkdyn.UpdateIFaceMesh();

// 设置单元本构模型为自定义模型
blkdyn.SetModel("custom");

// 输入基础材料参数（密度、弹性模量、泊松比、抗拉强度、粘聚力、内摩擦角、剪胀角）
blkdyn.SetMat(2500, 3e10, 0.25, 1e7, 1e7, 35, 10);

// 设置接触面模型为自定义模型
blkdyn.SetIModel("custom");

// 接触面刚度从单元自动获取
blkdyn.SetIStiffByElem(1.0);

// 接触面强度从单元自动获取
blkdyn.SetIStrengthByElem();

// 固定模型底部三个方向的速度
blkdyn.FixV("xyz", 0, "y", -0.001, 0.001);

// 设置自定义接触面本构参数（单位面积法向接触刚度、切向接触刚度、粘聚力、抗拉强度、内摩擦角）
var avalue = [1e10, 1e10, 0, 0, 30];
dyna.SetUDFValue(avalue);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.01);

// 运行自定义命令流（示例：计算并输出系统总能量）
dyna.RunUDFCmd("PrintTotalEnergy");

// 配置输出变量监测应力、应变及本构响应
dyna.Set("Output_Stress 1");
dyna.Set("Output_Strain 1");
dyna.Set("Output_Damage 1");

// 在求解过程中获取实时监测浮点值（示例：获取当前时间步）
var currentTime = dyna.RunUDFCmdAdv("GetCurrentTimeStep", []);

// 求解
dyna.Solve();

// 检查输出文件确认结果正确性（通过RunUDFCmdAdv获取状态信息）
var status = dyna.RunUDFCmdAdv("CheckOutputStatus", []);

// 显示接触面模型验证
dyna.Plot("Interface", "IModel");

// 卸载动态链接库
dyna.FreeUDF();
