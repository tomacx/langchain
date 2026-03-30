setCurDir(getSrcDir());

// 初始化环境
igeo.clear();
imeshing.clear();
dyna.Clear();
doc.clearResult();

// 创建被连接件（上下钢板）
var plateTop = igeo.genBrickV(0, 0, 0.015, 0.4, 0.2, 0.005, 0.005, 1);
var plateBot = igeo.genBrickV(0, 0, -0.015, 0.4, 0.2, 0.005, 0.005, 2);

// 创建螺栓（3个，模拟不同拧紧顺序）
var boltGroup = [];
for(var i = 0; i < 3; i++) {
    var x1 = 0.1 + 0.1 * i;
    var y1 = 0.1;

    // 螺栓头
    var vidHead = igeo.genCylinderV(x1, y1, 0.015, x1, y1, 0.02, 0.0, 0.01, 0.008, 0.008, 3 + i);
    // 螺栓杆上部
    var vidShaftTop = igeo.genCylinderV(x1, y1, 0.015, x1, y1, -0.01, 0.0, 0.008, 0.002, 0.002, 3 + i);
    // 螺栓杆下部
    var vidShaftBot = igeo.genCylinderV(x1, y1, -0.01, x1, y1, -0.015, 0.0, 0.008, 0.002, 0.002, 3 + i);
    // 螺母
    var vidNut = igeo.genCylinderV(x1, y1, -0.015, x1, y1, -0.02, 0.0, 0.01, 0.008, 0.008, 3 + i);

    boltGroup.push([vidHead, vidShaftTop, vidShaftBot, vidNut]);
}

// 设置单元组号
igeo.setGroup("volume", 1, 2, 3);

// 定义材料参数（钢板、螺栓）
blkdyn.SetMatByGroup(7800, 2.1e11, 0.33, 3e6, 3e6, 0, 0, 3); // 螺栓组号3-5
blkdyn.SetMatByGroup(2700, 7.2e10, 0.33, 1e6, 1e6, 0, 0, 1); // 钢板组号1-2

// 设置沙漏阻尼系数
dyna.Set("HourGlass_Damp_Factor 0.15");

// 设置求解参数
dyna.Set("Gravity 0 0 0");
dyna.Set("Output_Interval 1000");
dyna.Set("Moniter_Iter 100");
dyna.Set("Time_Step 1e-6");
dyna.Set("If_Renew_Contact 1");

// 创建接触对（螺纹啮合与板面摩擦）
blkdyn.CrtBoundIFaceByCoord(-100, 100, -100, 100, -0.0001, 0.0001);
blkdyn.CrtBoundIFaceByCoord(-100, 100, -100, 100, 0.0149999, 0.0150001);
blkdyn.CrtIFace(1, 2);
blkdyn.UpdateIFaceMesh();

// 设置接触摩擦系数
blkdyn.Set("Contact_Fric_Coeff 0.3");

// 定义拧紧顺序控制逻辑（通过UDF命令）
var tightenCmd = "TightenBolt 1 0.5\nTightenBolt 2 0.7\nTightenBolt 3 0.9";
dyna.RunUDFCmd(tightenCmd);

// 设置预紧力监测点（螺栓杆中部）
for(var i = 0; i < 3; i++) {
    var x1 = 0.1 + 0.1 * i;
    var y1 = 0.1;
    var z1 = 0.005;
    dyna.Monitor("block", "szz", x1, y1, z1);
}

// 设置位移监测点（螺栓头与螺母接触面）
for(var i = 0; i < 3; i++) {
    var x1 = 0.1 + 0.1 * i;
    var y1 = 0.1;
    dyna.Monitor("block", "u_z", x1, y1, 0.02);
    dyna.Monitor("block", "u_z", x1, y1, -0.02);
}

// 设置模型类型
blkdyn.SetModel("linear");

// 执行仿真计算
dyna.Solve(50000);

// 导出监测数据
doc.ExportResult();

// 释放资源
dyna.FreeUDF();
