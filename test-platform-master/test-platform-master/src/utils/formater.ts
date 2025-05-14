/*修改列表展示样式*/
export const formatValue = (row: any, column: any, cellValue: any) => {
        if (column.property === "redeemTime" || column.property === "updateTime" || column.property === "createTime") {
            return cellValue ? new Date(cellValue * 1000).toLocaleString() : '--';
        } else if (column.property === "price") {
            return cellValue; // 如果值为空或 undefined，则显示 '--'
        }
        return cellValue || "--"; // 如果值为空或 undefined，则显示 '--'

};
/*修改弹窗的输入款样式回显*/
export const formatValues = (row: any,data:any) => {
    if (data === "updateTime" || data === "createTime"){
        if(row>0){
            return new Date(row * 1000).toLocaleString();
        }else {
            return row
        }
    }
    return row
};



/*返回时间戳（时间转换）*/
export const formatDate = (list:any|number) => {
    if ( typeof list == "object" ) {
        for (let item of list) {
            list[list.indexOf(item)] = Date.parse(item);
        }
    }
    return list;
};