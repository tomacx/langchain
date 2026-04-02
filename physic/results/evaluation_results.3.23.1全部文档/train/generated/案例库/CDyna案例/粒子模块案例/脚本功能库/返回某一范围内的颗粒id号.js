setCurDir(getSrcDir());

// 设定接触搜索方法为2以优化仿真精度
dyna.Set("Contact_Search_Method 2");

// 使用RegularCreateByCoord创建粒子网格
pdyna.RegularCreateByCoord(1, 1, 0.1, 0, 10, 0, 10, 0, 0);

// 查找指定范围内包含的颗粒总数
var totalno = pdyna.SearchParInCell(4, 4, 0, 6, 6, 0);
print(totalno, " particles in cell.");

// 遍历并打印每个颗粒ID
for (var i = 1; i <= totalno; i++) {
    var id = pdyna.GetParIdInCell(i);
    print(id);

    // 设置组以用于显示
    pdyna.SetGroupByID(2, id, id);
}
