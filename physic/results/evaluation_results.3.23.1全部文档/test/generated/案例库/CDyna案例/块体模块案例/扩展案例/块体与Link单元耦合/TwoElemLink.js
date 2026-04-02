setCurDir(getSrcDir());

dyna.Clear();

// 创建一个2D的砖块模型
blkdyn.GenBrick2D(1, 1, 2, 2, 1);

var TotalNode = Math.round(dyna.GetValue("Total_Node_Num"));

for (var inode = 1; inode <= TotalNode; inode++) {
    var TotalComElem = Math.round(blkdyn.GetNodeValue(inode, "NeiElemSum"));

    for (var ielem = 1; ielem <= TotalComElem; ielem++) {
        var ElemID = Math.round(blkdyn.GetNodeValue(inode, "NeiElemID", ielem));
        var LocalNodeID = Math.round(blkdyn.GetNodeValue(inode, "LocalIDInNeiElem", ielem));

        print("Node ID  " + inode + "  NeiElemID  " + ElemID + "  LocalNodeID  " + LocalNodeID);
    }
}
