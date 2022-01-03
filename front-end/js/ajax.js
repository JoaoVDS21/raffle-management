const URL_WEBSERVICE = '../back-end/controller/'

function Ajax(method, url, data, func){
    let req = new XMLHttpRequest()
    req.onreadystatechange = ()=>{
        if(req.status == 200 && req.readyState == 4){
            let obj = JSON.parse(req.responseText)
            func(obj)
        }
    }
    req.open(method, url, true)
    req.send(data)
}