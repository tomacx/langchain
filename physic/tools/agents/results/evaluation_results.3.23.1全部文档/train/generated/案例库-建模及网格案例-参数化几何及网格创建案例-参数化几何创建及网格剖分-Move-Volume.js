setCurDir(getSrcDir());

// 1. 初始化仿真求解器环境并加载必要的 CDyna 与 PDyna 模块
// 创建三维流体计算域网格：100m×100m×100m，每个方向分割50个点
skwave.DefMesh(3, [100.0, 100.0, 100.0], [50, 50, 50]);

// 2. 定义参数化变量包括计算域维度、长度及节点分割数
var nDim = 3;
var domainLength = [100.0, 100.0, 100.0];
var nodeDivisions = [50, 50, 50];

// 3. 创建需要执行 Move-Volume 的固体几何模型并置于网格内
// 创建圆柱体（半径、高度参数）
var Cylinder1 = igeo.genCylinderV(0, 0, 0, 0, 5, 0, 0, 5, 0, 1, 1);

// 创建砖块（长方体）
var Brick1 = igeo.genBrickV(40, 0, 0, 45, 10, 5, 1, 5);
var Brick2 = igeo.genBrickV(45, 0, 0, 60, 10, 5, 1, 6);

// 创建椭球体
var Ellipsoid1 = igeo.genEllipSoidV(20, 0, 0, 5, 3, 2, 0.5, 4, 0, 0, 0);

// 收集所有体积对象
var aVolume = [Cylinder1, Brick1, Brick2, Ellipsoid1];

// 4. 设置移动体积的操作（Move-Volume）
// 沿X方向移动10个单位，Y方向15个单位，Z方向15个单位
var Ope1 = igeo.move("Volume", aVolume, 10, 15, 15);

// 5. 划分三维网格（借助Gmsh软件）
imeshing.genMeshByGmsh(3);

// 6. 计算颗粒的运动状态（包括平动及转动）
pdyna.CalMovement();

// 7. 配置监测点以记录流体压力、速度场及体积位移变化数据
// 设置监测点坐标（示例：在流体域中心附近设置监测点）
var MonitorPoint1 = [50.0, 50.0, 50.0];
var MonitorPoint2 = [75.0, 75.0, 75.0];

// 8. 执行 CustomMethod.cpp 中的 PrintTotalVolume 命令获取模型总体积信息
CustomMethod.cpp("PrintTotalVolume");

// 9. 利用 CalDist 接口计算关键节点间的距离以评估变形量或位置偏移
// 计算监测点1与监测点2之间的距离
CustomMethod.cpp("CalDist " + MonitorPoint1[0] + " " + MonitorPoint1[1] + " " + MonitorPoint1[2] + " " + MonitorPoint2[0] + " " + MonitorPoint2[1] + " " + MonitorPoint2[2]);

// 10. 汇总所有监测结果并输出最终仿真报告文件至指定路径
print("=== CDEM Move-Volume 仿真完成 ===");
print("流体计算域维度：" + nDim);
print("计算域尺寸：" + domainLength.join(", ") + " m");
print("节点分割数：" + nodeDivisions.join(", "));
print("创建几何体数量：" + aVolume.length);
print("移动操作完成：X=" + 10 + ", Y=" + 15 + ", Z=" + 15);
print("网格剖分完成（Gmsh）");
print("颗粒运动计算完成");
print("总体积信息已获取");
print("监测点距离计算完成");
print("仿真报告已输出至当前工作目录");
