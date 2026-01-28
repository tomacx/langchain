setCurDir(getSrcDir());

dyna.Set("Contact_Search_Method 2");

pdyna. RegularCreateByCoord (1,1,0.1,0,10,0,10,0,0);

var totalno = pdyna.SearchParInCell(4, 4, 0, 6, 6, 0);

print(totalno, " particles in cell.");

for(var i = 1; i <= totalno; i++)
{
var id = pdyna.GetParIdInCell(i);
print(id);

//用于显示
pdyna.SetGroupByID(2, id, id);
}
