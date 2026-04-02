setCurDir(getSrcDir());

//生成二维块体网格
blkdyn.GenBrick2D(10, 10, 50, 50, 1);

//搜索指定范围内的块体单元数量
var totalno = blkdyn.SearchElemInCell(4, 4, 0, 6, 6, 0);
print(totalno, " elements in cell.");

//遍历并获取每个块体的ID号，并打印到输出窗口
for(var i = 1; i <= totalno; i++) {
    var id = blkdyn.GetElemIdInCell(i);
    print(id);

    //用于显示
    blkdyn.SetGroupByID(2, id, id);
}

//将结果推送至Genvi平台进行展示
dyna.PutStep();
