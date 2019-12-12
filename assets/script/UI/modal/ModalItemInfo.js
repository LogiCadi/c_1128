cc.Class({
    extends: cc.Component,

    properties: {
        image: cc.Node,
        title: cc.Node,
        content: cc.Node,
        row: cc.Prefab,
        icon: cc.Prefab,
        text: cc.Prefab,
        btn: cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.dataStore = cc.find('Game').getComponent('DataStore')
        this.game = cc.find('Game').getComponent('Game')

        this.node.getComponent(cc.Animation).play()
    },
    start() {

    },

    init(data) {
        this.type = data.type
        this.groupInfo = data.group
        this.itemInfo = data.item

        this.image.getComponent(cc.Sprite).spriteFrame = this.dataStore.imageList[this.itemInfo['ID']]
        this.title.getComponent(cc.Label).string = this.itemInfo['名称']
        // this.getChildByName('desc').getComponent(cc.Label).string = this.itemInfo['名称']

        this.setContent(this.itemInfo)
        if (this.type == 'build') {
            if (this.itemInfo["已购买"]) {
                let node = new cc.Node('text')
                node.color = new cc.Color("#333333")

                let label = node.addComponent(cc.Label)
                this.btn.addChild(node)
                if (this.groupInfo.current.itemId == this.itemInfo["ID"]) {
                    label.string = '正在使用'
                } else {
                    label.string = '使用'
                }
            } else {
                // this.btn.getChildByName('text').getComponent(cc.Label).string = this.itemInfo["价格（万）"]
                let node = new cc.Node('text')
                node.color = new cc.Color("#333333")

                let label = node.addComponent(cc.Label)
                this.btn.addChild(node)
                label.string = this.itemInfo["价格（万）"] + '购买'
            }
        } else if (this.type == 'dish') {
            if (this.itemInfo["已解锁"]) {
                let node = new cc.Node('text')
                node.color = new cc.Color("#333333")

                let label = node.addComponent(cc.Label)
                this.btn.addChild(node)
                label.string = '已解锁'
            } else {
                let node = new cc.Node('text')
                node.color = new cc.Color("#333333")

                let label = node.addComponent(cc.Label)
                this.btn.addChild(node)
                label.string = this.itemInfo["价格（万）"] + '解锁'
            }
        }
    },

    setContent(data) {
        for (const key in data) {
            if ((
                    key == '提升星级' ||
                    key == '提升上限' ||
                    key == '提升用餐效率（%）' ||
                    key == '增加小费' ||
                    key == '二次消费' ||
                    key == '解锁条件（星级）' ||
                    key == '基础烹饪时间（s）' ||
                    key == '基础用餐时间（s）' ||
                    key == '每卖出一份能收入'
                ) &&
                data[key]
            ) {
                let row = cc.instantiate(this.row)
                this.content.addChild(row)

                this.newIcon(row)
                this.newText(row, key)
                this.newIcon(row)
                this.newText(row, `+${data[key]}`)
            }
        }
    },

    newIcon(wrap) {
        let icon = cc.instantiate(this.icon)
        wrap.addChild(icon)
    },
    newText(wrap, content) {
        let text = cc.instantiate(this.text)
        wrap.addChild(text)
        text.getComponent(cc.Label).string = content
    },

    useThisItem(e) {
        if (this.type == 'build') {
            if (!this.itemInfo['已购买']) {
                let star = this.game.star
                if (parseInt(this.itemInfo["解锁条件（星级）"]) > star) {
                    this.game.canvas.getComponent('Canvas').newMsg('星级不足')
                    return
                }

                let coin = this.game.coin
                if (parseInt(this.itemInfo["价格（万）"]) > coin) {
                    this.game.canvas.getComponent('Canvas').newMsg('金币不足')
                    return
                }

                this.game.coin -= parseInt(this.itemInfo["价格（万）"])
                this.game.star += parseInt(this.itemInfo["提升星级"])
                localStorage.setItem('coin', this.game.coin)
                localStorage.setItem('star', this.game.star)
            }

            this.game.build(this.groupInfo, this.itemInfo)

        } else if (this.type == 'dish') {
            if (!this.itemInfo['已解锁']) {
                let star = this.game.star
                if (parseInt(this.itemInfo["解锁条件（星级）"]) > star) {
                    this.game.canvas.getComponent('Canvas').newMsg('星级不足')
                    return
                }

                let coin = this.game.coin
                if (parseInt(this.itemInfo["价格（万）"]) > coin) {
                    this.game.canvas.getComponent('Canvas').newMsg('金币不足')
                    return
                }

                this.game.coin -= parseInt(this.itemInfo["价格（万）"])
                localStorage.setItem('coin', this.game.coin)

                this.dataStore.dish[this.itemInfo['ID']]['已解锁'] = true
                localStorage.setItem('dish', JSON.stringify(this.dataStore.dish))
            }
        }

        this.game.canvas.getComponent('Canvas').closeAllModals()

    },

    /**关闭modal */
    closeModal() {
        this.node.destroy()
    },
    start() {

    },

    // update (dt) {},
});