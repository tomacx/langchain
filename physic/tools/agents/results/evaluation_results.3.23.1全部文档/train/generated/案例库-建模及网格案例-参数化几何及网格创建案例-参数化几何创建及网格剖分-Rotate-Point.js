setCurDir(getSrcDir());

// 1. 定义三维流体计算域网格 (10m x 10m x 10m, 每个方向20个节点)
skwave.DefMesh(3, [10.0, 10.0, 10.0], [20, 20, 20]);

// 2. 在坐标范围内创建规则分布的颗粒 (x: -5~5m, y: -5~5m, z: -5~5m)
var xMin = -5.0;
var xMax = 5.0;
var yMin = -5.0;
var yMax = 5.0;
var zMin = -5.0;
var zMax = 5.0;

// 颗粒直径 (m)
var particleDiameter = 0.1;

// 创建规则分布的颗粒
var aPoint = genParRegularByCoord(xMin, xMax, yMin, yMax, zMin, zMax, particleDiameter);

// 3. 设置旋转参数
var RotaAngle = 45.0; // 旋转角度 (度)
var origin = new Array(0.0, 0.0, 0.0); // 旋转原点
var Normal = new Array(0.0, 1.0, 0.0); // 旋转轴方向矢量 (绕Y轴旋转)

// 4. 对坐标范围内的颗粒执行旋转操作
pdyna.RotaByCoord(RotaAngle, origin, Normal, xMin, xMax, yMin, yMax, zMin, zMax);

// 5. 生成网格并导入imeshing模块
imeshing.genMesh();

// 6. 设置监测传感器 (应力、位移等物理量)
var sensorStress = pdyna.AddSensor("Stress", "XYZ");
var sensorDisplacement = pdyna.AddSensor("Displacement", "XYZ");
var sensorVelocity = pdyna.AddSensor("Velocity", "XYZ");

// 7. 定义输出文件路径和格式
var outputDir = getSrcDir() + "/results";
pdyna.SetOutputPath(outputDir);
pdyna.SetOutputFormat("binary");

// 8. 保存当前模型状态
imeshing.SaveMesh(outputDir + "/mesh.dat");

// 9. 打印执行信息
print("Simulation initialized successfully.");
print("Grid dimensions: " + xMax - xMin + "m x " + yMax - yMin + "m x " + zMax - zMin + "m");
print("Number of particles created: " + aPoint.length);
print("Rotation angle: " + RotaAngle + " degrees around Y-axis.");
print("Output directory: " + outputDir);

// 10. 完成标记
print("Finished");
