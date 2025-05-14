
// 原生js设置cookie
import router from "@/router";

export function setCookie(token:string, refresh:string) {
    const date = new Date();
    date.setTime(date.getTime() + (24 * 60 * 60));
    const expires = date.toUTCString();
    let string = refresh + "?" + token
    console.log(string)
    document.cookie = `cookies=${string}; expires=${expires}; path=/;secure;`;
}

//获取token
export function getCookie() {
    let str = document.cookie;
    if (!str.includes("cookies")) {
        reloadLogin()
    } else {
        let arr = str.split(';')
        //遍历数组（查找以"cookies"开头的元素）
        str = arr.filter(item => item.startsWith('cookies'))[0]
        return str === undefined ? undefined : str.split('=')[1].split("?")[1]
    }

}
//获取refresh_token
export function getCookieRefresh() {
    let str = document.cookie;
    let arr = str.split(';')
    //遍历数组（查找以name=开头的元素）
    str = arr.filter(item => item.startsWith('cookies'))[0]
    return str === undefined ? "" : str.split('=')[1].split("?")[0]
}

export function reloadLogin(){
    router.push('/index')

}