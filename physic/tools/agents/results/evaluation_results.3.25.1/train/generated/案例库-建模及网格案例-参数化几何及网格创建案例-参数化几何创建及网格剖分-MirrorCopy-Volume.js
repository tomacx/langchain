setCurDir(getSrcDir());

// 1. 确定用户需求
// 2. 确认可用参考资料
// 3. 优先依据技术手册/API确认接口与参数含义
// 4. 借鉴案例参考流程结构与参数范围

// 5. 编写CDEM仿真脚本
// 6. 实现参数化几何创建
var Volume1 = igeo.genCylinderV(0, 0, 0, 0, 5, 0, 0, 5, 0, 1, 1);
var Volume2 = igeo.genCylinderV(0, 5, 0, 0, 10, 0, 0, 5, 0, 1, 2);
var Volume3 = igeo.genCylinderV(0, 10, 0, 0, 15, 0, 0, 4, 0, 0.5, 3);

var Volume4 = igeo.genEllipSoidV(20, 0, 0, 5, 3, 2, 0.5, 4, 0, 0, 0);

var Volume5 = igeo.genBrickV(40, 0, 0, 45, 10, 5, 1, 5);
var Volume6 = igeo.genBrickV(45, 0, 0, 60, 10, 5, 1, 6);
var Volume7 = igeo.genBrickV(60, 0, 0, 70, 15, 8, 1.5, 7);

var aVolume1 = [Volume1, Volume2, Volume3, Volume4, Volume5, Volume6, Volume7];

// 7. 实现网格剖分-MirrorCopy-Volume
var Ope1 = igeo.mirrorCopy("Volume", aVolume1, -20, 0, 0, 0, 0, 50, -20, 10, 0);

// 8. 输出必要的结果与监测
// 9. 编写脚本函数
// 10. 调用Gmsh软件进行网格剖分
imeshing.genMeshByGmsh(3);

// 11. 设置二维、三维的流体计算域正交网格
skwave.DefMesh(3, [100.0, 100.0, 100.0], [50, 50, 50], [50, 0, 0]);

// 12. 从Genvi平台获取网格并加载到块体模块求解器
GetMesh();
