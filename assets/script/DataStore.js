cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 当前场景下的Canvas
        this.canvas = cc.director.getScene().getChildByName('Canvas')
        this.game = this.node.getComponent('Game')

        // 加载进度
        this.loadProgress = 0
        // 障碍物
        this.barrier = []
        // 图片资源
        this.imageList = {}
        // 烹饪队列
        this.cookingQueue = []

        this.coinPool = {}

        // 客人的位置
        this.peoplePosition = {
            'table': []
        }
        // 排队坐标点
        this.queue = {
            table: {
                x: 200,
                y: 400,
                a_x: 0,
                a_y: 30,
                list: []
            }
        }

        this.buildData = JSON.parse(localStorage.getItem('buildData'))
        if (!this.buildData) {
            // 建筑物的信息
            this.buildData = {
                "101": {
                    'id': "101",
                    'scene': "canting",
                    "type": '小费台',
                    "title": "小费台",
                    "current": { // 当前建造物
                        "itemId": "", // 建筑ID
                        "node": null // 建筑实例节点
                    },
                    "position": { // 位置
                        x: 0,
                        y: 400
                    },
                    "data": { // 特殊的参数
                      
                    },
                    "itemList": {
                        "1010101": {
                            "ID": "1010101",
                            "名称": "小费台1",
                            "提升星级": "3",
                            "提升上限": "10000",
                            "提升用餐效率（%）": "",
                            "增加小费": "5",
                            "二次消费": "",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "1000"
                        },
                        "1010102": {
                            "ID": "1010102",
                            "名称": "小费台2",
                            "提升星级": "6",
                            "提升上限": "25000",
                            "提升用餐效率（%）": "",
                            "增加小费": "",
                            "二次消费": "",
                            "解锁条件（星级）": "130",
                            "解锁条件（事件）": "",
                            "价格（万）": "5000"
                        },
                    }
                },
                "102": {
                    'id': "102",
                    'scene': "canting",
                    "type": '餐桌',
                    "title": "餐桌1",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: -200,
                        y: 100
                    },
                    "data": {
                        "curPeople": false
                    },
                    "itemList": {
                        "1020101": {
                            "ID": "1020101",
                            "名称": "餐桌1-1",
                            "提升星级": "3",
                            "提升上限": "",
                            "提升用餐效率（%）": "1",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "100",
                            "已购买": false,
                        },
                        "1020102": {
                            "ID": "1020102",
                            "名称": "餐桌1-2",
                            "提升星级": "5",
                            "提升上限": "",
                            "提升用餐效率（%）": "2",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "100",
                            "解锁条件（事件）": "",
                            "价格（万）": "500"
                        },
                    }
                },
                "103": {
                    'id': "103",
                    'scene': "canting",
                    "type": '餐桌',
                    "title": "餐桌2",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: 0,
                        y: 100
                    },
                    "data": {

                    },
                    "itemList": {
                        "1020101": {
                            "ID": "1020101",
                            "名称": "餐桌1-1",
                            "提升星级": "3",
                            "提升上限": "",
                            "提升用餐效率（%）": "1",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "120"
                        },
                        "1020102": {
                            "ID": "1020102",
                            "名称": "餐桌1-2",
                            "提升星级": "5",
                            "提升上限": "",
                            "提升用餐效率（%）": "2",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "100",
                            "解锁条件（事件）": "",
                            "价格（万）": "550"
                        },
                    }
                },
                "104": {
                    'id': "104",
                    'scene': "canting",
                    "type": '餐桌',
                    "title": "餐桌3",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: 200,
                        y: 100
                    },
                    "data": {

                    },
                    "itemList": {
                        "1020101": {
                            "ID": "1020101",
                            "名称": "餐桌1-1",
                            "提升星级": "3",
                            "提升上限": "",
                            "提升用餐效率（%）": "1",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "120"
                        },
                        "1020102": {
                            "ID": "1020102",
                            "名称": "餐桌1-2",
                            "提升星级": "5",
                            "提升上限": "",
                            "提升用餐效率（%）": "2",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "100",
                            "解锁条件（事件）": "",
                            "价格（万）": "550"
                        },
                    }
                },
                "105": {
                    "id": "105",
                    'scene': "canting",
                    "type": "装饰",
                    "title": "装饰1",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: -200,
                        y: -400
                    },
                    "data": {

                    },
                    "itemList": {
                        "1030101": {
                            "ID": "1030101",
                            "名称": "装饰1-1",
                            "提升星级": "4",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "5",
                            "二次消费": "",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "200"
                        },
                        "1030102": {
                            "ID": "1030102",
                            "名称": "装饰1-2",
                            "提升星级": "8",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "7",
                            "二次消费": "",
                            "解锁条件（星级）": "120",
                            "解锁条件（事件）": "",
                            "价格（万）": "1000"
                        },
                    }
                },
                "106": {
                    "id": "106",
                    'scene': "canting",
                    "type": "吧台",
                    "title": "吧台1",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: -200,
                        y: -500
                    },
                    "data": {

                    },
                    "itemList": {
                        "1040101": {
                            "ID": "1040101",
                            "名称": "吧台1-1",
                            "提升星级": "9",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "",
                            "二次消费": "40",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "550"
                        },
                        "1040102": {
                            "ID": "1040102",
                            "名称": "吧台1-2",
                            "提升星级": "18",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "",
                            "二次消费": "70",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "1800"
                        },
                    }
                },
                "107": {
                    'id': "107",
                    'scene': "canting",
                    "type": '餐桌',
                    "title": "餐桌4",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: -200,
                        y: -100
                    },
                    "data": {

                    },
                    "itemList": {
                        "1020101": {
                            "ID": "1020101",
                            "名称": "餐桌1-1",
                            "提升星级": "3",
                            "提升上限": "",
                            "提升用餐效率（%）": "1",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "120"
                        },
                        "1020102": {
                            "ID": "1020102",
                            "名称": "餐桌1-2",
                            "提升星级": "5",
                            "提升上限": "",
                            "提升用餐效率（%）": "2",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "100",
                            "解锁条件（事件）": "",
                            "价格（万）": "550"
                        },
                    }
                },
                "108": {
                    'id': "108",
                    'scene': "canting",
                    "type": '餐桌',
                    "title": "餐桌5",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: 0,
                        y: -100
                    },
                    "data": {

                    },
                    "itemList": {
                        "1020101": {
                            "ID": "1020101",
                            "名称": "餐桌1-1",
                            "提升星级": "3",
                            "提升上限": "",
                            "提升用餐效率（%）": "1",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "120"
                        },
                        "1020102": {
                            "ID": "1020102",
                            "名称": "餐桌1-2",
                            "提升星级": "5",
                            "提升上限": "",
                            "提升用餐效率（%）": "2",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "100",
                            "解锁条件（事件）": "",
                            "价格（万）": "550"
                        },
                    }
                },
                "109": {
                    'id': "109",
                    'scene': "canting",
                    "type": '餐桌',
                    "title": "餐桌6",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: 200,
                        y: -100
                    },
                    "data": {

                    },
                    "itemList": {
                        "1020101": {
                            "ID": "1020101",
                            "名称": "餐桌1-1",
                            "提升星级": "3",
                            "提升上限": "",
                            "提升用餐效率（%）": "1",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "120"
                        },
                        "1020102": {
                            "ID": "1020102",
                            "名称": "餐桌1-2",
                            "提升星级": "5",
                            "提升上限": "",
                            "提升用餐效率（%）": "2",
                            "增加小费": "4",
                            "二次消费": "",
                            "解锁条件（星级）": "100",
                            "解锁条件（事件）": "",
                            "价格（万）": "550"
                        },
                    }
                },

                "110": {
                    "id": "110",
                    'scene': "canting",
                    "type": "装饰",
                    "title": "装饰2",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: 0,
                        y: -400
                    },
                    "data": {

                    },
                    "itemList": {
                        "1030101": {
                            "ID": "1030101",
                            "名称": "装饰2-1",
                            "提升星级": "4",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "5",
                            "二次消费": "80",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "200"
                        },
                        "1030102": {
                            "ID": "1030102",
                            "名称": "装饰2-2",
                            "提升星级": "8",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "7",
                            "二次消费": "110",
                            "解锁条件（星级）": "120",
                            "解锁条件（事件）": "",
                            "价格（万）": "1000"
                        },
                    }
                },
                "111": {
                    "id": "111",
                    'scene': "canting",
                    "type": "装饰",
                    "title": "装饰3",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: 200,
                        y: -400
                    },
                    "data": {

                    },
                    "itemList": {
                        "1030101": {
                            "ID": "1030101",
                            "名称": "装饰1-1",
                            "提升星级": "4",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "5",
                            "二次消费": "",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "200"
                        },
                        "1030102": {
                            "ID": "1030102",
                            "名称": "装饰1-2",
                            "提升星级": "8",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "7",
                            "二次消费": "",
                            "解锁条件（星级）": "120",
                            "解锁条件（事件）": "",
                            "价格（万）": "1000"
                        },
                    }
                },

                "112": {
                    "id": "112",
                    'scene': "canting",
                    "type": "吧台",
                    "title": "吧台2",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: 0,
                        y: -500
                    },
                    "data": {

                    },
                    "itemList": {
                        "1040101": {
                            "ID": "1040101",
                            "名称": "吧台1-1",
                            "提升星级": "9",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "",
                            "二次消费": "40",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "550"
                        },
                        "1040102": {
                            "ID": "1040102",
                            "名称": "吧台1-2",
                            "提升星级": "18",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "",
                            "二次消费": "70",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "1800"
                        },
                    }
                },
                "113": {
                    "id": "113",
                    'scene': "canting",
                    "type": "吧台",
                    "title": "吧台3",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: 200,
                        y: -500
                    },
                    "data": {

                    },
                    "itemList": {
                        "1040101": {
                            "ID": "1040101",
                            "名称": "吧台3-1",
                            "提升星级": "9",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "",
                            "二次消费": "40",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "550"
                        },
                        "1040102": {
                            "ID": "1040102",
                            "名称": "吧台3-2",
                            "提升星级": "18",
                            "提升上限": "",
                            "提升用餐效率（%）": "",
                            "增加小费": "",
                            "二次消费": "70",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "1800"
                        },
                    }
                },

                "114": {
                    "id": "114",
                    'scene': "chufang",
                    "type": "灶台",
                    "title": "灶台1",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: 200,
                        y: 100
                    },
                    "data": {

                    },
                    "itemList": {
                        "2010101": {
                            "ID": "2010101",
                            "名称": "灶台1-1",
                            "提升星级": "9",
                            "提升上限": "",
                            "提升烹饪效率（%）": "",
                            "增加小费": "1",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "0"
                        },
                        "2010102": {
                            "ID": "2010102",
                            "名称": "灶台1-2",
                            "提升星级": "18",
                            "提升上限": "",
                            "提升烹饪效率（%）": "5",
                            "增加小费": "",
                            "解锁条件（星级）": "100",
                            "解锁条件（事件）": "",
                            "价格（万）": "1800"
                        },
                    }
                },
                "115": {
                    "id": "115",
                    'scene': "chufang",
                    "type": "灶台",
                    "title": "灶台2",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: -200,
                        y: -100
                    },
                    "data": {

                    },
                    "itemList": {
                        "2010101": {
                            "ID": "2010101",
                            "名称": "灶台1-1",
                            "提升星级": "9",
                            "提升上限": "",
                            "提升烹饪效率（%）": "",
                            "增加小费": "1",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "0"
                        },
                        "2010102": {
                            "ID": "2010102",
                            "名称": "灶台1-2",
                            "提升星级": "18",
                            "提升上限": "",
                            "提升烹饪效率（%）": "5",
                            "增加小费": "",
                            "解锁条件（星级）": "100",
                            "解锁条件（事件）": "",
                            "价格（万）": "1800"
                        },
                    }
                },
                "116": {
                    "id": "116",
                    'scene': "chufang",
                    "type": "灶台",
                    "title": "灶台3",
                    "current": {
                        "itemId": "",
                        "node": null
                    },
                    "position": {
                        x: 0,
                        y: -100
                    },
                    "data": {

                    },
                    "itemList": {
                        "2010101": {
                            "ID": "2010101",
                            "名称": "灶台1-1",
                            "提升星级": "9",
                            "提升上限": "",
                            "提升烹饪效率（%）": "",
                            "增加小费": "1",
                            "解锁条件（星级）": "",
                            "解锁条件（事件）": "",
                            "价格（万）": "0"
                        },
                        "2010102": {
                            "ID": "2010102",
                            "名称": "灶台1-2",
                            "提升星级": "18",
                            "提升上限": "",
                            "提升烹饪效率（%）": "5",
                            "增加小费": "",
                            "解锁条件（星级）": "100",
                            "解锁条件（事件）": "",
                            "价格（万）": "1800"
                        },
                    }
                },
            }

            localStorage.setItem('buildData', JSON.stringify(this.buildData))
        }

        // ============================
        // 
        // 
        // 客人
        this.peopleData = {
            "1": {
                "ID": "7010101",
                "解锁条件（星级）": "0",
                "解锁条件（事件）": "",
                "需求1（50%）": "6010101",
                "需求2（35%）": "6010102",
                "需求3（15%）": "6029901",
                "点菜需求": '[{"id":"6010101","chance":50},{"id":"6019901","chance":35},{"id":"6029901","chance":15}]',
                "特点1（点赞增加星级）": "",
                "触发概率1（%）": "",
                "特点2（点多道菜）": "",
                "触发概率2（%）": "",
                "特点3（菜金倍乘）": "",
                "触发概率3（%）": "",
                "已解锁": false
            },
            "2": {
                "序号": "2",
                "名称": "B",
                "ID1": "701",
                "ID2": "2",
                "等级": "1",
                "ID": "7010201",
                "解锁条件（星级）": "10",
                "解锁条件（事件）": "1020201",
                "需求1（50%）": "6010102",
                "需求2（35%）": "6010301",
                "需求3（15%）": "6029901",
                "点菜需求": '[{"id":"6010101","chance":50},{"id":"6010301","chance":35},{"id":"6029901","chance":15}]',

                "特点1（点赞增加星级）": "1",
                "触发概率1（%）": "100",
                "特点2（点多道菜）": "",
                "触发概率2（%）": "",
                "特点3（菜金倍乘）": "",
                "触发概率3（%）": ""
            },
            "3": {
                "序号": "3",
                "名称": "C",
                "ID1": "701",
                "ID2": "99",
                "等级": "1",
                "ID": "7019901",
                "解锁条件（星级）": "10",
                "解锁条件（事件）": "",
                "需求1（50%）": "6010301",
                "需求2（35%）": "6019901",
                "需求3（15%）": "6029901",
                "点菜需求": '[{"id":"6010301","chance":50},{"id":"6019901","chance":35},{"id":"6029901","chance":15}]',

                "特点1（点赞增加星级）": "",
                "触发概率1（%）": "",
                "特点2（点多道菜）": "3",
                "触发概率2（%）": "100",
                "特点3（菜金倍乘）": "",
                "触发概率3（%）": ""
            },
            "4": {
                "序号": "4",
                "名称": "A",
                "ID1": "702",
                "ID2": "1",
                "等级": "2",
                "ID": "7020102",
                "解锁条件（星级）": "50",
                "解锁条件（事件）": "",
                "需求1（50%）": "6020101",
                "需求2（35%）": "6029901",
                "需求3（15%）": "6029901",
                "点菜需求": '[{"id":"6010101","chance":50},{"id":"6019901","chance":35},{"id":"6029901","chance":15}]',

                "特点1（点赞增加星级）": "",
                "触发概率1（%）": "",
                "特点2（点多道菜）": "",
                "触发概率2（%）": "",
                "特点3（菜金倍乘）": "6",
                "触发概率3（%）": "50"
            },
            "5": {
                "序号": "5",
                "名称": "B",
                "ID1": "702",
                "ID2": "99",
                "等级": "2",
                "ID": "7029902",
                "解锁条件（星级）": "100",
                "解锁条件（事件）": "",
                "需求1（50%）": "6020101",
                "需求2（35%）": "6029901",
                "需求3（15%）": "6029901",
                "点菜需求": '[{"id":"6010101","chance":50},{"id":"6019901","chance":35},{"id":"6029901","chance":15}]',

                "特点1（点赞增加星级）": "",
                "触发概率1（%）": "",
                "特点2（点多道菜）": "",
                "触发概率2（%）": "",
                "特点3（菜金倍乘）": "",
                "触发概率3（%）": ""
            }

        }
        this.dish = JSON.parse(localStorage.getItem('dish'))
        if (!this.dish) {
            // 菜品
            this.dish = {
                "6010101": {
                    "序号": "1",
                    "ID1": "601",
                    "ID2": "1",
                    "等级": "1",
                    "ID": "6010101",
                    "名称": "A",
                    "基础烹饪时间（s）": "5",
                    "基础用餐时间（s）": "5",
                    "每卖出一份能收入": "60",
                    "解锁条件（星级）": "",
                    "解锁条件（事件）": "2010101",
                    "已解锁": false,
                    "价格（万）": "10"
                },
                // "6010102": {
                //     "序号": "2",
                //     "ID1": "601",
                //     "ID2": "1",
                //     "等级": "2",
                //     "ID": "6010102",
                //     "名称": "",
                //     "基础烹饪时间（s）": "8",
                //     "基础用餐时间（s）": "6",
                //     "每卖出一份能收入": "120",
                //     "解锁条件（星级）": "",
                //     "解锁条件（事件）": "1040301",
                //     "价格（万）": "10"
                // },
                "6010301": {
                    "序号": "3",
                    "ID1": "601",
                    "ID2": "3",
                    "等级": "1",
                    "ID": "6010301",
                    "名称": "B",
                    "基础烹饪时间（s）": "8",
                    "基础用餐时间（s）": "6",
                    "每卖出一份能收入": "80",
                    "解锁条件（星级）": "10",
                    "解锁条件（事件）": "",
                    "价格（万）": "800"
                },
                "6019901": {
                    "序号": "4",
                    "ID1": "601",
                    "ID2": "99",
                    "等级": "1",
                    "ID": "6019901",
                    "名称": "C",
                    "基础烹饪时间（s）": "10",
                    "基础用餐时间（s）": "6",
                    "每卖出一份能收入": "120",
                    "解锁条件（星级）": "15",
                    "解锁条件（事件）": "",
                    "价格（万）": "1000"
                },
                "6020101": {
                    "序号": "5",
                    "ID1": "602",
                    "ID2": "1",
                    "等级": "1",
                    "ID": "6020101",
                    "名称": "D",
                    "基础烹饪时间（s）": "12",
                    "基础用餐时间（s）": "8",
                    "每卖出一份能收入": "150",
                    "解锁条件（星级）": "25",
                    "解锁条件（事件）": "",
                    "价格（万）": "1200"
                },
                "6029901": {
                    "序号": "6",
                    "ID1": "602",
                    "ID2": "99",
                    "等级": "1",
                    "ID": "6029901",
                    "名称": "E",
                    "基础烹饪时间（s）": "15",
                    "基础用餐时间（s）": "10",
                    "每卖出一份能收入": "200",
                    "解锁条件（星级）": "50",
                    "解锁条件（事件）": "",
                    "价格（万）": "1500"
                },
            }
        }

    },

    start() {
        // 预加载场景
        this.loadMainScene()
        // 加载图片
        this.loadImageRes()
    },

    /**
     * 获取随机数
     * @param {Object} min
     * @param {Object} max
     */
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    loadMainScene() {
        cc.director.preloadScene("game", () => {
            this.loadProgress++
        });
    },

    loadImageRes() {
        // 加载 image 目录下所有 SpriteFrame，并且获取它们的路径
        cc.loader.loadResDir("image", cc.SpriteFrame, (err, assets, urls) => {
            for (const value of assets) {
                this.imageList[value['name']] = value
            }
            this.loadProgress++
        });
    },

    /**找空桌子 */
    getBlankTable() {
        // 桌子的iD
        let tableIDs = ["102", "103", "104", "107", "108", "109"]

        for (const id of tableIDs) {
            if (this.buildData[id] && this.buildData[id]["current"]['node'] && !this.buildData[id].data.curPeople) {
                return this.buildData[id]
            }
        }

        return false
    },

    /**找吧台 */
    getBar() {
        // 吧台的iD
        let barIDs = ["106", "112", "113"]
        let barList = []
        for (const id of barIDs) {
            if (this.buildData[id] && this.buildData[id]["current"]['node']) {
                barList.push(this.buildData[id])
            }
        }

        return barList
    },

    /**判断一个点是否在障碍物上 */
    getBarrier(pos) {
        // let isInMap = this.game.map.getBoundingBox().contains(pos)
        // if (!isInMap) return true // 坐标不在地图上，所以是也无效的坐标点

        for (let i = 0; i < this.barrier.length; i++) {
            if (this.barrier[i].getBoundingBox().contains(pos)) {
                return true
            }
        }
        return false
    },
    Clone(obj) {
        //先判断是数组还是对象（执行对应的拷贝）
        var objCopy = Array.isArray(obj) ? [] : {};
        //拷贝的对象不能为空
        if (obj && typeof obj === "object") {
            for (let key in obj) { //遍历
                //拷贝的对象不能为空
                if (key !== "node" && key !== "curPeople" && key !== 'isCooking') {
                    if (obj[key] && typeof obj[key] === "object") {
                        objCopy[key] = this.Clone(obj[key]);
                    } else {
                        objCopy[key] = obj[key];
                    }
                }
            }
        }
        return objCopy;
    },

    /**两坐标直线距离 */
    getDistance(pos1, pos2) {
        return Math.round(Math.sqrt((Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2))))
    },

    /**判断一个点是否在集合内 */
    isInList(node, list) {
        for (let i = 0; i < list.length; i++) {
            const ele = list[i];
            if (ele.x == node.x && ele.y == node.y) {
                return i
            }
        }
        return false
    },
    // 随机一个顾客
    getPeople() {
        let list = []
        for (const key in this.peopleData) {
            if (parseInt(this.peopleData[key]["解锁条件（星级）"]) <= this.game.star) {
                list.push(key)
            }
        }
        let index = this.getRandom(0, list.length - 1)

        return this.peopleData[list[index]]
    },
    // 随机点菜
    getPeopleFood(people) {
        return this.lottery(JSON.parse(people['点菜需求']))
    },
    // 烹饪
    setCooking() {
        if (this.cookingQueue.length > 0) {
            // 找空灶台
            let cookingBenchIDs = ["114", "115", "116"]
            for (const index of cookingBenchIDs) {
                // 灶台
                let bench = this.buildData[index]
                if (bench.current.itemId && !bench['data']['isCooking']) {
                    // 灶台是空闲的
                    let cookingData = this.cookingQueue.shift()
                    bench['data']['isCooking'] = true

                    // 在灶台上显示食物
                    bench.current.node.getChildByName('top_food').active = true
                    bench.current.node.getChildByName('top_food').getComponent(cc.Sprite).spriteFrame = this.imageList[cookingData['dish']['id']]

                    // 烹饪时间 
                    // 菜的烹饪时间 * （1 - 灶台提升%）
                    let cookingTime = parseInt(this.dish[cookingData['dish']['id']]['基础烹饪时间（s）'])
                    if (bench.itemList[bench.current.itemId]["提升烹饪效率（%）"]) {
                        cookingTime *= (1 - parseInt(bench.itemList[bench.current.itemId]["提升烹饪效率（%）"]))
                    }

                    this.scheduleOnce(function () {
                        // 食物做好了
                        // 食物飞 的动画
                        bench.current.node.getChildByName('top_food').getComponent(cc.Animation).play()
                        let onStop = function () {
                            bench.current.node.getChildByName('top_food').getComponent(cc.Animation).off('stop', onStop, this)
                            this.scheduleOnce(function () {
                                // 灶台又变回空闲状态
                                bench['data']['isCooking'] = false

                                // 桌上放好食物
                                this.buildData[cookingData['table']['id']].current.node.getChildByName('food').active = true
                                this.buildData[cookingData['table']['id']].current.node.getChildByName('food').getComponent(cc.Sprite).spriteFrame = this.imageList[cookingData['dish']['id']]
                                // 标记正在吃
                                // this.buildData[cookingData['table']['id']].current.node.eating = true

                                // 进食时间
                                // 基础用餐时间（s） * (1- 提升用餐效率（%）)
                                let eatingTime = parseInt(this.dish[cookingData['dish']['id']]['基础用餐时间（s）'])
                                if (this.buildData[cookingData.table.id]["提升用餐效率（%）"]) {
                                    eatingTime *= (1 - parseInt(this.buildData[cookingData.table.id]["提升用餐效率（%）"]))
                                }

                                this.scheduleOnce(function () {
                                    // 食物消失
                                    // 标记已经吃完
                                    this.buildData[cookingData['table']['id']].current.node.getChildByName('food').active = false
                                    // 改变用户目标，让他离开桌子
                                    this.buildData[cookingData['table']['id']].data['curPeople'].target = 'bar'

                                }, eatingTime)
                            }, 0.5)
                        }
                        bench.current.node.getChildByName('top_food').getComponent(cc.Animation).on('stop', onStop, this)
                    }, cookingTime)
                    break
                }
            }
        }
    },

    /**
     * 抽奖算法
     * @param array $data
     *  exp: [
     *         ['id' => 1,'chance'=>50, ...],
     *         ['id' => 2,'chance'=>30, ...],
     *         ['id' => 3,'chance'=>20, ...],
     *       ]
     * 三个奖品中抽一个
     * @return ['id' => 3,'chance'=>20, ...],
     */
    lottery(data, chance = 'chance') {
        let baseNum = 1
        let totalNum = 0
        for (const key in data) {
            totalNum += data[key][chance]
            // 随即点区间
            data[key]['section'] = [baseNum, baseNum + data[key][chance] - 1]
            baseNum += data[key][chance]
        }

        let num = this.getRandom(1, totalNum)
        for (const key in data) {
            if (data[key]['section'][0] <= num && num <= data[key]['section'][1]) {
                return data[key]
            }
        }
    },
    update(dt) {
        // console.log(this.loadProgress)
        if (cc.director.getScene().name == 'loading') {
            this.canvas.getChildByName('progress').getComponent(cc.ProgressBar).progress = this.loadProgress / 2
            if (this.canvas.getChildByName('progress').getComponent(cc.ProgressBar).progress == 1) {
                cc.director.loadScene("game")
            }
        } else {
            this.setCooking()
        }

    },
});