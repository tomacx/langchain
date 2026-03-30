setCurDir(getSrcDir());

// 配置接触搜索方法
dyna.Set("Contact_Search_Method 2");

// 创建规则排布的颗粒 (组号, 数量, 半径, x_min, x_max, y_min, y_max, z_min, z_max)
pdyna.RegularCreateByCoord(1, 100, 0.1, 0, 10, 0, 10, 0, 0);

// 定义空间单元格边界 (cell_id, x_min, x_max, y_min, y_max, z_min, z_max)
var cellId = 4;
var xMin = 2.0;
var xMax = 8.0;
var yMin = 2.0;
var yMax = 8.0;
var zMin = 0.0;
var zMax = 10.0;

// 搜索定义范围内的颗粒总数
var totalno = pdyna.SearchParInCell(cellId, xMin, xMax, yMin, yMax, zMin, zMax);

print(totalno, " particles in cell range: [" + xMin + "," + xMax + "," + yMin + "," + yMax + "," + zMin + "," + zMax + "]");

// 遍历每个颗粒索引获取ID
for(var i = 1; i <= totalno; i++)
{
    var id = pdyna.GetParIdInCell(i);

    // 获取颗粒体心坐标 (x, y, z)
    var xc = pdyna.GetParticleValue(id, "Centroid", 1);
    var yc = pdyna.GetParticleValue(id, "Centroid", 2);
    var zc = pdyna.GetParticleValue(id, "Centroid", 3);

    // 获取颗粒速度 (vx, vy, vz)
    var vx = pdyna.GetParticleValue(id, "pa_xvel", 1);
    var vy = pdyna.GetParticleValue(id, "pa_yvel", 2);
    var vz = pdyna.GetParticleValue(id, "pa_zvel", 3);

    // 获取颗粒加速度 (ax, ay, az)
    var ax = pdyna.GetParticleValue(id, "pa_xacc", 1);
    var ay = pdyna.GetParticleValue(id, "pa_yacc", 2);
    var az = pdyna.GetParticleValue(id, "pa_zacc", 3);

    // 输出颗粒ID和监测数据
    print("Particle ID: " + id + ", Position: [" + xc.toFixed(4) + "," + yc.toFixed(4) + "," + zc.toFixed(4) + "], Velocity: [" + vx.toFixed(4) + "," + vy.toFixed(4) + "," + vz.toFixed(4) + "], Acceleration: [" + ax.toFixed(4) + "," + ay.toFixed(4) + "," + az.toFixed(4) + "]");
}

// 设置颗粒组用于可视化显示
pdyna.SetGroupByID(2, id, id);

print("Particle monitoring completed successfully.");
