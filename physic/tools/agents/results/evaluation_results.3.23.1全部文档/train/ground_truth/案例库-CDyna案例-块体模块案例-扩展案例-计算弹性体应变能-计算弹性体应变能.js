setCurDir(getSrcDir());

dyna.Clear();

doc.clearResult();

dyna.Set("Gravity 0 0 0");

blkdyn.GenBrick3D(1,1,1,10,10,10,1);

blkdyn.SetModel("linear");

blkdyn.SetMat(2500,3e10,0.25,1,1,1,1);


blkdyn.ApplyConditionByCoord("face_force",[0,1e6,0],[0,0,0,0,0,0,0,0,0],-100,100,0.999,1.1,-100,100, false);

blkdyn.FixV("y",0,"y",-1,0.001);

dyna.Solve();



//应变能
var Stain_Energy = 0.0;

//由于返回值是浮点型的，需要转化为整型进行循环
var TotalElem = dyna.GetValue("Total_Block_Num");
TotalElem = Math.round(TotalElem);


//循环所有单元
for(var ielem = 1; ielem <= TotalElem; ielem++)
{

var siglev = 0.0;

//所有分量相加
for(var i = 1; i <= 6; i++)
{
siglev  += 0.5 * blkdyn.GetElemValue(ielem, "Stress", i) * blkdyn.GetElemValue(ielem, "Strain", i);
}

//乘以体积
Stain_Energy += siglev * blkdyn.GetElemValue(ielem, "Volume");

}


print("应变能 = " + Stain_Energy);


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


print("阻尼耗散能 = " + (work - Stain_Energy));
