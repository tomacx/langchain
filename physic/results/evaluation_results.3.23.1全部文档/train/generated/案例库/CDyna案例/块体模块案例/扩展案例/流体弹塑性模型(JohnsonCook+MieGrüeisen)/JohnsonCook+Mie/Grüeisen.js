setCurDir(getSrcDir());

dyna.Clear();

doc.clearResult();

// 设置重力为0
dyna.Set("Gravity 0 0 0");

// 创建一个1x1x1的立方体，尺寸为10x10x10个单元格
blkdyn.GenBrick3D(1,1,1,10,10,10,1);

// 设置线弹性模型
blkdyn.SetModel("linear");

// 设置材料参数：密度、杨氏模量、泊松比、拉伸强度、粘聚力、摩擦角、局部阻尼
blkdyn.SetMat(2500,3e10,0.25,1,1,1,1);

// 在顶部施加面力条件
blkdyn.ApplyConditionByCoord("face_force",[0,1e6,0],[0,0,0,0,0,0,0,0,0],-100,100,0.999,1.1,-100,100, false);

// 固定底部
blkdyn.FixV("y",0,"y",-1,0.001);

// 求解模型
dyna.Solve();

// 计算应变能
var Stain_Energy = 0.0;

// 获取总单元数并转换为整型
var TotalElem = dyna.GetValue("Total_Block_Num");
TotalElem = Math.round(TotalElem);

// 循环所有单元计算应变能
for(var ielem = 1; ielem <= TotalElem; ielem++)
{
    var siglev = 0.0;

    // 计算应力和应变的乘积并累加
    for(var i = 1; i <= 6; i++)
    {
        siglev += 0.5 * blkdyn.GetElemValue(ielem, "Stress", i) * blkdyn.GetElemValue(ielem, "Strain", i);
    }

    // 应变能乘以单元体积
    Stain_Energy += siglev * blkdyn.GetElemValue(ielem, "Volume");
}

print("应变能 = " + Stain_Energy);

// 计算外力功
var TotalNode = dyna.GetValue("Total_Node_Num");
TotalNode = Math.round(TotalNode);
var addno = 0;
var averDisp = 0.0;

for(var inode = 1; inode <= TotalNode; inode++ )
{
    var ycoord = blkdyn.GetNodeValue(inode,"Coord0",2);

    if(ycoord >= 0.999)
    {
        averDisp += blkdyn.GetNodeValue(inode,"Displace",2);
        addno++;
    }
}

if(addno > 0)
{
    averDisp = averDisp / addno;
}

var work = 1e6 * 1 * 1 * Math.abs(averDisp);
print("外力功 = " + work);

// 计算阻尼耗散能
print("阻尼耗散能 = " + (work - Stain_Energy));
