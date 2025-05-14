import {request} from "@/utils/service";
import {pageDetail, psData} from "@/api/userMessage/types/user";

export function userList(data: pageDetail) {
    return request({
        url: "/User/list",
        method: "post",
        data:data
    })
}
export function userEdit(data:any) {
    return request({
        url: "/User/edit",
        method: "post",
        data:data
    })
}

export function PsEdit(data:psData) {
    return request({
        url: "/User/editPassword",
        method: "post",
        data:data
    })
}


export function userAdd(data:any) {
    return request({
        url: "/User/insert",
        method: "post",
        data:data
    })
}
