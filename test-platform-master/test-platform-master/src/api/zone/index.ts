import {request} from "@/utils/service";
import {Province} from "@/api/zone/types/province";
import {City} from "@/api/zone/types/city";

export function zoneCity1(data:City) {
    return request({
        url: "/Zone/cityList",
        method: "post",
        data:data
    })
}

export function zoneProvince1(data:Province) {
    return request({
        url: "/Zone/ProvinceList",
        method: "post",
        data:data
    })
}
export function zoneCity(data:City) {
    return request({
        url: "/Zone/cityList1",
        method: "post",
        data:data
    })
}
export function zoneProvince(data:Province) {
    return request({
        url: "/Zone/ProvinceList1",
        method: "post",
        data:data
    })
}