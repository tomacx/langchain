setCurDir(getSrcDir());

//dyna.Set("Contact_Search_Method 2");

blkdyn.GenBrick2D(10, 10, 50, 50, 1);

var totalno = blkdyn.SearchElemInCell(4, 4, 0, 6, 6, 0);

print(totalno, " elements in cell.");

for(var i = 1; i <= totalno; i++)
{
var id = blkdyn.GetElemIdInCell(i);
print(id);

//用于显示
blkdyn.SetGroupByID(2, id, id);
}
