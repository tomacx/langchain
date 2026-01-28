
var fso = new ActiveXObject("Scripting.FileSystemObject");//创建FileSystemObject对象
//1-仅读入，2-仅写，3-追加
var filew = fso.CreateTextFile("Aperture.txt", true);


var totalElem = Math.round( dyna.GetValue("Total_FS_ElemNum") );

filew.WriteLine(totalElem);


for(var i = 1; i <= totalElem; i++)
{
   var fcwidth = fracsp.GetElemValue (i, "CWidthIni");

   filew.WriteLine(fcwidth);
}

filew.Close();

print("File write successfully.");
