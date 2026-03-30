setCurDir(getSrcDir());

// 初始化几何和网格模块
igeo.clear();
imeshing.clear();

// 定义瓶子几何参数变量
var height = 0.2;      // 瓶子高度 (m)
var rad1 = 0.06;       // 瓶身半径 (m)
var rad2 = 0.03;       // 瓶颈半径 (m)
var size = 0.005;      // 网格尺寸 (m)

// 创建旋转轮廓的点序列（X,Y,Z坐标）
var aCoord = new Array(6);
aCoord[0] = igeo.genPoint(rad1, 0, 0, size);
aCoord[1] = igeo.genPoint(rad1 - 0.7 * rad2, height * 0.2, 0, size);
aCoord[2] = igeo.genPoint(rad1 - 1.0 * rad2, height * 0.4, 0, size);
aCoord[3] = igeo.genPoint(rad1 - 1.5 * rad2, height * 0.6, 0, size);
aCoord[4] = igeo.genPoint(rad1 - 1.2 * rad2, height * 0.8, 0, size);
aCoord[5] = igeo.genPoint(rad2, height, 0, size);

// 创建轮廓线
var lineid = new Array();
for(var i = 0; i < 5; i++) {
    var id = igeo.genLine(aCoord[i], aCoord[i + 1]);
    lineid.push(id);
}

// 添加底部和顶部封口线
var id1 = igeo.genLine(0, 0, 0, height, 0, size, size);
var id2 = igeo.genLine(0, 0, 0, rad1, 0, 0, size, size);
var id3 = igeo.genLine(0, height, 0, rad2, height, 0, size, size);

lineid.push(id1);
lineid.push(id2);
lineid.push(id3);

// 生成线环
var loopid = igeo.genLineLoop(lineid);

// 生成面
var surfid = igeo.genSurface(loopid, 1);

// 旋转面生成瓶子体（绕Z轴旋转90度）
var Volume1 = igeo.rotate("surface", surfid, 0, 0, 0, 0, 3, 0, 90, 4, size, 1);

// 借助Gmsh剖分网格
imeshing.genMeshByGmsh(3);

// 从Genvi平台获取网格并加载到块体模块求解器
GetMesh();

// 设置流体计算域（三维，尺寸略大于瓶子）
skwave.DefMesh(3, [height * 2.5, rad1 * 2.5, rad1 * 2.5], [60, 60, 60]);

// 按ID对网格单元进行分组
SetGroupByID(1, 1);

// 设置仿真时间步长及结果输出频率参数
var timeStep = 1e-7;
var outputFreq = 100;

console.log("瓶子几何创建完成");
console.log("网格剖分完成");
console.log("求解器加载完成");
