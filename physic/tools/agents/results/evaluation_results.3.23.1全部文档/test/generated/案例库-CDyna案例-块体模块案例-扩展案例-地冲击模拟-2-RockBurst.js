setCurDir(getSrcDir());

// 清除模块数据
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 全局环境参数设置
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("Monitor_Iter 10");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("If_Renew_Contact 1");
dyna.Set("Contact_Detect_Tol 0.0");

// ========== 几何建模及网格划分 ==========
// 创建外边界矩形环（围岩）
var loopid1 = igeo.genRect(0, 0, 0, 20, 20, 0, 1.0);

// 创建巷道内边界矩形环
var loopid2 = igeo.genRect(8, 8.5, 0, 12, 11.5, 0, 0.2);

// 创建外边界面（含矩形空洞）
igeo.genSurface([loopid1, loopid2], 1);

// 创建巷道实体
igeo.genSurface([loopid2], 2);

// 生成二维网格
imeshing.genMeshByGmsh(2);

// BlockDyna从平台下载网格
blkdyn.GetMesh(imeshing);

// 对两侧单元均为组1的公共面进行切割，设置为接触面
blkdyn.CrtIFace();

// 设置接触后，更新网格信息
blkdyn.UpdateIFaceMesh();

// ========== 材料参数设置 ==========
// 指定组1（围岩）的单元本构为线弹性本构
blkdyn.SetModel("linear");

// 指定组1-2的材料参数
// 密度, 弹性模量, 泊松比, 抗拉强度, 抗压强度, 断裂能拉伸, 断裂能剪切
blkdyn.SetMatByGroupRange(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0, 1, 1);

// 指定组2（巷道）的材料参数
blkdyn.SetMatByGroupRange(2300, 1e10, 0.25, 5e6, 5e6, 35.0, 15.0, 2, 2);

// 将接触面模型设定为线弹性模型
blkdyn.SetIModel("linear");

// 虚拟接触面刚度及强度从单元中自动获取
blkdyn.SetIStiffByElem(1);
blkdyn.SetIStrengthByElem();

// ========== 边界条件设置 ==========
// 固定底部节点（Y方向）
blkdyn.FixV("xyz", 0.0, "y", -0.001, 0.001);

// 施加初始地应力（X方向水平应力）
blkdyn.SetInitStress(5e6, "x");

// ========== 冲击载荷设置 ==========
// 在巷道顶部施加冲击载荷（模拟外部冲击荷载）
var impactForce = 1e7; // 冲击载荷大小
var impactDuration = 0.01; // 冲击持续时间

// 使用RunUDFCmd施加冲击载荷（通过自定义命令流）
dyna.RunUDFCmd("ApplyLoad " + impactForce + " 0.0 0.0 8.5 8.5 0.0");

// ========== 监测点设置 ==========
// 设置巷道顶部关键监测点（位移监测）
dyna.Monitor("block", "ydis", 10.0, 10.0, 10.0);

// 设置巷道侧壁应力监测点
dyna.Monitor("block", "stress", 8.5, 8.5, 10.0);

// 设置围岩关键位置位移监测
dyna.Monitor("block", "ydis", 2.0, 10.0, 10.0);

// ========== 计算前初始化 ==========
dyna.BeforeCal();

// ========== 循环迭代计算 ==========
for (var i = 0; i < 5000; i++) {
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
        print("不平衡率：" + unbal);
        print("计算步数：" + i);

        // 推送结果信息至GDEM-Env
        dyna.PutStep(1, i, 0.1);
    }

    // 检查计算是否收敛（不平衡率过大时终止）
    if (unbal > 0.1) {
        print("警告：不平衡率超过阈值，可能需调整时间步长");
    }
}

// ========== 输出结果 ==========
// 输出最终监测数据
dyna.OutputMonitorData();

// 保存仿真结果
doc.SaveResult();

// ========== 释放资源 ==========
// 释放动态链接库
dyna.FreeUDF();

print("冲击地压模拟计算完成！");
