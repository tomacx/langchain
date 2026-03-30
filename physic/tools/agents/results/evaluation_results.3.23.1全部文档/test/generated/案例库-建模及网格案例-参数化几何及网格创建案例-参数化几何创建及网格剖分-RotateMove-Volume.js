setCurDir(getSrcDir());

// 1. 初始化环境并创建参数化几何体
var Cylinder1 = igeo.genCylinderV(0, 0, 0, 0, 5, 0, 0, 5, 0, 1, 1);
var Cylinder2 = igeo.genCylinderV(0, 5, 0, 0, 10, 0, 0, 5, 0, 1, 2);
var Brick1 = igeo.genBrickV(40, 0, 0, 45, 10, 5, 1, 5);
var Brick2 = igeo.genBrickV(45, 0, 0, 60, 10, 5, 1, 6);

// 2. 创建几何体集合
var aVolume = [Cylinder1, Cylinder2, Brick1, Brick2];

// 3. 对几何体进行旋转操作（绕Y轴旋转30度）
var Ope1 = igeo.rotate("Volume", aVolume, -30, 0, 0, 0, 0, 5, 60, 5);

// 4. 网格剖分（三维）
imeshing.genMeshByGmsh(3);

// 5. 定义计算域并生成流体网格
skwave.DefMesh(3, [100.0, 100.0, 100.0], [50, 50, 50]);

// 6. 对坐标范围内的颗粒进行旋转操作（绕Y轴旋转15度）
var origin = new Array(0.0, 0.0, 0.0);
var Normal = new Array(0.0, 1.0, 0.0);
pdyna.RotaByCoord(15, origin, Normal, -1e5, 1e5, -1e5, 1e5, -1e5, 1e5);

// 7. 计算模型总体积
var VolumeCmd = "PrintTotalVolume";
UserDefFunction_Execute(VolumeCmd);

// 8. 监测两点间距离（点A: (0,0,0), 点B: (10,0,0)）
var DistCmd = "CalDist 0.0 0.0 0.0 10.0 0.0 0.0";
UserDefFunction_Execute(DistCmd);

// 9. 监测另一组点的距离（点C: (50,0,0), 点D: (60,0,0)）
var DistCmd2 = "CalDist 50.0 0.0 0.0 60.0 0.0 0.0";
UserDefFunction_Execute(DistCmd2);

// 10. 输出完成信息
print("Simulation completed successfully");
