//Submenus 子菜单配置
//attachedMenus 附属菜单,是map到某一个菜单
/*
 *menuData 1.1
*修改对象属性为大写，为了和wsafMenu统一
 */
//Url配置的为状态
var menuData = [
    {
        Url: "home",
        Icon: "icon-home",
        Name: "主页"
    },
    {
        Url: "demo",
        Icon: "icon-beaker",
        Name: "Demo"
    },
    {
        Url: "test",
        Icon: "icon-beaker",
        Name: "Test",
        Submenus: [
            {
                Url: "test2",
                Icon: "icon-beaker",
                Name: "Test2"
            }
        ]
    }
];

