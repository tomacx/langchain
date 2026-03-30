setCurDir(getSrcDir());

// ========== 1. 参数化几何模型定义 ==========
var width = 10;
var height = 4;
var thickness = 0.3;
var pointRadius = 0.3;

// ========== 2. 创建基础点单元 ==========
var Point1 = igeo.genPoint(0, 0, 0, pointRadius);
var Point2 = igeo.genPoint(width, 0, 0, pointRadius);
var Point3 = igeo.genPoint(width, height, 0, pointRadius);
var Point4 = igeo.genPoint(0, height, 0, pointRadius);

// ========== 3. 创建边界线单元 ==========
var Line1 = igeo.genLine(Point2, Point1);
var Line2 = igeo.genLine(Point2, Point3);
var Line3 = igeo.genLine(Point4, Point3);
var Line4 = igeo.genLine(Point1, Point4);

// ========== 4. 创建封闭线环 ==========
var aLineLoop = [Line1, Line2, Line3, Line4];
var LineLoop1 = igeo.genLineLoop(aLineLoop);

// ========== 5. 创建表面单元 ==========
var Surface1 = igeo.genSurface(LineLoop1, 1);

// ========== 6. 创建Glue-Surface连接关系并保存为.igeo格式 ==========
var Ope1 = igeo.glue("Surface", Surface1);

// ========== 7. 调用Gmsh进行网格剖分（二维） ==========
imeshing.genMeshByGmsh(2, "myMesh");

// ========== 8. 加载生成的网格文件至求解器模块 ==========
GetMesh("myMesh.msh");

// ========== 9. 设置材料属性（弹性材料示例） ==========
var mat1 = pdyna.SetMat(1, 2700, 3e7, 0.3); // 密度(kg/m^3), 弹性模量(Pa), 泊松比

// ========== 10. 设置边界条件（固定底部） ==========
SetGroupByPlane("bottom", 0, -thickness/2, 0, thickness/2, 0, 1);
pdyna.SetBC(1, "bottom", "fix"); // 固定约束

// ========== 11. 设置监测点位置信息 ==========
var MonitorPoint = igeo.genPoint(width/2, height/2, 0, pointRadius);
var monitorID = pdyna.SetMonitor(MonitorPoint, "disp", "stress");

// ========== 12. 配置输出结果文件路径及时间步长等计算控制参数 ==========
gflow.setGridFile("myMesh.msh", "myMesh.dat");
pdyna.SetTimeStep(0.001); // 时间步长(s)
pdyna.SetTotalTime(1.0); // 总计算时间(s)

// ========== 13. 启动求解器进行物理场数值计算与迭代求解 ==========
cdyna.Run();

// ========== 14. 读取并输出计算结束后的位移、应力等监测结果数据 ==========
var result = pdyna.GetResult(monitorID);
console.log("监测点位移结果:", result.disp);
console.log("监测点应力结果:", result.stress);
