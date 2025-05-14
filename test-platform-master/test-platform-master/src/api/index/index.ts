import {request} from "@/utils/service";


export function count() {
    return request({
        url: "/data/count",
        method: "post",
    })
}
export function countTest() {
    return request({
        url: "/data/countTest",
        method: "post",
    })
}
