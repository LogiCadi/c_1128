cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.tableData = [{
                x: -200,
                y: 80,
                itemId: 0,
                hasPeople: false,
                foodId: 0
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
                y: 160,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
            {
                x: 0,
                y: 160,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
            {
                x: 200,
                y: 160,
                itemId: 0,
                hasPeople: false,
                foodId: 0
            },
        ]
    },


    start() {

    },

    /**找空桌子 */
    getBlankTable() {
        for (let i = 0; i < this.tableData.length - 1; i++) {
            if (this.tableData[i].itemId && this.tableData[i].hasPeople == false) {
                return i
            }
        }
        return false
    },

    // update (dt) {},
});