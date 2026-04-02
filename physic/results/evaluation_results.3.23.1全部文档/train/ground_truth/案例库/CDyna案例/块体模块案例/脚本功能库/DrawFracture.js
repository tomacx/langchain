function DrawJointFracture(Color1R, Color1G, Color1B)
{
    //获取总单元数
    var TotalElem = Math.round(dyna.GetValue("Total_Block_Num"));

    //循环所有单元
    for (var ielem = 1; ielem <= TotalElem; ielem++)
    {
        var imodel = Math.round(blkdyn.GetElemValue(ielem, "Model"));

        if (imodel > 0)
        {

            //获得每个单元的面总数
            var TotalFace = Math.round(blkdyn.GetElemValue(ielem, "TotalFace"));


            var NShape = Math.round(blkdyn.GetElemValue(ielem, "Nshape"));



            //循环所有的面，获取面心
            for (var iface = 1; iface <= TotalFace; iface++)
            {
                var IfCFace = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "IfContactFace",1));
                if (IfCFace == 1)
                {
                    if (NShape < 5)
                    {
                        var is1 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "SpringID", 1));
                        var is2 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "SpringID", 2));


                        var FraI1 = blkdyn.GetSpringValue(is1, "FractureIter");
                        var FraI2 = blkdyn.GetSpringValue(is2, "FractureIter");

                        if (FraI1 > 0 && FraI2 > 0)
                        {


                            var coord1 = new Array(3);
                            var coord2 = new Array(3);

                            var node1 = Math.round(blkdyn.GetSpringValue(is1, "MotherNodeID"));
                            var node2 = Math.round(blkdyn.GetSpringValue(is2, "MotherNodeID"));

                            coord1[0] = blkdyn.GetNodeValue(node1, "Coord", 1);
                            coord1[1] = blkdyn.GetNodeValue(node1, "Coord", 2);
                            coord1[2] = blkdyn.GetNodeValue(node1, "Coord", 3);

                            coord2[0] = blkdyn.GetNodeValue(node2, "Coord", 1);
                            coord2[1] = blkdyn.GetNodeValue(node2, "Coord", 2);
                            coord2[2] = blkdyn.GetNodeValue(node2, "Coord", 3);

                            draw.SetColor(Color1R, Color1G, Color1B);

                            draw.line3d(coord1[0], coord1[1], coord1[2], coord2[0], coord2[1], coord2[2]);

                        }

                    }
                    else
                    {
                        var nodesum = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "TotalNodeInFace",1));
                        var FracFlag = 0;

                        for (var inode = 1; inode <= nodesum; inode++)
                        {
                            var SpID = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "SpringID", inode));

                            var FraI = blkdyn.GetSpringValue(SpID, "FractureIter");

                            if (FraI > 0)
                            {
                                FracFlag++;
                            }
                        }

                        if (FracFlag == nodesum)
                        {
                            for (var inode = 1; inode <= nodesum; inode++)
                            {
                                var NID1 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "GlobalNodeID", inode));

                                var inode2 = inode + 1;

                                if (inode == nodesum)
                                {
                                    inode2 = 1;
                                }

                                var NID2 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "GlobalNodeID", inode2));

                                var coord1 = new Array(3);
                                var coord2 = new Array(3);

                                coord1[0] = blkdyn.GetNodeValue(NID1, "Coord", 1);
                                coord1[1] = blkdyn.GetNodeValue(NID1, "Coord", 2);
                                coord1[2] = blkdyn.GetNodeValue(NID1, "Coord", 3);

                                coord2[0] = blkdyn.GetNodeValue(NID2, "Coord", 1);
                                coord2[1] = blkdyn.GetNodeValue(NID2, "Coord", 2);
                                coord2[2] = blkdyn.GetNodeValue(NID2, "Coord", 3);

                                draw.SetColor(Color1R, Color1G, Color1B);

                                draw.line3d(coord1[0], coord1[1], coord1[2], coord2[0], coord2[1], coord2[2]);
                            }
                        }

                    }

                }

            }
        }
    }
    draw.commit();
    print("Draw finished!")

}



DrawJointFracture(255,255,255);
