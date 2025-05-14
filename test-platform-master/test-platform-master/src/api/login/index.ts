import {request} from "@/utils/service";
import {User} from "@/api/login/types/login";
import {getSecretData} from "@/utils/crypto";
import {jsonStringSwitch} from "@/utils/handleData";


export function login(data: User) {
    return request({
        url: "/User/login",
        method: "post",
        data:getSecretData(jsonStringSwitch("String",data))
    })
}

export function loginUserMessage(data: User) {
    return request({
        url: "/User/getName",
        method: "post",
        data:getSecretData(jsonStringSwitch("String",data))
    })
}

export function KaptCha() {
    return request({
        url: "/captcha",
        method: "post",
    })
}