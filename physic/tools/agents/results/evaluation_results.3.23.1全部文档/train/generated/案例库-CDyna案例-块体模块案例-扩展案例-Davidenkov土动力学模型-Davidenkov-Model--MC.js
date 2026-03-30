setCurDir(getSrcDir());

// 初始化环境
dyna.Clear();
doc.clearResult();

// 设置求解器基本参数
dyna.Set("Mechanic_Cal 1");
dyna.Set("UnBalance_Ratio 1e-5");
dyna.Set("Gravity 0.0 0.0 -9.8");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 200");
dyna.Set("Moniter_Iter 200");
dyna.Set("If_Virtural_Mass 1");
dyna.Set("Virtural_Step 0.6");

// 创建三维块体模型（示例尺寸：1m x 1m x 1m，网格划分）
blkdyn.GenBrick3D(1.0, 1.0, 1.0, 20, 20, 20, 1);

// 设置单元本构模型为Davidenkov
blkdyn.SetModel("Davidenkov", 1, 1);

// 设置Davidenkov材料参数（序号1）
// Gmax0: 最大剪切模量 (Pa), Mu: 泊松比, A, B, Gamay: 拟合参数
blkdyn.SetDavidenkovMat(1, 5e6, 0.3, 1.1, 0.35, 3.8e-4);

// 将全局材料序号与单元组号关联（绑定所有单元）
blkdyn.BindDavidenkovMat(1, 1, blkdyn.GetGroupCount());

// 设置局部阻尼
blkdyn.SetLocalDamp(0.2);

// 边界条件：固定底部和侧面
blkdyn.FixV("z", 0.0, "z", -0.5, 0.5);
blkdyn.FixV("x", 0.0, "x", -0.5, 0.5);
blkdyn.FixV("y", 0.0, "y", -0.5, 0.5);

// 施加重力
blkdyn.ApplyGravity();

// 设置监测点位置（在模型中心区域）
var monitorX = [0.25, 0.5, 0.75];
var monitorY = [0.25, 0.5, 0.75];
var monitorZ = [0.25, 0.5, 0.75];

// 绘制监测点位置（红色圆点）
for (var i = 0; i < monitorX.length; i++) {
    for (var j = 0; j < monitorY.length; j++) {
        for (var k = 0; k < monitorZ.length; k++) {
            DrawMonitorPos(monitorX[i], monitorY[j], monitorZ[k]);
        }
    }
}

// 设置监测变量（位移、应力等）
for (var i = 0; i < monitorX.length; i++) {
    for (var j = 0; j < monitorY.length; j++) {
        // 监测x方向位移
        dyna.Monitor("block", "u1", monitorX[i], monitorY[j], monitorZ[k]);
        // 监测y方向位移
        dyna.Monitor("block", "u2", monitorX[i], monitorY[j], monitorZ[k]);
        // 监测z方向位移
        dyna.Monitor("block", "u3", monitorX[i], monitorY[j], monitorZ[k]);
        // 监测x方向正应力
        dyna.Monitor("block", "sxx", monitorX[i], monitorY[j], monitorZ[k]);
        // 监测y方向正应力
        dyna.Monitor("block", "syy", monitorX[i], monitorY[j], monitorZ[k]);
        // 监测z方向正应力
        dyna.Monitor("block", "szz", monitorX[i], monitorY[j], monitorZ[k]);
        // 监测静水压力
        dyna.Monitor("block", "General_P5", monitorX[i], monitorY[j], monitorZ[k]);
    }
}

// 执行求解（计算100000步）
dyna.Solve(100000);

// 输出监测数据到Result文件夹
OutputMonitorData();

// 输出模型结果到其他软件可导入格式
OutputModelResult();

// 保存当前状态
dyna.Save("Davidenkov-Model-MC.sav");
