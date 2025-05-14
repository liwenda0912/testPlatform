
export const dataHandle = (s:any) => {
    if (typeof s === "string") {
        let datalist:any  = {};
        let data = s.split(":")
        datalist.iv=data[2]
        datalist.key = data[1]
        datalist.iciphertext = data[0]
        return datalist
    } else {
        return s
    }

}
export const jsonStringSwitch = (type:any, s:any) => {
    if (type === "String" && typeof s === "object") {
        return JSON.stringify(s)
    } else if (type === "Json" && typeof s === "string") {
        return JSON.parse(s)
    } else {
        return s
    }
}


export const roundUpFirst = (num:any, pageSize:any) => {
    let num_ = pageSize / num
    if (num_.toString().split(".")[1] === "0") {
        return parseInt(num_.toString().split(".")[0])
    } else {
        return parseInt(num_.toString().split(".")[0]) + 1
    }
}


