// 设置当前工作路径为JS脚本所在路径
setCurDir(getSrcDir());

igeo.clear();
imeshing.clear();

// 创建一个球体
var id1 = igeo.genBall(0, 0, 0, 5.0, 0.1, 1);

// 剖分网格
imeshing.genMeshByGmsh(id1);

// 对剖分后的网格进行颗粒分组操作
for (var i = 0; i < 20; i++) {
    let sel = new SelElems(imeshing);
    sel.sphere(0, 0, 0, 5.0 - (i + 1) * 0.2, 5.0 - i * 0.2);
    var iGrp = i + 1;
    var strGrp = iGrp.toString();
    imeshing.setGroup(strGrp, sel);
}

// 导出PDyna格式的网格文件
imesh.exportPDyna(imeshing, "pdyna.dat");
