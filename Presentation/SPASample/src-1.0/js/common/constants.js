define(['../modules/commonModule'], function (module) {
    //----菜单对象
    module.constant('routeProvider', {
        $routeProvider: null,
        ctrlDic: {},
        defaultCtrl: null,
        AddRoute: function (route, templateUrl, controller) {
            this.ctrlDic[controller] = {
                templateUrl: templateUrl,
                controller: controller
            };
            this.$routeProvider.when('/' + route, this.ctrlDic[controller]);
        },
        SetDefaultCtrl: function (controller) {
            if (this.defaultCtrl) {
                utility.ErrorConsoleLog("Default route has been set twice!" + "  Before:" + this.defaultCtrl.controller + "  After:" + this.ctrlDic[controller].controller);
            }
            this.$routeProvider.when('/', this.ctrlDic[controller]);
            this.defaultCtrl = this.ctrlDic[controller];
        },
        AddDefaultRoute: function (templateUrl, controller) {
            this.ctrlDic[controller] = {
                templateUrl: templateUrl,
                controller: controller
            };
            if (this.defaultCtrl) {
                utility.ErrorConsoleLog("Default route has been set twice!" + "  Before:" + this.defaultCtrl.controller + "  After:" + this.ctrlDic[controller].controller);
            }
            this.$routeProvider.when('/', this.ctrlDic[controller]);
            this.defaultCtrl = this.ctrlDic[controller];
        }
    });


    //----系统常量配置
    module.constant("appConstants", {
        //----性别
        genders: [
            { Key: 1, Value: "女" },
            { Key: 0, Value: "男" }
        ],
        //----季度
        quarters: [
            { Key: 1, Value: '第一季度' },
            { Key: 2, Value: '第二季度' },
            { Key: 3, Value: '第三季度' },
            { Key: 4, Value: '第四季度' }
        ],
        //----审核状态(数组顺序请勿随便移动)
        auditStatus: [
            { Key: 'SubmitPending', Value: '待提交' },
            { Key: 'AuditPending', Value: '待审核' },
            { Key: 'Passed', Value: '审核通过' },
            { Key: 'Rejected', Value: '退回' }
        ],

        //----查询页面审核状态(数组顺序请勿随便移动)
        queryAuditStatus: [
            { Key: 'AuditPending', Value: '待审核' },
            { Key: 'Passed', Value: '审核通过' },
            { Key: 'Rejected', Value: '退回' }
        ],

        //----竞聘状态
        competeStatus: [
            { Key: 'SchemeSubmitPending', Value: '方案待提交' },
            { Key: 'SchemeAuditPending', Value: '方案待审核' },
            { Key: 'SchemePassed', Value: '方案通过' },
            { Key: 'SchemeRejected', Value: '方案退回' },
            { Key: 'PersonSubmitPending', Value: '人员待提交' },
            { Key: 'PersonAuditPending', Value: '人员待审' },
            { Key: 'PersonPassed', Value: '人员备案' },
            { Key: 'PersonReject', Value: '人员退回' }
        ],

        //----竞聘状态查询
        queryCompeteStatus: [
            { Key: 'SchemeAuditPending', Value: '方案待审核' },
            { Key: 'SchemePassed', Value: '方案通过' },
            { Key: 'SchemeRejected', Value: '方案退回' },
            { Key: 'PersonAuditPending', Value: '人员待审' },
            { Key: 'PersonPassed', Value: '人员通过' },
            { Key: 'PersonReject', Value: '人员退回' }
        ],

        //----竞聘人员状态查询
        queryCompetePersonStatus: [
            { Key: 'PersonPassed', Value: '人员通过' },
            { Key: 'PersonReject', Value: '人员退回' }
        ],

        //----出境类型
        leavetypes: [
            { Key: 'basic', Value: '基层' },
            { Key: 'organ', Value: '机关' }
        ],

        //出国（境）事由代码

        LeaveReasonCode: [
            { Key: 'Travel', Value: '旅游' },
            { Key: 'VisiteRelatives', Value: '探亲' },
            { Key: 'SettleDown', Value: '定居' },
            { Key: 'Service', Value: '劳务' },
            { Key: 'Business', Value: '商务' },
            { Key: 'StudyAbroad', Value: '留学' },
            { Key: 'CertificateRenewal', Value: '证件换发' },
            { Key: 'Other', Value: '其他' }
        ]
    }); //end appConstants
});