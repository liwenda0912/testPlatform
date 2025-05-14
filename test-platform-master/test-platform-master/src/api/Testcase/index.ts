import {request} from "@/utils/service";
import {TestCaseDri} from "@/api/Testcase/types/testcasedri";
import {TestCase} from "@/api/Testcase/types/testcase";

export function ListTestCaseDir(data:TestCaseDri) {
    return request({
        url: "/testCase/DriList",
        method: "post",
        data:data
    })
}

export function ListTestCase(data:TestCase) {
    return request({
        url: "/testCase/testCaseList/",
        method: "post",
        data:data
    })
}
export function InsertTestCase(data:any) {
    return request({
        url: "/testCase/CaseInsert/",
        method: "post",
        data:data
    })
}
export function InsertTestCaseDri(data:any) {
    return request({
        url: "/testCase/DriInsert/",
        method: "post",
        data:data
    })
}
export function EditTestCase(data:any) {
    return request({
        url: "/testCase/CaseUpdate/",
        method: "post",
        data:data
    })
}
export function EditTestCaseDir(data:any) {
    return request({
        url: "/testCase/DriUpdate/",
        method: "post",
        data:data
    })
}