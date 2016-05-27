function demoServiceProxy(service) {

    //服务调用示例
    this.getAll = function () {
        return service.call("Competitions/QueryOptions", {}, "get");
    }

    //-----demo示例
    var list = [{
        id: 0,
        name: 'Ben Sparrow',
        email: 'benSparrow@126.com',
        lastText: 'You on your way?',
        face: 'img/ben.png'
    }, {
        id: 1,
        name: 'Max Lynx',
        email: 'MaxLynx@126.com',
        lastText: 'Hey, it\'s me',
        face: 'img/max.png'
    }, {
        id: 2,
        name: 'Adam Bradleyson',
        email: 'Bradleyson@126.com',
        lastText: 'I should buy a boat',
        face: 'img/adam.jpg'
    }, {
        id: 3,
        name: 'Perry Governor',
        email: 'Governor@126.com',
        lastText: 'Look at my mukluks!',
        face: 'img/perry.png'
    }, {
        id: 4,
        name: 'Mike Harrington',
        email: 'Harrington@126.com',
        lastText: 'This is wicked good ice cream.',
        face: 'img/mike.png'
    }];

    this.getList = function () {
        return list;
    },

    this.remove = function (item) {
        list.splice(list.indexOf(item), 1);
    },

    this.getDetail = function (id) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return list[i];
            }
        }
        return null;
    }
}

angular.module('user.service', []).factory('demoService', ['service', function (service) {
    return new demoServiceProxy(service);
}]);