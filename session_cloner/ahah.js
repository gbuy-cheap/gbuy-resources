function parse_(data){
    const {local, session, cookie} = data
    document.cookie = ''
    if(local != '{}'){
        let parsedLocal = JSON.parse(local)
        try {
            parsedLocal = JSON.parse(parsedLocal)

            try {
                parsedLocal = JSON.parse(parsedLocal)
    
            }catch(e)
            {
                console.log('tekrar parse edilmeyecek.')
            }
        }catch(e)
        {
            console.log('tekrar parse edilmeyecek.')
        }
        for(let key in parsedLocal) {
            localStorage.setItem(key, parsedLocal[key])
        }
    }

    if(session != '{}'){
        const parsedSession = JSON.parse(session)
        for(let key in parsedSession) {
            sessionStorage.setItem(key, parsedSession[key])
        }
    }
    
    if(cookie && typeof cookie == 'object') {
        for(let key in cookie) {
            let {name, value, domain, secure, path, expires, expirationDate} = cookie[key]
            if(expires == undefined) {
                expires = expirationDate
            }
            const secureString = secure ? 'secure' : ''
            document.cookie = `${name}=${value};domain=${domain};path=${path};expires=${expires};${secureString}`
        }
    }
    return true
}





