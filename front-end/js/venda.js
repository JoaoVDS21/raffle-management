let formRifa = document.querySelector('#formRifa')
let selectVendedores = document.querySelector('.box-functions select[name="vendedor"]')
let selectNumRifa = document.querySelector('.box-functions select[name="numRifa"]')
let inputVendedores = (selectVendedores && selectVendedores) || (formRifa && formRifa['vendedor'])
let boxRifas = document.querySelector('#box-rifas')
let vendedorAtual = document.querySelector('#vendedorAtual')
let destaRifa = document.querySelector('#destaRifa')
let valorTotal = document.querySelector('#valorTotal')
let textAlert = document.querySelector('#textAlert')

window.addEventListener('load',()=>{

    listaVendedores((retorno)=>{
        if(retorno.status == 1){
            retorno.vendedores.forEach(vendedor => {
                inputVendedores.innerHTML += `
                    <option value="${vendedor['id_vendedor']}">${vendedor['nome']}</option>
                `
            });
        } else {
            alert(retorno.msg)
        }
    })

    inputVendedores.addEventListener('click', ()=>{
        formRifa && (inputVendedores.children[0].disabled = "true")
    })

    selectVendedores && inputVendedores.addEventListener('change', ()=>{
        listaRifas()
        vendedorAtual.parentNode.style.display = inputVendedores.value == "todos" ? "none" : "block"
    })

    selectVendedores && selectNumRifa.addEventListener('change', ()=>{
        listaRifas()
        consultaValoresTotal(selectNumRifa.value)
    })
    
    formRifa && formRifa.addEventListener('submit', (e)=>{
        e.preventDefault()

        let formatedName = formRifa['nomeEscolhido'].value.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
        
        let data = new FormData(formRifa)
        data.append('tipo', 'cadastrar')
        data.append('formatedName', formatedName)
        Ajax('POST', URL_WEBSERVICE+'venda.php', data, posCadastroRifa)
    })


    selectVendedores && listaRifas()
    selectVendedores && consultaValoresTotal()

    setTimeout(()=>{
        loading.classList.add('hide')
    },1500)
})

function listaVendedores(func){
    let data = new FormData()
    data.append('tipo', 'listagem')
    Ajax('POST', URL_WEBSERVICE+'vendedor.php', data, func)
}

posCadastroRifa = (retorno)=>{
    if(retorno.status == 1){
        textAlert.style.color = '#09f'
        textAlert.innerText = retorno.msg
        setTimeout(()=>{
            textAlert.innerText = ""
        }, 3000)
        
    } else {
        textAlert.style.color = '#f00'
        textAlert.innerText = retorno.msg
        setTimeout(()=>{
            textAlert.innerText = ""
        }, 3000)
    }
}

function listaRifas(){
    let data = new FormData()
    let vendedor = inputVendedores.value
    let numRifa = selectNumRifa.value
    data.append('tipo','listagem')
    data.append('vendedor', vendedor)
    data.append('numRifa', numRifa)
    Ajax('POST', URL_WEBSERVICE+'venda.php', data, posListagemRifas)
}

posListagemRifas = (retorno)=>{
    boxRifas.innerHTML = ""
    let cont = 1
    retorno.rifas && retorno.rifas.forEach(rifa =>{
        if(rifa['nome_cliente'] == null){
            boxRifas.innerHTML = ""
        } else {
            boxRifas.innerHTML += `
            <tr>
                <td>${cont++}</td>
                <td>${rifa['nome']}</td>
                <td>${rifa['nome_cliente']}</td>
                <td>${rifa['nome_escolhido']}</td>
                <td>
                    <button class="btn-delete" onclick="javascript: deleteVenda(${rifa['id_venda']})"><i class="far fa-trash-alt"></i></button>
                </td>
            </tr>
        `
        }
        
    })
    vendedorAtual.innerText = 'R$'+(--cont * 5).toFixed(2).replace('.',',')

}

function deleteVenda(cod){
    if(confirm("Deseja excluir mesmo?")){
        let data = new FormData()
        data.append('tipo', 'deletar')
        data.append('id', cod)
        Ajax('POST', URL_WEBSERVICE+'venda.php', data, (retorno)=>{
            retorno.status == 1 ? listaRifas() : alert(retorno.msg)
        })
        consultaValoresTotal()
    } 
    
}

function consultaValoresTotal(numRifa = 1){
    let data = new FormData()
    data.append('tipo','listagemTotal')
    Ajax('POST', URL_WEBSERVICE+'venda.php', data, (retorno)=>{
        exibeValoresTotal(numRifa, retorno)
    })
}

exibeValoresTotal = (numRifa, retorno)=>{
    let rifa1 = retorno.rifas.filter(rifa => rifa['num_rifa'] == 1 && rifa)
    let rifa2 = retorno.rifas.filter(rifa => rifa['num_rifa'] == 2 && rifa)
    cRifa1 = rifa1.length * 5
    cRifa2 = rifa2.length * 5
    cRifaTotal = cRifa1 + cRifa2
    cRifa = numRifa == 1 ? cRifa1 : cRifa2 
    destaRifa.innerText = 'R$'+cRifa.toFixed(2).replace('.',',')
    valorTotal.innerText = 'R$'+cRifaTotal.toFixed(2).replace('.',',')
}