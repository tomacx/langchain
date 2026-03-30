# Failure Analysis: 案例库-CDyna案例-块体模块案例-脚本功能库-DrawFracture.js

## Query
请编写一个CDyna仿真脚本，实现块体模块案例-脚本功能库-DrawFracture，并输出必要的结果与监测。

## Generated Code
```javascript
setCurDir(getSrcDir());

// 初始化环境设置
dyna.Set("Large_Displace 1");
dyna.Set("Output_Interval 500");
dyna.Set("If_Virtural_Mass 0");

// ==================== 2. 定义岩石材料参数 ====================
// 密度(kg/m^3),弹性模量(Pa),泊松比,屈服强度(MPa),断裂能(J/m^2)等
blkdyn.SetMat(2700, 3e9, 0.25, 3e4, 1e4, 15, 15);

// ==================== 3. 生成初始块体网格几何结构 ====================
// 创建基础块体单元（示例：2x2x2的立方体阵列）
blkdyn.GenBrick2D(1, 1, 2, 2, 1);

// ==================== 4. 在指定块体体积内创建裂隙面定义 ====================
// 创建耦合面/裂隙面（trff模块）
trff.CrtFace(2, 100);

// 设置耦合面模型为脆性断裂模型
trff.SetModel("brittleMC");

// 设置耦合参数（法向刚度、切向刚度等）
trff.SetMat(1e9, 1e9, 20, 0, 0, 1e8);

// ==================== 5. 分配裂隙单元组号并随机化开度 ====================
// 对组号为1的裂隙面进行均匀分布的开度随机（下限1e-4m，上限1e-3m）
fracsp.RandomizeWidthByGroup("uniform", 1e-4, 1e-3, 1);

// ==================== 6. 使用 imeshing.advExtrude 构建复杂裂隙几何 ====================
// 创建拉伸路径（L形路径示例）
var afCoord = new Array();
afCoord[0] = [0.5, 0.5, 0];
afCoord[1] = [0.5, 0.5, 5];
afCoord[2] = [5.5, 0.5, 5];
afCoord[3] = [5.5, 0.5, 0];
afCoord[4] = [10.5, 0.5, 0];
afCoord[5] = [10.5, 0.5, 5];

// 将当前所有网格沿路径拉伸（尺寸0.2m，删除原网格）
imeshing.advExtrude(afCoord, 0.2, 1, 0);

// ==================== 7. 配置块体与裂隙面之间的接触相互作用设置 ====================
blkdyn.SetContact("Coulomb");
blkdyn.SetContactParam(0.3, 0.5, 1e8, 1e8); // 摩擦系数，粘聚力，法向刚度，切向刚度

// ==================== 8. 施加边界条件 ====================
// 固定底部节点（X,Y方向）
blkdyn.FixVByGroupInterface("xyz", 0.0, 1, 1);

// 在顶部施加位移载荷（Y方向向下位移0.05m）
blkdyn.ApplyForce("Node", "Displace", 2, -0.05, 1);

// ==================== 9. 设置输出请求 ====================
// 设置时间步长修正因子
dyna.TimeStepCorrect(0.8);

// 设置求解器
dyna.Solve();
```

## Ground Truth
```javascript
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
```

## Unified Diff
```diff
--- 案例库-CDyna案例-块体模块案例-脚本功能库-DrawFracture.js (ground_truth)
+++ 案例库-CDyna案例-块体模块案例-脚本功能库-DrawFracture.js (generated)
@@ -1,125 +1,59 @@
-function DrawJointFracture(Color1R, Color1G, Color1B) 
-{
-    //获取总单元数
-    var TotalElem = Math.round(dyna.GetValue("Total_Block_Num"));
+setCurDir(getSrcDir());
 
-    //循环所有单元
-    for (var ielem = 1; ielem <= TotalElem; ielem++) 
-    {
-        var imodel = Math.round(blkdyn.GetElemValue(ielem, "Model"));
+// 初始化环境设置
+dyna.Set("Large_Displace 1");
+dyna.Set("Output_Interval 500");
+dyna.Set("If_Virtural_Mass 0");
 
-        if (imodel > 0)
-        {
+// ==================== 2. 定义岩石材料参数 ====================
+// 密度(kg/m^3),弹性模量(Pa),泊松比,屈服强度(MPa),断裂能(J/m^2)等
+blkdyn.SetMat(2700, 3e9, 0.25, 3e4, 1e4, 15, 15);
 
-            //获得每个单元的面总数
-            var TotalFace = Math.round(blkdyn.GetElemValue(ielem, "TotalFace"));
+// ==================== 3. 生成初始块体网格几何结构 ====================
+// 创建基础块体单元（示例：2x2x2的立方体阵列）
+blkdyn.GenBrick2D(1, 1, 2, 2, 1);
 
+// ==================== 4. 在指定块体体积内创建裂隙面定义 ====================
+// 创建耦合面/裂隙面（trff模块）
+trff.CrtFace(2, 100);
 
-            var NShape = Math.round(blkdyn.GetElemValue(ielem, "Nshape"));
+// 设置耦合面模型为脆性断裂模型
+trff.SetModel("brittleMC");
 
+// 设置耦合参数（法向刚度、切向刚度等）
+trff.SetMat(1e9, 1e9, 20, 0, 0, 1e8);
 
+// ==================== 5. 分配裂隙单元组号并随机化开度 ====================
+// 对组号为1的裂隙面进行均匀分布的开度随机（下限1e-4m，上限1e-3m）
+fracsp.RandomizeWidthByGroup("uniform", 1e-4, 1e-3, 1);
 
-            //循环所有的面，获取面心
-            for (var iface = 1; iface <= TotalFace; iface++) 
-            {
-                var IfCFace = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "IfContactFace",1));
-                if (IfCFace == 1) 
-                {
-                    if (NShape < 5) 
-                    {
-                        var is1 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "SpringID", 1));
-                        var is2 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "SpringID", 2));
+// ==================== 6. 使用 imeshing.advExtrude 构建复杂裂隙几何 ====================
+// 创建拉伸路径（L形路径示例）
+var afCoord = new Array();
+afCoord[0] = [0.5, 0.5, 0];
+afCoord[1] = [0.5, 0.5, 5];
+afCoord[2] = [5.5, 0.5, 5];
+afCoord[3] = [5.5, 0.5, 0];
+afCoord[4] = [10.5, 0.5, 0];
+afCoord[5] = [10.5, 0.5, 5];
 
+// 将当前所有网格沿路径拉伸（尺寸0.2m，删除原网格）
+imeshing.advExtrude(afCoord, 0.2, 1, 0);
 
-                        var FraI1 = blkdyn.GetSpringValue(is1, "FractureIter");
-                        var FraI2 = blkdyn.GetSpringValue(is2, "FractureIter");
+// ==================== 7. 配置块体与裂隙面之间的接触相互作用设置 ====================
+blkdyn.SetContact("Coulomb");
+blkdyn.SetContactParam(0.3, 0.5, 1e8, 1e8); // 摩擦系数，粘聚力，法向刚度，切向刚度
 
-                        if (FraI1 > 0 && FraI2 > 0) 
-                        {
+// ==================== 8. 施加边界条件 ====================
+// 固定底部节点（X,Y方向）
+blkdyn.FixVByGroupInterface("xyz", 0.0, 1, 1);
 
+// 在顶部施加位移载荷（Y方向向下位移0.05m）
+blkdyn.ApplyForce("Node", "Displace", 2, -0.05, 1);
 
-                            var coord1 = new Array(3);
-                            var coord2 = new Array(3);
+// ==================== 9. 设置输出请求 ====================
+// 设置时间步长修正因子
+dyna.TimeStepCorrect(0.8);
 
-                            var node1 = Math.round(blkdyn.GetSpringValue(is1, "MotherNodeID"));
-                            var node2 = Math.round(blkdyn.GetSpringValue(is2, "MotherNodeID"));
-
-                            coord1[0] = blkdyn.GetNodeValue(node1, "Coord", 1);
-                            coord1[1] = blkdyn.GetNodeValue(node1, "Coord", 2);
-                            coord1[2] = blkdyn.GetNodeValue(node1, "Coord", 3);
-
-                            coord2[0] = blkdyn.GetNodeValue(node2, "Coord", 1);
-                            coord2[1] = blkdyn.GetNodeValue(node2, "Coord", 2);
-                            coord2[2] = blkdyn.GetNodeValue(node2, "Coord", 3);
-
-                            draw.SetColor(Color1R, Color1G, Color1B);
-
-                            draw.line3d(coord1[0], coord1[1], coord1[2], coord2[0], coord2[1], coord2[2]);
-
-                        }
-
-                    }
-                    else 
-                    {
-                        var nodesum = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "TotalNodeInFace",1));
-                        var FracFlag = 0;
-
-                        for (var inode = 1; inode <= nodesum; inode++) 
-                        {
-                            var SpID = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "SpringID", inode));
-
-                            var FraI = blkdyn.GetSpringValue(SpID, "FractureIter");
-
-                            if (FraI > 0)
-                            {
-                                FracFlag++;
-                            }
-                        }
-
-                        if (FracFlag == nodesum) 
-                        {
-                            for (var inode = 1; inode <= nodesum; inode++) 
-                            {
-                                var NID1 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "GlobalNodeID", inode));
-                               
-                                var inode2 = inode + 1;
-                                
-                                if (inode == nodesum) 
-                                {
-                                    inode2 = 1;
-                                }
-                                
-                                var NID2 = Math.round(blkdyn.GetElemFaceValue(ielem, iface, "GlobalNodeID", inode2));
-
-                                var coord1 = new Array(3);
-                                var coord2 = new Array(3);
-
-                                coord1[0] = blkdyn.GetNodeValue(NID1, "Coord", 1);
-                                coord1[1] = blkdyn.GetNodeValue(NID1, "Coord", 2);
-                                coord1[2] = blkdyn.GetNodeValue(NID1, "Coord", 3);
-
-                                coord2[0] = blkdyn.GetNodeValue(NID2, "Coord", 1);
-                                coord2[1] = blkdyn.GetNodeValue(NID2, "Coord", 2);
-                                coord2[2] = blkdyn.GetNodeValue(NID2, "Coord", 3);
-
-                                draw.SetColor(Color1R, Color1G, Color1B);
-
-                                draw.line3d(coord1[0], coord1[1], coord1[2], coord2[0], coord2[1], coord2[2]);
-                            }
-                        }
- 
-                    }
-
-                }
-
-            }
-        }
-    }
-    draw.commit();
-    print("Draw finished!")
-
-}
-
-
-
-DrawJointFracture(255,255,255); 
+// 设置求解器
+dyna.Solve();
```
