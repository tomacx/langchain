setCurDir(getSrcDir());
igeo.clear();
imeshing.clear();

// 创建两条相交的线（裂缝）
igeo.genLine(1, 1, 0, 2, 2, 0, 0.01, 0.02);
igeo.genLine(2, 2, 0, 3, 3, 0, 0.01, 0.02);

// 执行相交操作，生成交点
igeo.lineInt();

// 重新设置网格尺寸信息（相交后原网格尺寸消失）
igeo.setSize("line", 0.02, 1, 4);

// 创建矩形面作为背景计算域
igeo.genRectS(0, 0, 0, 3, 3, 0, 0.2, 1);

// 将相交后的线设置为硬线压入面（共4条边）
igeo.setHardLineToFace(1, 1);
igeo.setHardLineToFace(2, 1);
igeo.setHardLineToFace(3, 1);
igeo.setHardLineToFace(4, 1);

// 生成三维网格（借助Gmsh）
imeshing.genMeshByGmsh(3);

// 初始化裂隙渗流网络（将所有单元的边界面设定为裂隙网络）
fracsp.CreateGridFromBlock(1);

// 连接相交的裂隙单元，建立流量传递管道
fracsp.ElemConnection();

// 为特定坐标范围内的裂隙单元施加流体参数
// 密度：1000 kg/m³, 体积模量：2e9 Pa, 渗透系数：1e-12 m²/Pa/s, 初始开度：0.001 m
fracsp.SetPropByCoord(1000, 2e9, 1e-12, 0.001, -0.5, 3.5, -0.5, 3.5, -0.5, 3.5);

// 设置压力注入边界条件（在裂缝一端施加初始压力）
fracsp.SetPressure(1, 1e6); // 在单元1上施加1MPa初始压力

// 配置结果输出选项
fracsp.SetOutput("Pressure", [1.0, 2.0, 3.0]); // 监测点位置
fracsp.SetOutput("FlowRate", [1.5, 2.5, 3.5]); // 流量监测点位置

// 导出网格数据和裂隙网络参数结果文件
fracsp.ExportResults();
