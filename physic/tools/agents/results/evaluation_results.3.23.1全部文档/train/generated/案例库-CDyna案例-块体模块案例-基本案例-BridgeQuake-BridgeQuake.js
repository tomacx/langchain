setCurDir(getSrcDir());

// 初始化仿真环境
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 100");
dyna.Set("Moniter_Iter 10");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.6");

// 导入网格文件
blkdyn.ImportGrid("patran", "bridge.out");

// 创建虚拟接触面并更新拓扑
blkdyn.CrtBoundIFaceByCoord(-1e7, 1e7, -1e7, 1e7, -1e7, 1e7);
blkdyn.UpdateIFaceMesh();

// 设置单元模型为线弹性模型
blkdyn.SetModel("linear");
blkdyn.SetIModel("linear");
blkdyn.SetIStrengthByElem();
blkdyn.SetIStiffByElem(10);

// 设置材料属性 - 基岩（组号1）
blkdyn.SetMat(2550, 1e10, 0.22, 1e7, 1e7, 55, 10, 1);

// 设置材料属性 - 覆盖层（组号2）
blkdyn.SetMat(2000, 6e7, 0.25, 6e4, 3e4, 30, 10, 2);

// 关联全局材料库与模型单元
blkdyn.BindTCKUSMat(1, 1, 2);

// 设置局部阻尼
blkdyn.SetLocalDamp(0.0);

// 关闭虚质量计算开关
dyna.Set("If_Virtural_Mass 0");

// 设置当前时间为0
dyna.Set("Time_Now 0");

// 设置动力计算时步
dyna.Set("Time_Step 1e-5");

// 设置无反射边界条件（底部）
blkdyn.SetQuietBoundByCoord(-2000, 2000, -20 - 0.001, -20 + 0.001, -2000, 2000);

// 设置地震动入流条件（X方向下限）
skwave.SetInflow(1, 1, 1, 2550, 0.5, 0, 1);

// 设置地震动入流条件（X方向上限）
skwave.SetInflow(2, 1, 2, 2550, -0.5, 0, 1);

// 设置监测点输出策略
dyna.Monitor("block", "ux", 0, 0.5, 0);
dyna.Monitor("block", "uy", 0, 0.5, 0);
dyna.Monitor("block", "uz", 0, 0.5, 0);

// 计算前初始化
dyna.BeforeCal();

// 执行求解器迭代计算（10000步）
dyna.Solver(10000);

// 实时获取仿真状态信息
var timeNow = dyna.GetValue("Time_Now");
console.log("当前时间：" + timeNow);

// 提取关键节点位移数据
var nodeID = blkdyn.GetNodeID([0, 0, 0]);
if (nodeID > 0) {
    var ux = blkdyn.GetNodeValue(nodeID, "ux");
    var uy = blkdyn.GetNodeValue(nodeID, "uy");
    var uz = blkdyn.GetNodeValue(nodeID, "uz");
    console.log("节点" + nodeID + "位移：" + ux + ", " + uy + ", " + uz);
}

// 导出最终监测结果
dyna.OutputMonitorData();

// 结束脚本运行
console.log("BridgeQuake仿真任务完成");
