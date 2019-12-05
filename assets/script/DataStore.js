cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.game = this.node.getComponent('Game')
        this.tableData = [{
                node: null,
                x: -200,
                y: 80,
                itemId: 0,
                hasPeople: false, // 该桌子是否有人
                foodId: 0, // 桌上食物
            },
            {
                x: 0,
                y: 80,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
            {
                x: 200,
                y: 80,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
            {
                x: -200,
                y: -100,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
            {
                x: 0,
                y: -100,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
            {
                x: 200,
                y: -100,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
        ]

        // 障碍物
        this.barrier = []

        // 图片资源
        this.imageRes = {
            'people_1_1': 'image/7010101',
            'people_1_2': 'image/7010101-1',

            'people_2_1': 'image/7010201',
            'people_2_2': 'image/7010201-1',

            'people_3_1': 'image/7019901',
            'people_3_2': 'image/7019901-1',
        }

        // // 排队点
        // this.queue = {
        //     // 等桌子
        //     table: {
        //         x: 200,
        //         y: 400,
        //         a_x: 0, // 下一个位子的偏移
        //         a_y: 30,
        //         list: []
        //     }
        // }
    },

    start() {
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

    loadImageRes() {
        for (const key in this.imageRes) {
            cc.loader.loadRes(this.imageRes[key], cc.SpriteFrame, (err, spriteFrame) => {
                this.imageRes[key] = spriteFrame
            })
        }
    },

    /**找空桌子 */
    getBlankTable() {
        for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].node && this.tableData[i].hasPeople == false) {
                return i
            }
        }
        return false
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
    }

    // update (dt) {},
});