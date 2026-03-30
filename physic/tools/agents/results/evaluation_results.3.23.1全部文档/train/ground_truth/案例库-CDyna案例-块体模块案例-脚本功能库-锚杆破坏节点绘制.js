setCurDir(getSrcDir());

draw.clear();
draw.commit();

var TotalBar = Math.round(dyna.GetValue("Total_Bar_Num"));

for(var ibar = 1; ibar <= TotalBar; ibar++)
{
var TotalSeg = Math.round( bar.GetBarInfo(ibar,"TotalSeg") );

for(var iseg = 1; iseg <= TotalSeg ; iseg++)
{
var failtype = bar.GetSegValue(ibar,iseg,"FailType");

if(failtype > 0.0001)  ///发生破坏
{

var Coord1x = bar.GetNodeValue (ibar, iseg, "Coord",1);
var Coord1y = bar.GetNodeValue (ibar, iseg, "Coord",2);
var Coord1z = bar.GetNodeValue (ibar, iseg, "Coord",3);


var Coord2x = bar.GetNodeValue (ibar, iseg+1, "Coord",1);
var Coord2y = bar.GetNodeValue (ibar, iseg+1, "Coord",2);
var Coord2z = bar.GetNodeValue (ibar, iseg+1, "Coord",3);

var AverC_x = (Coord1x + Coord2x) * 0.5;
var AverC_y = (Coord1y + Coord2y) * 0.5;
var AverC_z = (Coord1z + Coord2z) * 0.5;

draw.SetColor(255,0,0);
draw.point(AverC_x, AverC_y, AverC_z);

}

}
}

draw.commit();
