import {roundUpFirst} from "@/utils/handleData";

const recallHandler = (pageNum: any, name: any) => {
    scroll.pageNum = pageNum
}
/*接收回调的数组并加载下一页数据*/
const scrollEvent = (event: Event, name: any) => {
    if (name === "province") {
        // 回调函数
        scrollEventC(recallHandler, event, name, scroll)
    } else {
        // 回调函数
        scrollEventC(recallHandler, event, name, scroll)
    }
};
const scrollEventC = (callback: any, event: Event, name: any, list: any) => {
    if (event.target!=null) {
        if (event.target.className === "el-autocomplete-suggestion__wrap el-scrollbar__wrap el-scrollbar__wrap--hidden-default") {
            const domTarget = event.target
            const translateY = domTarget.scrollTop + 1
            const viewHeight = domTarget.clientHeight
            const allHeight = domTarget.scrollHeight
            if (allHeight - translateY <= viewHeight) { // 10 是一个容差值
                // 在这里调用加载更多数据的函数
                if (list.pageNum !== roundUpFirst(list.pageSize, list.TotalPage)) {
                    // 添加一个数据
                    setTimeout(() => {
                        callback(list.pageNum + 1, name)
                    }, 1000)
                }
            }
        }
    }
}