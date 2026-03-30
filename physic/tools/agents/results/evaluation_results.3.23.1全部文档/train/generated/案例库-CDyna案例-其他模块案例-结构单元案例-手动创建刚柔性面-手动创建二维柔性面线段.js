setCurDir(getSrcDir());

// ==================== 1. 初始化仿真环境 ====================
dyna.Set("Mechanic_Cal 1");
dyna.Set("Gravity 0.0 -9.8 0.0");
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");
dyna.Set("Time_Step 1e-4");

// ==================== 2. 定义柔性面几何坐标点 ====================
// 创建二维柔性面线段（矩形区域，4个顶点）
var flexFacePoints = [
    [0, 0, 0],      // 点1: 左下角
    [10, 0, 0],     // 点2: 右下角
    [10, 5, 0],     // 点3: 右上角
    [0, 5, 0]       // 点4: 左上角
];

// ==================== 3. 创建二维柔性面单元 ====================
// rdface.Create(itype, igroup, TotalPoint, fCoord[][3])
// itype: 1-普通刚性面，2-板（柔性），3-壳
// igroup: 组号
var flexFaceGroup = 1;

for (var i = 0; i < 4; i++) {
    rdface.Create(2, flexFaceGroup, 4, [
        flexFacePoints[i][0], flexFacePoints[i][1], flexFacePoints[i][2],
        flexFacePoints[(i + 1) % 4][0], flexFacePoints[(i + 1) % 4][1], flexFacePoints[(i + 1) % 4][2],
        flexFacePoints[(i + 2) % 4][0], flexFacePoints[(i + 2) % 4][1], flexFacePoints[(i + 2) % 4][2]
    ]);
}

// ==================== 4. 设置柔性面材料属性 ====================
// rdface.SetDeformMat(泊松比, 密度, 弹性模量, 屈服应力, 屈服应变, 强度, 其他参数)
rdface.SetDeformMat(0.25, 2500, 3e10, 0.25, 3e6, 1e6, 35, 0.8);

// ==================== 5. 配置接触面 ====================
// blkdyn.CrtIFaceByLine() - 通过线段创建接触面
blkdyn.CrtIFaceByLine(flexFaceGroup);

// 更新接触面网格
blkdyn.UpdateIFaceMesh();

// 设置接触面本构为线弹性
blkdyn.SetModel("linear");

// 设定接触面材料参数：法向刚度、切向刚度、内摩擦角、粘聚力、抗拉强度
blkdyn.SetIMat(1e10, 1e10, 25.0, 0.0, 0.0);

// ==================== 6. 施加边界条件/初始速度 ====================
// rdface.SetVelocityByCoord(vx, vy, vz, ixmin, ixmax, iymin, iymax, ivzmin, ivzmax, ivxmin, ivxmax)
rdface.SetVelocityByCoord(0.0, 0.0, 0.0, 1, 1, 1, -0.01, 0.01, -1e5, 1e5);

// ==================== 7. 配置结果输出请求 ====================
dyna.Set("Moniter_Iter 100");
dyna.Set("SaveFile_Out 1");
dyna.Set("Contact_Detect_Tol 1e-3");
dyna.Set("Renew_Interval 100");

// ==================== 8. 执行仿真计算 ====================
dyna.Solve();

// ==================== 9. 读取结果并导出监测数据 ====================
// 等待求解完成后，可调用相关接口读取位移、应力等监测数据
// 此处为示例：输出关键信息到控制台（实际应用中需根据具体API读取）
console.log("柔性面变形与接触力监测数据已生成");

// 导出结果文件
blkdyn.ExportResult("flexFace_result.dat");
